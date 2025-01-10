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