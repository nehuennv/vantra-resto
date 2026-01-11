import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { clientConfig } from '../config/client';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import MenuProductModal from '../components/menu/MenuProductModal';
import { Info, Utensils, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicMenuPage() {
    const { products, categories, getProductsByCategory, loading, isSyncing, menuEvents, clearMenuEvents } = useMenu();
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [highlightedPrices, setHighlightedPrices] = useState({});
    const [stockToasts, setStockToasts] = useState([]);

    const filteredProducts = activeCategory === 'all'
        ? products
        : getProductsByCategory(activeCategory);

    // Event Handling (Effects)
    useEffect(() => {
        if (menuEvents.length > 0) {
            menuEvents.forEach(event => {
                if (event.type === 'PRICE_UPDATE') {
                    // Trigger highlighting
                    setHighlightedPrices(prev => ({ ...prev, [event.product.id]: true }));
                    // Clear highlight after animation
                    setTimeout(() => {
                        setHighlightedPrices(prev => {
                            const newState = { ...prev };
                            delete newState[event.product.id];
                            return newState;
                        });
                    }, 2000);
                }
                if (event.type === 'STOCK_OUT') {
                    // Trigger Toast
                    const id = Date.now() + Math.random();
                    setStockToasts(prev => [...prev, { id, message: `El plato "${event.product.name}" ya no está disponible.` }]);
                    // Auto dismiss
                    setTimeout(() => {
                        setStockToasts(prev => prev.filter(t => t.id !== id));
                    }, 5000);
                }
            });
            clearMenuEvents();
        }
    }, [menuEvents, clearMenuEvents]);


    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans pb-24 relative overflow-x-hidden selection:bg-black selection:text-white">

            {/* --- Sticky Header --- */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden relative"
                        style={{ backgroundColor: clientConfig.themeColor }}
                    >
                        {clientConfig.shortName.substring(0, 2).toUpperCase()}
                        {isSyncing && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-zinc-800 dark:text-zinc-100 leading-none">{clientConfig.name}</h1>
                        <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">Digital Menu</p>
                    </div>
                </div>

                {/* Clean Header - No Cart */}
            </header>

            {/* --- Category Pills --- */}
            <div className="sticky top-[72px] z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-[2px] border-b border-zinc-50 dark:border-zinc-900 px-5 py-3 overflow-x-auto no-scrollbar flex gap-2 w-full">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm border ${activeCategory === 'all'
                        ? 'text-white border-transparent'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                        }`}
                    style={activeCategory === 'all' ? { backgroundColor: clientConfig.themeColor } : {}}
                >
                    Todos
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm border ${activeCategory === cat.id
                            ? 'text-white border-transparent'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                            }`}
                        style={activeCategory === cat.id ? { backgroundColor: clientConfig.themeColor } : {}}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* --- Product List --- */}
            <main className="px-5 py-6 space-y-8">
                {activeCategory === 'all' && (
                    <div className="mb-8 mt-2">
                        <h2 className="text-2xl font-light text-zinc-400 mb-1">Bienvenido a</h2>
                        <p className="text-3xl font-bold text-zinc-900 dark:text-white leading-none">La Experiencia.</p>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-28 h-28 rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800" />
                                <div className="flex-1 space-y-3 py-2">
                                    <div className="h-5 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
                                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
                                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => {
                            const isMetricChanged = highlightedPrices[product.id];

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`group flex gap-5 items-stretch cursor-pointer active:scale-98 transition-transform ${!product.available ? 'opacity-50 grayscale' : ''}`}
                                >
                                    {/* Image - Larger & Cleaner */}
                                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[1.5rem] overflow-hidden flex-shrink-0 relative shadow-md bg-zinc-100 dark:bg-zinc-800">
                                        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full" />
                                        {!product.available && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                                <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest backdrop-blur-md">Agotado</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content - Showroom Style */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white leading-tight mb-1.5">{product.name}</h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 font-light">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            {product.available ? (
                                                <motion.span
                                                    animate={isMetricChanged ? {
                                                        color: clientConfig.themeColor,
                                                        scale: 1.1,
                                                        fontWeight: 800
                                                    } : {
                                                        color: "inherit",
                                                        scale: 1,
                                                        fontWeight: 700
                                                    }}
                                                    className="font-mono text-lg text-zinc-900 dark:text-white"
                                                >
                                                    ${product.price.toLocaleString()}
                                                </motion.span>
                                            ) : (
                                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">No Disponible</span>
                                            )}

                                            {/* Details Arrow instead of Add Button */}
                                            {product.available && (
                                                <span className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                                    <Info size={16} strokeWidth={2.5} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center text-zinc-400 flex flex-col items-center gap-4">
                                <Utensils size={40} strokeWidth={1} opacity={0.5} />
                                <p>No hay productos en esta categoría.</p>
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </main>

            {/* --- Info/Promo Floating --- */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                <button className="bg-black/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black px-8 py-3.5 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold tracking-wide hover:scale-105 active:scale-95 transition-all">
                    <AlertCircle size={18} /> INFO DEL LOCAL
                </button>
            </div>

            {/* --- Detail Modal --- */}
            <MenuProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            {/* --- Toast Notifications --- */}
            <div className="fixed top-24 right-5 z-[80] space-y-2 pointer-events-none">
                <AnimatePresence>
                    {stockToasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white dark:bg-zinc-900 border-l-4 border-red-500 shadow-2xl p-4 rounded-lg flex items-start gap-3 w-72 backdrop-blur-md pointer-events-auto"
                        >
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                                {toast.message}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

        </div>
    );
}
