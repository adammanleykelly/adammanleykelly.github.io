// Particles.js configurations
const darkModeParticles = {
    background: { color: { value: "#333" } },
    particles: {
        number: { value: 100 }, // Number of particles
        size: { value: 3 }, // Particle size
        opacity: { value: 0.5 }, // Opacity of the particles
        color: { value: "#ffffff" }, // Particle color
        line_linked: {
            enable: true,
            color: "#ffffff", // Link color
            opacity: 0.9,
            width: 1,
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
        },
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: ["repulse", "bubble"], // Combine bubble and repulse
            },
            onclick: {
                enable: true,
                mode: "push", // Add new particles on click
            },
            resize: true,
        },
        modes: {
            repulse: {
                distance: 200,
                duration: 0.4,
            },
            bubble: {
                distance: 200, // Distance at which the bubble effect is triggered
                size: 20, // Size of the bubble
                duration: 2, // How long the bubble lasts
                opacity: 0.8, // Opacity of the bubble
                speed:3,
            },
            push: {
                particles_nb: 4,
            },
            remove: {
                particles_nb: 2,
            }
        },
    },
};

const lightModeParticles = {
    background: { color: { value: "#f9f9f9" } },
    particles: {
        number: { value: 100 }, // Number of particles
        size: { value: 3 }, // Particle size
        opacity: { value: 0.5 }, // Opacity of the particles
        color: { value: "#000000" }, // Particle color
        line_linked: {
            enable: true,
            color: "#000000", // Link color
            opacity: 0.5,
            width: 1,
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
        },
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: ["repulse", "bubble"], // Combine bubble and repulse
            },
            onclick: {
                enable: true,
                mode: "push", // Add new particles on click
            },
            resize: true,
        },
        modes: {
            repulse: {
                distance: 200,
                duration: 0.4,
            },
            bubble: {
                distance: 200, // Distance at which the bubble effect is triggered
                size: 20, // Size of the bubble
                duration: 2, // How long the bubble lasts
                opacity: 0.8, // Opacity of the bubble
                speed:3,
            },
            push: {
                particles_nb: 4,
            },
            remove: {
                particles_nb: 2,
            }
        },
    },
};

// Initialize Particles.js based on saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    particlesJS("particles-js", lightModeParticles);
} else {
    particlesJS("particles-js", darkModeParticles);
}
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const toggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Apply saved theme on page load
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        sunIcon.style.display = 'none'; // Hide sun icon in light mode
        moonIcon.style.display = 'block'; // Show moon icon in light mode
        particlesJS("particles-js", lightModeParticles); // Initialize particles for light mode
    } else {
        sunIcon.style.display = 'block'; // Show sun icon in dark mode
        moonIcon.style.display = 'none'; // Hide moon icon in dark mode
        particlesJS("particles-js", darkModeParticles); // Initialize particles for dark mode
    }

    // Toggle theme and particles on button click
    toggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            sunIcon.style.display = 'block'; // Show sun icon in dark mode
            moonIcon.style.display = 'none'; // Hide moon icon in dark mode
            particlesJS("particles-js", darkModeParticles); // Switch to dark mode particles
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            sunIcon.style.display = 'none'; // Hide sun icon in light mode
            moonIcon.style.display = 'block'; // Show moon icon in light mode
            particlesJS("particles-js", lightModeParticles); // Switch to light mode particles
        }
    });
});


