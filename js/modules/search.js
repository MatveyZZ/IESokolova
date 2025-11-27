// Модуль поиска
const Search = {
    currentSearch: '',
    currentFilter: 'all',

    // Инициализация поиска
    init() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const filterButtons = document.querySelectorAll('.filter-btn');

        if (searchInput) {
            searchInput.addEventListener('input', Helpers.debounce((e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.updateClearButton();
                window.renderProducts();
            }, 300));
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.category;
                window.renderProducts();
            });
        });
    },

    // Очистка поиска
    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        this.currentSearch = '';
        this.updateClearButton();
        window.renderProducts();
    },

    // Обновление кнопки очистки
    updateClearButton() {
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.classList.toggle('visible', this.currentSearch.length > 0);
        }
    }
};