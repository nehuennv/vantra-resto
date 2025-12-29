import React from 'react';
import { motion } from "framer-motion";
import { X, Activity, Zap, Users, CheckCircle, Smartphone, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "../../lib/utils";

const IntelligenceModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    // Mapa de iconos según el área
    const getIcon = (area) => {
        switch (area) {
            case 'Operativa': return Activity;
            case 'Tecnología':
            case 'Staff':
            case 'Automatización': return Smartphone;
            case 'Eficiencia':
            case 'Rentabilidad':
            case 'Comercial': return Zap;
            case 'Tendencia':
            case 'Distribución': return Users;
            case 'Cocina': return AlertTriangle;
            default: return CheckCircle;
        }
    };

    // Helper para la hora
    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* Backdrop oscuro con Blur fuerte */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[90]"
            />

            {/* Modal Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[100] flex flex-col max-h-[90vh]"
            >
                {/* --- HEADER: Diseño Solido y Jerárquico --- */}
                <div className={cn(
                    "px-8 py-6 border-b border-white/5 bg-gradient-to-r",
                    data.color === 'rose' ? "from-rose-950/40 via-[#09090b] to-[#09090b]" :
                        data.color === 'amber' ? "from-amber-950/40 via-[#09090b] to-[#09090b]" :
                            data.color === 'blue' ? "from-blue-950/40 via-[#09090b] to-[#09090b]" :
                                "from-emerald-950/40 via-[#09090b] to-[#09090b]"
                )}>
                    <div className="flex justify-between items-center">
                        {/* IZQUIERDA: Marca + Estado */}
                        <div className="flex items-center gap-5">
                            {/* Icono Principal Grande */}
                            <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10 shadow-lg shrink-0",
                                data.color === 'rose' ? "text-rose-500 shadow-rose-900/20" :
                                    data.color === 'amber' ? "text-amber-500 shadow-amber-900/20" :
                                        data.color === 'blue' ? "text-blue-500 shadow-blue-900/20" :
                                            "text-emerald-500 shadow-emerald-900/20"
                            )}>
                                <Activity size={28} strokeWidth={2} />
                            </div>

                            <div>
                                <div className="flex items-center gap-3 ">
                                    <h1 className="text-xl font-bold text-white tracking-wide uppercase font-sans leading-none">
                                        Vantra Intelligence
                                    </h1>

                                    {/* LIVE Badge Sutil y Alineado */}
                                    <div className="px-2 py-[3px] rounded-md bg-white/10 border border-white/5 flex items-center gap-1.5 h-fit">
                                        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse",
                                            data.color === 'rose' ? "bg-rose-500" :
                                                data.color === 'amber' ? "bg-amber-500" :
                                                    data.color === 'blue' ? "bg-blue-500" :
                                                        "bg-emerald-500"
                                        )} />
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider leading-none pt-[1px]">Live</span>
                                    </div>
                                </div>
                                <p className="text-base text-slate-300 font-medium leading-none">
                                    {data.label}
                                </p>
                            </div>
                        </div>

                        {/* DERECHA: Cerrar */}
                        <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white border border-white/5">
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* --- BODY SCROLLABLE --- */}
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-[#09090b]">
                    {data.details.map((item, idx) => {
                        const Icon = getIcon(item.area);
                        return (
                            <div key={idx} className="flex gap-5 p-5 rounded-2xl bg-[#0F0F12] border border-white/5 hover:border-white/10 transition-all">
                                {/* Icono Lateral */}
                                <div className={cn(
                                    "p-3 rounded-xl h-fit shrink-0",
                                    item.type === 'critical' ? "bg-rose-500/10 text-rose-400" :
                                        item.type === 'alert' ? "bg-orange-500/10 text-orange-400" :
                                            item.type === 'warning' ? "bg-amber-500/10 text-amber-400" :
                                                "bg-emerald-500/10 text-emerald-400"
                                )}>
                                    <Icon size={24} strokeWidth={2} />
                                </div>

                                {/* Texto */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className={cn("text-base font-bold",
                                            item.type === 'critical' ? "text-rose-200" : "text-white"
                                        )}>
                                            {item.title}
                                        </h4>
                                        <span className="text-[10px] font-bold uppercase text-slate-400 bg-white/5 px-2 py-0.5 rounded tracking-wide border border-white/5">
                                            {item.area}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-300 leading-relaxed font-medium mb-3">
                                        {item.text}
                                    </p>

                                    {/* TIP TÁCTICO (Visualmente distinto a un botón navegable) */}
                                    {item.action && (
                                        <div className={cn(
                                            "flex items-start gap-3 p-3 rounded-xl border",
                                            item.type === 'critical' ? "bg-rose-500/5 border-rose-500/20" : "bg-blue-500/5 border-blue-500/10"
                                        )}>
                                            <Lightbulb size={16} className={cn("mt-0.5 shrink-0", item.type === 'critical' ? "text-rose-400" : "text-blue-400")} />
                                            <div>
                                                <p className={cn("text-xs font-bold uppercase tracking-wide mb-0.5",
                                                    item.type === 'critical' ? "text-rose-400" : "text-blue-400"
                                                )}>
                                                    Acción Recomendada
                                                </p>
                                                <p className="text-sm text-slate-200 font-medium">
                                                    {item.action}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* --- FOOTER STATIC --- */}
                <div className="p-5 border-t border-white/5 bg-[#050506] flex justify-between items-center px-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Motor Neuronal Activo
                        </p>
                    </div>
                    <p className="text-[12px] font-medium text-slate-500">
                        Actualizado: {getCurrentTime()}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default IntelligenceModal;