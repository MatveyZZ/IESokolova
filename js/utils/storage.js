// Модуль для работы с localStorage
const Storage = {
    // Получение данных
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Ошибка чтения из localStorage:`, error);
            return null;
        }
    },

    // Сохранение данных
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Ошибка записи в localStorage:`, error);
            return false;
        }
    },

    // Удаление данных
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Ошибка удаления из localStorage:`, error);
            return false;
        }
    }
};