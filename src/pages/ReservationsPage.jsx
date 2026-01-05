import React, { useState, useMemo, memo, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import {
    Search, ChevronLeft, ChevronRight, History, CalendarDays,
    Layers, Clock, CheckCircle2, Zap, LogOut,
    LayoutList, Kanban, FilterX, SlidersHorizontal, Check
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useReservations } from "../context/ReservationsContext";
import { cn } from "../lib/utils";
import AnimatedSwitch from "@/components/ui/AnimatedSwitch";

import ReservationListView from '../components/reservations/ReservationListView';
import ReservationKanbanView from '../components/reservations/ReservationKanbanView';
import CustomCalendar from '../components/ui/CustomCalendar';
import { ScrollArea } from "@/components/ui/scroll-area";

// --- UTILIDADES ---
const getTodayString = () => new Date().toISOString().split('T')[0];

const formatDateHeader = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    const dayName = date.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '');
    const dayNum = date.getDate();
    const monthName = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return `${capitalize(dayName)} ${dayNum} ${capitalize(monthName)} ${year}`;
};

// --- COMPONENTES UI (LOCALS) ---

// --- COMPONENTES UI (LOCALS) ---

const SectionSeparator = memo(({ label }) => (
    <div className="flex items-center gap-3 w-full py-2 opacity-60">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
            {label}
        </span>
        <div className="h-px bg-border flex-1" />
    </div>
));

const StatusFilterItem = memo(({ filter, isSelected, count, onClick }) => (
    <button
        onClick={() => onClick(filter.id)}
        className={cn(
            "group flex items-center justify-between w-full p-2 rounded-xl transition-all duration-200 border mb-1.5",
            isSelected
                ? "bg-primary/5 border-primary/20 shadow-sm"
                : "bg-transparent border-transparent hover:bg-muted/50 hover:border-border/50"
        )}
    >
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-300",
                isSelected
                    ? "bg-primary border-primary text-primary-foreground scale-110"
                    : "bg-background border-border text-transparent group-hover:border-primary/50"
            )}>
                <motion.div initial={false} animate={{ scale: isSelected ? 1 : 0 }}>
                    <Check size={10} strokeWidth={3} />
                </motion.div>
            </div>

            <div className="flex items-center gap-2">
                <div className={cn(
                    "p-1 rounded-md transition-colors",
                    isSelected ? filter.color.replace('bg-', 'bg-opacity-20 bg-') + " " + filter.color.replace('bg-', 'text-') : "text-muted-foreground bg-muted"
                )}>
                    <filter.icon size={12} />
                </div>
                <span className={cn(
                    "text-xs font-bold transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                    {filter.label}
                </span>
            </div>
        </div>

        <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all",
            isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
            {count}
        </span>
    </button>
));

