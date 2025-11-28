// Главный JavaScript файл

// Глобальные переменные
let currentProduct = null;
let isProcessingOrder = false;
let showOnlyFavorites = false;

// Инициализация приложения
function init() {
    // Инициализация EmailJS
    emailjs.init("agVERlmGy4__VzycM");
    
    // Загрузка данных
    Favorites.load();
    Cart.load();
    
    // Инициализация модулей
    Search.init();
    Validation.init();
    
    // Рендеринг товаров
    renderProducts();
    
    // Настройка обработчиков событий
    setupEventListeners();
    
    // Имитация загрузки данных
    simulateDataLoading();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Избранное - теперь обрабатывается отдельной функцией
    const toggleFavorites = document.getElementById('toggleFavorites');
    if (toggleFavorites) {
        toggleFavorites.addEventListener('click', () => {
            showOnlyFavorites = !showOnlyFavorites;
            toggleFavorites.classList.toggle('active', showOnlyFavorites);
            renderProducts(); // Только здесь перерисовываем
        });
    }
    
    // Синхронизация между вкладками
    window.addEventListener('storage', () => {
        Favorites.load();
        Cart.load();
        renderProducts();
    });
}

// Имитация загрузки данных
function simulateDataLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 1000);
    }
}

// Рендеринг товаров
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const filteredProducts = Products.filterProducts(
        Search.currentSearch, 
        Search.currentFilter, 
        Favorites.items,
        showOnlyFavorites
    );
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="icon">🍽️</div>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить поисковый запрос или фильтры</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredProducts.map((product, index) => {
        const cartItem = Cart.getItem(product.id);
        const quantityInCart = cartItem ? cartItem.quantity : 0;
        const isFavorite = Favorites.has(product.id);
        
        const imageHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     loading="lazy">
                <div class="image-placeholder" style="display: none;">🍽️</div>
            </div>
        `;
        
        // Определяем, что показывать: кнопку или контролы количества
        const actionHTML = quantityInCart > 0 ? 
            `<div class="quantity-controls-main">
                <button class="quantity-btn-main" onclick="event.stopPropagation(); Cart.updateQuantity(${product.id}, ${quantityInCart - 1})">-</button>
                <span class="quantity-main">${quantityInCart}</span>
                <button class="quantity-btn-main" onclick="event.stopPropagation(); Cart.updateQuantity(${product.id}, ${quantityInCart + 1})">+</button>
            </div>` :
            `<button class="btn add-to-cart-btn" onclick="event.stopPropagation(); Cart.add(${product.id})">
                Добавить в корзину
            </button>`;
        
        return `
            <div class="product-card" onclick="openProduct(${product.id})">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${product.id})">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
                ${imageHTML}
                <div class="product-card-content">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">${product.price} ₽</div>
                    ${actionHTML}
                </div>
            </div>
        `;
    }).join('');
}

// Функции для модальных окон
function openProduct(productId) {
    currentProduct = Products.getById(productId);
    if (!currentProduct) {
        Notifications.show('Товар не найден', 'error');
        return;
    }

    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    const cartItem = Cart.getItem(productId);
    const initialQuantity = cartItem ? cartItem.quantity : 1;
    const isFavorite = Favorites.has(productId);
    
    const isImageFile = currentProduct.image.startsWith('./') || currentProduct.image.startsWith('http');
    
    const imageContent = isImageFile 
        ? `<img src="${currentProduct.image}" alt="${currentProduct.name}" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div class="image-placeholder" style="display: ${isImageFile ? 'none' : 'flex'};">🍽️</div>`
        : `<div class="image-placeholder">${currentProduct.image}</div>`;
    
    content.innerHTML = `
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                style="position: absolute; top: 1rem; right: 3rem;"
                onclick="Favorites.toggle(${currentProduct.id})">
            ${isFavorite ? '❤️' : '🤍'}
        </button>
        <div class="product-image">
            ${imageContent}
        </div>
        <div class="product-name">${currentProduct.name}</div>
        <div class="product-description">${currentProduct.description}</div>
        <div class="product-tags" style="margin-bottom: 1rem;">
            ${currentProduct.tags.map(tag => `<span style="background: #f0f0f0; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 0.5rem;">${tag}</span>`).join('')}
        </div>
        <div class="product-price">${currentProduct.price} ₽</div>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
            <span class="quantity" id="productQuantity">${initialQuantity}</span>
            <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
        </div>
        <button class="btn" onclick="addToCartFromModal(${currentProduct.id})">
            ${cartItem ? 'Обновить корзину' : 'Добавить в корзину'}
        </button>
    `;
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function changeQuantity(change) {
    const quantityElement = document.getElementById('productQuantity');
    if (!quantityElement) return;
    
    let quantity = parseInt(quantityElement.textContent);
    quantity = Math.max(1, quantity + change);
    quantityElement.textContent = quantity;
}

function addToCartFromModal(productId) {
    const quantityElement = document.getElementById('productQuantity');
    if (!quantityElement) return;
    
    const quantity = parseInt(quantityElement.textContent);
    Cart.add(productId, quantity);
    closeModal();
}

function openCart() {
    const modal = document.getElementById('cartModal');
    const itemsContainer = document.getElementById('cartItems');
    const checkoutBtn = modal.querySelector('.btn');
    
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = 'Оформить заказ';
    checkoutBtn.classList.remove('btn-loading', 'btn-disabled');
    
    if (Cart.isEmpty()) {
        itemsContainer.innerHTML = `
            <div class="cart-empty">
                <div class="icon">🛒</div>
                <p>Корзина пуста</p>
                <small>Добавьте товары, чтобы сделать заказ</small>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '';
        // Делаем кнопку неактивной при пустой корзине
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = 'Корзина пуста';
        checkoutBtn.classList.add('btn-disabled');
    } else {
        itemsContainer.innerHTML = Cart.items.map((item, index) => `
            <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                <div class="cart-item-info">
                    <strong>${item.name}</strong><br>
                    <small>${item.price} ₽ за шт.</small>
                </div>
                <div class="cart-item-controls">
                    <strong class="cart-item-total">${item.price * item.quantity} ₽</strong>
                    <div class="quantity-controls-cart">
                        <button class="quantity-btn-cart minus" onclick="event.stopPropagation(); updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity-cart">${item.quantity}</span>
                        <button class="quantity-btn-cart plus" onclick="event.stopPropagation(); updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = Cart.getTotal();
        document.getElementById('cartTotal').textContent = `Итого: ${total} ₽`;
        
        // Активируем кнопку если корзина не пуста
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = 'Оформить заказ';
        checkoutBtn.classList.remove('btn-disabled');
    }
    
    modal.style.display = 'flex';
}

// Функция для обновления количества товара в корзине
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        // Удаляем товар если количество становится 0
        Cart.remove(productId);
    } else {
        // Обновляем количество
        Cart.updateQuantity(productId, newQuantity);
    }
    
    // Перерисовываем корзину чтобы показать изменения
    openCart();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function showCheckout() {
    if (isProcessingOrder) return;
    
    // Проверяем, не пуста ли корзина
    if (Cart.isEmpty()) {
        Notifications.show('Корзина пуста. Добавьте товары перед оформлением заказа.', 'warning');
        return;
    }
    
    const checkoutBtn = document.querySelector('#cartModal .btn');
    
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add('btn-loading');
    checkoutBtn.innerHTML = '<span class="loading-spinner"></span>Обработка...';
    
    setTimeout(() => {
        closeCart();
        document.getElementById('checkoutModal').style.display = 'flex';
        
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('btn-loading');
        checkoutBtn.innerHTML = 'Оформить заказ';
    }, 1000);
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function sendOrder() {
    if (isProcessingOrder) return;
    
    // Дополнительная проверка на пустую корзину
    if (Cart.isEmpty()) {
        Notifications.show('Корзина пуста. Добавьте товары перед оформлением заказа.', 'warning');
        closeCheckout();
        return;
    }
    
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const organization = document.getElementById('customerOrganization').value;
    const address = document.getElementById('customerAddress').value;
    const sendBtn = document.querySelector('#checkoutModal .btn');
    
    // Валидация формы
    if (!Validation.validateForm()) {
        Notifications.show('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    if (!name || !email || !phone || !address) {
        Notifications.show('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Блокируем кнопку отправки
    isProcessingOrder = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('btn-loading');
    sendBtn.innerHTML = '<span class="loading-spinner"></span>Отправка заявки...';
    
    try {
        const orderDetails = Cart.items.map(item => 
            `${item.name} - ${item.quantity} шт. × ${item.price} ₽ = ${item.quantity * item.price} ₽`
        ).join('\n');
        
        const total = Cart.getTotal();
        
        const templateParams = {
            organization: "ИП Соколова Н.С. - Полуфабрикаты",
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            customer_organization: organization || 'Не указано',
            customer_address: address,
            order_details: orderDetails,
            total_amount: total,
            order_date: new Date().toLocaleString('ru-RU')
        };
        
        // Отправка через EmailJS
        emailjs.send('service_khlato8', 'template_jup6pwi', templateParams)
            .then(function(response) {
                Notifications.show('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Очищаем корзину и форму
                Cart.clear();
                closeCheckout();
                
                // Сбрасываем форму
                document.getElementById('customerName').value = '';
                document.getElementById('customerEmail').value = '';
                document.getElementById('customerPhone').value = '';
                document.getElementById('customerOrganization').value = '';
                document.getElementById('customerAddress').value = '';
            }, function(error) {
                throw new Error('Ошибка отправки email');
            })
            .catch(function(error) {
                console.error('Ошибка отправки:', error);
                Notifications.show('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.', 'error');
            })
            .finally(function() {
                isProcessingOrder = false;
                sendBtn.disabled = false;
                sendBtn.classList.remove('btn-loading');
                sendBtn.innerHTML = 'Отправить заявку';
            });
            
    } catch (error) {
        console.error('Ошибка обработки заказа:', error);
        Notifications.show('Произошла ошибка при обработке заказа', 'error');
        
        isProcessingOrder = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('btn-loading');
        sendBtn.innerHTML = 'Отправить заявку';
    }
}

// Более продвинутая функция toggleFavorite
function toggleFavorite(productId) {
    const wasFavorite = Favorites.has(productId);
    Favorites.toggle(productId);
    const isFavorite = Favorites.has(productId);
    
    // Обновляем только кнопку избранного
    const favoriteBtn = document.querySelector(`.favorite-btn[onclick*="${productId}"]`);
    if (favoriteBtn) {
        favoriteBtn.innerHTML = isFavorite ? '❤️' : '🤍';
        favoriteBtn.classList.toggle('active', isFavorite);
        
        // Плавная анимация
        favoriteBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            favoriteBtn.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Показываем уведомление только если нужно
    if (isFavorite && !wasFavorite) {
        setTimeout(() => {
            Notifications.show('Добавлено в избранное', 'success');
        }, 100);
    } else if (!isFavorite && wasFavorite) {
        setTimeout(() => {
            Notifications.show('Удалено из избранного', 'info');
        }, 100);
    }
}

// Глобальные функции
window.renderProducts = renderProducts;
window.openProduct = openProduct;
window.closeModal = closeModal;
window.changeQuantity = changeQuantity;
window.addToCartFromModal = addToCartFromModal;
window.openCart = openCart;
window.closeCart = closeCart;
window.showCheckout = showCheckout;
window.closeCheckout = closeCheckout;
window.sendOrder = sendOrder;
window.toggleFavorite = toggleFavorite;
window.updateProductCard = updateProductCard;
window.updateCartItemQuantity = updateCartItemQuantity; // Добавьте эту строку

// Сделаем Cart доступным глобально для обработчиков onclick
window.Cart = Cart;
window.Favorites = Favorites;

// Закрытие модальных окон при клике вне контента
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    Notifications.show('Произошла непредвиденная ошибка', 'error');
});

// Глобальная функция для обновления карточки товара
function updateProductCard(productId) {
    Cart.updateProductCard(productId);
}

// Сделаем функцию доступной глобально
window.updateProductCard = updateProductCard;

// Инициализация при загрузке страницы
window.onload = init;