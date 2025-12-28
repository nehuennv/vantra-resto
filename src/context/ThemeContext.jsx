import React, { createContext, useContext, useState, useEffect } from 'react';
import { hexToTailwindHsl, getContrastColor, hexToHSLValues } from '../lib/colors';
import { clientConfig } from '../config/client';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        color: clientConfig.themeColor,
        logo: clientConfig.logo,
        name: clientConfig.name
    });

    // --- NUEVO: ESTADO GLOBAL DE SONIDO ---
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        const root = document.documentElement;

        // Algoritmo de Aura (Ya lo tenías)
        const primaryHsl = hexToTailwindHsl(theme.color);
        const foregroundHsl = getContrastColor(theme.color);
        const { h } = hexToHSLValues(theme.color);
        const backgroundHsl = `${h} 12% 5%`;
        const sidebarHsl = `${h} 12% 8%`;
        const borderHsl = `${h} 15% 15%`;

        root.style.setProperty('--primary', primaryHsl);
        root.style.setProperty('--primary-foreground', foregroundHsl);
        root.style.setProperty('--background', backgroundHsl);
        root.style.setProperty('--sidebar', sidebarHsl);
        root.style.setProperty('--border-color', borderHsl);

    }, [theme.color]);

    const updateBrandColor = (color) => setTheme(prev => ({ ...prev, color }));
    const updateLogo = (url) => setTheme(prev => ({ ...prev, logo: url }));

    // Función para reproducir sonido de prueba
    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        if (newState) {
            // Un pequeño "beep" sutil para confirmar que activaste el sonido
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            audio.volume = 0.2;
            audio.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            clientConfig,
            updateBrandColor,
            updateLogo,
            soundEnabled, // Exportamos el estado
            toggleSound   // Exportamos la función
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);