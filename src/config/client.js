// src/config/client.js

export const clientConfig = {
    // --- IDENTIDAD ---
    name: "La Cabrera",
    shortName: "Cabrera",
    themeColor: '#8E0B27',
    //#E8EF41
    //#EF4178
    //#0AD3A4
    //#F97316
    //#F97316
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