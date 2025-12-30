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
                : "bg-card border-border hover:bg-muted"
        )}
    >
        {!active && (
            <div className="absolute inset-0 bg-gradient-to-r from-muted to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}

        <div className="relative z-10 flex items-start gap-4">
            <div className={cn(
                "p-2.5 rounded-xl transition-colors duration-300",
                active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted/80 text-muted-foreground group-hover:text-foreground group-hover:bg-muted"
            )}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
            </div>
            <div>
                <h4 className={cn(
                    "font-bold text-sm transition-colors font-jakarta",
                    active ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
                )}>
                    {title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed font-medium">
                    {description}
                </p>
            </div>
        </div>

        {/* Toggle Switch con Vantra Semantics */}
        <div className={cn(
            "w-12 h-7 rounded-full relative transition-colors duration-300 flex items-center px-1",
            active
                ? "bg-primary justify-end"
                : "bg-muted/80 border border-border justify-start"
        )}>
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                    "w-5 h-5 rounded-full shadow-sm",
                    active ? "bg-primary-foreground" : "bg-foreground/30"
                )}
            />
        </div>
    </div>
);

const SettingsPanel = ({ isOpen, onClose }) => {
    const {
        soundEnabled,
        toggleSound,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        themeMode,
        toggleTheme
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
                    {/* Overlay Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Panel Principal */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-background border-l border-border shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header con Glass Effect */}
                        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-card">
                            <div>
                                <h2 className="text-xl font-bold text-foreground font-jakarta tracking-tight">
                                    Preferencias
                                </h2>
                                <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                                    Configuración del Sistema
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90 outline-none focus:ring-2 ring-ring"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body con Scrollbar Vantra */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

                            {/* SECCIÓN TIPOGRAFÍA */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 opacity-80">
                                    <Type size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                                        Tipografía
                                    </h3>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground/90">
                                            Escala de Texto
                                        </span>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                                            {fontSize}%
                                        </span>
                                    </div>

                                    <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border h-12 relative">
                                        <button
                                            onClick={() => adjustFont(-5)}
                                            disabled={fontSize <= 85}
                                            className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors rounded-lg hover:bg-muted/80 active:bg-muted"
                                        >
                                            <span className="text-xs font-bold">A-</span>
                                        </button>

                                        <div className="w-px h-4 bg-border" />

                                        <button
                                            onClick={() => setFontSize(100)}
                                            className="flex-[2] h-full flex items-center justify-center gap-2 text-foreground/80 hover:text-foreground transition-colors text-[10px] font-bold uppercase tracking-wider hover:bg-muted/80"
                                        >
                                            {fontSize === 100 && <Check size={12} className="text-primary" />}
                                            Predeterminado
                                        </button>

                                        <div className="w-px h-4 bg-border" />

                                        <button
                                            onClick={() => adjustFont(5)}
                                            disabled={fontSize >= 115}
                                            className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors rounded-lg hover:bg-muted/80 active:bg-muted"
                                        >
                                            <span className="text-base font-bold">A+</span>
                                        </button>
                                    </div>

                                    <div className="h-px w-full bg-border my-2" />

                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] text-muted-foreground font-medium">
                                            Compacto
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-medium">
                                            Amplio
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* SECCIÓN INTERFAZ */}
                            <section>
                                <div className="flex items-center gap-2 mb-4 opacity-80">
                                    <Monitor size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                                        Interfaz
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {/* <SettingToggle
                                        icon={Monitor}
                                        title="Alto Contraste"
                                        description="Resalta bordes y separadores."
                                        active={highContrast}
                                        onToggle={() => setHighContrast(!highContrast)}
                                    /> */}

                                    <SettingToggle
                                        icon={BellRing}
                                        title="Alertas Sonoras"
                                        description="Feedback auditivo en acciones."
                                        active={soundEnabled}
                                        onToggle={toggleSound}
                                    />

                                    <SettingToggle
                                        icon={Moon}
                                        title="Modo Oscuro"
                                        description="Optimizado para ambientes nocturnos."
                                        active={themeMode === 'dark'}
                                        onToggle={toggleTheme}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Footer con Botón Principal */}
                        <div className="p-6 border-t border-border bg-card">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] outline-none focus:ring-2 ring-ring ring-offset-2 ring-offset-background"
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