const STORAGE_KEYS = {
    PRODUCTS: 'vantra_menu_products_v3',
    CATEGORIES: 'vantra_menu_categories_v3',
};

// --- COMPLETE ARGENTINE CATALOG ---
const INITIAL_CATEGORIES = [
    { id: 'cat_entradas', name: 'Entradas', slug: 'entradas' },
    { id: 'cat_minutas', name: 'Minutas', slug: 'minutas' },
    { id: 'cat_parrilla', name: 'Parrilla', slug: 'parrilla' },
    { id: 'cat_hamburguesas', name: 'Hamburguesas', slug: 'hamburguesas' },
    { id: 'cat_pizzas', name: 'Pizzas', slug: 'pizzas' },
    { id: 'cat_pastas', name: 'Pastas Caseras', slug: 'pastas' },
    { id: 'cat_ensaladas', name: 'Ensaladas', slug: 'ensaladas' },
    { id: 'cat_bebidas_sin_alcohol', name: 'Bebidas s/ Alcohol', slug: 'bebidas-sin' },
    { id: 'cat_cervezas', name: 'Cervezas', slug: 'cervezas' },
    { id: 'cat_vinos', name: 'Vinos', slug: 'vinos' },
    { id: 'cat_postres', name: 'Postres', slug: 'postres' },
];

