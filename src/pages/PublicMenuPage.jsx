import React, { useState, useEffect, useMemo } from 'react';
import { useMenu } from '../context/MenuContext';
import { clientConfig } from '../config/client';
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent
} from 'framer-motion';
import {
    Search, Grid, List as ListIcon,
    Sparkles, Utensils, WifiOff, Flame, ChefHat, X, Phone, Instagram, ArrowUp, Clock
} from 'lucide-react';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import MenuProductModal from '../components/menu/MenuProductModal';

// --- VISUAL FX ---
const BrandOrb = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
        <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] rounded-full blur-[120px] opacity-20 mix-blend-screen animate-pulse-slow"
            style={{ backgroundColor: clientConfig.themeColor }}
        />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
);

// --- COMPONENTES UI ---

const CategoryPill = ({ id, label, activeId, onClick, small = false }) => {
    const isActive = activeId === id;
    return (
        <button
            onClick={() => onClick(id)}
            className={`
                relative rounded-full font-bold whitespace-nowrap transition-all duration-300 border shrink-0
                ${small ? 'px-4 py-1.5 text-[11px]' : 'px-6 py-2.5 text-xs'}
                ${isActive
                    ? 'text-white border-white/20 shadow-[0_0_20px_-5px_var(--brand-color)] bg-[var(--brand-color)]'
                    : 'text-white/40 border-transparent hover:bg-white/5 hover:text-white'}
            `}
            style={{ '--brand-color': clientConfig.themeColor }}
        >
            {label}
        </button>
    );
};

const ViewToggle = ({ current, onChange }) => (
    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 w-full backdrop-blur-md">
        {['list', 'gallery'].map((view) => {
            const isActive = current === view;
            return (
                <button
                    key={view}
                    onClick={() => onChange(view)}
                    className={`
                        relative flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors z-10
                        ${isActive ? 'text-black' : 'text-white/40 hover:text-white'}
                    `}
                >
                    {isActive && (
                        <motion.div
                            layoutId="toggleBg"
                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        {view === 'list' ? <ListIcon size={14} strokeWidth={2.5} /> : <Grid size={14} strokeWidth={2.5} />}
                        {view === 'list' ? 'Carta' : 'Galería'}
                    </span>
                </button>
            );
        })}
    </div>
);

const DragScroll = ({ as: Component = "div", children, className, ...props }) => {
    const ref = React.useRef(null);
    const isDown = React.useRef(false);
    const startX = React.useRef(0);
    const scrollLeft = React.useRef(0);
    const hasDragged = React.useRef(false);

    const onMouseDown = (e) => {
        isDown.current = true;
        hasDragged.current = false;
        startX.current = e.pageX - ref.current.offsetLeft;
        scrollLeft.current = ref.current.scrollLeft;
        ref.current.style.cursor = 'grabbing';
    };

    const onMouseLeave = () => {
        isDown.current = false;
        if (ref.current) ref.current.style.cursor = 'grab';
    };

    const onMouseUp = () => {
        isDown.current = false;
        if (ref.current) ref.current.style.cursor = 'grab';
    };

    const onMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        if (Math.abs(walk) > 5) hasDragged.current = true;
        ref.current.scrollLeft = scrollLeft.current - walk;
    };

    const onClickCapture = (e) => {
        if (hasDragged.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <Component
            ref={ref}
            className={`cursor-grab ${className}`}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onClickCapture={onClickCapture}
            {...props}
        >
            {children}
        </Component>
    );
};

const StickyHeader = ({ isVisible, categories, activeCategory, setActiveCategory, products }) => {
    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl pt-safe-top"
        >
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
                <DragScroll className="flex-1 overflow-x-auto no-scrollbar mask-fade-right flex gap-2">
                    <CategoryPill id="all" label="Todo" activeId={activeCategory} onClick={setActiveCategory} />
                    {products.some(p => p.discountPrice) && (
                        <CategoryPill id="offers" label="% Ofertas" activeId={activeCategory} onClick={setActiveCategory} />
                    )}
                    {categories.map(cat => {
                        if (!products.some(p => p.categoryId === cat.id && p.available)) return null;
                        return <CategoryPill key={cat.id} id={cat.id} label={cat.name} activeId={activeCategory} onClick={setActiveCategory} />;
                    })}
                </DragScroll>
            </div>
        </motion.div >
    );
};

const ProductCard = ({ product, viewMode, onClick, highlight }) => {
    const isList = viewMode === 'list';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onClick(product)}
            className={`
                group relative overflow-hidden bg-black/20 backdrop-blur-md border border-white/10
                ${isList
                    ? 'flex gap-4 p-3 rounded-[20px] hover:border-white/20 hover:bg-black/40 transition-all'
                    : 'flex-col w-[260px] rounded-[32px] p-3 pb-4 shrink-0'}
            `}
        >
            <div className={`
                relative overflow-hidden bg-white/5
                ${isList ? 'w-24 h-24 rounded-[16px] shrink-0' : 'w-full aspect-[4/3] rounded-[24px] mb-3'}
            `}>
                <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!product.available ? 'grayscale opacity-40' : ''}`}
                />
                {!product.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <span className="px-2 py-1 bg-white/10 border border-white/20 text-[10px] font-black text-white uppercase tracking-widest rounded">
                            Agotado
                        </span>
                    </div>
                )}
                {product.available && product.discountPrice && (
                    <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 bg-[var(--brand-color)] text-white text-[10px] font-black uppercase tracking-wider rounded shadow-lg shadow-black/20"
                            style={{ '--brand-color': clientConfig.themeColor }}>
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                    </div>
                )}
            </div>

            <div className={`flex flex-col flex-1 ${!isList && 'px-1'}`}>
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className={`font-bold text-white leading-tight ${isList ? 'text-base' : 'text-lg line-clamp-1'}`}>
                        {product.name}
                    </h3>
                </div>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-3">
                    {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        {product.discountPrice ? (
                            <>
                                <span className="text-[10px] text-white/40 line-through decoration-white/40 decoration-1">
                                    ${product.price?.toLocaleString()}
                                </span>
                                <span
                                    className="text-lg font-bold tracking-tight"
                                    style={{ color: clientConfig.themeColor }}
                                >
                                    ${product.discountPrice?.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span
                                className="text-lg font-bold tracking-tight"
                                style={{ color: highlight ? clientConfig.themeColor : '#fff' }}
                            >
                                ${product.price?.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(product);
                        }}
                        className={`
                            hidden md:block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer
                            ${isList ? 'bg-white/5 text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5'}
                        `}
                    >
                        Ver más
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ConnectSection = () => (
    <div className="mt-5 px-6 pb-12 relative z-10">
        <div className="max-w-md mx-auto">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
            <h3 className="text-2xl font-black text-center text-white mb-8 tracking-tight">
                ¿Te gustó la experiencia?
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-16">
                <a
                    href={`https://wa.me/${clientConfig.contact?.whatsapp?.replace(/\D/g, '') || ''}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all group cursor-pointer"
                >
                    <Phone className="w-8 h-8 text-white/70 group-hover:text-[#25D366] transition-colors" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">WhatsApp</span>
                </a>
                <a
                    href={clientConfig.contact?.instagram || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30 transition-all group cursor-pointer"
                >
                    <Instagram className="w-8 h-8 text-white/70 group-hover:text-[#E1306C] transition-colors" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Instagram</span>
                </a>
            </div>
            <div className="text-center mt-8">
                <a
                    href="https://www.vantradigital.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-105 hover:opacity-100 opacity-60 cursor-pointer"
                >
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
                        Powered by <span className="font-black" style={{ color: '#EDF246' }}>VANTRA</span>
                    </p>
                </a>
            </div>
        </div>
    </div>
);