// --- COMPONENTE PRINCIPAL ---

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
    // Estado de vista persistente
    const [currentView, setCurrentView] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('reservations-view-preference') || 'list';
        }
        return 'list';
    });

    // Guardar preferencia de vista
    useEffect(() => {
        localStorage.setItem('reservations-view-preference', currentView);
    }, [currentView]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // --- LÓGICA DE DATOS ---

    // 1. Filtrado Base (Fecha, Busqueda) - Común para ambas vistas
    const baseReservations = useMemo(() => {
        return reservations.filter(r => {
            const matchDate = r.date === selectedDate;
            const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchDate && matchSearch;
        }).sort((a, b) => a.time.localeCompare(b.time));
    }, [reservations, selectedDate, searchTerm]);

    // 2. Status Counts (Basado en Base, para que los números reflejen la búsqueda)
    const statusCounts = useMemo(() => {
        const counts = { all: baseReservations.length, pending: 0, confirmed: 0, seated: 0, finished: 0 };
        baseReservations.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
        return counts;
    }, [baseReservations]);

    // 3. Final Display Reservations
    // -- En Kanban: Usamos baseReservations (el componente clasifica)
    // -- En Lista: Filtramos también por statusFilter
    const listViewReservations = useMemo(() => {
        return baseReservations.filter(r => statusFilter === 'all' || r.status === statusFilter);
    }, [baseReservations, statusFilter]);

    // Validar si la lista está vacía para Empty States
    const isEmpty = currentView === 'list' ? listViewReservations.length === 0 : baseReservations.length === 0;

    // Handlers
    const changeDay = (days) => {
        const date = new Date(selectedDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    // Configuración Filtros Status
    const filters = useMemo(() => [
        { id: 'all', label: 'Todas', icon: Layers, color: "bg-foreground" },
        { id: 'pending', label: 'Pendientes', icon: Clock, color: "bg-amber-500" },
        { id: 'confirmed', label: 'Confirmadas', icon: CheckCircle2, color: "bg-indigo-600" },
        { id: 'seated', label: 'En Mesa', icon: Zap, color: "bg-emerald-500" },
        { id: 'finished', label: 'Finalizadas', icon: LogOut, color: "bg-slate-500" },
    ], []);


    return (
        <div className="h-full flex flex-col gap-4 relative pb-2 overflow-hidden">

            {/* --- 1. HEADER GLOBAL (Sticky/Fijo) --- */}
            <header className="shrink-0 z-30 flex flex-col gap-4 bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-4 shadow-xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

                    {/* A. Título & Fecha */}
                    <div className="flex items-center gap-4 w-full lg:w-auto">

                        {/* Date Navigator (Full Width on Mobile) */}
                        <div className="flex items-center bg-background/60 border border-border/60 p-1 rounded-xl shadow-sm h-10 backdrop-blur-md flex-1 lg:flex-none max-w-md w-full lg:w-auto">
                            <button onClick={() => changeDay(-1)} className="w-8 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95">
                                <ChevronLeft size={16} />
                            </button>

                            <div
                                className="flex-1 px-3 h-full mx-0.5 rounded-lg flex items-center justify-center gap-2 hover:bg-background/50 transition-all cursor-pointer active:scale-95 group"
                                onClick={() => setIsCalendarOpen(true)}
                            >
                                <CalendarDays size={14} className="text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold text-foreground whitespace-nowrap">
                                    {formatDateHeader(selectedDate)}
                                </span>
                            </div>

                            <button onClick={() => changeDay(1)} className="w-8 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all active:scale-95">
                                <ChevronRight size={16} />
                            </button>

                            <AnimatePresence>
                                {selectedDate !== getTodayString() && (
                                    <motion.button
                                        initial={{ width: 0, opacity: 0, scale: 0.8 }}
                                        animate={{ width: "auto", opacity: 1, scale: 1 }}
                                        exit={{ width: 0, opacity: 0, scale: 0.8 }}
                                        onClick={() => setSelectedDate(getTodayString())}
                                        className="h-8 w-8 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors mx-1"
                                        title="Volver a Hoy"
                                    >
                                        <History size={16} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* B. Search & View Switcher */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                <Search size={14} className="text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 bg-background/40 hover:bg-background/60 focus:bg-background/90 border border-border/60 rounded-xl pl-9 pr-8 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                >
                                    <FilterX size={12} />
                                </button>
                            )}
                        </div>

                        <div className="w-px h-8 bg-border/60 hidden lg:block" />

                        <AnimatedSwitch
                            value={currentView}
                            onChange={setCurrentView}
                            options={[
                                { value: 'list', label: 'Lista', icon: LayoutList },
                                { value: 'kanban', label: 'Tablero', icon: Kanban },
                            ]}
                            className="h-10 w-full sm:w-auto"
                        />
                    </div>
                </div>
            </header>

            {/* --- 2. CONTENIDO ADAPTATIVO --- */}
            {currentView === 'list' ? (
                // --- VISTA LISTA: Main + Sidebar Layout ---
                <div className="flex-1 flex overflow-hidden gap-4">

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border border-border/60 rounded-3xl shadow-sm relative overflow-hidden">
                        {/* Header Decorativo */}
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />

                        <ScrollArea className="flex-1 h-full">
                            <div className="px-2 lg:px-4 min-h-full">
                                <AnimatePresence mode='popLayout'>
                                    {!isEmpty ? (
                                        <motion.div
                                            key="list-view"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="min-h-full"
                                        >
                                            <ReservationListView
                                                reservations={listViewReservations}
                                                selectedId={selectedId}
                                                onSelect={(id) => setSelectedId(prev => prev === id ? null : id)}
                                                onUpdate={updateReservation}
                                                onDelete={deleteReservation}
                                                onEdit={openModal}
                                            />
                                        </motion.div>
                                    ) : (
                                        <EmptyState onClear={() => { setStatusFilter('all'); setSearchTerm(''); }} />
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </main>

                    {/* SIDEBAR (Filtros Status) */}
                    <aside className="w-[280px] shrink-0 flex flex-col gap-4 h-full bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-5 shadow-xl overflow-hidden">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <SlidersHorizontal size={16} className="text-primary" />
                            <span>Filtros Activos</span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pr-1">
                            {/* Status Section Only */}
                            <div>
                                <SectionSeparator label="Estado" />
                                <div className="space-y-1">
                                    {filters.map((f) => (
                                        <StatusFilterItem
                                            key={f.id}
                                            filter={f}
                                            isSelected={statusFilter === f.id}
                                            count={statusCounts[f.id] || 0}
                                            onClick={setStatusFilter}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            ) : (
                // --- VISTA KANBAN: Full Width Layout (Sin filtros extra) ---
                <div className="flex-1 flex flex-col overflow-hidden gap-4">
                    <main className="flex-1 bg-card/50 backdrop-blur-sm border border-border/60 rounded-3xl shadow-sm relative overflow-hidden">
                        <AnimatePresence mode='popLayout'>
                            {!isEmpty ? (
                                <motion.div
                                    key="kanban-view"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full"
                                >
                                    <ReservationKanbanView
                                        reservations={baseReservations}
                                        selectedId={selectedId}
                                        onSelect={(id) => setSelectedId(prev => prev === id ? null : id)}
                                        onUpdate={updateReservation}
                                        onDelete={deleteReservation}
                                        onEdit={openModal}
                                    />
                                </motion.div>
                            ) : (
                                <EmptyState onClear={() => { setSearchTerm(''); }} />
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            )}

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

// Componente Empty State Reutilizable (Professional & Polished)
const EmptyState = ({ onClear }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-8 select-none"
    >
        {/* Decorative Background Blob & Icon */}
        <div className="relative mb-6 group cursor-default">
            {/* Pulsing Aura - Subtle and slow */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"
            />

            {/* Glass Container */}
            <div className="relative w-28 h-28 bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2rem] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500 ease-out group-hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] opacity-50 pointer-events-none" />
                <Layers size={40} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
            </div>
        </div>

        {/* Text Content - Professional & Clear */}
        <div className="max-w-sm space-y-2 mb-8">
            <h3 className="text-xl font-bold text-foreground tracking-tight">
                Sin reservas encontradas
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
                No hay coincidencias para los filtros o criterios de búsqueda actuales.
            </p>
        </div>

        {/* Action Button */}
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClear}
            className="group relative px-6 py-2.5 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 overflow-hidden"
        >
            <span className="relative z-10">Limpiar filtros</span>
            <FilterX size={14} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        </motion.button>
    </motion.div>
);

export default ReservationsPage;