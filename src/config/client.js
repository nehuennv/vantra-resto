// src/config/client.js

export const clientConfig = {
    // --- IDENTIDAD ---
    name: "La Cabrera",
    shortName: "Cabrera",
    themeColor: '#ef4444',
    currency: "$",
    locale: "es-AR",

    // --- LÓGICA DE NEGOCIO (CORE) ---
    businessLogic: {
        maxCapacityPax: 210,
        totalTables: 25,

        // ALGORITMO DE TIEMPO:
        // averageTicketTimeMinutes: Este valor es la SEMILLA inicial.
        // Con el tiempo, el backend lo sobrescribirá con el real calculado.
        averageTicketTimeMinutes: 90,

        // MODALIDAD DE SERVICIO:
        // 'split': Muestra tabs para Mediodía / Noche.
        // 'continuous': Muestra una línea de tiempo única.
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