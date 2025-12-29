import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, History, CalendarDays } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
// 1. IMPORTAMOS EL CONTEXTO GLOBAL
import { useReservations } from "../context/ReservationsContext";

import ReservationListView from '../components/reservations/ReservationListView';
import CustomCalendar from '../components/ui/CustomCalendar';

const getTodayString = () => new Date().toISOString().split('T')[0];

const formatDateHeader = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const ReservationsPage = () => {
    const { theme } = useTheme();

    // 2. USAMOS LA FECHA GLOBAL (selectedDate) EN LUGAR DE LA LOCAL
    const {
        reservations,
        updateReservation,
        deleteReservation,
        selectedDate,      // <--- LA FECHA DEL CEREBRO
        setSelectedDate    // <--- EL CONTROL DEL CEREBRO
    } = useReservations();

    const { openModal } = useOutletContext();

    // --- ESTADOS LOCALES (Solo UI) ---
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    // NOTA: Borramos const [currentDate, setCurrentDate]... ya no hace falta.

    // --- FILTRO Y ORDENAMIENTO (Usando selectedDate global) ---
    const displayedReservations = useMemo(() => {
        return reservations
            .filter(r => {
                const matchDate = r.date === selectedDate;
                const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
                return matchDate && matchSearch;
            })
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [reservations, selectedDate, searchTerm]);

    // --- MANEJADORES UI ---
    const handleCardClick = (id) => setSelectedId(prev => prev === id ? null : id);

    const changeDay = (days) => {
        const date = new Date(selectedDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
        // 3. ACTUALIZAMOS EL CONTEXTO GLOBAL
        setSelectedDate(date.toISOString().split('T')[0]);
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

    const handleEdit = (res) => {
        openModal(res);
    };

    return (
        <div className="h-full flex flex-col space-y-4 relative pb-2 overflow-hidden">

            {/* HEADER DE CONTROL */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* NAVEGACIÓN FECHAS */}
                <div className="flex items-center bg-[#0F0F10] border border-white/10 p-1 rounded-xl shadow-sm h-11 select-none">
                    <button
                        onClick={() => changeDay(-1)}
                        className="w-9 h-full rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 outline-none focus:outline-none focus:ring-0"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="w-[1px] h-4 bg-white/10 mx-1" />

                    <div
                        className="w-48 h-full rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer active:scale-95"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        <CalendarDays size={16} className="text-primary" />
                        <span className="text-sm font-bold text-white capitalize whitespace-nowrap">
                            {formatDateHeader(selectedDate)}
                        </span>
                    </div>

                    <div className="w-[1px] h-4 bg-white/10 mx-1" />

                    <button
                        onClick={() => changeDay(1)}
                        className="w-9 h-full rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 outline-none focus:outline-none focus:ring-0"
                    >
                        <ChevronRight size={18} />
                    </button>

                    <AnimatePresence>
                        {selectedDate !== getTodayString() && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                className="overflow-hidden flex items-center h-full"
                            >
                                <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />
                                <button
                                    onClick={() => setSelectedDate(getTodayString())}
                                    className="h-full px-3 rounded-lg text-primary hover:bg-primary/10 text-xs font-bold uppercase transition-colors flex items-center gap-1 whitespace-nowrap outline-none focus:outline-none focus:ring-0 active:scale-95"
                                >
                                    <History size={14} /> Hoy
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* BUSCADOR */}
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
                        onEdit={handleEdit}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60 min-h-[400px]">
                        <CalendarDays size={48} strokeWidth={1} className="mb-4 text-slate-600" />
                        <p className="text-lg font-medium text-slate-400">Día libre</p>
                        <p className="text-sm">Sin reservas para el <span className="capitalize">{formatDateHeader(selectedDate)}</span></p>
                    </div>
                )}
            </div>

            {/* CALENDARIO MODAL (Sincronizado con Global) */}
            <CustomCalendar
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                themeColor={theme.color}
            />
        </div>
    );
};

export default ReservationsPage;