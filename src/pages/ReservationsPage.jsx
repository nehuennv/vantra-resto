import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, History, CalendarDays } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
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

    const {
        reservations,
        updateReservation,
        deleteReservation,
        selectedDate,
        setSelectedDate
    } = useReservations();

    const { openModal } = useOutletContext();

    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const displayedReservations = useMemo(() => {
        return reservations
            .filter(r => {
                const matchDate = r.date === selectedDate;
                const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
                return matchDate && matchSearch;
            })
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [reservations, selectedDate, searchTerm]);

    const handleCardClick = (id) => setSelectedId(prev => prev === id ? null : id);

    const changeDay = (days) => {
        const date = new Date(selectedDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
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
            {/* AQUÍ ESTÁ EL CAMBIO DE CONTRASTE: */}
            {/* Usamos un contenedor visual para agrupar los controles si quisieras, 
                pero aquí vamos a diferenciar los inputs del fondo. */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* NAVEGACIÓN FECHAS */}
                {/* CAPA 1: bg-muted/40 -> Un tono sutilmente distinto al fondo para agrupar controles */}
                <div className="flex items-center bg-muted/50 border border-border/60 p-1 rounded-xl shadow-sm h-11 select-none transition-colors duration-300 backdrop-blur-sm">
                    <button
                        onClick={() => changeDay(-1)}
                        // CAPA 2 (Interacción): Al hacer hover, usamos bg-background (blanco/negro puro) para crear "relieve"
                        className="w-9 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all active:scale-95 outline-none focus:outline-none focus:ring-0"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Separador */}
                    <div className="w-[1px] h-4 bg-border mx-1 opacity-50" />

                    <div
                        className="w-48 h-full rounded-lg flex items-center justify-center gap-2 hover:bg-background hover:shadow-sm transition-all cursor-pointer active:scale-95 group border border-transparent hover:border-border/50"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        <CalendarDays size={16} className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-foreground capitalize whitespace-nowrap">
                            {formatDateHeader(selectedDate)}
                        </span>
                    </div>

                    <div className="w-[1px] h-4 bg-border mx-1 opacity-50" />

                    <button
                        onClick={() => changeDay(1)}
                        className="w-9 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all active:scale-95 outline-none focus:outline-none focus:ring-0"
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
                                <div className="w-[1px] h-4 bg-border mx-1 shrink-0 opacity-50" />
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
                    <div className="relative flex-1 md:w-64 h-full group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                            <Search size={16} className="text-muted-foreground" />
                        </div>
                        {/* CAPA DIFERENCIADA: bg-background (más claro/oscuro que el muted de alrededor) */}
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Aquí usamos bg-background para que contraste contra un posible fondo gris, y shadow-sm para elevarlo
                            className="w-full h-full bg-background border border-border/80 rounded-xl pl-9 pr-3 text-sm text-foreground focus:border-primary outline-none transition-all shadow-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                </div>
            </div>

            {/* LISTA DE RESERVAS */}
            {/* CAPA PRINCIPAL (Card): bg-card para máxima legibilidad, diferente del fondo base */}
            <div className="flex-1 min-h-0 bg-card border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden transition-colors duration-300">

                {/* Un gradiente sutil en el top para dar sensación de profundidad interna */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background/5 to-transparent pointer-events-none z-10" />

                {/* Glow decorativo (Mantenido pero sutil) */}
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
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60 min-h-[400px]">
                        {/* Círculo de fondo para el icono de estado vacío */}
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                            <CalendarDays size={40} strokeWidth={1} className="text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium text-foreground">Día libre</p>
                        <p className="text-sm">Sin reservas para el <span className="capitalize text-foreground font-semibold">{formatDateHeader(selectedDate)}</span></p>
                    </div>
                )}
            </div>

            {/* CALENDARIO MODAL */}
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