const INITIAL_PRODUCTS = [
    // --- ENTRADAS ---
    {
        id: 'prod_empanada_carne',
        categoryId: 'cat_entradas',
        name: 'Empanada de Carne Cortada a Cuchillo',
        description: 'Clásica empanada tucumana, suave y jugosa. Carne cortada a cuchillo, huevo y cebolla de verdeo.',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1619864227038-d9d132d43a6d?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Carne', 'Huevo', 'Verdeo', 'Masa Casera'],
        available: true
    },
    {
        id: 'prod_provoleta',
        categoryId: 'cat_entradas',
        name: 'Provoleta Asada',
        description: 'Queso provolone hilado fundido a la parrilla, con orégano y un toque de aceite de oliva.',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1549589233-ca571a94a64e?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Provolone', 'Orégano', 'Oliva', 'Tomate seco'],
        available: true
    },
    {
        id: 'prod_rabas',
        categoryId: 'cat_entradas',
        name: 'Rabas a la Romana',
        description: 'Anillos de calamar tiernos, rebozados y fritos. Acompañados con limón y salsa tártara.',
        price: 13500,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Calamar', 'Limón', 'Salsa Tártara'],
        available: true
    },
    {
        id: 'prod_papeletas',
        categoryId: 'cat_entradas',
        name: 'Papas Fritas Provenzal',
        description: 'Papas bastón crujientes bañadas en abundante ajo y perejil fresco picado.',
        price: 6200,
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Papas', 'Ajo', 'Perejil'],
        available: true
    },

    // --- MINUTAS ---
    {
        id: 'prod_mila_napolitana',
        categoryId: 'cat_minutas',
        name: 'Milanesa a la Napolitana',
        description: 'Milanesa de ternera con salsa de tomate, jamón cocido y abundante muzzarella gratinada.',
        price: 14500,
        image: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Ternera', 'Salsa', 'Jamón', 'Muzzarella', 'Orégano'],
        available: true
    },
    {
        id: 'prod_suprema',
        categoryId: 'cat_minutas',
        name: 'Suprema de Pollo Suiza',
        description: 'Suprema de pollo con salsa blanca y queso parmesano gratinado. Sale con puré.',
        price: 13800,
        image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Pollo', 'Salsa Blanca', 'Queso', 'Puré'],
        available: true
    },
    {
        id: 'prod_milanesa_caballo',
        categoryId: 'cat_minutas',
        name: 'Milanesa a Caballo',
        description: 'La clásica milanesa de carne acompañada con dos huevos fritos a punto y papas fritas.',
        price: 12500,
        image: 'https://images.unsplash.com/photo-1606850860555-46aa31518b5b?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Milanesa', 'Huevos Fritos', 'Papas Fritas'],
        available: true
    },

    // --- PARRILLA ---
    {
        id: 'prod_asado',
        categoryId: 'cat_parrilla',
        name: 'Asado de Tira (500g)',
        description: 'Costillas de ternera seleccionada, asadas a fuego lento. El clásico argentino.',
        price: 16500,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Asado', 'Sal Parrillera'],
        available: true
    },
    {
        id: 'prod_vacio',
        categoryId: 'cat_parrilla',
        name: 'Vacío al Asador (Porción)',
        description: 'Tierno y jugoso, cocinado lentamente con cuero crocante.',
        price: 17200,
        image: 'https://images.unsplash.com/photo-1544025162-d7669d26be72?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Vacío', 'Chimichurri'],
        available: true
    },
    {
        id: 'prod_chorizo',
        categoryId: 'cat_parrilla',
        name: 'Chorizo Bombón',
        description: 'Chorizo puro cerdo, ideal para empezar el asado. Precio por unidad.',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1594593457597-9cc1d50c7650?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Cerdo', 'Especias'],
        available: true
    },
    {
        id: 'prod_mollejas',
        categoryId: 'cat_parrilla',
        name: 'Mollejas al Limón',
        description: 'Mollejas de corazón crocantes por fuera y tiernas por dentro, con mucho limón.',
        price: 18500,
        image: 'https://images.unsplash.com/photo-1587323608248-0d1981fb5a8e?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Mollejas', 'Limón'],
        available: true
    },

    // --- HAMBURGUESAS ---
    {
        id: 'prod_burger_doble',
        categoryId: 'cat_hamburguesas',
        name: 'Doble Cheeseburger Royal',
        description: 'Doble medallón de 120g de roast beef, doble cheddar, cebolla picada y salsa mil islas.',
        price: 11500,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Roast Beef', 'Cheddar', 'Pan de Papa', 'Salsa Mil Islas'],
        available: true
    },
    {
        id: 'prod_burger_americana',
        categoryId: 'cat_hamburguesas',
        name: 'Americana Bacon',
        description: 'Medallón simple, cheddar, bacon crocante, huevo frito y barbacoa.',
        price: 12200,
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Carne', 'Bacon', 'Cheddar', 'Huevo', 'Barbacoa'],
        available: true
    },
    {
        id: 'prod_burger_veggie',
        categoryId: 'cat_hamburguesas',
        name: 'Veggie Not-Burger',
        description: 'Medallón a base de plantas, lechuga, tomate, palta y mayonesa vegana.',
        price: 11800,
        image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Medallón Plant Based', 'Lechuga', 'Tomate', 'Palta'],
        available: true
    },

    // --- PIZZAS ---
    {
        id: 'prod_pizza_muzza',
        categoryId: 'cat_pizzas',
        name: 'Muzzarella Clásica',
        description: 'Salsa de tomate casera, abundante muzzarella, orégano y aceitunas verdes. (8 porciones).',
        price: 10500,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Muzzarella', 'Salsa Tomate', 'Aceitunas', 'Orégano'],
        available: true
    },
    {
        id: 'prod_pizza_fugazzeta',
        categoryId: 'cat_pizzas',
        name: 'Fugazzeta Rellena',
        description: 'Rellena de cuartirolo y jamón, con mucha cebolla dorada y parmesano por encima.',
        price: 14800,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Cebolla', 'Queso Cuartirolo', 'Jamón', 'Parmesano'],
        available: true
    },
    {
        id: 'prod_pizza_rucula',
        categoryId: 'cat_pizzas',
        name: 'Rúcula y Jamón Crudo',
        description: 'Base de muzzarella, rúcula fresca, jamón crudo estacionado y lluvias de parmesano.',
        price: 15500,
        image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Rúcula', 'Jamón Crudo', 'Muzzarella', 'Parmesano'],
        available: true
    },

    // --- PASTAS ---
    {
        id: 'prod_sorrentinos',
        categoryId: 'cat_pastas',
        name: 'Sorrentinos de Jamón y Queso',
        description: 'Caseros y abundantes. Salsa sugerida: Crema, Mixta o Bolognesa.',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Ricota', 'Jamón', 'Masa al Huevo'],
        available: true
    },
    {
        id: 'prod_noquis',
        categoryId: 'cat_pastas',
        name: 'Ñoquis de Papa Caseros',
        description: 'Los del 29, todos los días. Acompañados de estofado de carne.',
        price: 11000,
        image: 'https://images.unsplash.com/photo-1621262274438-e6d30f3c5aa6?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Papa', 'Harina', 'Estofado'],
        available: true
    },
    {
        id: 'prod_lasagna',
        categoryId: 'cat_pastas',
        name: 'Lasagna Bolognesa',
        description: 'Capas de carne, verdura y ricota, gratinada con parmesano.',
        price: 14000,
        image: 'https://images.unsplash.com/photo-1574868468170-491a1347d4e5?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Carne', 'Espinaca', 'Ricota', 'Salsa Blanca'],
        available: true
    },

    // --- ENSALADAS ---
    {
        id: 'prod_caesar',
        categoryId: 'cat_ensaladas',
        name: 'Caesar con Pollo',
        description: 'Lechuga, pollo grillé, croutons, parmesano y el aderezo caesar original.',
        price: 9800,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Lechuga', 'Pollo', 'Parmesano', 'Croutons', 'Aderezo'],
        available: true
    },
    {
        id: 'prod_mixta',
        categoryId: 'cat_ensaladas',
        name: 'Ensalada Mixta',
        description: 'Lechuga, tomate y cebolla.',
        price: 5500,
        image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Lechuga', 'Tomate', 'Cebolla'],
        available: true
    },

    // --- POSTRES ---
    {
        id: 'prod_flan',
        categoryId: 'cat_postres',
        name: 'Flan Casero Mixto',
        description: 'Flan de huevos con dulce de leche y crema chantilly.',
        price: 5800,
        image: 'https://images.unsplash.com/photo-1624508933355-6320a7018cb1?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Huevo', 'Leche', 'Dulce de Leche', 'Crema'],
        available: true
    },
    {
        id: 'prod_chocotorta',
        categoryId: 'cat_postres',
        name: 'Chocotorta',
        description: 'La torta argentina por excelencia. Galletitas de chocolate, dulce de leche y crema.',
        price: 6500,
        image: 'https://images.unsplash.com/photo-1546944622-48cd5f726710?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Chocolinas', 'Dulce de Leche', 'Queso Crema'],
        available: true
    },
    {
        id: 'prod_helado',
        categoryId: 'cat_postres',
        name: 'Almendrado',
        description: 'Porción de almendrado con charlotte de chocolate caliente.',
        price: 5200,
        image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Helado', 'Almendras', 'Chocolate'],
        available: true
    },

    // --- BEBIDAS ---
    {
        id: 'prod_coca',
        categoryId: 'cat_bebidas_sin_alcohol',
        name: 'Coca-Cola 500ml',
        description: 'Sabor Original.',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop',
        ingredients: [],
        available: true
    },
    {
        id: 'prod_agua',
        categoryId: 'cat_bebidas_sin_alcohol',
        name: 'Agua Mineral 500ml',
        description: 'Con o sin gas.',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1564414277-27b2c5890e03?q=80&w=1000&auto=format&fit=crop',
        ingredients: [],
        available: true
    },
    {
        id: 'prod_cerveza_andes',
        categoryId: 'cat_cervezas',
        name: 'Andes Rubia 1L',
        description: 'Cerveza mendocina rubia. Botella de litro.',
        price: 5800,
        image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Cebada', 'Lúpulo'],
        available: true
    },
    {
        id: 'prod_vino_malbec',
        categoryId: 'cat_vinos',
        name: 'Malbec Reserva',
        description: 'Vino tinto Malbec de Mendoza, cuerpo medio y notas frutales.',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Uva Malbec'],
        available: true
    }
];

