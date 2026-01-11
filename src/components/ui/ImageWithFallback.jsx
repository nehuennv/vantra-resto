import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImageWithFallback({ src, alt, className }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setError(true);
    };

    return (
        <div className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${className}`}>
            {/* Fallback / Error State */}
            {(error || !src) && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                    <Utensils size={32} strokeWidth={1.5} />
                </div>
            )}

            {/* Actual Image */}
            {!error && src && (
                <motion.img
                    src={src}
                    alt={alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoading ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}

            {/* Loading Skeleton */}
            {isLoading && !error && (
                <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            )}
        </div>
    );
}
