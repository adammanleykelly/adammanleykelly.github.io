const toggleButton = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    toggleButton.textContent = 'Switch to Dark Mode';
}

toggleButton.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        toggleButton.textContent = 'Switch to Light Mode';
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        toggleButton.textContent = 'Switch to Dark Mode';
    }
});
