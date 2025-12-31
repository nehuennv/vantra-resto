import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import {
    Search, ChevronLeft, ChevronRight, History, CalendarDays,
    Layers, Clock, CheckCircle2, Zap, LogOut,
    LayoutList, StretchHorizontal, ChevronDown, Check
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
    const [currentView, setCurrentView] = useState('list');
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

    const filters = [
        { id: 'all', label: 'Todas las reservas', icon: Layers, color: "bg-foreground", text: "text-background" },
        { id: 'pending', label: 'Pendientes', icon: Clock, color: "bg-amber-500", text: "text-white" },
        { id: 'confirmed', label: 'Confirmadas', icon: CheckCircle2, color: "bg-indigo-600", text: "text-white" },
        { id: 'seated', label: 'En Mesa', icon: Zap, color: "bg-emerald-500", text: "text-white" },
        { id: 'finished', label: 'Finalizadas', icon: LogOut, color: "bg-slate-500", text: "text-white" },
    ];

    const views = [
        { id: 'list', label: 'Lista', icon: LayoutList },
        { id: 'timeline', label: 'Timeline', icon: StretchHorizontal },
    ];

    // Subcomponente de Separador (Solo visible en desktop)
    const SectionSeparator = ({ label }) => (
        <div className="hidden lg:flex items-center gap-3 w-full py-1 opacity-60">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                {label}
            </span>
            <div className="h-px bg-border flex-1" />
        </div>
    );

    return (
        <div className="h-full flex flex-col lg:flex-row gap-4 relative pb-2 overflow-hidden stable-gutter">

            {/* --- ISLA DE CONTROLES (DERECHA) ---
               Clave: `lg:order-last` mueve este bloque a la derecha en monitores.
               En móviles, al no tener order, respeta el flujo natural (arriba).
            */}
            <aside className={cn(
                "shrink-0 flex flex-col gap-3 transition-all duration-300 z-20",
                "lg:order-last", // <--- AQUÍ ESTÁ LA MAGIA DEL CAMBIO DE LADO
                // Mobile
                "w-full px-1",
                // Desktop
                "lg:w-[280px] lg:h-full lg:px-0 lg:gap-5",
                "lg:bg-card/60 lg:backdrop-blur-xl lg:border lg:border-border/60 lg:rounded-3xl lg:p-5 lg:shadow-xl lg:overflow-y-auto lg:custom-scrollbar"
            )}>

                {/* --- SECCIÓN 1: TIEMPO Y BÚSQUEDA --- */}
                <SectionSeparator label="Gestión" />

                <div className="flex flex-col md:flex-row lg:flex-col gap-3">
                    {/* Date Navigation */}
                    <div className="flex items-center bg-muted/40 lg:bg-background/50 border border-border/60 p-1 rounded-xl shadow-sm h-11 select-none backdrop-blur-sm w-full transition-colors hover:bg-muted/60">
                        <button onClick={() => changeDay(-1)} className="w-9 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all active:scale-95">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="w-[1px] h-4 bg-border/50 mx-1" />
                        <div
                            className="flex-1 h-full rounded-lg flex items-center justify-center gap-2 hover:bg-background transition-all cursor-pointer active:scale-95 px-2 overflow-hidden"
                            onClick={() => setIsCalendarOpen(true)}
                        >
                            <CalendarDays size={16} className="text-primary shrink-0" />
                            <span className="text-sm font-bold text-foreground capitalize whitespace-nowrap truncate">
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

                    {/* Search Input */}
                    <div className="relative h-11 w-full md:w-64 lg:w-full group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                            <Search size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar reserva..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-full bg-background/50 lg:bg-background/80 border border-border/80 rounded-xl pl-9 pr-3 text-sm text-foreground focus:border-primary outline-none transition-all shadow-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                </div>

                {/* --- SECCIÓN 2: ESTADO (CHECKBOXES EN DESKTOP) --- */}
                <div className="mt-2 lg:mt-0">
                    <SectionSeparator label="Filtrar Estado" />

                    {/* VERSIÓN MOBILE: DROPDOWN COMPACTO */}
                    <div className="lg:hidden relative z-20 w-full mb-3">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-between w-full h-11 px-3 bg-muted/40 border border-border/60 rounded-xl shadow-sm backdrop-blur-sm hover:bg-muted/60 transition-all outline-none"
                        >
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const active = filters.find(f => f.id === statusFilter) || filters[0];
                                    return (
                                        <>
                                            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shadow-sm", active.color)}>
                                                <active.icon size={14} className={active.text} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-sm font-bold text-foreground">{active.label}</span>
                                        </>
                                    );
                                })()}
                            </div>
                            <ChevronDown size={18} className={cn("text-muted-foreground transition-transform", isFilterOpen && "rotate-180")} />
                        </button>
                        {/* Dropdown menu mobile omitted for brevity, logic exists in previous version if needed, keeping it simpler here or reusing logic */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-2 w-full bg-card border border-border shadow-xl rounded-xl p-1 z-50"
                                >
                                    {filters.map(f => (
                                        <button key={f.id} onClick={() => { setStatusFilter(f.id); setIsFilterOpen(false) }} className="flex items-center w-full p-3 hover:bg-muted rounded-lg gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", f.id === statusFilter ? f.color : "bg-muted-foreground")} />
                                            <span className="text-sm font-medium">{f.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* VERSIÓN DESKTOP: LISTA DE CHECKBOXES "PRETTY" */}
                    <div className="hidden lg:flex flex-col gap-1.5">
                        {filters.map((f) => {
                            const isSelected = statusFilter === f.id;
                            const count = statusCounts[f.id] || 0;

                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setStatusFilter(f.id)}
                                    className={cn(
                                        "group flex items-center justify-between w-full p-2.5 rounded-xl transition-all duration-200 border",
                                        isSelected
                                            ? "bg-primary/5 border-primary/20 shadow-sm"
                                            : "bg-transparent border-transparent hover:bg-muted/50 hover:border-border/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Custom Checkbox UI */}
                                        <div className={cn(
                                            "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300",
                                            isSelected
                                                ? "bg-primary border-primary text-primary-foreground scale-110"
                                                : "bg-background border-border text-transparent group-hover:border-primary/50"
                                        )}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "p-1.5 rounded-md transition-colors",
                                                isSelected ? f.color.replace('bg-', 'bg-opacity-20 bg-') + " " + f.color.replace('bg-', 'text-') : "text-muted-foreground bg-muted"
                                            )}>
                                                <f.icon size={14} />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-bold transition-colors",
                                                isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                            )}>
                                                {f.label}
                                            </span>
                                        </div>
                                    </div>

                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full transition-all",
                                        isSelected
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* --- SECCIÓN 3: VISTAS --- */}
                <div className="mt-2 lg:mt-auto">
                    <SectionSeparator label="Visualización" />
                    <div className="grid grid-cols-2 bg-muted/50 lg:bg-background/50 p-1 rounded-xl border border-border/60 relative h-11 shadow-sm items-center w-full backdrop-blur-sm">
                        {views.map((v) => {
                            const isActive = currentView === v.id;
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => setCurrentView(v.id)}
                                    className={cn(
                                        "relative flex items-center justify-center gap-2 h-full rounded-lg text-sm font-bold transition-all duration-200 outline-none select-none z-10",
                                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div layoutId="activeViewTab" className="absolute inset-0 bg-background lg:bg-white/10 border border-black/5 rounded-lg shadow-sm lg:shadow-none z-[-1]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                    )}
                                    <v.icon size={14} className={cn("transition-all", isActive && "text-primary")} />
                                    {v.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </aside>

            {/* --- ÁREA PRINCIPAL (LISTADO) --- */}
            <div className="flex-1 min-h-0 bg-card border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background/5 to-transparent pointer-events-none z-10" />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60 min-h-[400px]">
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