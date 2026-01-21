import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Zap, Users, CheckCircle, Smartphone, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import { clientConfig } from "../../config/client";
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
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98, filter: "blur(4px)" },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 80, damping: 15 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && data && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans"
                >

                    {/* BACKDROP: Utiliza variables de color del sistema (generalmente oscuro) */}
                    <div
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90]"
                    />

                    {/* MODAL CARD: Adaptativo al Theme del Cliente */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.2 } }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0, damping: 20, stiffness: 100 }}
                        // Uso de bg-card/95 para respetar modo dark/light y border-border
                        className="relative w-full max-w-2xl bg-card/95 backdrop-blur-2xl border border-border rounded-3xl shadow-2xl overflow-hidden z-[100] flex flex-col max-h-[85vh]"
                    >
                        {/* Glow Superior Semántico */}
                        <div className={cn("absolute top-0 inset-x-0 h-[1px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50",
                            data.color === 'rose' ? "text-rose-500" :
                                data.color === 'yellow' ? "text-yellow-500" :
                                    data.color === 'blue' ? "text-blue-500" :
                                        "text-emerald-500"
                        )} />

                        {/* --- HEADER --- */}
                        <div className="px-8 py-6 border-b border-border relative shrink-0">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex gap-5 items-center">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm backdrop-blur-md transition-colors",
                                        data.color === 'rose' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                            data.color === 'yellow' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                                                data.color === 'blue' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                                    "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    )}>
                                        <Sparkles size={28} strokeWidth={1.5} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-xl font-bold text-foreground tracking-tight">Asistente de IA</h2>
                                            <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-sm",
                                                data.color === 'rose' ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400" :
                                                    data.color === 'yellow' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400" :
                                                        data.color === 'blue' ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400" :
                                                            "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                            )}>
                                                {data.label}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            Diagnóstico operativo en tiempo real
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* --- BODY --- */}
                        <motion.div
                            className="p-8 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-card/50"
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
                                            "group flex gap-5 p-5 rounded-2xl border transition-all duration-500 bg-card",
                                            isCriticalItem ? "bg-rose-500/5 border-rose-500/20" :
                                                isAlertItem ? "bg-yellow-500/5 border-yellow-500/20" :
                                                    "bg-background/50 border-border hover:border-primary/20 hover:shadow-sm"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3.5 rounded-xl h-fit shrink-0 border bg-background",
                                            isCriticalItem ? "text-rose-500 border-rose-500/20" :
                                                isAlertItem ? "text-yellow-500 border-yellow-500/20" :
                                                    "text-muted-foreground border-border group-hover:text-primary group-hover:border-primary/20 transition-colors"
                                        )}>
                                            <Icon size={20} strokeWidth={2} />
                                        </div>

                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <h4 className={cn("text-sm font-bold tracking-wide transition-colors",
                                                    isCriticalItem ? "text-rose-600 dark:text-rose-400" :
                                                        isAlertItem ? "text-yellow-600 dark:text-yellow-400" : "text-foreground"
                                                )}>
                                                    {item.title}
                                                </h4>
                                                <span className="text-[9px] font-black uppercase text-muted-foreground bg-muted px-2 py-1 rounded-md tracking-wider">
                                                    {item.area}
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                                {item.text}
                                            </p>

                                            {item.action && (
                                                <div className={cn(
                                                    "mt-4 p-4 rounded-xl border flex gap-3 items-start",
                                                    isCriticalItem ? "bg-rose-500/5 border-rose-500/20" : "bg-primary/5 border-primary/10"
                                                )}>
                                                    <Lightbulb size={16} className={cn("shrink-0 mt-0.5", isCriticalItem ? "text-rose-500" : "text-primary")} />
                                                    <div className="flex flex-col gap-1">
                                                        <span className={cn("text-[9px] font-bold uppercase tracking-widest",
                                                            isCriticalItem ? "text-rose-500" : "text-primary"
                                                        )}>
                                                            Sugerencia
                                                        </span>
                                                        <p className="text-xs text-foreground/80 font-medium italic">
                                                            "{item.action}"
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>

                        {/* --- FOOTER --- */}
                        <div className="px-8 py-5 border-t border-border bg-muted/30 flex justify-between items-center shrink-0 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <span className={cn("relative flex h-2 w-2",
                                    data.color === 'rose' ? "text-rose-500" :
                                        data.color === 'yellow' ? "text-yellow-500" :
                                            data.color === 'blue' ? "text-blue-500" :
                                                "text-emerald-500"
                                )}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                </span>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                    AI Live Monitor
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <p className="text-[11px] font-mono font-medium text-muted-foreground">
                                    {getCurrentTime()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntelligenceModal; // No changes needed to export, but tool needs file content. I'll rewrite the component.