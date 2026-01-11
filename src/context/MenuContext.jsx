import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import menuService from '../services/menuService';

const MenuContext = createContext();

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};

export const MenuProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState(null);
    const [menuEvents, setMenuEvents] = useState([]); // Queue for realtime events

    // Refs for safe access in intervals/timeouts
    const productsRef = useRef(products);
    const isTabActiveRef = useRef(true);

    // Keep ref in sync
    useEffect(() => {
        productsRef.current = products;
    }, [products]);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { products: fetchedProducts, categories: fetchedCategories } = await menuService.getAll();
                setProducts(fetchedProducts);
                setCategories(fetchedCategories);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Polling Logic
    useEffect(() => {
        let intervalId;

        const refreshData = async () => {
            // Smart Polling: Skip if tab is hidden
            if (!isTabActiveRef.current) return;

            console.log('🔄 Polling: Verificando cambios...', new Date().toLocaleTimeString());

            try {
                setIsSyncing(true);
                const { products: fetchedProducts, categories: fetchedCategories } = await menuService.getAll();

                // Diffing Logic
                const currentProducts = productsRef.current;
                const newEvents = [];

                fetchedProducts.forEach(newP => {
                    const oldP = currentProducts.find(p => p.id === newP.id);
                    if (oldP) {
                        // Detect Price Change
                        if (oldP.price !== newP.price) {
                            newEvents.push({ type: 'PRICE_UPDATE', product: newP });
                        }
                        // Detect Stock Out (Available -> Unavailable)
                        if (oldP.available && !newP.available) {
                            newEvents.push({ type: 'STOCK_OUT', product: newP });
                        }
                    }
                });

                if (newEvents.length > 0) {
                    setMenuEvents(prev => [...prev, ...newEvents]);
                }

                // Force Update: Always set state to ensure UI reacts to new reference
                setProducts(fetchedProducts);
                setCategories(fetchedCategories);

            } catch (err) {
                console.error("Polling error", err);
            } finally {
                setIsSyncing(false);
            }
        };


        const handleVisibilityChange = () => {
            isTabActiveRef.current = document.visibilityState === 'visible';
            if (isTabActiveRef.current) {
                // Restart immediately on focus
                refreshData();
                // Re-setup interval
                clearInterval(intervalId);
                intervalId = setInterval(refreshData, 5000);
            } else {
                // Pause polling
                clearInterval(intervalId);
            }
        };

        // Initialize
        document.addEventListener('visibilitychange', handleVisibilityChange);
        intervalId = setInterval(refreshData, 5000);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []); // Empty dependency array = runs once on mount, but closure uses refs

    // Helper to clear events after consumption
    const clearMenuEvents = () => setMenuEvents([]);

    const addProduct = async (data) => {
        const newProduct = await menuService.createProduct(data);
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    };

    const updateProduct = async (id, data) => {
        const updatedProduct = await menuService.updateProduct(id, data);
        setProducts(prev => prev.map(prod => prod.id === id ? updatedProduct : prod));
        return updatedProduct;
    };

    const deleteProduct = async (id) => {
        await menuService.deleteProduct(id);
        setProducts(prev => prev.filter(prod => prod.id !== id));
    };

    const addCategory = async (name) => {
        const newCategory = await menuService.createCategory(name);
        setCategories(prev => [...prev, newCategory]);
    };

    const getProductsByCategory = (catId) => {
        return products.filter(product => product.categoryId === catId);
    };

    return (
        <MenuContext.Provider value={{
            products,
            categories,
            loading,
            isSyncing,
            error,
            menuEvents,
            clearMenuEvents,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            getProductsByCategory
        }}>
            {children}
        </MenuContext.Provider>
    );
};
