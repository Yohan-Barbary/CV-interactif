// Menu mobile
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId)

    if(toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}

showMenu('nav-toggle', 'nav-menu')

// Active et supprime le menu
const navLink = document.querySelectorAll('.nav-link')

function linkAction() {
    // Active link
    navLink.forEach(n => n.classList.remove('active'))
    this.classList.add('active')
    
    // Supprime le menu mobile
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show')
}

navLink.forEach(n => n.addEventListener('click', linkAction))

// Animation du titre lettre par lettre
const animateTitle = () => {
    const title = document.querySelector('.home-title')
    const text = title.textContent
    title.textContent = ''
    
    text.split('').forEach((char, i) => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.animationDelay = `${i * 0.05}s`
        title.appendChild(span)
    })
}

// Effet de parallaxe
document.addEventListener('mousemove', (e) => {
    const sections = document.querySelectorAll('.section')
    const mouseX = e.clientX / window.innerWidth - 0.5
    const mouseY = e.clientY / window.innerHeight - 0.5

    sections.forEach(section => {
        const depth = 20
        const moveX = mouseX * depth
        const moveY = mouseY * depth
        section.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`
    })
})

// Observer pour les animations au scroll
const observerOptions = {
    threshold: 0.3
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active', 'visible')
        }
    })
}, observerOptions)

document.querySelectorAll('.section, .section-title').forEach(section => {
    observer.observe(section)
})

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    animateTitle()
})

// Animation plus fluide des compétences
const animateSkills = () => {
    const skills = document.querySelectorAll('.skills-bar')
    skills.forEach(skill => {
        skill.style.width = '0'
        skill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
    })

    requestAnimationFrame(() => {
        skills.forEach(skill => {
            const width = skill.dataset.width || '0%'
            setTimeout(() => {
                skill.style.width = width
            }, 100)
        })
    })
}

// Animations au scroll avec ScrollReveal
const sr = ScrollReveal({
    origin: 'top',
    distance: '40px',
    duration: 800,
    delay: 100,
    reset: false,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
})

// Animation de la section Home
sr.reveal('.home-title', {})
sr.reveal('.home-title-color', { delay: 400 })
sr.reveal('.home-social-icon', { interval: 200 })
sr.reveal('.button', { delay: 600 })

// Animation de la section About
sr.reveal('.about-subtitle', {})
sr.reveal('.about-text', { delay: 200 })

// Animation de la section Skills
sr.reveal('.skills-subtitle', {})
sr.reveal('.skills-text', { delay: 200 })
sr.reveal('.skills-data', { 
    interval: 200,
    afterReveal: animateSkills // Anime les barres après leur apparition
})

// Animation de la Timeline
sr.reveal('.timeline-item', {
    interval: 200,
    distance: '40px',
    origin: 'left'
})

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: 'smooth'
            })
        }
    })
})

// Observer pour changer le lien actif au scroll
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        const sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href*=${sectionId}]`).classList.add('active')
        } else {
            document.querySelector(`.nav-link[href*=${sectionId}]`).classList.remove('active')
        }
    })
}

window.addEventListener('scroll', scrollActive) 