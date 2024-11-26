document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Particles configuration as a JavaScript object
    const particlesConfig = {
        particles: {
            number: {
                value: 100,
                density: { 
                    enable: true, 
                    value_area: 800 
                } // Added density
            },
            size: { 
                value: 3, 
                random: true, // Added random size
                anim: { 
                    enable: false, 
                    speed: 40, 
                    size_min: 0.1, 
                    sync: false 
                } // Added animation settings
            },
            opacity: { 
                value: 0.4, 
                random: false, 
                anim: { 
                    enable: false, 
                    speed: 1, 
                    opacity_min: 0.1, 
                    sync: false 
                } // Added opacity animation settings
            },
            color: { 
                value: "#ffffff" 
            },
            shape: {
                type: "circle", // Added shape type
                stroke: { 
                    width: 0, 
                    color: "#000000" 
                }, // Added shape stroke
                polygon: { 
                    nb_sides: 5 
                }, // Added polygon sides
                image: { 
                    src: "img/github.svg", 
                    width: 100, 
                    height: 100 
                } // Added shape image
            },
            line_linked: {
                enable: true,
                distance: 150, // Added link distance
                color: "#ffffff",
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 5,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out", // Added out_mode
                attract: { 
                    enable: false, 
                    rotateX: 600, 
                    rotateY: 1200 
                } // Added attract properties
            },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: ["repulse", "bubble"]
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: { 
                    distance: 400, 
                    line_linked: { 
                        opacity: 1 
                    } 
                }, // Added grab mode
                bubble: {
                    distance: 200,
                    size: 5,
                    duration: 2,
                    opacity: 0.8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            },
        },
        background: {
            color: { value: "#333" }, // Default dark mode background
        },
    };


    // Initialize particles with the current configuration
    const initializeParticles = (theme) => {
        // Update particle and link colors based on theme
        if (theme === "light") {
            particlesConfig.particles.color.value = "#000000"; // Black particles for light mode
            particlesConfig.particles.line_linked.color = "#000000"; // Black links for light mode
            particlesConfig.background.color.value = "#f9f9f9"; // Light mode background
        } else {
            particlesConfig.particles.color.value = "#ffffff"; // White particles for dark mode
            particlesConfig.particles.line_linked.color = "#ffffff"; // White links for dark mode
            particlesConfig.background.color.value = "#333"; // Dark mode background
        }

        // Destroy existing particles instance if it exists
        if (window.pJSDom && window.pJSDom.length > 0) {
            pJSDom[0].pJS.fn.vendors.destroypJS();
            pJSDom = [];
        }

        // Initialize particles.js with updated configuration
        particlesJS("particles-js", particlesConfig);
    };

    // Apply saved theme on page load
    const currentTheme = localStorage.getItem("theme") || "dark";
    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
        sunIcon.style.display = "none"; // Hide sun icon in light mode
        moonIcon.style.display = "block"; // Show moon icon in light mode
    } else {
        document.body.classList.remove("light-mode");
        sunIcon.style.display = "block"; // Show sun icon in dark mode
        moonIcon.style.display = "none"; // Hide moon icon in dark mode
    }
    initializeParticles(currentTheme); // Initialize particles with the current theme

    // Toggle theme and particles on button click
    toggleButton.addEventListener("click", () => {
        if (document.body.classList.contains("light-mode")) {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
            sunIcon.style.display = "block"; // Show sun icon in dark mode
            moonIcon.style.display = "none"; // Hide moon icon in dark mode
            initializeParticles("dark"); // Reinitialize particles for dark mode
        } else {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
            sunIcon.style.display = "none"; // Hide sun icon in light mode
            moonIcon.style.display = "block"; // Show moon icon in light mode
            initializeParticles("light"); // Reinitialize particles for light mode
        }
    });
});
