import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";

const initialFormState = { name: '', pax: 2, time: '', date: '', origin: 'walk-in', notes: '', phone: '' };

const ReservationFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialFormState);

    // Sincronizar datos cuando se abre el modal o cambia la data inicial
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Modo Edición: Cargar datos existentes
                setFormData({
                    ...initialData,
                    notes: initialData.tags ? initialData.tags.join(', ') : ''
                });
            } else {
                // Modo Creación: Resetear (manteniendo fecha si se desea, o todo a 0)
                setFormData({ ...initialFormState, date: new Date().toISOString().split('T')[0] });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Devolvemos los datos limpios al padre
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#18181b] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? "Editar Reserva" : "Nueva Reserva"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fecha</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none color-scheme-dark"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Hora</label>
                            <input
                                type="time"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none color-scheme-dark"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nombre</label>
                        <input
                            autoFocus
                            type="text"
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none placeholder:text-slate-700"
                            placeholder="Nombre del cliente"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Pax</label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none"
                                value={formData.pax}
                                onChange={e => setFormData({ ...formData, pax: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Origen</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none appearance-none"
                                value={formData.origin}
                                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                            >
                                <option value="walk-in">Walk-in</option>
                                <option value="phone">Teléfono</option>
                                <option value="whatsapp">WhatsApp</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Teléfono</label>
                        <input
                            type="tel"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none placeholder:text-slate-700"
                            placeholder="Opcional"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Notas</label>
                        <textarea
                            rows="2"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none resize-none placeholder:text-slate-700"
                            placeholder="Alergias, preferencias, etc."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 mt-4 active:scale-95 transition-transform"
                    >
                        {initialData ? "Guardar Cambios" : "Guardar Reserva"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReservationFormModal;