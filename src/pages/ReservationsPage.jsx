import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import {
    Search, ChevronLeft, ChevronRight, History, CalendarDays,
    Layers, Clock, CheckCircle2, Zap, LogOut,
    LayoutList, StretchHorizontal, ChevronDown
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useReservations } from "../context/ReservationsContext";
import { cn } from "../lib/utils";

import ReservationListView from '../components/reservations/ReservationListView';
import CustomCalendar from '../components/ui/CustomCalendar';

const getTodayString = () => new Date().toISOString().split('T')[0];

const formatDateHeader = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-AR', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
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
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentView, setCurrentView] = useState('list'); // 'list' o 'timeline'
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- LOGICA DATOS ---
    const statusCounts = useMemo(() => {
        const dateReservations = reservations.filter(r => r.date === selectedDate);
        const counts = { all: dateReservations.length, pending: 0, confirmed: 0, seated: 0, finished: 0 };
        dateReservations.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
        return counts;
    }, [reservations, selectedDate]);

    const displayedReservations = useMemo(() => {
        return reservations
            .filter(r => {
                const matchDate = r.date === selectedDate;
                const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchStatus = statusFilter === 'all' || r.status === statusFilter;
                return matchDate && matchSearch && matchStatus;
            })
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [reservations, selectedDate, searchTerm, statusFilter]);

    const changeDay = (days) => {
        const date = new Date(selectedDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    // Filtros de Estado con Expansión
    const filters = [
        { id: 'all', label: 'Todo', icon: Layers, color: "bg-foreground", text: "text-background" },
        { id: 'pending', label: 'Pendiente', icon: Clock, color: "bg-amber-500", text: "text-white" },
        { id: 'confirmed', label: 'Confirmado', icon: CheckCircle2, color: "bg-indigo-600", text: "text-white" },
        { id: 'seated', label: 'En Mesa', icon: Zap, color: "bg-emerald-500", text: "text-white" },
        { id: 'finished', label: 'Cerrado', icon: LogOut, color: "bg-slate-500", text: "text-white" },
    ];

    // Vistas con Expansión (Solo Lista y Timeline)
    const views = [
        { id: 'list', label: 'Lista', icon: LayoutList },
        { id: 'timeline', label: 'Timeline', icon: StretchHorizontal },
    ];

    return (
        <div className="h-full flex flex-col space-y-4 relative pb-2 overflow-hidden stable-gutter">

            {/* --- HEADER NIVEL 1: FECHA + BÚSQUEDA --- */}
            <div className="shrink-0 flex flex-col md:flex-row justify-between gap-3 px-1">
                <div className="flex items-center bg-muted/40 border border-border/60 p-1 rounded-xl shadow-sm h-11 select-none backdrop-blur-sm">
                    <button onClick={() => changeDay(-1)} className="w-9 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all active:scale-95">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="w-[1px] h-4 bg-border/50 mx-1" />
                    <div
                        className="w-[200px] h-full rounded-lg flex items-center justify-center gap-2 hover:bg-background transition-all cursor-pointer active:scale-95"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        <CalendarDays size={16} className="text-primary" />
                        <span className="text-sm font-bold text-foreground capitalize whitespace-nowrap tabular-nums">
                            {formatDateHeader(selectedDate)}
                        </span>
                    </div>
                    <div className="w-[1px] h-4 bg-border/50 mx-1" />
                    <button onClick={() => changeDay(1)} className="w-9 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all active:scale-95">
                        <ChevronRight size={18} />
                    </button>
                    <AnimatePresence>
                        {selectedDate !== getTodayString() && (
                            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden flex items-center h-full ml-1">
                                <button onClick={() => setSelectedDate(getTodayString())} className="h-full px-3 rounded-lg text-primary hover:bg-primary/10 text-xs font-bold transition-colors">
                                    <History size={16} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative h-11 w-full md:w-64 group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                        <Search size={16} className="text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar reserva..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-full bg-background border border-border/80 rounded-xl pl-9 pr-3 text-sm text-foreground focus:border-primary outline-none transition-all shadow-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/10"
                    />
                </div>
            </div>

            {/* --- HEADER NIVEL 2: FILTROS + VISTAS (AMBOS EXPANDIBLES) --- */}
            <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 px-1">

                {/* Filtros de Estado - Custom Select Estilizado */}
                <div className="relative z-20 min-w-[200px]">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center justify-between w-full h-11 px-3 bg-muted/40 border border-border/60 rounded-xl shadow-sm backdrop-blur-sm hover:bg-muted/60 transition-all duration-200 outline-none active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-2.5">
                            {(() => {
                                const active = filters.find(f => f.id === statusFilter) || filters[0];
                                return (
                                    <>
                                        <div className={cn(
                                            "w-6 h-6 rounded-md flex items-center justify-center shadow-sm transition-colors",
                                            active.color
                                        )}>
                                            <active.icon size={14} className={active.text} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Estado</span>
                                            <span className="text-sm font-bold text-foreground leading-none">{active.label}</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                        <ChevronDown
                            size={18}
                            className={cn("text-muted-foreground transition-transform duration-300", isFilterOpen && "rotate-180")}
                        />
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute top-full left-0 mt-2 w-[240px] bg-card/95 backdrop-blur-2xl border border-border shadow-2xl rounded-xl overflow-hidden p-1.5 flex flex-col gap-1 z-50 ring-1 ring-black/5"
                            >
                                {filters.map((f) => {
                                    const isSelected = statusFilter === f.id;
                                    const count = statusCounts[f.id] || 0;
                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => {
                                                setStatusFilter(f.id);
                                                setIsFilterOpen(false);
                                            }}
                                            className={cn(
                                                "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative",
                                                isSelected ? "bg-muted shadow-sm" : "hover:bg-muted/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className={cn(
                                                    "w-2 h-8 rounded-full transition-all duration-300 absolute -left-3.5",
                                                    isSelected ? f.color : "bg-transparent group-hover:bg-muted-foreground/20"
                                                )} />
                                                <f.icon
                                                    size={16}
                                                    className={cn("transition-colors", isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}
                                                    strokeWidth={isSelected ? 2.5 : 2}
                                                />
                                                <span className={cn("font-medium", isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                                                    {f.label}
                                                </span>
                                            </div>
                                            {count > 0 && (
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
                                                    isSelected ? "bg-background text-foreground shadow-sm border border-border/50" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Selector de Vistas Estilo Dashboard (Fixed Grid) */}
                <div className="grid grid-cols-2 bg-muted/50 p-1 rounded-xl border border-border/60 relative h-11 shadow-sm items-center w-[260px] backdrop-blur-sm ml-auto">
                    {views.map((v) => {
                        const isActive = currentView === v.id;
                        return (
                            <button
                                key={v.id}
                                onClick={() => setCurrentView(v.id)}
                                className={cn(
                                    "relative flex items-center justify-center gap-2 h-full rounded-lg text-sm font-bold transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none border-none ring-0 select-none appearance-none bg-transparent",
                                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                                style={{ WebkitTapHighlightColor: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeViewTab"
                                        className="absolute inset-0 bg-primary/10 rounded-lg shadow-none"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <v.icon
                                        size={14}
                                        className={cn(
                                            "transition-all duration-300",
                                            isActive && "scale-110 text-primary drop-shadow-[0_0_8px_currentColor]"
                                        )}
                                    />
                                    {v.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- ÁREA DE LISTADO --- */}
            <div className="flex-1 min-h-0 bg-card border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background/5 to-transparent pointer-events-none z-10" />

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* --- LISTADO DE RESERVACIONES --- */}
                    <AnimatePresence mode='wait'>
                        {displayedReservations.length > 0 ? (
                            <motion.div
                                key={currentView}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {currentView === 'list' ? (
                                    <ReservationListView
                                        reservations={displayedReservations}
                                        selectedId={selectedId}
                                        onSelect={(id) => setSelectedId(prev => prev === id ? null : id)}
                                        onUpdate={updateReservation}
                                        onDelete={deleteReservation}
                                        onEdit={openModal}
                                    />
                                ) : (
                                    <div className="p-20 text-center text-muted-foreground italic">
                                        [Espacio para la Vista Timeline]
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60 min-h-[400px]"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-4">
                                    <Layers size={32} strokeWidth={1.5} />
                                </div>
                                <p className="text-lg font-bold text-foreground">Sin resultados</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

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