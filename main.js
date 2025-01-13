// Vérifier si nous sommes sur la page portfolio
if (document.querySelector('.portfolio-page')) {
    // Animation au scroll - sans reset
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 1000,
        reset: false
    })

    // Scroll Home
    sr.reveal('.home-title', {})
    sr.reveal('.button', {delay: 200})
    sr.reveal('.home-social-icon', {interval: 200})

    // Scroll About
    sr.reveal('.about-subtitle', {})
    sr.reveal('.about-text', {delay: 200})

    // Scroll Skills
    sr.reveal('.skills-subtitle', {})
    sr.reveal('.skills-data', {
        interval: 100,
        distance: '20px'
    })

    // Scroll Experience
    sr.reveal('.timeline-item', {
        interval: 200,
        distance: '40px'
    })
} 

// Sélection des éléments
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const homeContent = document.querySelector('.home-content');

// Fonction pour gérer uniquement le déplacement du menu
function toggleMenu() {
    if (navToggle.checked) {
        navMenu.style.left = '0';
    } else {
        navMenu.style.left = '-300px';
    }
}

// Écouteur d'événement sur la checkbox
navToggle.addEventListener('change', toggleMenu);

// Fermeture du menu lors du clic sur un lien
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            navToggle.checked = false;
            navMenu.style.left = '-300px';
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fermeture du menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.checked = false;
        navMenu.style.left = '-300px';
        homeContent.style.transform = 'translateX(0)';
    }
});

// Gestion de la navigation active
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');
        
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-link[href*=' + sectionId + ']').classList.add('active');
        } else {
            document.querySelector('.nav-link[href*=' + sectionId + ']').classList.remove('active');
        }
    });
}

window.addEventListener('scroll', scrollActive); 

// Carousel des compétences
function initSkillsCarousel() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function showNextItem() {
        carouselItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % carouselItems.length;
        carouselItems[currentIndex].classList.add('active');
    }

    // Initialiser le premier item
    carouselItems[0].classList.add('active');
    
    // Changer toutes les 3 secondes
    setInterval(showNextItem, 3000);
}

// Appeler la fonction quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initSkillsCarousel); 

// Initialisation du Swiper avec un effet coverflow ajusté
var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 30, // Augmentez la rotation pour un effet plus prononcé
        stretch: 100, // Augmentez l'étirement pour écarter les cartes
        depth: 200, // Ajustez la profondeur pour un effet 3D
        modifier: 1, // Modifiez l'intensité de l'effet
        slideShadows: false
    },
    loop: true,
    speed: 600,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    }
});

// Ajout d'un gestionnaire d'événements pour la navigation au clavier
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        swiper.slidePrev();
    }
    if (e.key === 'ArrowRight') {
        swiper.slideNext();
    }
}); 