document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const terms = document.querySelectorAll('.term-card');

    // Filtrage par catégorie
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Mise à jour des boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrage des termes
            terms.forEach(term => {
                if (filter === 'all' || term.dataset.category === filter) {
                    term.style.display = 'block';
                } else {
                    term.style.display = 'none';
                }
            });
        });
    });

    // Recherche en temps réel
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        terms.forEach(term => {
            const text = term.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                term.style.display = 'block';
            } else {
                term.style.display = 'none';
            }
        });
    });
}); 