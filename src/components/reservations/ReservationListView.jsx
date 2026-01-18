import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, MessageCircle, Phone, CheckCircle2,
    X, ChevronDown, Store, Pencil, LogOut, Zap, Clock,
    Trash2, Hash, CalendarDays
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";
import { useReservationGrouping } from '../../hooks/useReservationGrouping';
import { getCurrentTimeLocal, formatDateCreated } from '../../lib/dateUtils';

// --- NUEVO COMPONENTE: SEPARADOR DE HORARIO (FRANJA 1H) ---
const TimeGroupHeader = ({ time, count }) => (
    <div className="flex items-center gap-3 py-4 mt-2 mb-1 select-none">

        {/* HORA (Visible pero balanceada) */}
        <div className="flex items-baseline gap-1.5 text-muted-foreground">
            <span className="text-lg font-bold tracking-tight tabular-nums">
                {time}
            </span>
            <span className="text-[10px] font-bold opacity-70">HS</span>
        </div>

        {/* LÍNEA DE ESTRUCTURA (Sutil) */}
        <div className="h-px flex-1 bg-border/60" />

        {/* CONTADOR (Minimalista) */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 text-[10px] font-semibold text-muted-foreground">
            <span>{count}</span>
            <span className="opacity-80">{count === 1 ? 'Reserva' : 'Reservas'}</span>
        </div>
    </div>
);

// --- COMPONENTE: TARJETA DE INGENIERÍA (SOLIDA & ROBUSTA) ---
// (VERSIÓN ORIGINAL PRESERVADA AL 100%)
const ReservationCard = ({ res, isSelected, onClick, onUpdate, onDelete, onEdit }) => {
    const { theme } = useTheme();
    const [confirmAction, setConfirmAction] = useState(null);

    // Configuración de Estados: Colores sólidos, alto contraste, sin degradados raros.
    const statusConfig = {
        pending: {
            label: "Pendiente",
            icon: Clock,
            borderLeft: "border-l-amber-500",
            badgeBg: "bg-amber-100 dark:bg-amber-500/10",
            badgeText: "text-amber-700 dark:text-amber-400",
            badgeBorder: "border-amber-200 dark:border-amber-500/20",
            timeBox: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/5",
            mainBtn: "bg-amber-600 hover:bg-amber-500 text-white"
        },
        confirmed: {
            label: "Confirmada",
            icon: CheckCircle2,
            borderLeft: "border-l-indigo-500",
            badgeBg: "bg-indigo-100 dark:bg-indigo-500/10",
            badgeText: "text-indigo-700 dark:text-indigo-400",
            badgeBorder: "border-indigo-200 dark:border-indigo-500/20",
            timeBox: "text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/5",
            mainBtn: "bg-indigo-600 hover:bg-indigo-500 text-white"
        },
        seated: {
            label: "En Mesa",
            icon: Zap,
            borderLeft: "border-l-emerald-500",
            badgeBg: "bg-emerald-100 dark:bg-emerald-500/10",
            badgeText: "text-emerald-700 dark:text-emerald-400",
            badgeBorder: "border-emerald-200 dark:border-emerald-500/20",
            timeBox: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5",
            mainBtn: "bg-emerald-600 hover:bg-emerald-500 text-white"
        },
        finished: {
            label: "Finalizada",
            icon: LogOut,
            borderLeft: "border-l-slate-500",
            badgeBg: "bg-slate-100 dark:bg-slate-800",
            badgeText: "text-slate-600 dark:text-slate-400",
            badgeBorder: "border-slate-200 dark:border-slate-700",
            timeBox: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50",
            mainBtn: "bg-slate-800 text-white"
        },
    };

    const style = statusConfig[res.status] || statusConfig.confirmed;
    const StatusIcon = style.icon;

    // --- ACCIONES CON CONFIRMACIÓN ---
    const handleAction = (e, type, callback) => {
        e.stopPropagation();
        if (confirmAction === type) {
            callback();
            setConfirmAction(null);
        } else {
            setConfirmAction(type);
            setTimeout(() => setConfirmAction(null), 3000);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                "group relative w-full overflow-hidden transition-all duration-200", // Quitamos cursor-pointer global
                "bg-card border border-border/60 rounded-lg shadow-sm hover:shadow-md hover:bg-card/80 hover:border-primary/20 hover:z-10", // Mejor feedback hover
                "border-l-[4px]", // Borde indicador sólido pero no invasivo
                style.borderLeft,
                isSelected
                    ? "ring-1 ring-inset ring-primary/20 shadow-md border-y-primary/20 border-r-primary/20"
                    : "border-y-border/60 border-r-border/60 hover:brightness-105" // Ajuste sutil borde
            )}
        >
            {/* --- GRID ESTRUCTURAL (Layout Apretado en Mobile) --- */}
            {/* El click ahora vive SOLO en el encabezado */}
            <div
                onClick={() => { onClick(res.id); setConfirmAction(null); }}
                className="grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 p-3 sm:p-4 items-center cursor-pointer"
            >

                {/* 1. TIME BOX (Compacto en Mobile) */}
                <div className={cn(
                    "flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-md border border-transparent transition-colors",
                    style.timeBox // Hereda color sutil del estado
                )}>
                    <span className="text-base sm:text-lg font-bold tabular-nums leading-none tracking-tight">
                        {res.time}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase opacity-60 mt-0.5">HS</span>
                </div>

                {/* 2. DATOS DEL CLIENTE (Fluid Text) */}
                <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                            "text-sm sm:text-base font-bold truncate leading-none",
                            "text-foreground"
                        )}>
                            {res.name}
                        </h3>
                        {/* Indicador de Notas sutil */}
                        {res.tags?.length > 0 && (
                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-muted text-[10px] text-muted-foreground shrink-0" title="Ver notas">
                                <Hash size={10} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-muted/30 border border-border/50 whitespace-nowrap">
                            <Users size={12} strokeWidth={2.5} />
                            <span className="font-semibold text-foreground tabular-nums">{res.pax}</span>
                        </div>
                        <span className="hidden sm:inline text-border">|</span>
                        <div className="flex items-center gap-1.5 capitalize truncate">
                            {res.origin === 'whatsapp' ? <MessageCircle size={12} /> : res.origin === 'walk-in' ? <Store size={12} /> : <Phone size={12} />}
                            <span className="truncate max-w-[80px] sm:max-w-none">{res.origin === 'walk-in' ? 'Presencial' : res.origin}</span>
                        </div>
                    </div>
                </div>

                {/* 3. ESTADO (Icon Only on Mobile, Full Badge on Desktop) */}
                <div className="flex items-center gap-3">
                    {/* Badge Desktop */}
                    {!isSelected && (
                        <div className={cn(
                            "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider",
                            style.badgeBg, style.badgeText, style.badgeBorder
                        )}>
                            <StatusIcon size={12} strokeWidth={2.5} />
                            {style.label}
                        </div>
                    )}
                    {/* Mobile Dot Indicator */}
                    {!isSelected && (
                        <div className={cn(
                            "flex sm:hidden w-2 h-2 rounded-full",
                            style.bar || (style.badgeText.includes('amber') ? 'bg-amber-500' : style.badgeText.includes('indigo') ? 'bg-indigo-600' : style.badgeText.includes('emerald') ? 'bg-emerald-500' : 'bg-slate-500')
                        )} />
                    )}
                    <ChevronDown size={18} className={cn("text-muted-foreground transition-transform duration-200", isSelected && "rotate-180")} />
                </div>
            </div>

            {/* --- PANEL OPERATIVO (Despliegue Controlado) --- */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                                height: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
                                opacity: { duration: 0.2, delay: 0.1 }
                            }
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                                height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
                                opacity: { duration: 0.1 }
                            }
                        }}
                        className="border-t border-border bg-muted/20 overflow-hidden"
                    >
                        <motion.div
                            className="p-4 pt-3"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                                hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
                            }}
                        >

                            {/* METADATOS (Fila superior) */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
                                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } }
                                }}
                                className="flex flex-col sm:flex-row gap-3 mb-4"
                            >
                                {/* Notas */}
                                <div className="flex-1 bg-background border border-border rounded-md p-2.5 shadow-sm">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <Hash size={10} /> Notas / Etiquetas
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {res.tags?.length > 0 ? res.tags.map((tag, i) => (
                                            <span key={i} className="px-1.5 py-0.5 rounded-sm bg-muted text-foreground border border-border text-xs font-medium">
                                                {tag}
                                            </span>
                                        )) : <span className="text-xs italic text-muted-foreground">Sin notas adicionales.</span>}
                                    </div>
                                </div>
                                {/* Fecha */}
                                <div className="bg-background border border-border rounded-md p-2.5 shadow-sm flex flex-col justify-center min-w-[150px]">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                        <CalendarDays size={10} /> Creado
                                    </p>
                                    <div className="flex items-center gap-2 h-6">
                                        <span className="text-xs font-medium text-foreground tabular-nums">
                                            {formatDateCreated(res.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* BOTONERA (Standard Size h-10) */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 5 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }
                                }}
                                className="flex flex-col sm:flex-row items-stretch gap-3 sm:h-10"
                            >

                                {/* 1. Grupo Herramientas (Botones Acciones) */}
                                <div className="flex gap-3 shrink-0 h-10 sm:h-auto">
                                    <motion.button
                                        onClick={(e) => handleAction(e, 'delete', () => onDelete(res.id))}
                                        className={cn(
                                            "relative px-4 h-full flex items-center justify-center gap-2 rounded-md border transition-all duration-300 text-sm font-bold shadow-sm",
                                            confirmAction === 'delete'
                                                ? "bg-red-600 border-red-600 text-white shadow-md ring-2 ring-red-600/30"
                                                : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-300 hover:shadow-red-500/10"
                                        )}
                                        title="Eliminar Reserva"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                        <span className="hidden sm:inline">{confirmAction === 'delete' ? "¿Confirmar?" : "Eliminar"}</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); onEdit(res); }}
                                        className="relative px-4 h-full flex items-center justify-center gap-2 rounded-md border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:border-indigo-300 hover:shadow-indigo-500/10 transition-all duration-300 text-sm font-bold shadow-sm"
                                        title="Editar Datos"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Pencil size={16} strokeWidth={2.5} />
                                        <span className="hidden sm:inline">Editar</span>
                                    </motion.button>
                                </div>

                                {/* 2. Botón Principal (Acción Primaria - Estilo Tinted con Hover Sutil) */}
                                <div className="flex-1 h-10 sm:h-auto">
                                    {res.status === 'pending' && (
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdate(res.id, { status: 'confirmed' });
                                                onClick(res.id); // Cerrar tarjeta
                                            }}
                                            className="w-full h-full rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-300 transition-all duration-300 font-black text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-2"
                                            title="Confirmar Reserva"
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <CheckCircle2 size={16} strokeWidth={3} />
                                            <span>Confirmar Solicitud</span>
                                        </motion.button>
                                    )}

                                    {res.status === 'confirmed' && (
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdate(res.id, { status: 'seated', time: getCurrentTimeLocal() });
                                                onClick(res.id); // Cerrar tarjeta
                                            }}
                                            className="w-full h-full rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:border-amber-300 transition-all duration-300 font-black text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-2"
                                            title="Marcar como Llegó"
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(245, 158, 11, 0.15)" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Zap size={16} fill="currentColor" strokeWidth={0} />
                                            <span>¡Llegó al Local!</span>
                                        </motion.button>
                                    )}

                                    {res.status === 'seated' && (
                                        <motion.button
                                            onClick={(e) => handleAction(e, 'release', () => {
                                                onUpdate(res.id, { status: 'finished' });
                                                onClick(res.id); // Cerrar tarjeta
                                            })}
                                            className={cn(
                                                "w-full h-full rounded-md border transition-all duration-300 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm",
                                                confirmAction === 'release'
                                                    ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                                                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300"
                                            )}
                                            title="Liberar Mesa"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <LogOut size={16} strokeWidth={2.5} />
                                            <span>{confirmAction === 'release' ? "¿Confirmar Salida?" : "Liberar Mesa"}</span>
                                        </motion.button>
                                    )}

                                    {res.status === 'finished' && (
                                        <div className="w-full h-full rounded-md bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 text-xs font-black uppercase tracking-wider cursor-default select-none">
                                            <span>Ciclo Completado</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- LISTA AGRUPADA POR FRANJA HORARIA (BUCKETS 1H) ---
const ReservationListView = ({ reservations, selectedId, onSelect, onUpdate, onDelete, onEdit }) => {

    const groupedReservations = useReservationGrouping(reservations);

    return (
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-2 sm:p-4 space-y-1 relative">
            <div className="max-w-4xl mx-auto w-full">
                {groupedReservations.map((group) => (
                    <div key={group.time} className="mb-6">
                        {/* SEPARADOR DE FRANJA HORARIA */}
                        <TimeGroupHeader time={group.time} count={group.items.length} />

                        {/* LISTA DE TARJETAS EN ESA HORA */}
                        <div className="space-y-3">
                            {group.items.map(res => (
                                <ReservationCard
                                    key={res.id}
                                    res={res}
                                    isSelected={selectedId === res.id}
                                    onClick={onSelect}
                                    onUpdate={onUpdate}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReservationListView;