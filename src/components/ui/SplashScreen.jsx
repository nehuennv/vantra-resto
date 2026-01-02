import React from 'react';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { clientConfig } from '../../config/client';

const SplashScreen = ({ message }) => {
    const brandColor = clientConfig.themeColor || '#F97316';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
            {/* 1. Fondo Atmosférico (Igual al Login para continuidad) */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundColor: brandColor }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${brandColor}15 0%, transparent 60%)`
                }}
            />

            {/* 2. Logo Animado */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="relative z-10 scale-150 p-6"
            >
                <BrandLogo />
            </motion.div>

            {/* 3. Indicador de Carga (Barra de progreso sutil) */}
            <div className="absolute bottom-20 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full rounded-full"
                    style={{ background: brandColor }}
                />
            </div>

            {/* Texto de carga */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 text-[10px] text-zinc-500 font-medium tracking-widest uppercase"
            >
                {message || "Sincronizando Entorno..."}
            </motion.p>
        </motion.div>
    );
};

export default SplashScreen;
