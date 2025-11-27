// Модуль товаров
const Products = {
    data: [
        {
            id: 1,
            name: "Пельмени Сибирские", /////////////////////////
            description: "Свинина, Говядина, 1кг.",
            price: 350, /////////////////////////////////////
            image: "./assets/images/products/sibirskie.jpg", ////////////////
            category: "пельмени", ///////////////////////////////////
            tags: ["ручная работа", "сибирские", "премиум"]
        },
        {
            id: 2,
            name: "Пельмени Русские", //
            description: "Свинина, 0.4кг.",
            price: 110, //
            image: "./assets/images/products/russkie.jpg", //////////////////
            category: "пельмени", //
            tags: ["итальянская линия", "русские", "премиум"]
        },
        {
            id: 3,
            name: "Пельмени Даниловские", //
            description: "Свинина, 0.4кг.",
            price: 100,
            image: "./assets/images/products/danil.jpg", ///////////////////////
            category: "пельмени",
            tags: ["итальянская линия", "даниловские", "премиум"]
        },
        {
            id: 4,
            name: "Пельмени Крестьянские",
            description: "Свинина, 0.5кг.",
            price: 85,
            image: "./assets/images/products/krest.jpg", ///////////////////
            category: "пельмени",
            tags: ["итальянская линия", "крестьянские", "премиум"]
        },
        {
            id: 5,
            name: "Пельмени Столичные",
            description: "Свинина, 0.5кг.",
            price: 150,
            image: "./assets/images/products/stol.jpg", ////////////////////
            category: "пельмени",
            tags: ["ручная работа", "столичные", "премиум"]
        },
        {
            id: 6,
            name: "Котлеты 'Киевские'",
            description: "Курица, 0.8кг",
            price: 280,
            image: "./assets/images/products/kievskie.jpg", //////////////////
            category: "котлеты",
            tags: ["куриные", "нежные", "классические"]
        },
        {
            id: 7,
            name: "Зразы с сыром",
            description: "Курица, 0.8кг",
            price: 320,
            image: "./assets/images/products/zrazy.jpg", ///////////////////////
            category: "котлеты",
            tags: ["с сыром", "куриные", "сытные"]
        },
        {
            id: 8,
            name: "Котлеты 'Домашние'",
            description: "Свинина, 0.6кг",
            price: 200,
            image: "./assets/images/products/domashnie.jpg", //////////////////
            category: "котлеты",
            tags: ["свиные", "домашние", "традиционные"]
        },
        {
            id: 9,
            name: "Ромштекс",
            description: "Свинина, 0.6кг",
            price: 175,
            image: "./assets/images/products/romsh.jpg",
            category: "котлеты",
            tags: ["свиные", "ромштекс", "традиционные"]
        },
        {
            id: 10,
            name: "Котлеты Московские",
            description: "Свинина, 0.6кг",
            price: 160,
            image: "./assets/images/products/moskva.jpg",
            category: "котлеты",
            tags: ["свиные", "московские", "традиционные"]
        },
        {
            id: 11,
            name: "Наггетсы",
            description: "Курица, 0.8кг",
            price: 280,
            image: "./assets/images/products/naggets.jpg",
            category: "наггетсы",
            tags: ["куриные", "домашние", "традиционные"]
        },
        {
            id: 12,
            name: "Люля-Кебаб",
            description: "Говядина, 0.8кг",
            price: 280,
            image: "./assets/images/products/lula.jpg",
            category: "котлеты",
            tags: ["говяжьи", "домашние", "традиционные"]
        },
        {
            id: 13,
            name: "Шницель",
            description: "Свинина, 0.6кг",
            price: 200,
            image: "./assets/images/products/shnisel.jpg",
            category: "котлеты",
            tags: ["свиные", "шницель", "традиционные"]
        },
        {
            id: 14,
            name: "Фрикадельки",
            description: "Говядина, 0.5кг",
            price: 180,
            image: "./assets/images/products/frik.jpg",
            category: "тефтели",
            tags: ["говяжьи", "для супа", "традиционные"]
        },
        {
            id: 15,
            name: "Ёжики",
            description: "Свинина, 0.5кг",
            price: 180,
            image: "./assets/images/products/ezhik.jpg",
            category: "тефтели",
            tags: ["свиные", "сытные", "традиционные"]
        },
        {
            id: 16,
            name: "Котлеты Аппетитные",
            description: "Свинина, 0.8кг",
            price: 175,
            image: "./assets/images/products/appetit.jpg",
            category: "котлеты",
            tags: ["свиные", "аппетитные", "традиционные"]
        },
        {
            id: 17,
            name: "Котлеты Деревенские",
            description: "Курица, 0.6кг",
            price: 130,
            image: "./assets/images/products/derev.jpg",
            category: "котлеты",
            tags: ["курица", "сочные", "традиционные"]
        },
        {
            id: 18,
            name: "Котлеты Нежные",
            description: "Курица, 0.6кг",
            price: 150,
            image: "./assets/images/products/nezhnue.jpg",
            category: "котлеты",
            tags: ["курица", "сочные", "традиционные"]
        },
        {
            id: 19,
            name: "Тефтели Ароматные",
            description: "Свинина, 0.5кг",
            price: 180,
            image: "./assets/images/products/teftel.jpg",
            category: "тефтели",
            tags: ["свиные", "домашние", "традиционные"]
        },
        {
            id: 20,
            name: "Колбаски Аппетитки",
            description: "Свинина, 0.8кг",
            price: 420,
            image: "./assets/images/products/kolbas.jpg",
            category: "колбаски",
            tags: ["свиные", "аппетитные", "традиционные"]
        },
        {
            id: 21,
            name: "Купаты Восточные",
            description: "Курица, 0.8кг",
            price: 420,
            image: "./assets/images/products/vostok.jpg",
            category: "колбаски",
            tags: ["куриные", "высший сорт", "традиционные"]
        },
        {
            id: 22,
            name: "Биточки Особые",
            description: "Курица, 0.5кг",
            price: 180,
            image: "./assets/images/products/bit.jpg",
            category: "котлеты",
            tags: ["куриные", "особые", "традиционные"]
        },
        {
            id: 23,
            name: "Бифштекс",
            description: "Говядина, 0.6кг",
            price: 225,
            image: "./assets/images/products/bif.jpg",
            category: "котлеты",
            tags: ["говяжьи", "рубленый", "традиционные"]
        },
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