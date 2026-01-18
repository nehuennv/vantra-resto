import React, { useRef, useState } from 'react';
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
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className={cn(
                // Base structure: Glassmorphism + Rounded Corners
                "relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-xl",
                "transition-all duration-300 group hover:border-primary/30",
                className
            )}
        >
            {/* --- SPOTLIGHT EFFECT LAYERS --- */}

            {/* 1. Fondo sutil que sigue al mouse */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, hsl(var(--primary) / 0.03), transparent 40%)`,
                }}
            />

            {/* 2. Borde brillante que sigue al mouse (Masking Trick) */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, hsl(var(--primary) / 0.07), transparent 40%)`,
                    maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                    WebkitMaskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                }}
            />

            {/* Header Semántico */}
            {(title || Icon) && (
                <div className="flex items-center justify-between mb-6 z-20 relative">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="p-2 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]">
                                <Icon size={18} />
                            </div>
                        )}
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                            {title}
                        </span>
                    </div>
                    {headerAction && <div className="z-20 relative">{headerAction}</div>}
                </div>
            )}

            <div className="flex-1 z-10 relative min-h-0 flex flex-col w-full h-full text-foreground">
                {children}
            </div>
        </motion.div>
    );
};

export default BentoCard;