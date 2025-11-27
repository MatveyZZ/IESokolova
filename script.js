// Инициализация EmailJS (замените на свои ключи)
emailjs.init("agVERlmGy4__VzycM");

// Данные товаров
const products = [
    {
        id: 1,
        name: "Пельмени Сибирские",
        description: "Сибирские пельмени ручной работы, 1кг.",
        price: 450,
        image: "./assets/pelmeni.jpg"
    },
    {
        id: 2,
        name: "Котлеты 'Киевские'",
        description: "Нежнейшие котлеты из куриной грудки, 800г",
        price: 380,
        image: "./assets/kievskie.jpg"
    },
    {
        id: 3,
        name: "Зразы с сыром",
        description: "Куриные котлеты с сыром, 800г",
        price: 420,
        image: "./assets/zrazy.jpg"
    },
    {
        id: 4,
        name: "Котлеты 'Домашние'",
        description: "Котлеты из свинины, 600г",
        price: 300,
        image: "./assets/domashnie.jpg"
    }
];

let cart = [];
let currentProduct = null;
let isProcessingOrder = false;

// Инициализация страницы
// Инициализация страницы
function init() {
    // Сначала загружаем корзину из localStorage
    loadCartFromStorage();
    console.log('Загружена корзина:', cart);
    
    // Затем рендерим товары
    renderProducts();
    updateCartBadge();
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Отображение товаров
// Отображение товаров
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        const quantityInCart = cartItem ? cartItem.quantity : 0;
        
        // Проверяем, является ли image путем к файлу или эмодзи
        const isImageFile = product.image.startsWith('./') || product.image.startsWith('http');
        
        const imageContent = isImageFile 
            ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
               <div class="image-placeholder" style="display: ${isImageFile ? 'none' : 'flex'};">🍽️</div>`
            : `<div class="image-placeholder">${product.image}</div>`;
        
        return `
            <div class="product-card" onclick="openProduct(${product.id})">
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

// Обновление количества товара на главной странице
function updateProductQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
        // Удаляем товар из корзины
        cart = cart.filter(item => item.id !== productId);
        showNotification(`${product.name} удален из корзины`, 'info');
    } else {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity = newQuantity;
            showNotification(`Количество ${product.name} обновлено: ${newQuantity} шт.`, 'success');
        } else {
            const product = products.find(p => p.id === productId);
            cart.push({
                ...product,
                quantity: newQuantity
            });
            showNotification(`${product.name} добавлен в корзину`, 'success');
        }
    }
    
    saveCartToStorage();
    updateCartBadge();
    renderProducts(); // Перерисовываем товары для обновления кнопок
}

// Открытие модального окна товара
// Открытие модального окна товара
function openProduct(productId) {
    currentProduct = products.find(p => p.id === productId);
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    const cartItem = cart.find(item => item.id === productId);
    const initialQuantity = cartItem ? cartItem.quantity : 1;
    
    // Проверяем, является ли image путем к файлу или эмодзи
    const isImageFile = currentProduct.image.startsWith('./') || currentProduct.image.startsWith('http');
    
    const imageContent = isImageFile 
        ? `<img src="${currentProduct.image}" alt="${currentProduct.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div class="image-placeholder" style="display: ${isImageFile ? 'none' : 'flex'};">🍽️</div>`
        : `<div class="image-placeholder">${currentProduct.image}</div>`;
    
    content.innerHTML = `
        <div class="product-image">
            ${imageContent}
        </div>
        <div class="product-name">${currentProduct.name}</div>
        <div class="product-description">${currentProduct.description}</div>
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
    const product = products.find(p => p.id === productId);
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
    
    saveCartToStorage();
    updateCartBadge();
    renderProducts(); // Обновляем кнопки на главной странице
    closeModal();
}

// Открытие корзины
function openCart() {
    const modal = document.getElementById('cartModal');
    const itemsContainer = document.getElementById('cartItems');
    const checkoutBtn = modal.querySelector('.btn');
    
    // Сбрасываем состояние кнопки при открытии корзины
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = 'Оформить заказ';
    checkoutBtn.classList.remove('btn-loading');
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p>Корзина пуста</p>';
        document.getElementById('cartTotal').textContent = '';
    } else {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
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
    const product = products.find(p => p.id === productId);
    
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
    
    saveCartToStorage();
    updateCartBadge();
    renderProducts(); // Обновляем кнопки на главной странице
    openCart(); // Переоткрываем корзину для обновления
}

// Показать оформление заказа
function showCheckout() {
    if (isProcessingOrder) return;
    
    const checkoutBtn = document.querySelector('#cartModal .btn');
    
    // Блокируем кнопку и показываем загрузку
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add('btn-loading');
    checkoutBtn.innerHTML = '<span class="loading-spinner"></span>Обработка...';
    
    // Имитируем загрузку (в реальном приложении здесь может быть проверка данных)
    setTimeout(() => {
        closeCart();
        document.getElementById('checkoutModal').style.display = 'flex';
        
        // Восстанавливаем кнопку
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('btn-loading');
        checkoutBtn.innerHTML = 'Оформить заказ';
    }, 1000);
}

// Закрыть оформление заказа
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Отправка заказа
function sendOrder() {
    if (isProcessingOrder) return;
    
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const sendBtn = document.querySelector('#checkoutModal .btn');
    
    if (!name || !email || !phone || !address) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Блокируем кнопку отправки
    isProcessingOrder = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('btn-loading');
    sendBtn.innerHTML = '<span class="loading-spinner"></span>Отправка заявки...';
    
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
            cart = [];
            saveCartToStorage();
            updateCartBadge();
            renderProducts();
            closeCheckout();
            document.getElementById('checkoutModal').style.display = 'none';
            
            // Очищаем форму
            document.getElementById('customerName').value = '';
            document.getElementById('customerEmail').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('customerAddress').value = '';
        }, function(error) {
            showNotification('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.', 'error');
        })
        .finally(function() {
            // Разблокируем кнопку в любом случае
            isProcessingOrder = false;
            sendBtn.disabled = false;
            sendBtn.classList.remove('btn-loading');
            sendBtn.innerHTML = 'Отправить заявку';
        });
}

// Обновление бейджа корзины
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
}

// Сохранение корзины в localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Загрузка корзины из localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
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