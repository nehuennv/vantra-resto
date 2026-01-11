import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { clientConfig } from '../config/client';
import ProductFormModal from '../components/menu/ProductFormModal';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { Search, Plus, Edit2, Trash2, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuManagerPage() {
    const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, loading } = useMenu();
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, data);
        } else {
            addProduct(data);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-white dark:bg-zinc-950 overflow-hidden">

            {/* --- SIDEBAR DE CATEGORÍAS --- */}
            <aside className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 flex-shrink-0 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Categorías</h2>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            style={{
                                borderColor: activeCategory === 'all' ? clientConfig.themeColor : 'transparent',
                                backgroundColor: activeCategory === 'all' ? `${clientConfig.themeColor}10` : 'transparent',
                                color: activeCategory === 'all' ? clientConfig.themeColor : ''
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 font-medium ${activeCategory !== 'all' ? 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}`}
                        >
                            Ver Todo
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    borderColor: activeCategory === cat.id ? clientConfig.themeColor : 'transparent',
                                    backgroundColor: activeCategory === cat.id ? `${clientConfig.themeColor}10` : 'transparent',
                                    color: activeCategory === cat.id ? clientConfig.themeColor : ''
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 font-medium ${activeCategory !== cat.id ? 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Add Category (Optional simplified version) */}
                <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={() => {
                            const name = prompt('Nombre de la nueva categoría:');
                            if (name) addCategory(name);
                        }}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        <Plus size={16} /> Crear Categoría
                    </button>
                </div>
            </aside>

            {/* --- GRID PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Header */}
                <header className="px-8 py-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 sticky top-0 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h1 className="text-2xl font-light text-zinc-900 dark:text-white">Gestión de Menú</h1>
                        <p className="text-sm text-zinc-500">Administra tus platos y disponibilidad</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar plato..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:bg-white dark:focus:bg-black focus:border-zinc-300 dark:focus:border-zinc-700 rounded-xl transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-zinc-200 dark:shadow-none hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={18} /> Nuevo Plato
                        </button>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    {filteredProducts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                            <div className="p-6 rounded-full bg-zinc-50 dark:bg-zinc-900">
                                <UtensilsCrossed size={48} opacity={0.5} />
                            </div>
                            <p>No se encontraron productos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            <AnimatePresence>
                                {filteredProducts.map(product => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={product.id}
                                        className="group bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Image Area */}
                                        <div className="relative aspect-video overflow-hidden border-b border-zinc-100 dark:border-zinc-800">
                                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />

                                            {/* Quick Availability Switch */}
                                            <div className="absolute bottom-3 right-3 z-10" onClick={e => e.stopPropagation()}>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={product.available}
                                                        onChange={(e) => updateProduct(product.id, { available: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-9 h-5 bg-zinc-600/50 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                                </label>
                                            </div>

                                            {/* Actions Overlay */}
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-2.5 bg-white text-zinc-900 rounded-full hover:scale-110 transition-transform shadow-xl"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-2.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                                                    title="Borrar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-lg text-zinc-900 dark:text-zinc-100 leading-tight">{product.name}</h3>
                                                <span className="font-mono text-zinc-900 dark:text-white font-bold">${product.price.toLocaleString()}</span>
                                            </div>

                                            <p className="text-zinc-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                                                {product.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                                {product.ingredients?.slice(0, 3).map((ing, idx) => (
                                                    <span key={idx} className="text-[10px] uppercase tracking-wide px-2 py-1 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 rounded-md border border-zinc-100 dark:border-zinc-800">
                                                        {ing}
                                                    </span>
                                                ))}
                                                {product.ingredients?.length > 3 && (
                                                    <span className="text-[10px] px-2 py-1 text-zinc-400">+{product.ingredients.length - 3}</span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <ProductFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={editingProduct}
                    categories={categories}
                />

                {/* Loading State Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                    </div>
                )}

            </main>
        </div>
    );
}
