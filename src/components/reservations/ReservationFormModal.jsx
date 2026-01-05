import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Users, Phone, FileText, Globe, Store } from "lucide-react";
import { cn } from "../../lib/utils";

const initialFormState = { name: '', pax: 2, time: '', date: '', origin: 'whatsapp', notes: '', phone: '' };

// Variantes para Framer Motion
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

const ReservationFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialFormState);

    // Sincronizar datos
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Modo Edición
                setFormData({
                    ...initialData,
                    notes: initialData.tags ? initialData.tags.join(', ') : ''
                });
            } else {
                // Modo Creación
                setFormData({ ...initialFormState, date: new Date().toISOString().split('T')[0] });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                        className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border bg-muted/40 flex justify-between items-center shrink-0">
                            <h2 className="text-lg font-bold text-foreground tracking-wide">
                                {initialData ? "Editar Reserva" : "Nueva Reserva"}
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

                            {/* SWITCH PRESENCIAL (Solo nueva reserva) */}
                            {!initialData && (
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg transition-colors", formData.origin === 'walk-in' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                            <Store size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-foreground">¿Cliente Presencial?</span>
                                            <span className="text-[10px] text-muted-foreground">Llegó al local ahora mismo</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const isNowWalkIn = formData.origin !== 'walk-in'; // Toggle
                                            if (isNowWalkIn) {
                                                const now = new Date();
                                                setFormData(prev => ({
                                                    ...prev,
                                                    origin: 'walk-in',
                                                    date: now.toISOString().split('T')[0],
                                                    time: now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }),
                                                    status: 'seated' // Entra directo a mesa
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    origin: 'whatsapp', // Default fallback
                                                    status: 'pending'
                                                }));
                                            }
                                        }}
                                        className={cn(
                                            "relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0",
                                            formData.origin === 'walk-in' ? "bg-primary" : "bg-muted-foreground/30"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out absolute top-0.5 left-0.5",
                                                formData.origin === 'walk-in' ? "translate-x-5" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            )}

                            {/* Fila 1: Fecha y Hora */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                        <Calendar size={10} /> Fecha
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        disabled={formData.origin === 'walk-in' && !initialData}
                                        className={cn(
                                            "w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-muted-foreground",
                                            formData.origin === 'walk-in' && !initialData && "opacity-60 cursor-not-allowed bg-muted/50"
                                        )}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                        <Clock size={10} /> Hora
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        disabled={formData.origin === 'walk-in' && !initialData}
                                        className={cn(
                                            "w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors",
                                            formData.origin === 'walk-in' && !initialData && "opacity-60 cursor-not-allowed bg-muted/50"
                                        )}
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Nombre */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                    <User size={10} /> Nombre del Cliente
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    required
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-muted-foreground font-medium"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Fila 2: Pax y Origen */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                        <Users size={10} /> Personas
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors font-mono"
                                        value={formData.pax}
                                        onChange={e => setFormData({ ...formData, pax: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                        <Globe size={10} /> Origen
                                    </label>
                                    <div className="relative">
                                        <select
                                            disabled={formData.origin === 'walk-in' && !initialData}
                                            className={cn(
                                                "w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors appearance-none cursor-pointer",
                                                formData.origin === 'walk-in' && !initialData && "opacity-60 cursor-not-allowed bg-muted/50"
                                            )}
                                            value={formData.origin}
                                            onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                        >
                                            <option value="whatsapp">WhatsApp / Bot</option>
                                            <option value="walk-in">Presencial</option>
                                        </select>
                                        {/* Flecha custom para el select */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                    <Phone size={10} /> Teléfono (Opcional)
                                </label>
                                <input
                                    type="tel"
                                    className="w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-muted-foreground font-mono"
                                    placeholder="+54 9 11..."
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            {/* Notas */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                    <FileText size={10} /> Notas Adicionales
                                </label>
                                <textarea
                                    rows="2"
                                    className="w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-muted-foreground"
                                    placeholder="Alergias, mesa preferida, cumpleaños..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            {/* Botón Submit */}
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 mt-2 active:scale-95 transition-all outline-none focus:outline-none focus:ring-0"
                            >
                                {initialData ? "Guardar Cambios" : (formData.origin === 'walk-in' ? "Ingresar Cliente" : "Crear Reserva")}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReservationFormModal;