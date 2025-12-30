import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, MessageCircle, Phone, CheckCircle2,
    X, ChevronRight, Store, Pencil, LogOut, Zap, Clock,
    AlertTriangle, Trash2, Calendar, Hash
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

// --- UTILIDADES ---
const getCurrentTime = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

const formatDateCreated = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }).toUpperCase();
};

const getDayName = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { weekday: 'long' });
};

// --- COMPONENTE: TARJETA "COMMAND BLOCK" ---
const ReservationCard = ({ res, isSelected, onClick, onUpdate, onDelete, onEdit }) => {
    const { theme } = useTheme();
    const [confirmAction, setConfirmAction] = useState(null);

    // --- SISTEMA DE DISEÑO DE ESTADOS (Deep Colors) ---
    const statusConfig = {
        pending: {
            label: "Pendiente",
            icon: Clock,
            // Bloque Lateral
            accentColor: "bg-amber-500",
            // Estilos del contenedor activo
            activeBorder: "border-amber-500/50",
            activeShadow: "shadow-amber-500/10",
            // Badge
            badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
            // Hora
            timeBg: "bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100"
        },
        confirmed: {
            label: "Confirmada",
            icon: CheckCircle2,
            accentColor: "bg-indigo-600",
            activeBorder: "border-indigo-500/50",
            activeShadow: "shadow-indigo-500/10",
            badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
            timeBg: "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100"
        },
        seated: {
            label: "En Mesa",
            icon: Zap,
            accentColor: "bg-emerald-500",
            activeBorder: "border-emerald-500/50",
            activeShadow: "shadow-emerald-500/10",
            badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
            timeBg: "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100"
        },
        finished: {
            label: "Finalizada",
            icon: LogOut,
            accentColor: "bg-slate-500",
            activeBorder: "border-slate-500/30",
            activeShadow: "shadow-slate-500/5",
            badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
            timeBg: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        },
    };

    const style = statusConfig[res.status] || statusConfig.confirmed;
    const StatusIcon = style.icon;

    // --- ACCIONES ---
    const handleReleaseTable = (e) => {
        e.stopPropagation();
        if (confirmAction === 'release') {
            onUpdate(res.id, { status: 'finished' });
            setConfirmAction(null);
        } else {
            setConfirmAction('release');
            setTimeout(() => setConfirmAction(null), 3000);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirmAction === 'delete') {
            onDelete(res.id);
            setConfirmAction(null);
        } else {
            setConfirmAction('delete');
            setTimeout(() => setConfirmAction(null), 3000);
        }
    };

    const handleArrivedNow = (e) => {
        e.stopPropagation();
        onUpdate(res.id, { status: 'seated', time: getCurrentTime() });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => { onClick(res.id); setConfirmAction(null); }}
            className={cn(
                "group relative w-full overflow-hidden transition-all duration-300 cursor-pointer",
                "rounded-xl border mb-3",
                // ESTADO ACTIVO VS INACTIVO
                isSelected
                    ? cn("bg-card z-20 shadow-xl scale-[1.01] ring-1", style.activeBorder, style.activeShadow)
                    : "bg-card border-border hover:border-foreground/20 hover:shadow-md"
            )}
        >
            {/* INDICADOR LATERAL (Slim Bar) */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", style.accentColor)} />

            {/* --- GRID PRINCIPAL (Alineación Perfecta) --- */}
            {/* Grid de 3 columnas: [Hora] -- [Datos] -- [Estado+Flecha] */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4">

                {/* 1. MÓDULO HORA (Bloque Sólido) */}
                <div className={cn(
                    "flex items-center justify-center w-[72px] h-[72px] rounded-lg border-2",
                    isSelected ? "border-transparent shadow-inner" : "border-transparent",
                    style.timeBg
                )}>
                    <span className="text-2xl font-black tracking-tighter">{res.time}</span>
                </div>

                {/* 2. MÓDULO DATOS (Flow Central) */}
                <div className="flex flex-col justify-center gap-1.5 min-w-0">
                    <h3 className={cn(
                        "text-lg font-bold truncate leading-none",
                        isSelected ? "text-foreground" : "text-foreground/80"
                    )}>
                        {res.name}
                    </h3>

                    {/* Fila de Metadatos con Separadores */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {/* Pax */}
                        <div className="flex items-center gap-1.5">
                            <Users size={14} className="opacity-70" />
                            <span className="font-semibold text-foreground">{res.pax}</span>
                            <span className="text-[10px] uppercase font-bold opacity-60">Pers</span>
                        </div>

                        <div className="w-px h-3 bg-border" />

                        {/* Origen */}
                        <div className="flex items-center gap-1.5">
                            {res.origin === 'whatsapp' ? <MessageCircle size={14} className="opacity-70" /> : res.origin === 'walk-in' ? <Store size={14} className="opacity-70" /> : <Phone size={14} className="opacity-70" />}
                            <span className="text-xs font-medium capitalize">{res.origin}</span>
                        </div>

                        {/* Indicador de Notas */}
                        {res.tags?.length > 0 && (
                            <>
                                <div className="w-px h-3 bg-border" />
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                                    <Hash size={10} /> Notas
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. MÓDULO CONTROL (Alineado a la Derecha) */}
                <div className="flex items-center gap-4">

                    {/* Badge de Estado */}
                    <div className={cn(
                        "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold uppercase tracking-wider shadow-sm",
                        style.badge
                    )}>
                        <StatusIcon size={12} strokeWidth={3} />
                        {style.label}
                    </div>

                    {/* Trigger de Expansión (Botón Circular) */}
                    <div className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300",
                        isSelected
                            ? "bg-foreground text-background rotate-90"
                            : "bg-muted text-muted-foreground group-hover:bg-foreground/10"
                    )}>
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* --- COCKPIT OPERATIVO (Panel Expandido) --- */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-muted/30 border-t border-border"
                    >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">

                            {/* COLUMNA 1: INFO DETALLADA (Notas y Fecha) - Span 4 */}
                            <div className="md:col-span-5 flex flex-col gap-3">
                                <div className="bg-background border border-border rounded-lg p-3 flex-1 shadow-sm">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <MessageCircle size={12} /> Notas del Cliente
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {res.tags && res.tags.length > 0 ? res.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 rounded bg-muted/50 border border-border text-foreground text-xs font-medium">
                                                {tag}
                                            </span>
                                        )) : <span className="text-muted-foreground italic text-xs">Sin notas registradas.</span>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-background border border-border rounded-lg p-3 shadow-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Creado</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-foreground">{formatDateCreated(res.createdAt)}</span>
                                        <span className="block text-[9px] uppercase text-muted-foreground">{getDayName(res.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* COLUMNA 2: BOTONERA DE ACCIÓN (Action Grid) - Span 8 */}
                            <div className="md:col-span-7 flex flex-col gap-3">

                                {/* Acciones Principales (Flow) */}
                                <div className="flex-1">
                                    {res.status === 'pending' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdate(res.id, { status: 'confirmed' }); }}
                                            className="w-full h-14 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={18} strokeWidth={2.5} />
                                            <span>CONFIRMAR RESERVA</span>
                                        </button>
                                    )}

                                    {res.status === 'confirmed' && (
                                        <div className="flex gap-2 h-14">
                                            <button
                                                onClick={handleArrivedNow}
                                                className="flex-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                            >
                                                <Zap size={18} fill="currentColor" />
                                                <span>¡LLEGÓ AL LOCAL!</span>
                                            </button>

                                        </div>
                                    )}

                                    {res.status === 'seated' && (
                                        <button
                                            onClick={handleReleaseTable}
                                            className={cn(
                                                "w-full h-14 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm border",
                                                confirmAction === 'release'
                                                    ? "bg-red-600 border-red-700 text-white animate-pulse"
                                                    : "bg-zinc-800 text-white border-zinc-900 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                                            )}
                                        >
                                            {confirmAction === 'release' ? (
                                                <> <AlertTriangle size={18} /> CLICK NUEVAMENTE PARA LIBERAR </>
                                            ) : (
                                                <> <LogOut size={18} /> LIBERAR MESA </>
                                            )}
                                        </button>
                                    )}

                                    {res.status === 'finished' && (
                                        <div className="w-full h-14 rounded-lg bg-muted border border-border flex items-center justify-center gap-2 text-muted-foreground font-medium cursor-not-allowed select-none">
                                            <CheckCircle2 size={16} /> CICLO FINALIZADO
                                        </div>
                                    )}
                                </div>

                                {/* Acciones Secundarias (Gestión) */}
                                <div className="grid grid-cols-2 gap-3 h-12">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEdit(res); }}
                                        className="rounded-lg border border-border bg-background text-foreground hover:bg-muted hover:border-foreground/20 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                                    >
                                        <Pencil size={16} /> Editar
                                    </button>

                                    <button
                                        onClick={handleDelete}
                                        className={cn(
                                            "rounded-lg border transition-all flex items-center justify-center gap-2 text-xs font-bold",
                                            confirmAction === 'delete'
                                                ? "bg-red-600 text-white border-red-700"
                                                : "bg-background border-border text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200"
                                        )}
                                    >
                                        {confirmAction === 'delete' ? "Confirmar" : <> <Trash2 size={16} /> Eliminar </>}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- LISTA ---
const ReservationListView = ({ reservations, selectedId, onSelect, onUpdate, onDelete, onEdit }) => {
    return (
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-4 space-y-1 relative">
            <div className="max-w-4xl mx-auto w-full ">
                {reservations.map(res => (
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
    );
};

export default ReservationListView;