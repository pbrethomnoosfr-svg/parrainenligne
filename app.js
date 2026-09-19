/**
 * ParrainEnLigne — Logique applicative
 */
document.addEventListener('DOMContentLoaded', () => {
    let currentCategory = 'all';
    let debounceTimer = null;
    let toastTimer = null;

    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.offer-card');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    /**
     * Applique les filtres de catégorie et de recherche textuelle
     */
    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        cards.forEach(card => {
            const matchesCategory = (currentCategory === 'all' || card.dataset.category === currentCategory);
            const matchesSearch = !query || card.textContent.toLowerCase().includes(query);

            card.style.display = (matchesCategory && matchesSearch) ? 'flex' : 'none';
        });
    }

    /**
     * Gère la sélection des catégories
     */
    function filterCategory(category) {
        currentCategory = category;

        filterButtons.forEach(btn => {
            const isSelected = btn.dataset.category === category;
            btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
            if (isSelected) {
                btn.classList.add('bg-indigo-600', 'text-white');
                btn.classList.remove('bg-slate-800', 'text-slate-300');
            } else {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-slate-800', 'text-slate-300');
            }
        });

        applyFilters();
    }

    // Événements sur les boutons de catégorie
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => filterCategory(btn.dataset.category));
    });

    // Événement sur la barre de recherche avec anti-rebond (debounce)
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFilters, 100);
        });
    }

    // Copie du code parrain dans le presse-papier + notification Toast
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.copyCode;
            const name = btn.dataset.copyName;

            if (!code) return;

            navigator.clipboard.writeText(code).then(() => {
                if (toast && toastMessage) {
                    toastMessage.textContent = `Code ${name || ''} copié dans le presse-papier !`;
                    toast.classList.add('show');

                    clearTimeout(toastTimer);
                    toastTimer = setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                }
            }).catch(err => {
                console.error('Erreur de copie :', err);
            });
        });
    });
});