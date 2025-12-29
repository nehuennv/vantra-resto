import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ChevronsLeft, ChevronsRight, CalendarDays, History } from "lucide-react";
import { cn } from "../../lib/utils";

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const CustomCalendar = ({ isOpen, onClose, selectedDate, onSelect, themeColor = "#10b981" }) => {

    // Sincronizar estado interno cuando se abre
    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        if (isOpen) {
            const d = new Date(selectedDate ? selectedDate + 'T00:00:00' : new Date());
            setViewDate(isNaN(d.getTime()) ? new Date() : d);
        }
    }, [isOpen, selectedDate]);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // --- CÁLCULOS MATEMÁTICOS PARA GRILLA PERFECTA (42 CELDAS) ---
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Domingo
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Siempre 42 celdas (6 semanas) para evitar que el calendario salte de altura
    const TOTAL_SLOTS = 42;
    const daysFromNextMonth = TOTAL_SLOTS - (daysInMonth + firstDayOfMonth);

    // Navegación
    const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));
    const handlePrevYear = () => setViewDate(new Date(year - 1, month, 1));
    const handleNextYear = () => setViewDate(new Date(year + 1, month, 1));

    const handleSelectDay = (day, offsetMonth = 0) => {
        const targetDate = new Date(year, month + offsetMonth, day);
        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, '0');
        const d = String(targetDate.getDate()).padStart(2, '0');
        onSelect(`${y}-${m}-${d}`);
        onClose();
    };

    const handleGoToToday = () => {
        const y = currentYear;
        const m = String(currentMonth + 1).padStart(2, '0');
        const d = String(currentDay).padStart(2, '0');
        onSelect(`${y}-${m}-${d}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

                    {/* BACKDROP (Fondo Oscuro) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* MODAL CARD */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.3 }}
                        className="bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden relative z-10 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* --- HEADER --- */}
                        <div className="px-5 py-4 border-b border-white/5 bg-[#131316] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-white" style={{ color: themeColor }}>
                                    <CalendarDays size={16} />
                                </div>
                                <span className="font-bold text-white text-sm tracking-wide">Seleccionar Fecha</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors outline-none focus:outline-none focus:ring-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* --- BODY --- */}
                        <div className="p-5">

                            {/* NAVEGACIÓN (Diseño Cápsula) */}
                            <div className="flex items-center justify-between bg-[#18181b] border border-white/5 rounded-xl p-1 mb-6 shadow-sm">
                                <div className="flex items-center">
                                    <button onClick={handlePrevYear} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors outline-none focus:outline-none focus:ring-0">
                                        <ChevronsLeft size={16} />
                                    </button>
                                    <div className="w-[1px] h-4 bg-white/5 mx-0.5" />
                                    <button onClick={handlePrevMonth} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors outline-none focus:outline-none focus:ring-0">
                                        <ChevronLeft size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center px-2 cursor-default min-w-[100px]">
                                    <span className="text-sm font-bold text-white capitalize leading-none mb-0.5">
                                        {MONTHS[month]}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 font-mono leading-none">
                                        {year}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <button onClick={handleNextMonth} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors outline-none focus:outline-none focus:ring-0">
                                        <ChevronRight size={16} />
                                    </button>
                                    <div className="w-[1px] h-4 bg-white/5 mx-0.5" />
                                    <button onClick={handleNextYear} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors outline-none focus:outline-none focus:ring-0">
                                        <ChevronsRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* DÍAS SEMANA */}
                            <div className="grid grid-cols-7 mb-2">
                                {DAYS.map(day => (
                                    <div key={day} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* GRILLA DÍAS (42 Celdas Fijas) */}
                            <div className="grid grid-cols-7 gap-1">

                                {/* 1. Días del Mes ANTERIOR (Opacidad baja) */}
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => {
                                    const day = daysInPrevMonth - firstDayOfMonth + i + 1;
                                    return (
                                        <button
                                            key={`prev-${day}`}
                                            onClick={() => handleSelectDay(day, -1)}
                                            className="h-9 w-full rounded-lg flex items-center justify-center text-xs font-medium text-slate-700 hover:text-slate-400 hover:bg-white/[0.02] transition-colors outline-none focus:outline-none focus:ring-0"
                                        >
                                            {day}
                                        </button>
                                    );
                                })}

                                {/* 2. Días del Mes ACTUAL */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const isSelected =
                                        day === parseInt(selectedDate.split('-')[2]) &&
                                        month === parseInt(selectedDate.split('-')[1]) - 1 &&
                                        year === parseInt(selectedDate.split('-')[0]);

                                    const isToday = day === currentDay && month === currentMonth && year === currentYear;

                                    return (
                                        <button
                                            key={`curr-${day}`}
                                            onClick={() => handleSelectDay(day, 0)}
                                            className={cn(
                                                "h-9 w-full rounded-lg flex items-center justify-center text-xs font-bold transition-all relative outline-none focus:outline-none focus:ring-0",
                                                isSelected
                                                    ? "text-white shadow-md z-10 scale-105"
                                                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                                                !isSelected && isToday && "bg-white/[0.03] border border-white/10 text-white"
                                            )}
                                            style={{ backgroundColor: isSelected ? themeColor : undefined }}
                                        >
                                            {day}
                                            {isToday && !isSelected && (
                                                <div
                                                    className="absolute bottom-1 w-0.5 h-0.5 rounded-full"
                                                    style={{ backgroundColor: themeColor }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}

                                {/* 3. Días del Mes SIGUIENTE (Relleno para completar grilla) */}
                                {Array.from({ length: daysFromNextMonth }).map((_, i) => {
                                    const day = i + 1;
                                    return (
                                        <button
                                            key={`next-${day}`}
                                            onClick={() => handleSelectDay(day, 1)}
                                            className="h-9 w-full rounded-lg flex items-center justify-center text-xs font-medium text-slate-700 hover:text-slate-400 hover:bg-white/[0.02] transition-colors outline-none focus:outline-none focus:ring-0"
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* FOOTER */}
                            <button
                                onClick={handleGoToToday}
                                className="w-full mt-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-all group active:scale-95 outline-none focus:outline-none focus:ring-0"
                            >
                                <History size={14} className="text-slate-500 group-hover:text-primary transition-colors" style={{ color: 'inherit' }} />
                                <span className="group-hover:translate-x-0.5 transition-transform">
                                    Ir a Hoy ({currentDay} de {MONTHS[currentMonth]})
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CustomCalendar;