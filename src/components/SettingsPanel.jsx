import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Monitor, Type, Save, BellRing } from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

const SettingToggle = ({ icon: Icon, title, description, active, onToggle }) => (
    <div
        onClick={onToggle}
        className={cn(
            "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 group select-none",
            active
                ? "bg-white/5 border-primary shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)] shadow-primary/20"
                : "bg-white/5 border-white-alpha hover:bg-white/10"
        )}
    >
        <div className="flex items-start gap-4">
            <div className={cn(
                "p-2 rounded-lg transition-colors",
                active ? "bg-transparent text-primary" : "bg-transparent text-slate-400 group-hover:text-slate-200"
            )}>
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            </div>
            <div>
                <h4 className={cn("font-medium text-sm transition-colors", active ? "text-white" : "text-slate-300")}>
                    {title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
            </div>
        </div>

        <div className={cn(
            "w-10 h-6 rounded-full relative transition-colors duration-300",
            active ? "bg-primary" : "bg-slate-700"
        )}>
            <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
                active ? "left-5" : "left-1"
            )} />
        </div>
    </div>
);

const SettingsPanel = ({ isOpen, onClose }) => {
    // Importamos soundEnabled y toggleSound del contexto
    const { soundEnabled, toggleSound } = useTheme();

    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);

    const adjustFont = (delta) => {
        setFontSize(prev => Math.min(Math.max(prev + delta, 85), 115));
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
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-[400px] bg-sidebar border-l border-white-alpha shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white-alpha flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h2 className="text-xl font-bold text-foreground font-jakarta tracking-tight">Preferencias</h2>
                                <p className="text-sm text-slate-400">Ajustes visuales del sistema.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors outline-none"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* SECCIÓN 1: ACCESIBILIDAD */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Visualización</h3>

                                <div className="space-y-3"> {/* Espaciado para el grupo visual */}
                                    <div className="bg-white/5 border border-white-alpha rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Type size={18} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-200">Tamaño de Texto</span>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-primary border border-primary/30 px-2 py-0.5 rounded">
                                                {fontSize}%
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1 border border-white/5">
                                            <button
                                                onClick={() => adjustFont(-5)}
                                                className="flex-1 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-md font-bold text-xs transition-colors active:scale-95"
                                            >
                                                A-
                                            </button>
                                            <div className="w-px h-4 bg-white/10"></div>
                                            <button
                                                onClick={() => setFontSize(100)}
                                                className="flex-1 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-md text-[10px] uppercase font-bold transition-colors"
                                            >
                                                Reset
                                            </button>
                                            <div className="w-px h-4 bg-white/10"></div>
                                            <button
                                                onClick={() => adjustFont(5)}
                                                className="flex-1 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-md font-bold text-xs transition-colors active:scale-95"
                                            >
                                                A+
                                            </button>
                                        </div>
                                    </div>

                                    <SettingToggle
                                        icon={Monitor}
                                        title="Modo Alto Contraste"
                                        description="Aumenta la definición de bordes."
                                        active={highContrast}
                                        onToggle={() => setHighContrast(!highContrast)}
                                    />
                                </div>
                            </section>

                            {/* SECCIÓN 2: SISTEMA (AQUI ESTABA EL ERROR DE GAP) */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Notificaciones</h3>

                                {/* FIX: Agregado space-y-3 para separar los items */}
                                <div className="space-y-3">
                                    <SettingToggle
                                        icon={BellRing}
                                        title="Sonidos de Alerta"
                                        description="Reproducir sonido al recibir nuevas reservas."
                                        active={soundEnabled} // Estado real del contexto
                                        onToggle={toggleSound} // Función real
                                    />
                                    <SettingToggle
                                        icon={Moon}
                                        title="Modo Oscuro Forzado"
                                        description="Optimizado para bajo consumo de luz."
                                        active={true}
                                        onToggle={() => { }}
                                    />
                                </div>
                            </section>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white-alpha bg-white/[0.02]">
                            <button
                                onClick={onClose}
                                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Save size={18} />
                                Guardar Preferencias
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsPanel;