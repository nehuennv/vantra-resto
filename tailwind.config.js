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
                // --- SISTEMA VANTRA (Tus colores originales mapeados) ---
                background: "hsl(var(--background) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",
                border: "hsl(var(--border) / <alpha-value>)",
                input: "hsl(var(--input) / <alpha-value>)",
                ring: "hsl(var(--ring) / <alpha-value>)",

                primary: {
                    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
                    light: "hsl(var(--primary-light) / <alpha-value>)", // Nuevo Tono Claro
                    dark: "hsl(var(--primary-dark) / <alpha-value>)",   // Nuevo Tono Oscuro
                    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
                },

                // --- SHADCN/UI (Agregados necesarios para que no se rompa el diseño) ---
                // Estos leen las variables que YA TIENES en tu CSS.
                secondary: {
                    DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
                    foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
                    foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted) / <alpha-value>)",
                    foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent) / <alpha-value>)",
                    foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover) / <alpha-value>)",
                    foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "hsl(var(--card) / <alpha-value>)",
                    foreground: "hsl(var(--card-foreground) / <alpha-value>)",
                },

                // --- TREMOR COLORS (INTACTOS) ---
                tremor: {
                    brand: {
                        faint: "hsl(var(--base-hue) var(--base-sat) 95%)",
                        muted: "hsl(var(--base-hue) var(--base-sat) 85%)",
                        subtle: "hsl(var(--base-hue) var(--base-sat) 70%)",
                        DEFAULT: "hsl(var(--base-hue) var(--base-sat) 60%)",
                        emphasis: "hsl(var(--base-hue) var(--base-sat) 45%)",
                        inverted: colors.white,
                    },
                    background: {
                        // AHORA LEEN LAS VARIABLES DINÁMICAS DE TU CSS
                        muted: "hsl(var(--muted) / <alpha-value>)",
                        subtle: "hsl(var(--card) / <alpha-value>)",
                        DEFAULT: "hsl(var(--background) / <alpha-value>)",
                        emphasis: "hsl(var(--secondary) / <alpha-value>)",
                    },
                    content: {
                        subtle: "hsl(var(--muted-foreground) / <alpha-value>)",
                        DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
                        emphasis: "hsl(var(--foreground) / <alpha-value>)",
                        strong: "hsl(var(--foreground) / <alpha-value>)",
                        inverted: "hsl(var(--background) / <alpha-value>)",
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
                // Tus radios de Tremor
                'tremor-default': '0.5rem',
                'tremor-content': '0.75rem',
                'tremor-small': '0.375rem',

                // Radios necesarios para Shadcn (lg, md, sm)
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    // PLUGIN OBLIGATORIO PARA SHADCN (Si no está instalado, corre: npm i tailwindcss-animate)
    plugins: [require("tailwindcss-animate")],
}