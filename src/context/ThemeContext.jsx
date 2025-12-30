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
    const [themeMode, setThemeMode] = useState(() => getStorage('vantra_theme_mode', 'dark'));
    const [fontSize, setFontSize] = useState(() => getStorage('vantra_fontsize', 100));
    const [highContrast, setHighContrast] = useState(() => getStorage('vantra_contrast', false));

    // 3. ALGORITMO AURA DUAL (Fix de variables)
    useEffect(() => {
        const root = document.documentElement;

        const primaryHsl = hexToTailwindHsl(theme.color);
        const foregroundHsl = getContrastColor(theme.color);
        const { h } = hexToHSLValues(theme.color);

        // Variables Fijas (Color de Marca)
        root.style.setProperty('--primary', primaryHsl);
        root.style.setProperty('--primary-foreground', foregroundHsl);

        // El anillo de foco (Ring) suele ser el color primario con opacidad o similar
        root.style.setProperty('--ring', primaryHsl);

        if (themeMode === 'light') {
            // --- MODO CLARO ---
            root.classList.remove('dark');
            root.classList.add('light');

            // Fondo casi blanco (96% luz, matiz de marca) - No tan blanco puro (#FFF)
            root.style.setProperty('--background', `${h} 20% 96%`);

            // Texto oscuro
            root.style.setProperty('--foreground', `${h} 40% 10%`);

            // Elementos secundarios (Sidebars/Cards suaves) -> Usamos --muted
            root.style.setProperty('--muted', `${h} 15% 96%`);
            root.style.setProperty('--muted-foreground', `${h} 10% 40%`);

            // BORDES & INPUTS: 
            // Gris suave (90% luz) para que se note sobre blanco pero no ensucie.
            // Sincronizamos --border y --input
            const borderVal = `${h} 15% 90%`;
            root.style.setProperty('--border', borderVal);
            root.style.setProperty('--input', borderVal);

        } else {
            // --- MODO OSCURO (Vantra Premium) ---
            root.classList.remove('light');
            root.classList.add('dark');

            // Fondo profundo (5% luz)
            root.style.setProperty('--background', `${h} 30% 6%`);

            // Texto claro
            root.style.setProperty('--foreground', `${h} 10% 98%`);

            // Elementos secundarios (Sidebar/Cards) -> Un poco más claros que el fondo (10% luz)
            root.style.setProperty('--muted', `${h} 25% 10%`);
            root.style.setProperty('--muted-foreground', `${h} 10% 70%`);

            // BORDES & INPUTS (EL FIX FINAL):
            // Usamos un valor sólido pero oscuro (18% luz).
            // Visualmente funciona como una línea translúcida sobre el fondo negro.
            // NO usamos opacidad aquí, usamos un color "computed" para evitar superposiciones raras.
            const borderVal = `${h} 20% 18%`;
            root.style.setProperty('--border', borderVal);
            root.style.setProperty('--input', borderVal);
        }

    }, [theme.color, themeMode]);

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
            // Nota: Asegúrate de que este sonido exista o cámbialo por uno local
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