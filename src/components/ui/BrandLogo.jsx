import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon } from "lucide-react"; // O el icono que uses
import { cn } from "../../lib/utils";

const BrandLogo = ({ collapsed = false }) => {
    return (
        <div className={cn(
            "relative flex items-center h-12 transition-all duration-500",
            collapsed ? "justify-center w-full px-0" : "justify-start gap-3 px-2"
        )}>
            {/* ICONO - Siempre visible, pero ajusta tamaño sutilmente */}
            <div className="relative z-10 flex items-center justify-center shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 text-primary-foreground">
                    <Hexagon size={24} strokeWidth={2.5} className="fill-white/20" />
                </div>
            </div>

            {/* TEXTO - Se oculta suavemente con AnimatePresence */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -10, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex flex-col justify-center overflow-hidden whitespace-nowrap"
                    >
                        <span className="font-bold text-lg tracking-tight leading-none text-foreground">
                            Vantra
                            <span className="text-primary">.</span>
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                            Resto Manager
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BrandLogo;