// Helper for simulated delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const menuService = {
    getAll: async () => {
        await delay(600);
        try {
            // Force read from storage every time to bypass any closure outdated data
            const prodData = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
            const catData = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

            let products = prodData ? JSON.parse(prodData) : null;
            let categories = catData ? JSON.parse(catData) : null;

            // Initialize if empty (or updated version)
            if (!products || !categories) {
                products = INITIAL_PRODUCTS;
                categories = INITIAL_CATEGORIES;
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
                localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
            }

            return { products, categories };
        } catch (error) {
            console.error("Service Error:", error);
            throw new Error("Failed to fetch menu data");
        }
    },

    createProduct: async (productData) => {
        await delay(600);
        const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        const products = stored ? JSON.parse(stored) : [];

        const newProduct = {
            id: productData.id || `prod_${Date.now()}`,
            ...productData,
            ingredients: Array.isArray(productData.ingredients) ? productData.ingredients : [],
        };

        products.push(newProduct);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return newProduct;
    },

    updateProduct: async (id, data) => {
        await delay(600);
        const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        let products = stored ? JSON.parse(stored) : [];

        const index = products.findIndex(p => p.id === id);
        if (index === -1) throw new Error("Product not found");

        // Patch logic: merge existing with new data
        products[index] = { ...products[index], ...data };

        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return products[index];
    },

    deleteProduct: async (id) => {
        await delay(600);
        const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        let products = stored ? JSON.parse(stored) : [];

        products = products.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return true;
    },

    createCategory: async (name) => {
        await delay(600);
        const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        const categories = stored ? JSON.parse(stored) : [];

        const newCategory = {
            id: `cat_${Date.now()}`,
            name,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        };

        categories.push(newCategory);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        return newCategory;
    }
};

export default menuService;
