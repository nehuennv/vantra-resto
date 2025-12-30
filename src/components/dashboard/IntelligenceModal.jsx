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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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

                    {/* BACKDROP: Oscuro absoluto para centrar la atención */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]"
                    />

                    {/* MODAL CARD: SÓLIDO Y CONTRASTADO */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        // bg-background o bg-card pero SIN transparencia para que no se pise con el fondo
                        className="relative w-full max-w-2xl bg-background border border-border rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden z-[100] flex flex-col max-h-[85vh]"
                    >
                        {/* Borde Superior de Estado */}
                        <div className={cn("absolute top-0 inset-x-0 h-1 z-50",
                            data.color === 'rose' ? "bg-rose-500" :
                                data.color === 'amber' ? "bg-amber-500" :
                                    data.color === 'blue' ? "bg-blue-500" :
                                        "bg-emerald-500"
                        )} />

                        {/* --- HEADER SÓLIDO --- */}
                        <div className="px-6 py-5 border-b border-border bg-muted/50 relative shrink-0">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm bg-background",
                                        data.color === 'rose' ? "border-rose-500/30 text-rose-500" :
                                            data.color === 'amber' ? "border-amber-500/30 text-amber-500" :
                                                data.color === 'blue' ? "border-blue-500/30 text-blue-500" :
                                                    "border-emerald-500/30 text-emerald-500"
                                    )}>
                                        <Sparkles size={24} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 ">
                                            <h2 className="text-lg font-bold text-foreground tracking-tight">Vantra Intelligence</h2>
                                            <div className={cn("px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border bg-background",
                                                data.color === 'rose' ? "border-rose-500/40 text-rose-500" :
                                                    data.color === 'amber' ? "border-amber-500/40 text-amber-500" :
                                                        data.color === 'blue' ? "border-blue-500/40 text-blue-500" :
                                                            "border-emerald-500/40 text-emerald-500"
                                            )}>
                                                {data.label}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-semibold">
                                            Análisis operativo en tiempo real
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* --- BODY (CONTRASTE ALTO) --- */}
                        <motion.div
                            className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-background"
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
                                            "group flex gap-4 p-5 rounded-xl border transition-all duration-300",
                                            isCriticalItem ? "bg-rose-500/[0.03] border-rose-500/30" :
                                                isAlertItem ? "bg-amber-500/[0.03] border-amber-500/30" :
                                                    "bg-muted/10 border-border hover:bg-muted/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-lg h-fit shrink-0 border bg-background shadow-sm",
                                            isCriticalItem ? "text-rose-600 border-rose-500/20" :
                                                isAlertItem ? "text-amber-600 border-amber-500/20" :
                                                    "text-muted-foreground border-border group-hover:text-primary transition-colors"
                                        )}>
                                            <Icon size={22} strokeWidth={2.5} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <h4 className={cn("text-sm font-bold",
                                                    isCriticalItem ? "text-rose-700 dark:text-rose-400" : "text-foreground"
                                                )}>
                                                    {item.title}
                                                </h4>
                                                <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                    {item.area}
                                                </span>
                                            </div>

                                            <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                                                {item.text}
                                            </p>

                                            {item.action && (
                                                <div className={cn(
                                                    "mt-4 p-3 border-l-4 rounded-r-lg bg-muted/40",
                                                    isCriticalItem ? "border-rose-500" : "border-primary"
                                                )}>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <Lightbulb size={14} className={isCriticalItem ? "text-rose-600" : "text-primary"} />
                                                        <span className={cn("text-[10px] font-black uppercase tracking-widest",
                                                            isCriticalItem ? "text-rose-600" : "text-primary"
                                                        )}>
                                                            Recomendación Estratégica
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-foreground font-black italic">
                                                        {item.action}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>

                        {/* --- FOOTER SÓLIDO --- */}
                        <div className="px-6 py-4 border-t border-border bg-muted/50 flex justify-between items-center shrink-0">
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
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Vantra Intelligence Live
                                </p>
                            </div>
                            <p className="text-[11px] font-bold text-muted-foreground tabular-nums bg-background px-2 py-1 rounded border border-border">
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