export default function PublicMenuPage() {
    const { products, categories, loading, menuEvents, clearMenuEvents } = useMenu();
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });
    const [showStickyHeader, setShowStickyHeader] = useState(false);

    // Lógica de "Abierto/Cerrado"
    const isOpen = useMemo(() => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const shifts = Object.values(clientConfig.businessLogic.shifts).filter(s => s.active);

        return shifts.some(shift => {
            const [startH, startM] = shift.start.split(':').map(Number);
            const [endH, endM] = shift.end.split(':').map(Number);
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;

            if (endTotal < startTotal) {
                // Cruza medianoche (ej: 19:00 a 01:00)
                return currentMinutes >= startTotal || currentMinutes < endTotal;
            } else {
                return currentMinutes >= startTotal && currentMinutes < endTotal;
            }
        });
    }, []);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setShowStickyHeader(latest > 350); // Aumenté un poco el trigger
    });

    const handleViewChange = (newView) => {
        if (newView === viewMode) return;
        setActiveCategory('all');
        setViewMode(newView);
    };

    const searchResults = useMemo(() => {
        if (!products?.length) return [];
        if (!searchTerm) return products;
        const lower = searchTerm.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.description?.toLowerCase().includes(lower)
        );
    }, [products, searchTerm]);

    const listData = useMemo(() => {
        if (activeCategory === 'all') return searchResults;
        if (activeCategory === 'offers') return searchResults.filter(p => p.discountPrice);
        return searchResults.filter(p => p.categoryId === activeCategory);
    }, [activeCategory, searchResults]);

    const galleryData = useMemo(() => {
        if (!categories?.length || !searchResults?.length) return [];

        if (activeCategory === 'all') {
            return categories
                .map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    items: searchResults.filter(p => p.categoryId === cat.id)
                }))
                .filter(group => group.items.length > 0);
        } else if (activeCategory === 'offers') {
            const items = searchResults.filter(p => p.discountPrice);
            return items.length > 0 ? [{ id: 'offers', name: 'Ofertas y Descuentos', items }] : [];
        } else {
            const category = categories.find(c => c.id === activeCategory);
            const items = searchResults.filter(p => p.categoryId === activeCategory);
            return (category && items.length > 0) ? [{ id: category.id, name: category.name, items }] : [];
        }
    }, [searchResults, categories, activeCategory]);

    // Polling Feedback
    useEffect(() => {
        if (menuEvents?.length > 0) {
            menuEvents.forEach(event => {
                // Solo notificamos si algo se agota, NO si cambia el precio
                if (event.type === 'STOCK_OUT') {
                    setToast({ show: true, msg: `${event.product.name} se ha agotado`, type: 'error' });
                }
            });
            clearMenuEvents();
            setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 4000);
        }
    }, [menuEvents, clearMenuEvents]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    if (loading && products.length === 0) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[var(--brand-color)] animate-spin"
                style={{ '--brand-color': clientConfig.themeColor }} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[var(--brand-color)] selection:text-white overflow-x-hidden pb-10"
            style={{ '--brand-color': clientConfig.themeColor }}>

            <BrandOrb />

            <StickyHeader
                isVisible={showStickyHeader}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                products={products}
            />

            {/* --- HERO SECTION REDISEÑADA --- */}
            <header className="relative pt-16 px-6 pb-8 max-w-2xl mx-auto z-10 flex flex-col items-center text-center">

                {/* 1. Indicador de Estado (Dinámico) */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm mb-6 ${isOpen ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
                >
                    <span className="relative flex h-2 w-2">
                        {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                        {isOpen ? 'Abierto ahora' : 'Cerrado por ahora'}
                    </span>
                </motion.div>

                {/* 2. Título GIGANTE y con Estilo */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-6xl md:text-7xl font-black tracking-tighter mb-12 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-[0.9]"
                >
                    {clientConfig.name}
                </motion.h1>



                {/* Controles (Search + Toggle + Cats) */}
                <div className="w-full space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar antojos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-10 pr-10 text-sm font-medium text-white focus:bg-white/10 transition-all outline-none focus:border-white/10"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <ViewToggle current={viewMode} onChange={handleViewChange} />

                    <DragScroll
                        as={motion.div}
                        animate={{ opacity: showStickyHeader ? 0 : 1, height: showStickyHeader ? 0 : 'auto' }}
                        className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-fade-right pt-2"
                    >
                        <CategoryPill id="all" label="Todo" activeId={activeCategory} onClick={setActiveCategory} />
                        {searchResults.some(p => p.discountPrice) && (
                            <CategoryPill id="offers" label="% Ofertas" activeId={activeCategory} onClick={setActiveCategory} />
                        )}
                        {categories.map(cat => {
                            if (!searchResults.some(p => p.categoryId === cat.id && p.available)) return null;
                            return <CategoryPill key={cat.id} id={cat.id} label={cat.name} activeId={activeCategory} onClick={setActiveCategory} />;
                        })}
                    </DragScroll>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative z-10 max-w-2xl mx-auto px-4 pt-4 min-h-[40vh]">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list-container"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            {listData.length === 0 ? (
                                <div className="text-center py-20 opacity-40">No hay resultados.</div>
                            ) : (
                                listData.map(p => (
                                    <ProductCard key={`list-${p.id}`} product={p} viewMode="list" onClick={setSelectedProduct} />
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="gallery-container"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            {galleryData.length === 0 ? (
                                <div className="text-center py-20 opacity-40">No hay productos.</div>
                            ) : (
                                galleryData.map(group => (
                                    <div key={group.id}>
                                        <div className="flex items-center gap-3 mb-4 px-2">
                                            <h2 className="text-xl font-black text-white tracking-tight">{group.name}</h2>
                                            <div className="h-px flex-1 bg-white/10" />
                                        </div>
                                        <DragScroll className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
                                            {group.items.map(p => (
                                                <div key={`gallery-${p.id}`} className="snap-center shrink-0">
                                                    <ProductCard product={p} viewMode="gallery" onClick={setSelectedProduct} />
                                                </div>
                                            ))}
                                            <div className="w-2 shrink-0" />
                                        </DragScroll>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <ConnectSection />

            <AnimatePresence>
                {selectedProduct && (
                    <MenuProductModal
                        product={selectedProduct}
                        isOpen={!!selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast.show && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
                        <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#151515]/90 backdrop-blur-xl border border-white/10 shadow-2xl" style={{ borderLeft: `3px solid ${toast.type === 'error' ? '#ef4444' : clientConfig.themeColor}` }}>
                            {toast.type === 'error' ? <WifiOff size={16} className="text-red-500" /> : <Flame size={16} style={{ color: clientConfig.themeColor }} />}
                            <p className="text-xs font-bold text-white/90">{toast.msg}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}