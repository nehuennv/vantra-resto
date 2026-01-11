import React, { useMemo, memo } from 'react';
import { motion } from "framer-motion";
import {
    SlidersHorizontal, Layers, Clock, CheckCircle2, Zap, LogOut, Check
} from "lucide-react";
import { cn } from "../../lib/utils";

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

const ReservationsFilterSidebar = memo(({
    statusFilter,
    setStatusFilter,
    statusCounts
}) => {

    // Configuración Filtros Status
    const filters = useMemo(() => [
        { id: 'all', label: 'Todas', icon: Layers, color: "bg-foreground" },
        { id: 'pending', label: 'Pendientes', icon: Clock, color: "bg-amber-500" },
        { id: 'confirmed', label: 'Confirmadas', icon: CheckCircle2, color: "bg-indigo-600" },
        { id: 'seated', label: 'En Mesa', icon: Zap, color: "bg-emerald-500" },
        { id: 'finished', label: 'Finalizadas', icon: LogOut, color: "bg-slate-500" },
    ], []);

    return (
        <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4 h-full bg-background/40 backdrop-blur-xl backdrop-saturate-150 border border-border/60 rounded-3xl p-4 sm:p-5 shadow-sm overflow-hidden">
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
    );
});

export default ReservationsFilterSidebar;
