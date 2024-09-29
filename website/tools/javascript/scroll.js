// Testimonials Scroll Control
var testimonials = document.querySelector('.testimonials');

function pauseScroll() {
    testimonials.style.animationPlayState = 'paused';
}

function resumeScroll() {
    testimonials.style.animationPlayState = 'running';
}
