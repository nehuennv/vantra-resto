import React, { useState, useMemo, useRef } from 'react';
import { AnimatePresence } from "framer-motion";
import {
    Search, Plus, X, User, Users, Clock,
    MessageSquare, ChevronLeft, ChevronRight,
    History, Phone, CalendarDays
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext"; // <--- ESTO ES VITAL

// 👇 IMPORTAMOS TUS COMPONENTES MODULARES
import ReservationListView from '../components/reservations/ReservationListView';
import CustomCalendar from '../components/ui/CustomCalendar';

// --- UTILIDADES ---
const getTodayString = () => new Date().toISOString().split('T')[0];

const formatDateHeader = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    // Formato: "Lun, 28 Dic 2025"
    return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

// --- BASE DE DATOS MOCK ---
const TODAY = getTodayString();
const initialReservations = [
    {
        id: 1, name: "Valentina Zenere", time: "22:00", pax: 4, date: TODAY, phone: "1155556666",
        status: "confirmed", origin: "whatsapp", tags: ["Celíaco"], createdAt: "2023-10-10"
    },
    {
        id: 2, name: "Julián Álvarez", time: "21:00", pax: 2, date: TODAY, phone: "1144445555",
        status: "seated", origin: "instagram", tags: ["VIP"], createdAt: "2023-12-01"
    },
    {
        id: 3, name: "Evento Futuro", time: "21:00", pax: 20, date: "2026-01-01", phone: "1122334455",
        status: "confirmed", origin: "phone", tags: ["Adelanto Pago"], createdAt: TODAY
    },
];

const ReservationsPage = () => {
    // 1. OBTENEMOS EL TEMA (Esto faltaba y causaba el error)
    const { theme } = useTheme();

    // --- ESTADOS ---
    const [reservations, setReservations] = useState(initialReservations);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [currentDate, setCurrentDate] = useState(getTodayString());

    // Formulario
    const initialFormState = { name: '', pax: 2, time: '', date: '', origin: 'walk-in', notes: '', phone: '' };
    const [formData, setFormData] = useState(initialFormState);

    // --- FILTRO Y ORDENAMIENTO ---
    const displayedReservations = useMemo(() => {
        return reservations
            .filter(r => {
                const matchDate = r.date === currentDate;
                const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
                return matchDate && matchSearch;
            })
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [reservations, currentDate, searchTerm]);

    // --- MANEJADORES ---
    const handleCardClick = (id) => setSelectedId(prev => prev === id ? null : id);
    const handleUpdate = (id, newData) => { setReservations(prev => prev.map(r => r.id === id ? { ...r, ...newData } : r)); setSelectedId(null); };
    const handleDelete = (id) => { if (window.confirm("¿Eliminar?")) { setReservations(prev => prev.filter(r => r.id !== id)); setSelectedId(null); } };

    // Navegación rápida de días
    const changeDay = (days) => {
        const date = new Date(currentDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
        setCurrentDate(date.toISOString().split('T')[0]);
    };

    // Crear / Editar
    const openCreateModal = () => {
        setEditingId(null);
        setFormData({ ...initialFormState, date: currentDate, time: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (res) => {
        setEditingId(res.id);
        setFormData({
            name: res.name, pax: res.pax, time: res.time, date: res.date,
            origin: res.origin, phone: res.phone || '',
            notes: res.tags ? res.tags.join(', ') : ''
        });
        setIsModalOpen(true);
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            setReservations(prev => prev.map(r => r.id === editingId ? { ...r, ...formData, tags: formData.notes ? [formData.notes] : [] } : r));
        } else {
            const newId = Math.max(...reservations.map(r => r.id), 0) + 1;
            setReservations([...reservations, { id: newId, ...formData, status: 'confirmed', tags: formData.notes ? [formData.notes] : [], createdAt: getTodayString() }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="h-full flex flex-col space-y-4 relative pb-2 overflow-hidden">

            {/* HEADER */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* NAVIGATOR (Izquierda) */}
                <div className="flex items-center gap-3 bg-[#0F0F10] border border-white/10 p-1 rounded-xl w-full md:w-auto h-11 shadow-sm">
                    <button onClick={() => changeDay(-1)} className="h-full px-3 hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-r border-white/5"><ChevronLeft size={18} /></button>

                    {/* Botón Central: Abre el Calendario Custom */}
                    <div
                        className="relative flex-1 md:flex-none flex items-center justify-center px-4 hover:bg-white/5 transition-colors cursor-pointer h-full"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        <div className="flex items-center gap-2 text-white font-bold text-sm capitalize whitespace-nowrap">
                            <CalendarDays size={16} className="text-primary" />
                            {formatDateHeader(currentDate)}
                        </div>
                    </div>

                    <button onClick={() => changeDay(1)} className="h-full px-3 hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-l border-white/5"><ChevronRight size={18} /></button>

                    {/* Botón Hoy */}
                    {currentDate !== getTodayString() && (
                        <div className="border-l border-white/10 pl-1">
                            <button onClick={() => setCurrentDate(getTodayString())} className="h-full px-3 hover:bg-white/5 text-primary text-xs font-bold uppercase transition-colors flex items-center gap-1"><History size={14} /> Hoy</button>
                        </div>
                    )}
                </div>

                {/* TOOLS (Derecha) */}
                <div className="flex items-center gap-3 w-full md:w-auto h-11">
                    <div className="relative flex-1 md:w-64 h-full">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-500" /></div>
                        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-full bg-[#0F0F10] border border-white/10 rounded-xl pl-9 pr-3 text-sm text-white focus:border-primary/50 outline-none transition-all shadow-sm placeholder:text-slate-600" />
                    </div>
                    <button onClick={openCreateModal} className="h-full px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"><Plus size={18} strokeWidth={3} /><span className="hidden md:inline">Nueva</span></button>
                </div>
            </div>

            {/* LISTA RESERVAS (Modular) */}
            <div className="flex-1 min-h-0 bg-[#0F0F10] border border-white/5 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                {displayedReservations.length > 0 ? (
                    <ReservationListView
                        reservations={displayedReservations}
                        selectedId={selectedId}
                        onSelect={handleCardClick}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onEdit={openEditModal}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60 min-h-[400px]">
                        <CalendarDays size={48} strokeWidth={1} className="mb-4 text-slate-600" />
                        <p className="text-lg font-medium text-slate-400">Día libre</p>
                        <p className="text-sm">Sin reservas para el <span className="capitalize">{formatDateHeader(currentDate)}</span></p>
                    </div>
                )}
            </div>

            {/* MODAL CALENDARIO CUSTOM */}
            <AnimatePresence>
                {isCalendarOpen && (
                    <CustomCalendar
                        isOpen={isCalendarOpen}
                        onClose={() => setIsCalendarOpen(false)}
                        selectedDate={currentDate}
                        onSelect={setCurrentDate}
                        themeColor={theme.color} // Ahora SÍ existe theme
                    />
                )}
            </AnimatePresence>

            {/* MODAL CREAR/EDITAR */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#18181b] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">{editingId ? "Editar Reserva" : "Nueva Reserva"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleModalSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Fecha</label><input type="date" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none color-scheme-dark" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required /></div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Hora</label><input type="time" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none color-scheme-dark" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required /></div>
                            </div>
                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Nombre</label><input autoFocus type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Pax</label><input type="number" min="1" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none" value={formData.pax} onChange={e => setFormData({ ...formData, pax: parseInt(e.target.value) })} required /></div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Origen</label><select className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none appearance-none" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })}><option value="walk-in">Walk-in</option><option value="phone">Teléfono</option><option value="whatsapp">WhatsApp</option></select></div>
                            </div>
                            {/* CAMPO TELEFONO */}
                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Teléfono</label><input type="tel" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>

                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Notas</label><textarea rows="2" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary/50 outline-none resize-none" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
                            <button type="submit" className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 mt-4 active:scale-95 transition-transform">{editingId ? "Guardar Cambios" : "Guardar Reserva"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;