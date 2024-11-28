document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("api-key");
    const ipListTextarea = document.getElementById("ip-list");
    const removeRFC1918Checkbox = document.getElementById("remove-rfc1918");
    const tableBody = document.querySelector(".results-table tbody");
    const progressText = document.querySelector(".progress-text");
    const progressFill = document.querySelector(".progress-fill");
    const lineCountDisplay = document.getElementById("line-count");

    let countryPieChart = null;
    let registrarPieChart = null;

    // Load saved API key
    const savedApiKey = localStorage.getItem("apiKey");
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }

    // Save API key to localStorage
    apiKeyInput.addEventListener("input", function () {
        localStorage.setItem("apiKey", this.value);
    });

    // Drag-and-drop functionality for the textarea
    ipListTextarea.addEventListener("drop", function (event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            ipListTextarea.value = this.result;
        };
        reader.readAsText(file);
    });
    function updateLineCount() {
        const lines = ipListTextarea.value.split("\n").filter(line => line.trim() !== ""); // Count non-empty lines
        lineCountDisplay.innerText = `Lines: ${lines.length}`;
    }

    // Update the line count whenever the textarea content changes
    ipListTextarea.addEventListener("input", updateLineCount);

    // Initialize the line count
    updateLineCount();

    // Lookup function
    window.lookup = async function () {
        const apiKey = document.getElementById("api-key").value.trim();
        const ipList = document.getElementById("ip-list").value.trim();
        const ipArray = ipList.split("\n").map(ip => ip.trim());
        const queriedIPs = new Set();

        const countryCounts = {};
        const registrarCounts = {};
        const tableBody = document.querySelector(".results-table tbody");

        // Clear table and reset progress
        tableBody.innerHTML = "";
        const filteredIPs = ipArray.filter(ip => !isRFC1918(ip)); // Automatically exclude private IPs

        const total = filteredIPs.length; // Only count non-private IPs
        let current = 0;

        for (const ip of filteredIPs) {
            if (!ip || queriedIPs.has(ip)) {
                current++;
                updateProgressBar(current, total);
                continue;
            }

            queriedIPs.add(ip);

            try {
                const response = await fetch(`https://ipinfo.io/${ip}?token=${apiKey}`);
                if (response.ok) {
                    const whois = await response.json();
                    const registrar = whois.org || "N/A";
                    const country = whois.country || "Unknown";

                    addRowToTable(ip, registrar, country);

                    countryCounts[country] = (countryCounts[country] || 0) + 1;
                    registrarCounts[registrar] = (registrarCounts[registrar] || 0) + 1;

                    updateCountryChart(countryCounts);
                    updateRegistrarChart(registrarCounts);
                } else {
                    console.error(`Error fetching data for IP ${ip}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error querying IP ${ip}:`, error);
            } finally {
                current++;
                updateProgressBar(current, total);
            }
        }

        // Enable sorting after all rows are added
        makeTableSortable();
    };



    // Add a row to the table
    function addRowToTable(ip, registrar, country) {
        const row = tableBody.insertRow();

        row.insertCell(0).innerText = ip;
        row.insertCell(1).innerText = registrar;
        row.insertCell(2).innerText = country;

        const actionsCell = row.insertCell(3);
        actionsCell.appendChild(createButton("VT", `https://www.virustotal.com/gui/ip-address/${ip}`));
        actionsCell.appendChild(createButton("AbuseIPDB", `https://www.abuseipdb.com/check/${ip}`));
        actionsCell.appendChild(createButton("Shodan", `https://www.shodan.io/host/${ip}`));
        actionsCell.appendChild(createButton("IPInfo", `https://ipinfo.io/${ip}`));
        actionsCell.appendChild(createButton("AVault", `https://otx.alienvault.com/indicator/ip/${ip}`));
    }

    // Create a button for action links
    function createButton(label, url) {
        const button = document.createElement("button");
        button.innerText = label;
        button.style.marginRight = "5px";
        button.onclick = () => window.open(url, "_blank");
        return button;
    }

    // Check if IP is private
    function isRFC1918(ip) {
        const [a, b, c] = ip.split(".").map(Number);
        return (a === 10) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
    }

    // Update the progress bar
    function updateProgressBar(current, total) {
        const progressFill = document.querySelector(".progress-fill");
        const progressText = document.querySelector(".progress-text");

        const percentage = (current / total) * 100;
        progressFill.style.width = `${percentage}%`;

        progressText.innerText = `Progress: ${current} / ${total}`;
    }

    // Update country chart
    function updateCountryChart(data) {
        const ctx = document.getElementById("country-chart").getContext("2d");
        if (countryPieChart) countryPieChart.destroy();
        countryPieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: generateColors(Object.keys(data).length)
                }]
            }
        });
    }

    // Update registrar chart
    function updateRegistrarChart(data) {
        const ctx = document.getElementById("registrar-chart").getContext("2d");
        if (registrarPieChart) registrarPieChart.destroy();
        registrarPieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: generateColors(Object.keys(data).length)
                }]
            }
        });
    }

    // Generate colors for the charts
    function generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }
        return colors;
    }

    function makeTableSortable() {
        const headers = document.querySelectorAll(".results-table th");

        headers.forEach((header, index) => {
            header.style.cursor = "pointer"; // Make headers visually clickable

            // Initialize data-sort attribute to "none" or "asc"
            header.dataset.sort = "asc";

            // Attach click event listener to each header
            header.addEventListener("click", function () {
                const currentSort = header.dataset.sort;

                // Toggle between ascending and descending
                const newSortDirection = currentSort === "asc" ? "desc" : "asc";

                // Reset all other headers' sort states
                headers.forEach(h => h.dataset.sort = "asc");

                // Apply the new sort state to the clicked header
                header.dataset.sort = newSortDirection;

                // Sort the table
                sortTableByColumn(index, newSortDirection);
            });
        });
    }




    function sortTableByColumn(columnIndex, direction) {
        const tbody = document.querySelector(".results-table tbody");
        const rows = Array.from(tbody.rows);

        const isNumericColumn = rows.every(row => !isNaN(row.cells[columnIndex]?.innerText.trim()) && row.cells[columnIndex]?.innerText.trim() !== "");

        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex]?.innerText.trim() || "";
            const cellB = rowB.cells[columnIndex]?.innerText.trim() || "";

            if (isNumericColumn) {
                return direction === "asc"
                    ? parseFloat(cellA) - parseFloat(cellB)
                    : parseFloat(cellB) - parseFloat(cellA);
            } else {
                return direction === "asc"
                    ? cellA.localeCompare(cellB)
                    : cellB.localeCompare(cellA);
            }
        });

        // Rebuild the table body with sorted rows
        rows.forEach(row => tbody.appendChild(row));
    }

    // Export table to CSV
    window.exportToCsv = function () {
        const table = document.querySelector(".results-table");

        // Extract table headers
        const headers = Array.from(table.querySelectorAll("thead th"))
            .slice(0, 3) // Exclude the last "Actions" header
            .map(th => `"${th.innerText.replace(/"/g, '""')}"`); // Escape quotes and wrap in quotes

        // Extract table rows
        const rows = Array.from(table.querySelectorAll("tbody tr")).map(row => {
            return Array.from(row.cells)
                .slice(0, 3) // Exclude the last "Actions" column
                .map(cell => `"${cell.innerText.replace(/"/g, '""')}"`); // Escape quotes and wrap in quotes
        });

        // Combine headers and rows
        const csvData = [headers, ...rows]
            .map(row => row.join(",")) // Convert each row to a comma-separated string
            .join("\n"); // Join all rows with newline characters

        // Create a downloadable link for the CSV
        const link = document.createElement("a");
        link.download = "whois.csv";
        link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;
        link.click();
    };


});
