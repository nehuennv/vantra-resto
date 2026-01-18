// src/config/client.js

// --- PALETA DE COLORES (Descomenta la que quieras usar) ---
const COLOR_VARIANTS = {
    // --- CLÁSICOS / ELEGANTES ---
    SignatureGold: '#ffc400',   // Lujo, Tradición, Carnes Premium             
    RoyalPurple: '#7c3aed',     // Sofisticado, Lounge, Vinos
    MidnightBlue: '#0f172a',    // Serio, Corporativo, Minimalista (Cuidado con dark mode)
    RubyRed: '#e11d48',         // Pasión, Italiano, Carnes Rojas

    // --- MODERNOS / VIBRANTES ---
    ElectricLime: '#E8EF41',    // Disruptivo, Fast-Casual, Joven
    HotPink: '#EF4178',         // Sushi Bar, Cocktails, Fiesta
    CyanFuture: '#06b6d4',      // Tecnológico, Mariscos, Frío
    SunsetOrange: '#FC7E32',    // Burgers, Rápido, Apetitoso

    // --- FRESCOS / NATURALES ---
    MintTeal: '#0AD3A4',        // Vegano, Saludable, Brunch
    SageGreen: '#84cc16',       // Ensaladas, Eco-Friendly
    OceanBlue: '#3b82f6',       // Costa, Pescados, Aire Libre

    // --- CÁLIDOS / ACOGEDORES ---
    Terracotta: '#c2410c',      // Horno de Barro, rústico, Pizza
    Saffron: '#fbbf24',         // Especias, Indio, Arabe
    Espresso: '#78350f',        // Cafetería, Pastelería, Chocolate

    // --- TENDENCIA (NEON / CYBER) ---
    NeonViolet: '#d946ef',      // Bar Nocturno, Arcade
    AcidGreen: '#a3e635', 
    CerebralBlue: '#6AAAE8',      // Smoothie Bar, Gym Food
};

// <--- CAMBIA ESTO PARA PROBAR COLORES
const ACTIVE_COLOR = COLOR_VARIANTS.SunsetOrange;

export const clientConfig = {

    name: "La Cabrera",
    shortName: "Cabrera",
    themeColor: ACTIVE_COLOR,
    currency: "$",
    locale: "es-AR",

    // --- (CORE) ---
    businessLogic: {
        maxCapacityPax: 400,
        totalTables: 25,
        averageTicketTimeMinutes: 90,
        serviceMode: 'split',

        shifts: {
            lunch: {
                label: "Mediodía",
                start: "11:00",
                end: "16:00",
                active: true
            },
            dinner: {
                label: "Noche",
                start: "19:00",
                end: "01:00",
                active: true
            }
        }
    },

    contact: {
        address: "José A. Cabrera 5099, CABA",
        whatsapp: "5491155554444",
    }
};