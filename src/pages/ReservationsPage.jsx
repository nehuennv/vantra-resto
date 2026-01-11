import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { FilterX, Layers } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useReservations } from "../context/ReservationsContext";

import ReservationListView from '../components/reservations/ReservationListView';
import ReservationKanbanView from '../components/reservations/ReservationKanbanView';
import ReservationsHeader from '../components/reservations/ReservationsHeader';
import ReservationsFilterSidebar from '../components/reservations/ReservationsFilterSidebar';
import CustomCalendar from '../components/ui/CustomCalendar';
import { ScrollArea } from "@/components/ui/scroll-area";

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
    // NEW: Mobile Filters State
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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

    return (
        <div className="h-full flex flex-col gap-4 relative pb-2 overflow-hidden">

            {/* --- 1. HEADER GLOBAL --- */}
            <ReservationsHeader
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentView={currentView}
                setCurrentView={setCurrentView}
                setIsCalendarOpen={setIsCalendarOpen}
                onToggleFilters={() => setShowMobileFilters(!showMobileFilters)}
            />

            {/* --- 2. CONTENIDO ADAPTATIVO --- */}
            {currentView === 'list' ? (
                // --- VISTA LISTA: Main + Sidebar Layout ---
                <div className="flex-1 flex overflow-hidden gap-4 relative">

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col bg-card/60 backdrop-blur-md border border-border/80 rounded-3xl shadow-sm relative overflow-hidden transition-all duration-300">
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

                    {/* SIDEBAR (Responsive Logic) */}
                    {/* Desktop: Always Visible. Mobile: Absolute Overlay if Open */}
                    <AnimatePresence>
                        {(showMobileFilters || window.innerWidth >= 1024) && (
                            <div className={`
                                absolute inset-y-0 right-0 z-20 w-[280px] h-full shadow-2xl transition-transform duration-300 ease-in-out lg:relative lg:block lg:shadow-none lg:translate-x-0
                                ${showMobileFilters ? 'translate-x-0' : 'translate-x-[110%] lg:translate-x-0'}
                            `}>
                                <div className="h-full relative z-30">
                                    <ReservationsFilterSidebar
                                        statusFilter={statusFilter}
                                        setStatusFilter={(filter) => {
                                            setStatusFilter(filter);
                                            setShowMobileFilters(false); // Close on selection (mobile UX)
                                        }}
                                        statusCounts={statusCounts}
                                    />
                                    {/* Mobile Close Button (Implicit by background click below) */}
                                </div>
                                {/* Mobile Overlay Backdrop */}
                                {showMobileFilters && (
                                    <div
                                        onClick={() => setShowMobileFilters(false)}
                                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden cursor-pointer"
                                    />
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                    {/* Hacky fix for layout shift: Keep space if hidden? No, we want main to expand. */}
                    {/* The main flex-1 takes space automatically. */}
                </div>
            ) : (
                // --- VISTA KANBAN: Full Width Layout (Sin filtros extra) ---
                <div className="flex-1 flex flex-col overflow-hidden gap-4">
                    <main className="flex-1 bg-card/60 backdrop-blur-md border border-border/80 rounded-3xl shadow-sm relative overflow-hidden">
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