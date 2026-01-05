import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const AnimatedSwitch = ({ options, value, onChange, className }) => {
    return (
        <div className={cn("relative flex bg-muted/30 p-1 rounded-xl border border-border/50", className)}>
            {options.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold transition-colors duration-200 outline-none focus:outline-none focus:ring-0",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                        tabIndex={0}
                        type="button"
                    >
                        {isActive && (
                            <motion.div
                                layoutId={`active-bg-${options.map(o => o.value).join('-')}`} // Unique ID based on values to prevent conflict if multiple switches exist
                                className="absolute inset-0 bg-background dark:bg-muted border border-primary/20 shadow-sm rounded-lg"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                            </motion.div>
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {option.icon && <option.icon size={14} />}
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default AnimatedSwitch;
