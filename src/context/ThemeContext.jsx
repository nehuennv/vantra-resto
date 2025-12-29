import React, { createContext, useContext, useState, useEffect } from 'react';
import { hexToTailwindHsl, getContrastColor, hexToHSLValues } from '../lib/colors';
import { clientConfig } from '../config/client';

const ThemeContext = createContext();

// Helper para leer de LocalStorage de forma segura
const getStorage = (key, defaultValue) => {
    try {
        const saved = localStorage.getItem(key);
        return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

export const ThemeProvider = ({ children }) => {
    // 1. CONFIGURACIÓN
    const [theme, setTheme] = useState({
        color: clientConfig.themeColor,
        logo: clientConfig.logo,
        name: clientConfig.name
    });

    // 2. ESTADOS (Persistentes)
    const [soundEnabled, setSoundEnabled] = useState(() => getStorage('vantra_sound', true));
    const [themeMode, setThemeMode] = useState(() => getStorage('vantra_theme_mode', 'dark')); // <--- ESTO FALTABA
    const [fontSize, setFontSize] = useState(() => getStorage('vantra_fontsize', 100));
    const [highContrast, setHighContrast] = useState(() => getStorage('vantra_contrast', false));

    // 3. ALGORITMO AURA DUAL (Aquí arreglamos los bordes)
    useEffect(() => {
        const root = document.documentElement;

        const primaryHsl = hexToTailwindHsl(theme.color);
        const foregroundHsl = getContrastColor(theme.color);
        const { h } = hexToHSLValues(theme.color);

        // Variables Fijas (Color de Marca)
        root.style.setProperty('--primary', primaryHsl);
        root.style.setProperty('--primary-foreground', foregroundHsl);

        if (themeMode === 'light') {
            // --- MODO CLARO ---
            // Fondo casi blanco (98% luz)
            root.style.setProperty('--background', `${h} 20% 98%`);
            // Sidebar un pelín más oscuro para contraste (95% luz)
            root.style.setProperty('--sidebar', `${h} 15% 95%`);
            // Texto oscuro (10% luz)
            root.style.setProperty('--foreground', `${h} 40% 10%`);
            // BORDES: Gris suave (88% luz) -> Si esto fuera blanco, no se vería
            root.style.setProperty('--border-color', `${h} 10% 88%`);

            root.classList.remove('dark');
            root.classList.add('light');
        } else {
            // --- MODO OSCURO ---
            // Fondo oscuro (5% luz)
            root.style.setProperty('--background', `${h} 12% 5%`);
            // Sidebar un pelín más claro (8% luz)
            root.style.setProperty('--sidebar', `${h} 12% 8%`);
            // Texto claro (98% luz)
            root.style.setProperty('--foreground', `${h} 10% 98%`);
            // BORDES: Gris oscuro (15% luz). AQUÍ ESTÁ LA CLAVE.
            // Si esto se pone muy alto, los bordes brillan. 15% es sutil.
            root.style.setProperty('--border-color', `${h} 15% 15%`);

            root.classList.remove('light');
            root.classList.add('dark');
        }

    }, [theme.color, themeMode]); // Se ejecuta cuando cambia el color O el modo

    // 4. PERSISTENCIA
    useEffect(() => { localStorage.setItem('vantra_sound', JSON.stringify(soundEnabled)); }, [soundEnabled]);
    useEffect(() => { localStorage.setItem('vantra_theme_mode', JSON.stringify(themeMode)); }, [themeMode]);
    useEffect(() => {
        localStorage.setItem('vantra_fontsize', JSON.stringify(fontSize));
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);
    useEffect(() => {
        localStorage.setItem('vantra_contrast', JSON.stringify(highContrast));
        if (highContrast) document.body.classList.add('high-contrast');
        else document.body.classList.remove('high-contrast');
    }, [highContrast]);

    // 5. ACTIONS
    const updateBrandColor = (color) => setTheme(prev => ({ ...prev, color }));
    const updateLogo = (url) => setTheme(prev => ({ ...prev, logo: url }));

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        if (newState) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            audio.volume = 0.2;
            audio.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            clientConfig,
            updateBrandColor,
            updateLogo,
            soundEnabled,
            toggleSound,
            themeMode,
            setThemeMode,
            toggleTheme,
            fontSize,
            setFontSize,
            highContrast,
            setHighContrast
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);