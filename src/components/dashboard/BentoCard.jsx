import React from 'react';
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const BentoCard = ({
    children,
    className,
    delay = 0,
    title,
    icon: Icon,
    headerAction,
    gradient = false
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className={cn(
                // --- 1. SUPERFICIE SEMÁNTICA (Regla 2) ---
                "relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm backdrop-blur-sm",
                "hover:border-primary/30 hover:shadow-md transition-all duration-300 group",

                // --- 2. GRADIENTE SEMÁNTICO (Opcional) ---
                gradient && "bg-gradient-to-br from-card to-muted/50",
                className
            )}
        >
            {/* Glow Effect: Dinámico con el color de marca (text-primary) */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors duration-500 opacity-50 pointer-events-none" />

            {/* Header de la Tarjeta */}
            {(title || Icon) && (
                <div className="flex items-center justify-between mb-6 z-10 relative">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            // Icono con rol funcional: bg-muted y texto dinámico
                            <div className="p-2 rounded-xl bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
                                <Icon size={18} />
                            </div>
                        )}
                        {/* --- 3. TIPOGRAFÍA SEMÁNTICA (Regla 2) --- */}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            {title}
                        </span>
                    </div>

                    {/* Acción extra: Mantiene el contexto del tema */}
                    {headerAction && <div className="z-20 relative">{headerAction}</div>}
                </div>
            )}

            {/* --- 4. CONTENIDO PRINCIPAL --- */}
            {/* text-foreground asegura legibilidad total en Light y Dark */}
            <div className="flex-1 z-10 relative min-h-0 flex flex-col text-foreground">
                {children}
            </div>
        </motion.div>
    );
};

export default BentoCard;