import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Flame } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { clientConfig } from '../../config/client';

export default function MenuProductModal({ product, onClose }) {
    if (!product) return null;

    // Detectar si es móvil para ajustar animación
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <>
            {/* Backdrop (Fondo oscuro desenfocado) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Modal / Sheet Container */}
            <motion.div
                key="modal-content"
                initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 0 }}
                animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 md:inset-0 md:top-auto md:m-auto md:w-full md:max-w-2xl z-[70] bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-2xl border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden max-h-[90vh] md:max-h-[85vh] shadow-2xl flex flex-col items-center"
            >

                <div className="w-full overflow-y-auto pb-10 custom-scrollbar relative">

                    {/* --- HEADER IMAGEN (Cinemático) --- */}
                    <div className="relative w-full aspect-[4/3] md:aspect-video">
                        <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className={`w-full h-full object-cover ${!product.available ? 'grayscale opacity-50' : ''}`}
                        />

                        {/* Gradiente de protección para texto/iconos */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-90" />

                        {/* Botón Cerrar Flotante */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/10 active:scale-95 z-30"
                        >
                            <X size={20} />
                        </button>

                        {/* Badge de Estado (Sobre la imagen) */}
                        {!product.available && (
                            <div className="absolute bottom-6 left-6 z-20">
                                <span className="px-3 py-1.5 bg-red-500/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-400/30 backdrop-blur-md shadow-lg">
                                    Agotado
                                </span>
                            </div>
                        )}
                    </div>

                    {/* --- CONTENIDO --- */}
                    <div className="px-6 md:px-10 -mt-10 relative z-10">
                        <div className="bg-white/80 dark:bg-[#121212]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] border border-white/10">

                            {/* Título y Precio */}
                            <div className="flex flex-col gap-2 mb-6">
                                <div className="flex justify-between items-start gap-4">
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight">
                                        {product.name}
                                    </h2>

                                    {/* Precio con Color de Marca */}
                                    <div className="flex flex-col items-end shrink-0">
                                        <span
                                            className="text-2xl font-bold tracking-tight"
                                            style={{ color: clientConfig.themeColor }}
                                        >
                                            ${product.price?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mb-8">
                                {product.description || "Una experiencia de sabor única, preparada con los mejores ingredientes."}
                            </p>

                            {/* Separador Sutil */}
                            <div className="h-px w-full bg-zinc-100 dark:bg-white/5 mb-8" />

                            {/* Ingredientes / Detalles */}
                            {product.ingredients && product.ingredients.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Flame size={14} className="text-orange-500" />
                                        Lo que lleva
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.ingredients.map((ing, idx) => (
                                            <span
                                                key={idx}
                                                className="px-4 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl text-zinc-700 dark:text-zinc-300 text-sm font-semibold"
                                            >
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}