// Модуль избранного
const Favorites = {
    items: new Set(),

    // Загрузка избранного
    load() {
        const saved = Storage.get('favorites');
        if (saved) {
            this.items = new Set(saved);
        }
    },

    // Сохранение избранного
    save() {
        Storage.set('favorites', Array.from(this.items));
    },

    // Добавление/удаление из избранного
    toggle(productId) {
        if (this.items.has(productId)) {
            this.items.delete(productId);
        } else {
            this.items.add(productId);
        }
        this.save();
    },

    // Проверка наличия в избранном
    has(productId) {
        return this.items.has(productId);
    }
};