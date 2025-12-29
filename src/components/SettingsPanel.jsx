import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Monitor, Type, Save, BellRing, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

const SettingToggle = ({ icon: Icon, title, description, active, onToggle }) => (
    <div
        onClick={onToggle}
        className={cn(
            "relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 group select-none overflow-hidden",
            active
                ? "bg-primary/5 border-primary/50 shadow-[0_0_20px_-10px_rgba(var(--primary),0.3)]"
                : "bg-[#18181b] border-white/5 hover:bg-white/5 hover:border-white/10"
        )}
    >
        {!active && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}

        <div className="relative z-10 flex items-start gap-4">
            <div className={cn(
                "p-2.5 rounded-xl transition-colors duration-300",
                active ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-slate-400 group-hover:text-white"
            )}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
            </div>
            <div>
                <h4 className={cn("font-bold text-sm transition-colors font-jakarta", active ? "text-white" : "text-slate-300 group-hover:text-white")}>
                    {title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">{description}</p>
            </div>
        </div>

        {/* MANTENEMOS TU LÓGICA DE JUSTIFY QUE YA ESTABA BIEN */}
        <div className={cn(
            "w-12 h-7 rounded-full relative transition-colors duration-300 flex items-center px-1",
            active ? "bg-primary justify-end" : "bg-slate-800 border border-white/5 justify-start"
        )}>
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                    "w-5 h-5 rounded-full shadow-sm",
                    active ? "bg-white" : "bg-slate-500"
                )}
            />
        </div>
    </div>
);

const SettingsPanel = ({ isOpen, onClose }) => {
    // 1. AQUÍ AGREGAMOS SOLO LO QUE FALTA (themeMode, toggleTheme)
    const {
        soundEnabled,
        toggleSound,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        themeMode,   // <--- NUEVO
        toggleTheme  // <--- NUEVO
    } = useTheme();

    const adjustFont = (delta) => {
        setFontSize(prev => {
            const newValue = prev + delta;
            if (newValue > 115) return 115;
            if (newValue < 85) return 85;
            return newValue;
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[#0A0A0B] border-l border-white/10 shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-[#0F0F10]">
                            <div>
                                <h2 className="text-xl font-bold text-white font-jakarta tracking-tight">Preferencias</h2>
                                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Configuración del Sistema</p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 outline-none">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

                            {/* SECCIÓN TIPOGRAFÍA (Intacta) */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 opacity-80">
                                    <Type size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Tipografía</h3>
                                </div>

                                <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-300">Escala de Texto</span>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                                            {fontSize}%
                                        </span>
                                    </div>

                                    <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5 h-12 relative">
                                        <button onClick={() => adjustFont(-5)} disabled={fontSize <= 85} className="flex-1 h-full flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-colors rounded-lg active:bg-white/5">
                                            <span className="text-xs font-bold">A-</span>
                                        </button>
                                        <div className="w-px h-4 bg-white/10" />
                                        <button onClick={() => setFontSize(100)} className="flex-[2] h-full flex items-center justify-center gap-2 text-slate-300 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider">
                                            {fontSize === 100 && <Check size={12} className="text-primary" />}
                                            Predeterminado
                                        </button>
                                        <div className="w-px h-4 bg-white/10" />
                                        <button onClick={() => adjustFont(5)} disabled={fontSize >= 115} className="flex-1 h-full flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-colors rounded-lg active:bg-white/5">
                                            <span className="text-base font-bold">A+</span>
                                        </button>
                                    </div>
                                    <div className="h-px w-full bg-white/5 my-2" />
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] text-slate-500 font-medium">Compacto</span>
                                        <span className="text-[10px] text-slate-500 font-medium">Amplio</span>
                                    </div>
                                </div>
                            </section>

                            {/* SECCIÓN INTERFAZ */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 opacity-80">
                                    <Monitor size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Interfaz</h3>
                                </div>

                                <div className="space-y-4">
                                    <SettingToggle
                                        icon={Monitor}
                                        title="Alto Contraste"
                                        description="Resalta bordes y separadores."
                                        active={highContrast}
                                        onToggle={() => setHighContrast(!highContrast)}
                                    />

                                    <SettingToggle
                                        icon={BellRing}
                                        title="Alertas Sonoras"
                                        description="Feedback auditivo en acciones."
                                        active={soundEnabled}
                                        onToggle={toggleSound}
                                    />

                                    {/* 2. AQUÍ CONECTAMOS EL TOGGLE REAL */}
                                    <SettingToggle
                                        icon={Moon}
                                        title="Modo Oscuro"
                                        description="Optimizado para ambientes nocturnos."
                                        active={themeMode === 'dark'} // <--- AHORA LEE LA VERDAD
                                        onToggle={toggleTheme}        // <--- AHORA EJECUTA LA ACCIÓN
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Footer (Intacto) */}
                        <div className="p-6 border-t border-white/10 bg-[#0F0F10]">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] outline-none"
                            >
                                <Save size={18} strokeWidth={2.5} />
                                <span className="tracking-wide text-sm">Cerrar</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsPanel;