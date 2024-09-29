// Mobile Menu Toggle
function toggleMenu() {
    var navbar = document.getElementById('navbar');
    if (navbar.style.display === 'flex') {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
    }
}

// Dropdown Menu Toggle on Mobile
function toggleDropdown() {
    var dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('active');
}

// Testimonials Scroll Control
var testimonials = document.querySelector('.testimonials');

function pauseScroll() {
    testimonials.style.animationPlayState = 'paused';
}

function resumeScroll() {
    testimonials.style.animationPlayState = 'running';
}
