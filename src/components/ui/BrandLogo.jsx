import React from "react";
import { UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

const BrandLogo = ({ collapsed }) => {
    const { clientConfig } = useTheme();

    return (
        // Quitamos justify-center. Dejamos que el padding del padre (DashboardLayout) controle la posición.
        <div className="relative flex items-center w-full overflow-hidden">

            {/* 1. EL ÍCONO */}
            {/* Usamos w-10 h-10 (40px) EXACTOS para coincidir con los botones del sidebar */}
            {/* Quitamos sombras rojas y fondos fuertes. Solo el logo limpio. */}
            <div className="flex items-center justify-center w-10 h-10 shrink-0 z-20">
                {clientConfig.logo ? (
                    <img
                        src={clientConfig.logo}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-xl"
                    />
                ) : (
                    // Si no hay logo, mostramos el ícono en el color primario, simple.
                    <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-xl text-primary">
                        <UtensilsCrossed size={22} strokeWidth={2.5} />
                    </div>
                )}
            </div>

            {/* 2. EL TEXTO */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col ml-3 overflow-hidden whitespace-nowrap"
                    >
                        <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
                            {clientConfig.name || "Vantra"}
                        </h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BrandLogo;