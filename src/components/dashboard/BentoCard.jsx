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
            // CAMBIO: Se eliminó "y: -4" para que la tarjeta no se mueva hacia arriba.
            whileHover={{ transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className={cn(
                "relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#0F0F10] p-6 shadow-2xl backdrop-blur-sm",
                "hover:border-white/15 hover:shadow-primary/5 transition-all duration-300 group",
                gradient && "bg-gradient-to-br from-[#0F0F10] to-[#18181b]",
                className
            )}
        >
            {/* Glow Effect (Efecto de luz de fondo) */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors duration-500 opacity-50" />

            {/* Header de la Tarjeta */}
            {(title || Icon) && (
                <div className="flex items-center justify-between mb-6 z-10 relative">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="p-2 rounded-xl bg-white/5 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                <Icon size={18} />
                            </div>
                        )}
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
                            {title}
                        </span>
                    </div>
                    {/* Botón o acción extra en la esquina derecha */}
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}

            {/* Contenido Principal */}
            <div className="flex-1 z-10 relative min-h-0 flex flex-col">{children}</div>
        </motion.div>
    );
};

export default BentoCard;