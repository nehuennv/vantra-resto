import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "../../lib/utils";

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const CustomCalendar = ({ isOpen, onClose, selectedDate, onSelect, themeColor }) => {
    if (!isOpen) return null;

    // Inicializar con la fecha seleccionada o con HOY si falla
    const [viewDate, setViewDate] = useState(() => {
        const d = new Date(selectedDate ? selectedDate + 'T00:00:00' : new Date());
        return isNaN(d.getTime()) ? new Date() : d;
    });

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Matemáticas del calendario
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // --- NAVEGACIÓN ---
    const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));
    const handlePrevYear = () => setViewDate(new Date(year - 1, month, 1)); // <--- SALTO DE AÑO
    const handleNextYear = () => setViewDate(new Date(year + 1, month, 1)); // <--- SALTO DE AÑO

    const handleSelectDay = (day) => {
        // Construir string YYYY-MM-DD manualmente para evitar líos de Timezone
        const y = year;
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');

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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#18181b] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-sm relative"
            >
                {/* Botón cerrar */}
                <button
                    type="button" // <--- IMPORTANTE: Evita reload
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Header: Navegación */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={handlePrevYear} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors" title="Año Anterior">
                            <ChevronsLeft size={18} />
                        </button>
                        <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Mes Anterior">
                            <ChevronLeft size={18} />
                        </button>
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white capitalize tracking-wide leading-none">
                            {MONTHS[month]}
                        </h3>
                        <span className="text-xs font-bold text-slate-500 font-mono mt-1 block cursor-pointer hover:text-primary transition-colors">
                            {year}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Mes Siguiente">
                            <ChevronRight size={18} />
                        </button>
                        <button type="button" onClick={handleNextYear} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors" title="Año Siguiente">
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Días Semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-[10px] uppercase font-bold text-slate-500 py-2 tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grilla Días */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Espacios vacíos */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {/* Días Reales */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;

                        // ¿Es el día seleccionado?
                        const isSelected =
                            day === parseInt(selectedDate.split('-')[2]) &&
                            month === parseInt(selectedDate.split('-')[1]) - 1 &&
                            year === parseInt(selectedDate.split('-')[0]);

                        // ¿Es HOY?
                        const isToday = day === currentDay && month === currentMonth && year === currentYear;

                        return (
                            <button
                                key={day}
                                type="button" // <--- CRÍTICO
                                onClick={() => handleSelectDay(day)}
                                className={cn(
                                    "h-10 w-10 rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all relative group",
                                    isSelected
                                        ? "text-white shadow-lg scale-105 z-10"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white",
                                    // Borde para HOY si no está seleccionado
                                    !isSelected && isToday && "border border-dashed"
                                )}
                                style={{
                                    backgroundColor: isSelected ? themeColor : 'transparent',
                                    borderColor: !isSelected && isToday ? themeColor : 'transparent'
                                }}
                            >
                                {day}
                                {/* Puntito indicador para HOY */}
                                {isToday && !isSelected && (
                                    <div
                                        className="absolute bottom-1 w-1 h-1 rounded-full opacity-80"
                                        style={{ backgroundColor: themeColor }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer: Volver a Hoy */}
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                    <button
                        type="button"
                        onClick={handleGoToToday}
                        className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
                    >
                        Hoy es {currentDay} de {MONTHS[currentMonth]}
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default CustomCalendar;