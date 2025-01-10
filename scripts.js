document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour diviser le texte en lettres
    const splitText = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const text = element.textContent;
            const letters = text.split('');
            element.textContent = '';
            letters.forEach(letter => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = letter;
                element.appendChild(span);
            });
        });
    };

    // Diviser le texte en lettres
    splitText('.letter-wrapper');

    // Animation des lettres
    const textReveal = anime.timeline({
        loop: false,
        autoplay: true
    });

    textReveal
        .add({
            targets: '.text-reveal .letter-wrapper',
            opacity: [0, 1],
            duration: 100,
            easing: 'easeInOutQuad'
        })
        .add({
            targets: '.text-reveal .letter',
            opacity: [0, 1],
            duration: 50,
            delay: anime.stagger(50),
            easing: 'easeInOutQuad',
            complete: (anim) => {
                document.querySelectorAll('.letter').forEach(letter => {
                    letter.classList.add('filled');
                });
            }
        });

    // Animation de remplissage des lettres
    const letterFill = anime({
        targets: '.letter.filled',
        color: [
            { value: 'transparent' },
            { value: getComputedStyle(document.documentElement).getPropertyValue('--text-color') }
        ],
        duration: 1000,
        delay: anime.stagger(50),
        easing: 'easeInOutSine'
    });

    // Nouvelle fonction pour l'effet machine à écrire
    const typewriterEffect = () => {
        const textElements = document.querySelectorAll('.reveal-text');
        
        textElements.forEach(element => {
            if (element.tagName !== 'A') {  // Ne pas wrapper le bouton
                const text = element.textContent;
                const wrapper = document.createElement('span');
                wrapper.className = 'typewriter';
                wrapper.textContent = text;
                element.textContent = '';
                element.appendChild(wrapper);
            }
        });
    };

    // Observer pour l'animation de la section À propos
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const textElements = entry.target.querySelectorAll('.reveal-text');
                textElements.forEach(element => {
                    element.classList.add('visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer la section about
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    // Fonction pour réinitialiser l'animation
    function resetAnimation() {
        const textElements = document.querySelectorAll('.reveal-text');
        textElements.forEach(element => {
            element.classList.remove('visible');
        });
        if (aboutSection) {
            observer.observe(aboutSection);
        }
    }

    // Réinitialiser l'animation lors du retour en haut de page
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            setTimeout(resetAnimation, 300);
        }
    });

    // Fonction pour mettre à jour l'année
    function updateYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Mettre à jour l'année au chargement
    updateYear();

    // Mettre à jour l'année toutes les secondes (optionnel, car l'année change rarement pendant une session)
    setInterval(updateYear, 1000);
}); 