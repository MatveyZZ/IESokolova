// Модуль товаров
const Products = {
    data: [
        {
            id: 1,
            name: "Пельмени Сибирские",
            description: "Сибирские пельмени ручной работы, 1кг.",
            price: 450,
            image: "./assets/images/products/pelmeni.jpg",
            category: "пельмени",
            tags: ["ручная работа", "сибирские", "премиум"]
        },
        {
            id: 2,
            name: "Котлеты 'Киевские'",
            description: "Нежнейшие котлеты из куриной грудки, 800г",
            price: 380,
            image: "./assets/images/products/kievskie.jpg",
            category: "котлеты",
            tags: ["куриные", "нежные", "классические"]
        },
        {
            id: 3,
            name: "Зразы с сыром",
            description: "Куриные котлеты с сыром, 800г",
            price: 420,
            image: "./assets/images/products/zrazy.jpg",
            category: "зразы",
            tags: ["с сыром", "куриные", "сытные"]
        },
        {
            id: 4,
            name: "Котлеты 'Домашние'",
            description: "Котлеты из свинины, 600г",
            price: 300,
            image: "./assets/images/products/domashnie.jpg",
            category: "котлеты",
            tags: ["свиные", "домашние", "традиционные"]
        }
    ],

    // Получение товара по ID
    getById(id) {
        return this.data.find(product => product.id === id);
    },

    // Фильтрация товаров
    filterProducts(search = '', filter = 'all', favorites = new Set(), showOnlyFavorites = false) {
        return this.data.filter(product => {
            const matchesSearch = !search || 
                product.name.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search) ||
                product.tags.some(tag => tag.toLowerCase().includes(search));
            
            const matchesFilter = filter === 'all' || product.category === filter;
            const matchesFavorites = !showOnlyFavorites || favorites.has(product.id);
            
            return matchesSearch && matchesFilter && matchesFavorites;
        });
    }
};