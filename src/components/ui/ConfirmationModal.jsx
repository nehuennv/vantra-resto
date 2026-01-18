import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, check, title, message }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-card w-full max-w-sm border border-border rounded-xl shadow-2xl relative z-10 overflow-hidden"
                    >
                        <div className="p-6 pb-0 flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-1">
                                <AlertTriangle size={32} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground tracking-tight">
                                    {title || "¿Estás seguro?"}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {message || "Esta acción es irreversible y eliminará el elemento permanentemente."}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col-reverse sm:flex-row gap-3 w-full">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground bg-muted/40 hover:bg-muted hover:text-foreground transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={check}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Confirmar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
