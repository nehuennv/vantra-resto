import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Zap, Users, CheckCircle, Smartphone, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

const IntelligenceModal = ({ isOpen, onClose, data }) => {

    // Mapa de iconos
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

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    // Variantes para la animación en cascada de la lista
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1 // Retraso entre cada item
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <AnimatePresence>
            {isOpen && data && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[90]"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-2xl bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] flex flex-col max-h-[85vh]"
                    >
                        {/* Borde Superior Colorizado */}
                        <div className={cn("absolute top-0 inset-x-0 h-1",
                            data.color === 'rose' ? "bg-rose-500" :
                                data.color === 'amber' ? "bg-amber-500" :
                                    data.color === 'blue' ? "bg-blue-500" :
                                        "bg-emerald-500"
                        )} />

                        {/* --- HEADER --- */}
                        <div className="px-6 py-5 border-b border-white/5 bg-[#131316] relative">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-white/5",
                                        data.color === 'rose' ? "border-rose-500/20 text-rose-500 bg-rose-500/5" :
                                            data.color === 'amber' ? "border-amber-500/20 text-amber-500 bg-amber-500/5" :
                                                data.color === 'blue' ? "border-blue-500/20 text-blue-500 bg-blue-500/5" :
                                                    "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
                                    )}>
                                        <Sparkles size={24} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-lg font-bold text-white tracking-tight">Vantra Intelligence</h2>
                                            <div className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                                                data.color === 'rose' ? "border-rose-500/20 text-rose-400 bg-rose-500/10" :
                                                    data.color === 'amber' ? "border-amber-500/20 text-amber-400 bg-amber-500/10" :
                                                        data.color === 'blue' ? "border-blue-500/20 text-blue-400 bg-blue-500/10" :
                                                            "border-emerald-500/20 text-emerald-400 bg-emerald-500/10"
                                            )}>
                                                {data.label}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium">
                                            Análisis operativo en tiempo real
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* --- BODY SCROLLABLE (Con Animación Stagger) --- */}
                        <motion.div
                            className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-[#0F0F10]"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {data.details.map((item, idx) => {
                                const Icon = getIcon(item.area);
                                const isCriticalItem = item.type === 'critical';
                                const isAlertItem = item.type === 'alert';

                                return (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className={cn(
                                            "group flex gap-4 p-4 rounded-xl border transition-all duration-300",
                                            // HOVER EFFECTS: Transformación suave y cambio de borde/fondo
                                            "hover:translate-x-1 hover:shadow-lg",
                                            isCriticalItem ? "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/30 hover:shadow-rose-900/10" :
                                                isAlertItem ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/30 hover:shadow-amber-900/10" :
                                                    "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                                        )}
                                    >
                                        {/* Icono Lateral */}
                                        <div className={cn(
                                            "p-2.5 rounded-lg h-fit shrink-0 transition-colors duration-300",
                                            isCriticalItem ? "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 group-hover:text-rose-300" :
                                                isAlertItem ? "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300" :
                                                    item.type === 'warning' ? "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20" :
                                                        "bg-white/5 text-slate-400 group-hover:text-slate-200 group-hover:bg-white/10"
                                        )}>
                                            <Icon size={20} strokeWidth={2} />
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <h4 className={cn("text-sm font-bold transition-colors",
                                                    isCriticalItem ? "text-rose-200 group-hover:text-rose-100" : "text-white"
                                                )}>
                                                    {item.title}
                                                </h4>
                                                <span className="text-[10px] font-bold uppercase text-slate-500 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                                                    {item.area}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                                                {item.text}
                                            </p>

                                            {/* Acción Recomendada (SIN MONOSPACE) */}
                                            {item.action && (
                                                <div className={cn(
                                                    "mt-3 pl-3 border-l-2 py-1 transition-colors",
                                                    isCriticalItem ? "border-rose-500/30" : "border-blue-500/30"
                                                )}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Lightbulb size={12} className={cn(
                                                            isCriticalItem ? "text-rose-400" : "text-blue-400"
                                                        )} />
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider",
                                                            isCriticalItem ? "text-rose-400" : "text-blue-400"
                                                        )}>
                                                            Sugerencia
                                                        </span>
                                                    </div>
                                                    {/* Fuente normal, color claro para lectura fácil */}
                                                    <p className="text-xs text-slate-200 font-medium">
                                                        {item.action}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>

                        {/* --- FOOTER STATIC --- */}
                        <div className="px-6 py-4 border-t border-white/5 bg-[#131316] flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className={cn("relative flex h-2 w-2",
                                    data.color === 'rose' ? "text-rose-500" :
                                        data.color === 'amber' ? "text-amber-500" :
                                            data.color === 'blue' ? "text-blue-500" :
                                                "text-emerald-500"
                                )}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                </span>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Live Analysis
                                </p>
                            </div>
                            {/* Fuente normal para la hora también */}
                            <p className="text-[11px] font-medium text-slate-500">
                                {getCurrentTime()}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default IntelligenceModal;