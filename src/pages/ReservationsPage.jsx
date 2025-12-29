import React, { useState, useMemo } from 'react';
import { AnimatePresence } from "framer-motion";
import { Search, Plus, ChevronLeft, ChevronRight, History, CalendarDays } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useReservations } from "../context/ReservationsContext"; // <--- CONEXIÓN AL CEREBRO

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
    // Ya no usamos useState local para 'reservations', usamos el global
    const { reservations, addReservation, updateReservation, deleteReservation } = useReservations();

    // --- ESTADOS LOCALES (Solo UI: filtros, modales, selección) ---
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Estado para saber si estamos editando (objeto) o creando (null)
    const [editingReservation, setEditingReservation] = useState(null);

    const [currentDate, setCurrentDate] = useState(getTodayString());

    // --- FILTRO Y ORDENAMIENTO ---
    // Esto sigue siendo local porque depende de 'searchTerm' y 'currentDate' que son preferencias de vista
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

    // Navegación rápida de fechas
    const changeDay = (days) => {
        const date = new Date(currentDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
        setCurrentDate(date.toISOString().split('T')[0]);
    };

    // --- GESTIÓN DE MODALES ---
    const openCreateModal = () => {
        setEditingReservation(null); // Null = "Modo Crear"
        setIsModalOpen(true);
    };

    const openEditModal = (res) => {
        setEditingReservation(res); // Objeto = "Modo Editar"
        setIsModalOpen(true);
    };

    // --- ACCIONES CRUD (Conectadas al Contexto) ---
    const handleFormSubmit = (formData) => {
        // Formatear notas a array de tags
        const tags = formData.notes ? [formData.notes] : [];

        if (editingReservation) {
            // EDITAR: Llamamos a la función global de actualizar
            updateReservation(editingReservation.id, { ...formData, tags });
        } else {
            // CREAR: Llamamos a la función global de crear
            addReservation({ ...formData, tags });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta reserva?")) {
            deleteReservation(id); // Acción Global
            setSelectedId(null);
        }
    };

    // Wrapper para cuando cambiamos status desde la tarjeta (ej: "Llegó ya")
    const handleUpdateStatus = (id, newData) => {
        updateReservation(id, newData); // Acción Global
        setSelectedId(null);
    };

    return (
        <div className="h-full flex flex-col space-y-4 relative pb-2 overflow-hidden">

            {/* HEADER DE CONTROL */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* NAVEGACIÓN FECHAS (Izquierda) */}
                <div className="flex items-center gap-3 bg-[#0F0F10] border border-white/10 p-1 rounded-xl w-full md:w-auto h-11 shadow-sm">
                    <button onClick={() => changeDay(-1)} className="h-full px-3 hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-r border-white/5">
                        <ChevronLeft size={18} />
                    </button>

                    <div
                        className="relative flex-1 md:flex-none flex items-center justify-center px-4 hover:bg-white/5 transition-colors cursor-pointer h-full"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        <div className="flex items-center gap-2 text-white font-bold text-sm capitalize whitespace-nowrap">
                            <CalendarDays size={16} className="text-primary" />
                            {formatDateHeader(currentDate)}
                        </div>
                    </div>

                    <button onClick={() => changeDay(1)} className="h-full px-3 hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-l border-white/5">
                        <ChevronRight size={18} />
                    </button>

                    {/* Botón "Hoy" si no estamos en hoy */}
                    {currentDate !== getTodayString() && (
                        <div className="border-l border-white/10 pl-1">
                            <button onClick={() => setCurrentDate(getTodayString())} className="h-full px-3 hover:bg-white/5 text-primary text-xs font-bold uppercase transition-colors flex items-center gap-1">
                                <History size={14} /> Hoy
                            </button>
                        </div>
                    )}
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
                            className="w-full h-full bg-[#0F0F10] border border-white/10 rounded-xl pl-9 pr-3 text-sm text-white focus:border-primary/50 outline-none transition-all shadow-sm placeholder:text-slate-600"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="h-full px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span className="hidden md:inline">Nueva</span>
                    </button>
                </div>
            </div>

            {/* LISTA DE RESERVAS (Área Principal) */}
            <div className="flex-1 min-h-0 bg-[#0F0F10] border border-white/5 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
                {/* Efecto de fondo (Glow) */}
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
                    // Estado vacío (Empty State)
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60 min-h-[400px]">
                        <CalendarDays size={48} strokeWidth={1} className="mb-4 text-slate-600" />
                        <p className="text-lg font-medium text-slate-400">Día libre</p>
                        <p className="text-sm">Sin reservas para el <span className="capitalize">{formatDateHeader(currentDate)}</span></p>
                    </div>
                )}
            </div>

            {/* MODALES FLOTANTES */}
            <AnimatePresence>
                {isCalendarOpen && (
                    <CustomCalendar
                        isOpen={isCalendarOpen}
                        onClose={() => setIsCalendarOpen(false)}
                        selectedDate={currentDate}
                        onSelect={setCurrentDate}
                        themeColor={theme.color}
                    />
                )}
            </AnimatePresence>

            {/* El Modal de Formulario ahora es un componente limpio */}
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