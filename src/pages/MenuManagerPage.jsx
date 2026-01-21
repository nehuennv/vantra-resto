import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { clientConfig } from '../config/client';
import ProductFormModal from '../components/menu/ProductFormModal';
import CategoryFormModal from '../components/menu/CategoryFormModal';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { Search, Plus, Edit2, Trash2, UtensilsCrossed, Eye, EyeOff, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import ConfirmationModal from '../components/ui/ConfirmationModal';

export default function MenuManagerPage() {
    const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, loading } = useMenu();

    // Obtenemos setHeaderAction del contexto del layout
    const { setHeaderAction } = useOutletContext();

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Effect para registrar la acción en el Header del Layout
    useEffect(() => {
        setHeaderAction({
            label: "Nuevo Plato",
            onClick: () => {
                // Si hay una categoría activa (y no es 'all'), pre-cargamos esa id
                const prefillData = activeCategory !== 'all' ? { categoryId: activeCategory } : null;
                setEditingProduct(prefillData);
                setIsProductModalOpen(true);
            }
        });

        // Cleanup: restaurar el estado original (Nueva Reserva)
        return () => setHeaderAction(null);
    }, [setHeaderAction]);



    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    // --- Delete Confirmation Logic ---
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, productId: null });

    const handleDeleteClick = (id) => {
        setConfirmModal({ isOpen: true, productId: id });
    };

    const handleConfirmDelete = () => {
        if (confirmModal.productId) {
            deleteProduct(confirmModal.productId);
            setConfirmModal({ isOpen: false, productId: null });
        }
    };

    const handleModalSubmit = (data) => {
        // Chequeamos si tiene ID real para saber si es edición
        if (editingProduct && editingProduct.id) {
            updateProduct(editingProduct.id, data);
        } else {
            addProduct(data);
        }
    };

    // Calculate filtered products
    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Caluculate counts for categories
    const getCategoryCount = (catId) => products.filter(p => p.categoryId === catId).length;

    return (
        <div className="h-full flex flex-col lg:flex-row gap-4 relative p-4 overflow-hidden w-full">



            {/* --- MAIN CONTENT: HEADER & PRODUCTS --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-card/40 backdrop-blur-md border border-border/60 md:rounded-3xl shadow-sm relative overflow-hidden">

                {/* Sticky Header with Search */}
                <header className="shrink-0 p-4 md:p-6 border-b border-border/40 flex flex-col sm:flex-row gap-4 items-center justify-between z-10 bg-background/20 backdrop-blur-sm">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            {activeCategory === 'all'
                                ? 'Carta Completa'
                                : categories.find(c => c.id === activeCategory)?.name || 'Categoría'}
                            {/* Badge contador */}
                            <span className="px-2.5 py-0.5 rounded-full bg-muted border border-border text-xs font-mono text-muted-foreground">
                                {filteredProducts.length}
                            </span>
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-72 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                            <Search size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar plato..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 rounded-xl pl-10 pr-10 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </header>

                {/* Products Grid */}
                <div className="flex-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background/10 to-transparent z-10 pointer-events-none" />

                    <ScrollArea className="h-full">
                        <div className="p-4 md:p-6 mb-20">
                            {filteredProducts.length === 0 ? (
                                <EmptyState onAction={() => {
                                    const prefillData = activeCategory !== 'all' ? { categoryId: activeCategory } : null;
                                    setEditingProduct(prefillData);
                                    setIsProductModalOpen(true);
                                }} />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                                    <AnimatePresence mode='popLayout'>
                                        {filteredProducts.map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onEdit={handleOpenEdit}
                                                onDelete={handleDeleteClick}
                                                onToggle={updateProduct}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </main>

            {/* --- RIGHT SIDEBAR: CATEGORIES --- */}
            <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4 h-full bg-background/40 backdrop-blur-xl backdrop-saturate-150 border border-border/60 rounded-3xl p-4 sm:p-5 shadow-sm overflow-hidden">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                            Categorías
                        </h2>
                        <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                            {categories.length} activas
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="h-7 w-7 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                        title="Nueva Categoría"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Categories List */}
                <ScrollArea className="flex-1 -mr-2 pr-2">
                    <div className="flex flex-col gap-1.5 pt-2">
                        <CategoryItem
                            label="Todos"
                            count={products.length}
                            isActive={activeCategory === 'all'}
                            onClick={() => setActiveCategory('all')}
                        />
                        <div className="my-2 h-px bg-border/40 mx-2" />
                        {categories.map(cat => (
                            <CategoryItem
                                key={cat.id}
                                label={cat.name}
                                count={getCategoryCount(cat.id)}
                                isActive={activeCategory === cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* --- MODALS --- */}
            <ProductFormModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingProduct}
                categories={categories}
            />

            <CategoryFormModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSubmit={addCategory}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                check={handleConfirmDelete}
                title="¿Eliminar Plato?"
                message="Esta acción no se puede deshacer. El producto será eliminado permanentemente del menú."
            />

            {loading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function CategoryItem({ label, count, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative flex items-center justify-between border
                ${isActive
                    ? 'bg-primary text-primary-foreground border-primary/20 shadow-md shadow-primary/20'
                    : 'bg-transparent text-muted-foreground border-transparent hover:bg-muted/60 hover:text-foreground'
                }
            `}
        >
            <span className="truncate mr-2 relative z-10">{label}</span>
            <span className={`
                text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors
                ${isActive
                    ? 'bg-white/20 text-white border-white/20'
                    : 'bg-muted border-border text-muted-foreground group-hover:border-border/80'}
            `}>
                {count}
            </span>
        </button>
    );
}

function ProductCard({ product, onEdit, onDelete, onToggle }) {
    const isAvailable = product.available;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: isAvailable ? 1 : 0.6, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)", transition: { duration: 0.2 } }}
            whileHover={{ y: -5 }}
            transition={{
                layout: { type: "spring", stiffness: 300, damping: 28 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
                filter: { duration: 0.2 }
            }}
            className={`
                group relative flex flex-col bg-card rounded-2xl border border-border/60 shadow-sm 
                hover:shadow-xl hover:border-primary/20 transition-colors duration-300 overflow-hidden
            `}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isAvailable ? 'grayscale opacity-70' : ''}`}
                />

                {/* Discount Badge */}
                {product.discountPrice && (
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/10 shadow-sm bg-purple-500/90 text-white flex items-center gap-1.5 z-10">
                        <Tag size={12} />
                        OFERTA
                    </div>
                )}

                {/* Available Badge / Toggle */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(product.id, { available: !product.available });
                    }}
                    className={`
                        absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/10 shadow-sm transition-all flex items-center gap-1.5 z-10
                        ${isAvailable
                            ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                            : 'bg-black/60 text-white/70 hover:bg-black/80'}
                    `}
                >
                    {isAvailable ? <Eye size={12} /> : <EyeOff size={12} />}
                    {isAvailable ? 'VISIBLE' : 'OCULTO'}
                </button>

                {/* Actions Overlay (Hover) */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-20">
                    <button
                        onClick={() => onEdit(product)}
                        className="h-11 w-11 bg-white rounded-full flex items-center justify-center text-zinc-900 hover:scale-110 hover:bg-zinc-50 transition-all shadow-xl"
                        title="Editar Plato"
                    >
                        <Edit2 size={20} strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="h-11 w-11 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 hover:bg-red-600 transition-all shadow-xl"
                        title="Eliminar Plato"
                    >
                        <Trash2 size={20} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2 text-sm flex-1">
                        {product.name}
                    </h3>
                    <div className="flex flex-col items-end">
                        {product.discountPrice ? (
                            <>
                                <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">
                                    ${product.price?.toLocaleString()}
                                </span>
                                <span className="font-mono font-bold text-sm whitespace-nowrap text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                                    ${product.discountPrice.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="font-mono font-bold text-sm whitespace-nowrap text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10">
                                ${product.price ? product.price.toLocaleString() : '0'}
                            </span>
                        )}
                    </div>
                </div>

                {/* AQUÍ ESTÁ LA SOLUCIÓN:
                   Cambié h-8 (32px) por h-10 (40px). 
                   Esto da el espacio justo para 2 líneas de texto con interlineado relajado.
                */}
                <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed h-10 mb-1">
                    {product.description || <span className="italic opacity-50">Sin descripción añadida.</span>}
                </p>

                {/* Ingredients / Tags */}
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                    {product.ingredients?.length > 0 ? (
                        <>
                            {product.ingredients.slice(0, 3).map((ing, idx) => (
                                <span key={idx} className="text-[10px] font-medium px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-md border border-border/50">
                                    {ing}
                                </span>
                            ))}
                            {product.ingredients.length > 3 && (
                                <span className="text-[10px] text-muted-foreground px-1 py-1 font-medium">
                                    +{product.ingredients.length - 3}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-[10px] text-muted-foreground/40 italic py-1">Sin ingredientes</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
function EmptyState({ onAction }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-60 min-h-[400px]">
            <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
                <UtensilsCrossed className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">Menú vacío</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-2 mb-6 leading-relaxed">
                No hay productos en esta categoría o no coinciden con tu búsqueda.
            </p>
            <button
                onClick={onAction}
                className="px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-all flex items-center gap-2"
            >
                <Plus size={16} /> Crear Producto
            </button>
        </div>
    );
}