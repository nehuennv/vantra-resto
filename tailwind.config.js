/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        transparent: 'transparent',
        current: 'currentColor',
        extend: {
            colors: {
                // --- VARIABLES DINÁMICAS ---
                background: "hsl(var(--background) / <alpha-value>)",
                sidebar: "hsl(var(--sidebar) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",

                // --- EL FIX DEFINITIVO ---
                // Mapeamos 'white-alpha' a la variable de borde.
                // IMPORTANTE: Al usar ThemeContext nuevo, --border-color ya tiene el color exacto (Gris Oscuro o Gris Claro).
                // No necesitamos que sea blanca con transparencia, necesitamos que sea del color del borde.
                "white-alpha": "hsl(var(--border-color) / <alpha-value>)",

                primary: {
                    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
                    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
                },

                // --- TREMOR COLORS (Originales) ---
                tremor: {
                    brand: {
                        faint: colors.blue[50],
                        muted: colors.blue[200],
                        subtle: colors.blue[400],
                        DEFAULT: colors.blue[500],
                        emphasis: colors.blue[700],
                        inverted: colors.white,
                    },
                    background: {
                        muted: "#131A2B",
                        subtle: colors.gray[800],
                        DEFAULT: "#0b1120",
                        emphasis: colors.gray[700],
                    },
                    content: {
                        subtle: colors.gray[400],
                        DEFAULT: colors.gray[200],
                        emphasis: colors.white,
                        strong: colors.gray[50],
                        inverted: colors.black,
                    },
                },
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            boxShadow: {
                'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            borderRadius: {
                'tremor-default': '0.5rem',
                'tremor-content': '0.75rem',
                'tremor-small': '0.375rem',
            },
        },
    },
    plugins: [],
}