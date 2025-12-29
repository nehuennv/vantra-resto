import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Search, Plus, ChevronLeft, ChevronRight, History, CalendarDays } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useReservations } from "../context/ReservationsContext";

// Componentes Modulares
import ReservationListView from '../components/reservations/ReservationListView';
import CustomCalendar from '../components/ui/CustomCalendar';
import ReservationFormModal from '../components/reservations/ReservationFormModal';

// Utilidades
const getTodayString = () => new Date().toISOString().split('T')[0];

const formatDateHeader = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const ReservationsPage = () => {
    const { theme } = useTheme();

    // 1. EXTRAEMOS LA LOGICA GLOBAL DEL CONTEXTO
    const { reservations, addReservation, updateReservation, deleteReservation } = useReservations();

    // --- ESTADOS LOCALES ---
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [currentDate, setCurrentDate] = useState(getTodayString());

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

    // --- MANEJADORES UI ---
    const handleCardClick = (id) => setSelectedId(prev => prev === id ? null : id);

    // Navegación rápida
    const changeDay = (days) => {
        const date = new Date(currentDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
        setCurrentDate(date.toISOString().split('T')[0]);
    };

    // --- GESTIÓN DE MODALES ---
    const openCreateModal = () => {
        setEditingReservation(null);
        setIsModalOpen(true);
    };

    const openEditModal = (res) => {
        setEditingReservation(res);
        setIsModalOpen(true);
    };

    // --- ACCIONES CRUD ---
    const handleFormSubmit = (formData) => {
        const tags = formData.notes ? [formData.notes] : [];
        if (editingReservation) {
            updateReservation(editingReservation.id, { ...formData, tags });
        } else {
            addReservation({ ...formData, tags });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta reserva?")) {
            deleteReservation(id);
            setSelectedId(null);
        }
    };

    const handleUpdateStatus = (id, newData) => {
        updateReservation(id, newData);
        setSelectedId(null);
    };

    return (
        <div className="h-full flex flex-col space-y-4 relative pb-2 overflow-hidden">

            {/* HEADER DE CONTROL */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* NAVEGACIÓN FECHAS (Rediseñado: Fijo, Separadores y Animado) */}
                <div className="flex items-center bg-[#0F0F10] border border-white/10 p-1 rounded-xl shadow-sm h-11 select-none">

                    {/* Flecha Izquierda */}
                    <button
                        onClick={() => changeDay(-1)}
                        className="w-9 h-full rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 outline-none focus:outline-none focus:ring-0"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Separador Vertical */}
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />

                    {/* Visor de Fecha (ANCHO FIJO para evitar temblequeo) */}
                    <div
                        className="w-48 h-full rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer active:scale-95"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        <CalendarDays size={16} className="text-primary" />
                        <span className="text-sm font-bold text-white capitalize whitespace-nowrap">
                            {formatDateHeader(currentDate)}
                        </span>
                    </div>

                    {/* Separador Vertical */}
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />

                    {/* Flecha Derecha */}
                    <button
                        onClick={() => changeDay(1)}
                        className="w-9 h-full rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 outline-none focus:outline-none focus:ring-0"
                    >
                        <ChevronRight size={18} />
                    </button>

                    {/* Botón "Hoy" (ANIMACIÓN PRO) */}
                    <AnimatePresence>
                        {currentDate !== getTodayString() && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                // SPRING: Rebote suave, mucho más premium
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                className="overflow-hidden flex items-center h-full" // <--- h-full IMPORTANTE
                            >
                                {/* Separador extra que aparece con el botón */}
                                <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />

                                <button
                                    onClick={() => setCurrentDate(getTodayString())}
                                    // CLASES CLAVE: h-full, outline-none, focus:ring-0
                                    className="h-full px-3 rounded-lg text-primary hover:bg-primary/10 text-xs font-bold uppercase transition-colors flex items-center gap-1 whitespace-nowrap outline-none focus:outline-none focus:ring-0 active:scale-95"
                                >
                                    <History size={14} /> Hoy
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* BUSCADOR Y BOTÓN NUEVA (Derecha) */}
                <div className="flex items-center gap-3 w-full md:w-auto h-11">
                    <div className="relative flex-1 md:w-64 h-full">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-full bg-[#0F0F10] border border-white/10 rounded-xl pl-9 pr-3 text-sm text-white focus:border-primary/50 outline-none transition-all shadow-sm placeholder:text-slate-600 focus:ring-0"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="h-full px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap outline-none focus:outline-none focus:ring-0"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span className="hidden md:inline">Nueva</span>
                    </button>
                </div>
            </div>

            {/* LISTA DE RESERVAS */}
            <div className="flex-1 min-h-0 bg-[#0F0F10] border border-white/5 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                {displayedReservations.length > 0 ? (
                    <ReservationListView
                        reservations={displayedReservations}
                        selectedId={selectedId}
                        onSelect={handleCardClick}
                        onUpdate={handleUpdateStatus}
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

            {/* MODALES */}
            <CustomCalendar
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={currentDate}
                onSelect={setCurrentDate}
                themeColor={theme.color}
            />

            {/* El Modal de Formulario */}
            <ReservationFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingReservation}
            />
        </div>
    );
};

export default ReservationsPage;