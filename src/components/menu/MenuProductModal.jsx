import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';

export default function MenuProductModal({ product, isOpen, onClose }) {
    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal / Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-zinc-900 rounded-t-[2.5rem] overflow-hidden max-h-[85vh] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center"
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (offset.y > 100 || velocity.y > 100) onClose();
                        }}
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mt-4 mb-2 flex-shrink-0" />

                        <div className="w-full overflow-y-auto pb-10 custom-scrollbar">
                            {/* Image Header */}
                            <div className="relative w-full aspect-video md:aspect-[21/9]">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-8 md:px-10 max-w-2xl mx-auto">
                                <div className="flex justify-between items-start mb-4 gap-4">
                                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
                                        {product.name}
                                    </h2>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
                                            ${product.price?.toLocaleString()}
                                        </span>
                                        {!product.available && (
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                                Agotado
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8">
                                    {product.description}
                                </p>

                                {product.ingredients && product.ingredients.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                            <Utensils size={14} /> Ingredientes
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.ingredients.map((ing, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 text-sm font-medium"
                                                >
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
