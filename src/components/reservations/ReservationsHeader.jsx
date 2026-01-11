import React, { memo } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import {
    Search, ChevronLeft, ChevronRight, History, CalendarDays,
    FilterX, LayoutList, Kanban, SlidersHorizontal
} from "lucide-react";
import AnimatedSwitch from "@/components/ui/AnimatedSwitch";
import { getTodayLocalString, formatDateForDisplay, addDaysToDate } from "../../lib/dateUtils";

const ReservationsHeader = memo(({
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    currentView,
    setCurrentView,
    setIsCalendarOpen,
    onToggleFilters // New Prop for Mobile
}) => {

    const changeDay = (days) => {
        setSelectedDate(prev => addDaysToDate(prev, days));
    };

    return (
        <header className="shrink-0 z-30 flex flex-col gap-4 bg-background/40 backdrop-blur-xl backdrop-saturate-150 border border-border/60 rounded-3xl p-3 sm:p-4 shadow-sm">
            {/* Top Row: Navigation & Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">

                {/* A. Título & Fecha (Always Full on Mobile, Auto on Desktop) */}
                <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto">

                    {/* Left: Mobile Filter Toggle (Visible only < lg and ListView) */}
                    {currentView === 'list' && (
                        <button
                            onClick={onToggleFilters}
                            className="lg:hidden h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-background/50 border border-border/80 text-muted-foreground hover:text-primary active:scale-95 transition-all"
                        >
                            <SlidersHorizontal size={18} />
                        </button>
                    )}

                    {/* Date Navigator */}
                    <div className="flex items-center bg-background/40 border border-border/60 p-1 rounded-xl shadow-sm h-10 backdrop-blur-md flex-1 md:flex-none w-full md:min-w-[280px]">
                        <button onClick={() => changeDay(-1)} className="w-8 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/60 transition-all active:scale-95">
                            <ChevronLeft size={16} />
                        </button>

                        <div
                            className="flex-1 px-3 h-full mx-0.5 rounded-lg flex items-center justify-center gap-2 hover:bg-background/40 transition-all cursor-pointer active:scale-95 group"
                            onClick={() => setIsCalendarOpen(true)}
                        >
                            <CalendarDays size={14} className="text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-foreground whitespace-nowrap truncate">
                                {formatDateForDisplay(selectedDate)}
                            </span>
                        </div>

                        <button onClick={() => changeDay(1)} className="w-8 h-full rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/60 transition-all active:scale-95">
                            <ChevronRight size={16} />
                        </button>

                        <AnimatePresence>
                            {selectedDate !== getTodayLocalString() && (
                                <motion.button
                                    initial={{ width: 0, opacity: 0, scale: 0.8 }}
                                    animate={{ width: "auto", opacity: 1, scale: 1 }}
                                    exit={{ width: 0, opacity: 0, scale: 0.8 }}
                                    onClick={() => setSelectedDate(getTodayLocalString())}
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
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

                    {/* Search Bar */}
                    <div className="relative flex-1 w-full sm:w-auto md:w-64 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                            <Search size={14} className="text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 bg-background/50 hover:bg-background/70 focus:bg-background/90 border border-border/60 rounded-xl pl-9 pr-8 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
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

                    <div className="hidden md:block w-px h-8 bg-border/40" />

                    {/* View Switcher - Full width on very small screens */}
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
    );
});

export default ReservationsHeader;
