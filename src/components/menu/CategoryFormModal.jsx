import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Type } from "lucide-react";
import { cn } from "../../lib/utils";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.3 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2 }
    }
};

export default function CategoryFormModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        try {
            await onSubmit(name);
            onClose();
        } catch (err) {
            setError(err.message || 'Error al crear la categoría');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={overlayVariants}
                >
                    {/* BACKDROP */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

                    {/* MODAL CARD */}
                    <motion.div
                        className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border bg-muted/40 flex justify-between items-center shrink-0">
                            <h2 className="text-lg font-bold text-foreground tracking-wide flex items-center gap-2">
                                <Layers size={18} className="text-primary" />
                                Nueva Categoría
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus:outline-none focus:ring-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                    <Type size={10} /> Nombre de la Categoría
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    required
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-muted-foreground font-medium"
                                    placeholder="Ej: Entradas, Postres..."
                                    value={name}
                                    onChange={e => {
                                        setName(e.target.value);
                                        setError('');
                                    }}
                                />
                                {error && (
                                    <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-left-1">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Botón Submit */}
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 mt-2 active:scale-95 transition-all outline-none focus:outline-none focus:ring-0"
                            >
                                Crear Categoría
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
