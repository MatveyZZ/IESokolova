// Модуль корзины
const Cart = {
    items: [],

    // Загрузка корзины
    load() {
        const saved = Storage.get('cart');
        if (saved) {
            this.items = saved;
        }
        this.updateBadge();
    },

    // Сохранение корзины
    save() {
        Storage.set('cart', this.items);
        this.updateBadge();
        this.updateProductCards(); // Обновляем карточки товаров
    },

    // Добавление товара в корзину
    add(productId, quantity = 1) {
        const product = Products.getById(productId);
        if (!product) {
            Notifications.show('Товар не найден', 'error');
            return false;
        }

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            Notifications.show(`Добавлено ${quantity} шт. ${product.name}. Всего: ${existingItem.quantity} шт.`, 'success');
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
            Notifications.show(`${product.name} добавлен в корзину: ${quantity} шт.`, 'success');
        }

        this.save();
        return true;
    },

    // Обновление количества товара
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.remove(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.save();
            // Обновляем карточку товара после изменения количества
            this.updateProductCard(productId);
        }
    },

    // Удаление товара из корзины
    remove(productId) {
        const product = this.items.find(item => item.id === productId);
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        
        // Обновляем карточку товара после удаления
        this.updateProductCard(productId);
        
        if (product) {
            Notifications.show(`${product.name} удален из корзины`, 'info');
        }
    },

    // Получение товара из корзины
    getItem(productId) {
        return this.items.find(item => item.id === productId);
    },

    // Очистка корзины
    clear() {
        this.items = [];
        this.save();
        Notifications.show('Корзина очищена', 'info');
    },

    // Подсчет общей суммы
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Подсчет количества товаров
    getItemsCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },

    // Обновление бейджа корзины
    updateBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const count = this.getItemsCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    // Обновление карточек товаров
    updateProductCards() {
        // Находим все карточки товаров, которые есть в корзине
        this.items.forEach(item => {
            this.updateProductCard(item.id);
        });
    },

    // Обновление конкретной карточки товара
    updateProductCard(productId) {
        const productCard = document.querySelector(`.product-card[onclick*="openProduct(${productId})"]`);
        if (!productCard) return;

        const cartItem = this.getItem(productId);
        const quantityInCart = cartItem ? cartItem.quantity : 0;
        
        // Находим контейнер для кнопки/контролов
        const buttonContainer = productCard.querySelector('.add-to-cart-btn, .quantity-controls-main');
        if (!buttonContainer) return;

        if (quantityInCart > 0) {
            // Заменяем на контролы количества
            buttonContainer.outerHTML = `
                <div class="quantity-controls-main">
                    <button class="quantity-btn-main" onclick="event.stopPropagation(); Cart.updateQuantity(${productId}, ${quantityInCart - 1})">-</button>
                    <span class="quantity-main">${quantityInCart}</span>
                    <button class="quantity-btn-main" onclick="event.stopPropagation(); Cart.updateQuantity(${productId}, ${quantityInCart + 1})">+</button>
                </div>
            `;
        } else {
            // Заменяем на кнопку добавления в корзину
            buttonContainer.outerHTML = `
                <button class="btn add-to-cart-btn" onclick="event.stopPropagation(); Cart.add(${productId})">
                    Добавить в корзину
                </button>
            `;
        }
    },

    // Проверка пуста ли корзина
    isEmpty() {
        return this.items.length === 0;
    }
};