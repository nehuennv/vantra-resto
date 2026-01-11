const STORAGE_KEYS = {
    PRODUCTS: 'vantra_menu_products',
    CATEGORIES: 'vantra_menu_categories',
};

// Mock Data for initialization
const INITIAL_CATEGORIES = [
    { id: 'cat_signature', name: 'Signature Burgers', slug: 'signature-burgers' },
    { id: 'cat_cocktails', name: 'Cocktails de Autor', slug: 'cocktails' },
];

const INITIAL_PRODUCTS = [
    {
        id: 'prod_royal',
        categoryId: 'cat_signature',
        name: 'Royal Truffle Burger',
        description: 'Blend de Wagyu, emulsión de trufa negra, queso brie fundido y rúcula selvática en pan brioche artesanal.',
        price: 14500,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Carne Wagyu', 'Pan Brioche', 'Queso Brie', 'Trufa Negra', 'Rúcula'],
        available: true
    },
    {
        id: 'prod_negroni',
        categoryId: 'cat_cocktails',
        name: 'Smoked Negroni',
        description: 'Gin macerado en especias, Campari, Vermouth Rosso y humo de roble americano.',
        price: 6800,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1000&auto=format&fit=crop',
        ingredients: ['Gin', 'Campari', 'Vermouth Rosso', 'Naranja'],
        available: true
    }
];

// Helper for simulated delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const menuService = {
    getAll: async () => {
        await delay(600);
        try {
            console.log('📡 Service: Fetching fresh data from Storage...');
            // Force read from storage every time to bypass any closure outdated data
            const prodData = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
            const catData = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

            let products = prodData ? JSON.parse(prodData) : null;
            let categories = catData ? JSON.parse(catData) : null;

            // Initialize if empty
            if (!products || !categories) {
                products = products || INITIAL_PRODUCTS;
                categories = categories || INITIAL_CATEGORIES;
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
