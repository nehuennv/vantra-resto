import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Users, Phone, FileText, Globe } from "lucide-react";
import { cn } from "../../lib/utils";

const initialFormState = { name: '', pax: 2, time: '', date: '', origin: 'walk-in', notes: '', phone: '' };

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
                        className="bg-[#0F0F10] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 bg-[#131316] flex justify-between items-center shrink-0">
                            <h2 className="text-lg font-bold text-white tracking-wide">
                                {initialData ? "Editar Reserva" : "Nueva Reserva"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors outline-none focus:outline-none focus:ring-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Fila 1: Fecha y Hora */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                                        <Calendar size={10} /> Fecha
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-600 color-scheme-dark"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                                        <Clock size={10} /> Hora
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors color-scheme-dark"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Nombre */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                                    <User size={10} /> Nombre del Cliente
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    required
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-700 font-medium"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Fila 2: Pax y Origen */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                                        <Users size={10} /> Personas
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors font-mono"
                                        value={formData.pax}
                                        onChange={e => setFormData({ ...formData, pax: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                                        <Globe size={10} /> Origen
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors appearance-none cursor-pointer"
                                            value={formData.origin}
                                            onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                        >
                                            <option value="walk-in">Walk-in (Presencial)</option>
                                            <option value="phone">Teléfono</option>
                                            <option value="whatsapp">WhatsApp / Bot</option>
                                            <option value="web">Sitio Web</option>
                                        </select>
                                        {/* Flecha custom para el select */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                                    <Phone size={10} /> Teléfono (Opcional)
                                </label>
                                <input
                                    type="tel"
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-700 font-mono"
                                    placeholder="+54 9 11..."
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            {/* Notas */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                                    <FileText size={10} /> Notas Adicionales
                                </label>
                                <textarea
                                    rows="2"
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-slate-700"
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
                                {initialData ? "Guardar Cambios" : "Crear Reserva"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReservationFormModal;