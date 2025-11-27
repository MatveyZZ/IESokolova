// Инициализация EmailJS
emailjs.init("agVERlmGy4__VzycM");

// Расширенные данные товаров
const products = [
    {
        id: 1,
        name: "Пельмени Сибирские",
        description: "Сибирские пельмени ручной работы, 1кг.",
        price: 450,
        image: "./assets/pelmeni.jpg",
        category: "пельмени",
        tags: ["ручная работа", "сибирские", "премиум"]
    },
    {
        id: 2,
        name: "Котлеты 'Киевские'",
        description: "Нежнейшие котлеты из куриной грудки, 800г",
        price: 380,
        image: "./assets/kievskie.jpg",
        category: "котлеты",
        tags: ["куриные", "нежные", "классические"]
    },
    {
        id: 3,
        name: "Зразы с сыром",
        description: "Куриные котлеты с сыром, 800г",
        price: 420,
        image: "./assets/zrazy.jpg",
        category: "зразы",
        tags: ["с сыром", "куриные", "сытные"]
    },
    {
        id: 4,
        name: "Котлеты 'Домашние'",
        description: "Котлеты из свинины, 600г",
        price: 300,
        image: "./assets/domashnie.jpg",
        category: "котлеты",
        tags: ["свиные", "домашние", "традиционные"]
    }
];

// Глобальные переменные
let cart = [];
let favorites = new Set();
let currentProduct = null;
let isProcessingOrder = false;
let currentFilter = 'all';
let currentSearch = '';
let showOnlyFavorites = false;

// Инициализация страницы
function init() {
    loadFromStorage();
    setupEventListeners();
    renderProducts();
    updateCartBadge();
    
    // Имитация загрузки данных
    simulateDataLoading();
}

// Загрузка данных из localStorage
function loadFromStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        const savedFavorites = localStorage.getItem('favorites');
        
        cart = savedCart ? JSON.parse(savedCart) : [];
        favorites = new Set(savedFavorites ? JSON.parse(savedFavorites) : []);
        
        console.log('Загружена корзина:', cart);
        console.log('Загружены избранные:', Array.from(favorites));
    } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
        showNotification('Ошибка загрузки данных', 'error');
        cart = [];
        favorites = new Set();
    }
}

// Сохранение данных в localStorage
function saveToStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
        
        // Синхронизация между вкладками
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
        showNotification('Ошибка сохранения данных', 'error');
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentSearch = e.target.value.toLowerCase();
            updateClearSearchButton();
            renderProducts();
        }, 300));
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            currentSearch = '';
            updateClearSearchButton();
            renderProducts();
        });
    }
    
    // Фильтры
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderProducts();
        });
    });
    
    // Избранное
    const toggleFavorites = document.getElementById('toggleFavorites');
    if (toggleFavorites) {
        toggleFavorites.addEventListener('click', () => {
            showOnlyFavorites = !showOnlyFavorites;
            toggleFavorites.classList.toggle('active', showOnlyFavorites);
            renderProducts();
        });
    }
    
    // Синхронизация между вкладками
    window.addEventListener('storage', () => {
        loadFromStorage();
        renderProducts();
        updateCartBadge();
    });
    
    // Валидация форм
    setupFormValidation();
}

// Обновление кнопки очистки поиска
function updateClearSearchButton() {
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.classList.toggle('visible', currentSearch.length > 0);
    }
}

// Debounce для поиска
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

// Отображение товаров с виртуализацией
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // Фильтрация товаров
    let filteredProducts = products.filter(product => {
        const matchesSearch = !currentSearch || 
            product.name.toLowerCase().includes(currentSearch) ||
            product.description.toLowerCase().includes(currentSearch) ||
            product.tags.some(tag => tag.toLowerCase().includes(currentSearch));
        
        const matchesFilter = currentFilter === 'all' || product.category === currentFilter;
        const matchesFavorites = !showOnlyFavorites || favorites.has(product.id);
        
        return matchesSearch && matchesFilter && matchesFavorites;
    });
    
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
    
    // Рендеринг с задержкой для анимаций
    grid.innerHTML = filteredProducts.map((product, index) => {
        const cartItem = cart.find(item => item.id === product.id);
        const quantityInCart = cartItem ? cartItem.quantity : 0;
        const isFavorite = favorites.has(product.id);
        
        const isImageFile = product.image.startsWith('./') || product.image.startsWith('http');
        
        const imageContent = isImageFile 
            ? `<img src="${product.image}" alt="${product.name}" 
                   loading="lazy"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
               <div class="image-placeholder" style="display: ${isImageFile ? 'none' : 'flex'};">🍽️</div>`
            : `<div class="image-placeholder">${product.image}</div>`;
        
        return `
            <div class="product-card" onclick="openProduct(${product.id})" 
                 style="animation-delay: ${index * 0.1}s">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${product.id})">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
                <div class="product-image">
                    ${imageContent}
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price} ₽</div>
                ${quantityInCart > 0 ? 
                    `<div class="quantity-controls-main">
                        <button class="quantity-btn-main" onclick="event.stopPropagation(); updateProductQuantity(${product.id}, ${quantityInCart - 1})">-</button>
                        <span class="quantity-main">${quantityInCart}</span>
                        <button class="quantity-btn-main" onclick="event.stopPropagation(); updateProductQuantity(${product.id}, ${quantityInCart + 1})">+</button>
                    </div>` :
                    `<button class="btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Добавить в корзину
                    </button>`
                }
            </div>
        `;
    }).join('');
}

// Избранное
function toggleFavorite(productId) {
    if (favorites.has(productId)) {
        favorites.delete(productId);
        showNotification('Удалено из избранного', 'info');
    } else {
        favorites.add(productId);
        showNotification('Добавлено в избранное', 'success');
    }
    saveToStorage();
    renderProducts();
}

// Обновление количества товара
function updateProductQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    
    try {
        if (newQuantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
            showNotification(`${product.name} удален из корзины`, 'info');
        } else {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity = newQuantity;
                showNotification(`Количество ${product.name} обновлено: ${newQuantity} шт.`, 'success');
            } else {
                cart.push({
                    ...product,
                    quantity: newQuantity
                });
                showNotification(`${product.name} добавлен в корзину`, 'success');
            }
        }
        
        saveToStorage();
        updateCartBadge();
        renderProducts();
    } catch (error) {
        console.error('Ошибка обновления количества:', error);
        showNotification('Ошибка обновления корзины', 'error');
    }
}

// Открытие модального окна товара
function openProduct(productId) {
    try {
        currentProduct = products.find(p => p.id === productId);
        if (!currentProduct) throw new Error('Товар не найден');
        
        const modal = document.getElementById('productModal');
        const content = document.getElementById('modalContent');
        
        const cartItem = cart.find(item => item.id === productId);
        const initialQuantity = cartItem ? cartItem.quantity : 1;
        const isFavorite = favorites.has(productId);
        
        const isImageFile = currentProduct.image.startsWith('./') || currentProduct.image.startsWith('http');
        
        const imageContent = isImageFile 
            ? `<img src="${currentProduct.image}" alt="${currentProduct.name}" 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
               <div class="image-placeholder" style="display: ${isImageFile ? 'none' : 'flex'};">🍽️</div>`
            : `<div class="image-placeholder">${currentProduct.image}</div>`;
        
        content.innerHTML = `
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                    style="position: absolute; top: 1rem; right: 3rem;"
                    onclick="toggleFavorite(${currentProduct.id})">
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
    } catch (error) {
        console.error('Ошибка открытия товара:', error);
        showNotification('Ошибка загрузки товара', 'error');
    }
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Изменение количества в модальном окне
function changeQuantity(change) {
    const quantityElement = document.getElementById('productQuantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity = Math.max(1, quantity + change);
    quantityElement.textContent = quantity;
}

// Добавление в корзину из модального окна
function addToCartFromModal(productId) {
    const quantity = parseInt(document.getElementById('productQuantity').textContent);
    addToCart(productId, quantity);
}

// Добавление в корзину
function addToCart(productId, quantity = 1) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Товар не найден');
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            showNotification(`Добавлено ${quantity} шт. ${product.name}. Всего: ${existingItem.quantity} шт.`, 'success');
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
            showNotification(`${product.name} добавлен в корзину: ${quantity} шт.`, 'success');
        }
        
        saveToStorage();
        updateCartBadge();
        renderProducts();
        closeModal();
    } catch (error) {
        console.error('Ошибка добавления в корзину:', error);
        showNotification('Ошибка добавления в корзину', 'error');
    }
}

// Открытие корзины
function openCart() {
    const modal = document.getElementById('cartModal');
    const itemsContainer = document.getElementById('cartItems');
    const checkoutBtn = modal.querySelector('.btn');
    
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = 'Оформить заказ';
    checkoutBtn.classList.remove('btn-loading');
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div class="empty-state"><div class="icon">🛒</div><p>Корзина пуста</p></div>';
        document.getElementById('cartTotal').textContent = '';
    } else {
        itemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.price} ₽ × ${item.quantity}</small>
                </div>
                <div>
                    <strong>${item.price * item.quantity} ₽</strong>
                    <div class="quantity-controls" style="margin-top: 0.5rem;">
                        <button class="quantity-btn" onclick="updateCartItem(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItem(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = `Итого: ${total} ₽`;
    }
    
    modal.style.display = 'flex';
}

// Закрытие корзины
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Обновление элемента корзины
function updateCartItem(productId, newQuantity) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Товар не найден');
        
        if (newQuantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
            showNotification(`${product.name} удален из корзины`, 'info');
        } else {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                showNotification(`Количество ${product.name} обновлено: ${newQuantity} шт.`, 'success');
            }
        }
        
        saveToStorage();
        updateCartBadge();
        renderProducts();
        openCart();
    } catch (error) {
        console.error('Ошибка обновления корзины:', error);
        showNotification('Ошибка обновления корзины', 'error');
    }
}

// Показать оформление заказа
function showCheckout() {
    if (isProcessingOrder) return;
    
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

// Закрыть оформление заказа
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Настройка валидации форм
function setupFormValidation() {
    const inputs = document.querySelectorAll('#checkoutModal input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Валидация поля
function validateField(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.id + 'Error');
    
    let isValid = true;
    let errorMessage = '';
    
    switch (field.id) {
        case 'customerName':
            if (field.value.length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            }
            break;
        case 'customerEmail':
            if (!/\S+@\S+\.\S+/.test(field.value)) {
                isValid = false;
                errorMessage = 'Введите корректный email';
            }
            break;
        case 'customerPhone':
            if (!/^[\d\s\-\+\(\)]+$/.test(field.value) || field.value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
            break;
        case 'customerAddress':
            if (field.value.length < 5) {
                isValid = false;
                errorMessage = 'Адрес должен содержать минимум 5 символов';
            }
            break;
    }
    
    if (!isValid) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
    
    return isValid;
}

// Очистка ошибки поля
function clearFieldError(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.id + 'Error');
    
    field.classList.remove('error');
    errorElement.textContent = '';
}

// Валидация всей формы
function validateForm() {
    const fields = ['customerName', 'customerEmail', 'customerPhone', 'customerAddress'];
    let isValid = true;
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const event = new Event('blur');
        field.dispatchEvent(event);
        
        if (field.classList.contains('error')) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Отправка заказа
function sendOrder() {
    if (isProcessingOrder) return;
    
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const sendBtn = document.querySelector('#checkoutModal .btn');
    
    // Валидация формы
    if (!validateForm()) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    if (!name || !email || !phone || !address) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Блокируем кнопку отправки
    isProcessingOrder = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('btn-loading');
    sendBtn.innerHTML = '<span class="loading-spinner"></span>Отправка заявки...';
    
    try {
        const orderDetails = cart.map(item => 
            `${item.name} - ${item.quantity} шт. × ${item.price} ₽ = ${item.quantity * item.price} ₽`
        ).join('\n');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const templateParams = {
            organization: "ИП Соколова Н.С. - Полуфабрикаты",
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            customer_address: address,
            order_details: orderDetails,
            total_amount: total,
            order_date: new Date().toLocaleString('ru-RU')
        };
        
        // Отправка через EmailJS
        emailjs.send('service_khlato8', 'template_jup6pwi', templateParams)
            .then(function(response) {
                showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Очищаем корзину и форму
                cart = [];
                saveToStorage();
                updateCartBadge();
                renderProducts();
                closeCheckout();
                
                document.getElementById('customerName').value = '';
                document.getElementById('customerEmail').value = '';
                document.getElementById('customerPhone').value = '';
                document.getElementById('customerAddress').value = '';
            }, function(error) {
                throw new Error('Ошибка отправки email');
            })
            .catch(function(error) {
                console.error('Ошибка отправки:', error);
                showNotification('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.', 'error');
            })
            .finally(function() {
                isProcessingOrder = false;
                sendBtn.disabled = false;
                sendBtn.classList.remove('btn-loading');
                sendBtn.innerHTML = 'Отправить заявку';
            });
            
    } catch (error) {
        console.error('Ошибка обработки заказа:', error);
        showNotification('Произошла ошибка при обработке заказа', 'error');
        
        isProcessingOrder = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('btn-loading');
        sendBtn.innerHTML = 'Отправить заявку';
    }
}

// Обновление бейджа корзины
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    try {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
        
        // Закрытие по клику
        notification.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    } catch (error) {
        console.error('Ошибка показа уведомления:', error);
        // Fallback на alert
        alert(message);
    }
}

// Инициализация при загрузке страницы
window.onload = init;

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
    showNotification('Произошла непредвиденная ошибка', 'error');
});

// Export для тестирования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        cart,
        favorites,
        init,
        addToCart,
        updateProductQuantity,
        toggleFavorite
    };
}