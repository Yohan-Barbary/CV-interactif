document.addEventListener('DOMContentLoaded', function() {
    const termsContainer = document.querySelector('.terms-container');
    const cards = Array.from(termsContainer.getElementsByClassName('term-card'));

    // Fonction pour obtenir le texte de la balise code
    function getCodeText(card) {
        const codeElement = card.querySelector('code');
        return codeElement.textContent.toLowerCase().replace(/[<>$]/g, '');
    }

    // Trier les cartes par ordre alphabétique
    cards.sort((a, b) => {
        const textA = getCodeText(a);
        const textB = getCodeText(b);
        return textA.localeCompare(textB);
    });

    // Réinsérer les cartes triées
    cards.forEach(card => {
        termsContainer.appendChild(card);
    });

    // Garder la fonctionnalité de filtrage existante
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterCards(filter);
            
            // Mettre à jour la classe active
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchCards(searchTerm);
    });

    function filterCards(filter) {
        const cards = document.querySelectorAll('.term-card');
        cards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function searchCards(searchTerm) {
        const cards = document.querySelectorAll('.term-card');
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    const topButton = document.querySelector('a[href="#"]');
    topButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 