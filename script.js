// Initialisation des animations AOS
AOS.init({
    duration: 1000,
    once: true
});

// Gestion de la navigation
const navbar = document.querySelector('.navbar');
const navTexts = document.querySelectorAll('.nav-text');

window.addEventListener('scroll', () => {
    // Masquer/afficher le texte de la navigation
    if (window.scrollY > 100) {
        navTexts.forEach(text => {
            text.style.opacity = '0';
            text.style.width = '0';
            text.style.display = 'none';
        });
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        navTexts.forEach(text => {
            text.style.opacity = '1';
            text.style.width = 'auto';
            text.style.display = 'inline';
        });
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation des éléments de la timeline au scroll
const timelineItems = document.querySelectorAll('.timeline-item');

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    observer.observe(item);
}); 