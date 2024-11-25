document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Full Particles.js configuration
    const particlesConfig = {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" }, // Default to dark mode
            shape: {
                type: "circle",
                stroke: { width: 0, color: "#000000" },
                polygon: { nb_sides: 5 },
            },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff", // Default to dark mode
                opacity: 0.4,
                width: 1,
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 1200 },
            },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true,
            },
            modes: {
                grab: { distance: 400, line_linked: { opacity: 1 } },
                bubble: { distance: 200, size: 40, duration: 2, opacity: 8, speed: 3 },
                repulse: { distance: 200, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 },
            },
        },
        retina_detect: true,
    };

    // Function to dynamically update particles configuration for light or dark mode
    const updateParticlesConfig = (theme) => {
        if (theme === "light") {
            particlesConfig.particles.color.value = "#000000"; // Black for light mode
            particlesConfig.particles.line_linked.color = "#000000"; // Black for light mode
        } else {
            particlesConfig.particles.color.value = "#ffffff"; // White for dark mode
            particlesConfig.particles.line_linked.color = "#ffffff"; // White for dark mode
        }
    };

    // Initialize Particles.js
    const initializeParticles = (theme) => {
        updateParticlesConfig(theme);

        if (window.pJSDom && window.pJSDom.length > 0) {
            pJSDom[0].pJS.fn.vendors.destroypJS(); // Destroy existing particles instance
            pJSDom = []; // Reset particles DOM
        }
        particlesJS("particles-js", particlesConfig); // Initialize particles with updated config
    };

    // Apply saved theme and initialize on page load
    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
    } else {
        document.body.classList.remove("light-mode");
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
    }
    initializeParticles(currentTheme);

    // Toggle theme and reinitialize particles on button click
    toggleButton.addEventListener("click", () => {
        if (document.body.classList.contains("light-mode")) {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
            sunIcon.style.display = "block";
            moonIcon.style.display = "none";
            initializeParticles("dark");
        } else {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
            sunIcon.style.display = "none";
            moonIcon.style.display = "block";
            initializeParticles("light");
        }
    });
});
