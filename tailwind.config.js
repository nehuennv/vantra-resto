/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
    darkMode: 'class', // Habilita el control manual del modo oscuro
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
                // --- SISTEMA DE COLORES VANTRA (Semántico) ---
                // Estos colores "escucharán" a tus variables CSS en index.css

                background: "hsl(var(--background) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",

                // AQUÍ ESTÁ LA MAGIA DEL BORDE:
                // Usaremos 'border-border' en tus componentes.
                border: "hsl(var(--border) / <alpha-value>)",

                // Extras útiles para inputs y formularios premium
                input: "hsl(var(--input) / <alpha-value>)",
                ring: "hsl(var(--ring) / <alpha-value>)",

                primary: {
                    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
                    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
                },

                // --- TREMOR COLORS (Intactos) ---
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