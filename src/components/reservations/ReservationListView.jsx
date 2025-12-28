import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, MessageCircle, Phone, CheckCircle2,
    XCircle, ChevronDown, MessageSquare, Zap, Store, Pencil, LogOut
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

// --- UTILIDADES VISUALES ---
const getTodayString = () => new Date().toISOString().split('T')[0];
const getCurrentTime = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

const formatDateCreated = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// --- SUB-COMPONENTE: TARJETA INDIVIDUAL ---
const ReservationCard = ({ res, isSelected, onClick, onUpdate, onDelete, onEdit }) => {
    const { theme } = useTheme();
    const isToday = res.date === getTodayString();

    const statusConfig = {
        pending: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Pendiente" },
        confirmed: { color: "text-white", bg: "bg-white/5", border: "border-white/10", label: "Confirmada" },
        seated: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "En Mesa" },
        finished: { color: "text-slate-500", bg: "bg-transparent", border: "border-white/5", label: "Finalizada" },
    };

    const style = statusConfig[res.status] || statusConfig.confirmed;

    const handleArrivedNow = (e) => {
        e.stopPropagation();
        onUpdate(res.id, { status: 'seated', time: getCurrentTime() });
    };

    return (
        <motion.div
            layout
            onClick={() => onClick(res.id)}
            className={cn(
                "relative overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl border",
                isSelected
                    ? "bg-[#18181b] shadow-2xl z-10 my-4 ring-1 ring-white/10"
                    : "bg-[#0F0F10] hover:bg-[#18181b] my-2",
                style.border
            )}
            style={isSelected ? { borderColor: res.status === 'confirmed' ? theme.color : undefined } : {}}
        >
            <div
                className={cn("absolute left-0 top-0 bottom-0 w-1 transition-all", isSelected ? "w-1.5" : "w-1")}
                style={{ backgroundColor: res.status === 'confirmed' ? theme.color : style.color.replace('text-', '') }}
            />

            <div className="p-4 pl-5">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        {/* HORA: Fuente Arreglada (Chau font-mono) */}
                        <div className={cn(
                            "flex flex-col items-center justify-center w-16 h-14 rounded-2xl border transition-colors",
                            isSelected ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-slate-300"
                        )}>
                            {/* AQUÍ ESTÁ EL CAMBIO DE FUENTE: text-xl font-bold tracking-tight */}
                            <span className="text-xl font-bold tracking-tight">{res.time}</span>
                        </div>

                        <div>
                            <h4 className={cn("font-bold text-lg transition-colors", isSelected ? "text-white" : "text-slate-200")}>
                                {res.name}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                    <Users size={12} /> <span className="text-slate-300 font-bold">{res.pax}</span>
                                </span>
                                <span className="flex items-center gap-1.5 capitalize">
                                    {res.origin === 'whatsapp' ? <MessageCircle size={12} /> : res.origin === 'walk-in' ? <Store size={12} /> : <Phone size={12} />}
                                    {res.origin}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isSelected && (
                            <div className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", style.bg, style.color)}>
                                {style.label}
                            </div>
                        )}
                        <ChevronDown size={20} className={cn("text-slate-600 transition-transform duration-300", isSelected && "rotate-180")} />
                    </div>
                </div>

                {/* CONTENIDO EXPANDIDO */}
                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-5 mt-5 border-t border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {res.tags && res.tags.length > 0 ? res.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                                                {tag}
                                            </span>
                                        )) : <span className="text-xs text-slate-600 italic">Sin notas</span>}
                                    </div>
                                    <div className="text-[10px] text-slate-600 font-mono text-right">
                                        Creado: {formatDateCreated(res.createdAt)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(res.id); }} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent border border-white/5 text-slate-500 hover:text-red-500 hover:border-red-500/30 transition-all" title="Eliminar">
                                        <XCircle size={18} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(res); }} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 transition-all" title="Editar">
                                        <Pencil size={18} /> <span className="text-xs font-bold hidden sm:inline">Editar</span>
                                    </button>

                                    {res.status === 'pending' && (
                                        <button onClick={(e) => { e.stopPropagation(); onUpdate(res.id, { status: 'confirmed' }); }} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all">
                                            <CheckCircle2 size={16} /> Confirmar
                                        </button>
                                    )}

                                    {res.status === 'confirmed' && (
                                        <>
                                            {isToday ? (
                                                <button onClick={handleArrivedNow} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 active:scale-95 transition-all">
                                                    <Zap size={16} fill="currentColor" /> ¡Llegó Ya!
                                                </button>
                                            ) : (
                                                <button onClick={(e) => { e.stopPropagation(); onUpdate(res.id, { status: 'seated' }); }} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-sm hover:bg-emerald-500/20 transition-all">
                                                    <Zap size={16} /> Marcar Llegada
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {res.status === 'seated' && (
                                        <button onClick={(e) => { e.stopPropagation(); onUpdate(res.id, { status: 'finished' }); }} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm hover:bg-slate-600 transition-all">
                                            <LogOut size={16} /> Liberar Mesa
                                        </button>
                                    )}

                                    {res.status === 'finished' && (
                                        <div className="col-span-2 flex items-center justify-center text-xs font-mono text-slate-500 border border-white/5 rounded-xl">
                                            Cerrada
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// --- COMPONENTE PRINCIPAL DE LA VISTA ---
// Aquí forzamos el alto completo para que no se "adapte" a pocas reservas
const ReservationListView = ({ reservations, selectedId, onSelect, onUpdate, onDelete, onEdit }) => {
    return (
        // flex-1 y h-full aseguran que ocupe todo el espacio del padre
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-2 relative">
            <div className="max-w-4xl mx-auto w-full">
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