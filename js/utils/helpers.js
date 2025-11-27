// Вспомогательные функции
const Helpers = {
    // Debounce для оптимизации
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Форматирование цены
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }
};