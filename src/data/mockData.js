// src/data/mockData.js

// Utilidad para asegurar que siempre sean para HOY (así el Dashboard explota de datos)
const getTodayString = () => new Date().toISOString().split('T')[0];
const TODAY = getTodayString();

export const initialReservations = [
    // --- TURNO 19:00 / 20:00 (Early Birds) ---
    {
        id: 1,
        name: "Mesa Empresarial Tech",
        time: "19:30",
        pax: 12,
        date: TODAY,
        phone: "1155550001",
        status: "seated", // Ya están comiendo
        origin: "phone",
        tags: ["Factura A", "Menú Ejecutivo"],
        createdAt: "2023-10-10"
    },
    {
        id: 2,
        name: "Ana & Clara",
        time: "20:00",
        pax: 2,
        date: TODAY,
        phone: "1155550002",
        status: "seated",
        origin: "walk-in",
        tags: [],
        createdAt: TODAY
    },
    {
        id: 3,
        name: "Familia Rossi",
        time: "20:00",
        pax: 5,
        date: TODAY,
        phone: "1155550003",
        status: "seated",
        origin: "whatsapp",
        tags: ["Silla Bebé"],
        createdAt: TODAY
    },
    {
        id: 4,
        name: "Roberto Gomez",
        time: "20:15",
        pax: 3,
        date: TODAY,
        phone: "1155550004",
        status: "seated",
        origin: "whatsapp",
        tags: [],
        createdAt: TODAY
    },

    // --- TURNO 21:00 (Pico Fuerte - El Bot trabajó duro aquí) ---
    {
        id: 5,
        name: "Valentina Zenere",
        time: "21:00",
        pax: 4,
        date: TODAY,
        phone: "1155550005",
        status: "confirmed",
        origin: "whatsapp",
        tags: ["Celíaco", "VIP"],
        createdAt: "2023-10-12"
    },
    {
        id: 6,
        name: "Grupo Despedida Soltera",
        time: "21:00",
        pax: 10,
        date: TODAY,
        phone: "1155550006",
        status: "confirmed",
        origin: "whatsapp",
        tags: ["Adelanto Pago", "Ruido"],
        createdAt: "2023-12-01"
    },
    {
        id: 7,
        name: "Carlos Tevez",
        time: "21:00",
        pax: 6,
        date: TODAY,
        phone: "1155550007",
        status: "confirmed",
        origin: "phone", // Llamó directo al dueño
        tags: ["VIP", "Mesa Privada"],
        createdAt: TODAY
    },
    {
        id: 8,
        name: "Lucia Méndez",
        time: "21:00",
        pax: 2,
        date: TODAY,
        phone: "1155550008",
        status: "confirmed",
        origin: "whatsapp",
        tags: [],
        createdAt: TODAY
    },
    {
        id: 9,
        name: "Marcos & Sol",
        time: "21:15",
        pax: 2,
        date: TODAY,
        phone: "1155550009",
        status: "confirmed",
        origin: "whatsapp",
        tags: ["Aniversario"],
        createdAt: TODAY
    },
    {
        id: 10,
        name: "Turistas USA",
        time: "21:15",
        pax: 4,
        date: TODAY,
        phone: "1155550010",
        status: "pending", // Falta reconfirmar
        origin: "whatsapp",
        tags: ["Inglés"],
        createdAt: TODAY
    },

    // --- TURNO 21:30 / 22:00 (Segunda Ola) ---
    {
        id: 11,
        name: "Julian Álvarez",
        time: "21:30",
        pax: 2,
        date: TODAY,
        phone: "1155550011",
        status: "confirmed",
        origin: "whatsapp",
        tags: ["VIP"],
        createdAt: TODAY
    },
    {
        id: 12,
        name: "Mesa Cumpleaños 30",
        time: "22:00",
        pax: 15,
        date: TODAY,
        phone: "1155550012",
        status: "confirmed",
        origin: "whatsapp",
        tags: ["Torta Propia", "Globo"],
        createdAt: "2023-11-20"
    },
    {
        id: 13,
        name: "Ignacio F.",
        time: "22:00",
        pax: 3,
        date: TODAY,
        phone: "1155550013",
        status: "confirmed",
        origin: "walk-in", // Llegaron y esperan mesa
        tags: [],
        createdAt: TODAY
    },
    {
        id: 14,
        name: "Sofi Maure",
        time: "22:00",
        pax: 5,
        date: TODAY,
        phone: "1155550014",
        status: "confirmed",
        origin: "whatsapp",
        tags: ["Vegetarianos"],
        createdAt: TODAY
    },
    {
        id: 15,
        name: "Pedro P.",
        time: "22:00",
        pax: 2,
        date: TODAY,
        phone: "1155550015",
        status: "pending",
        origin: "whatsapp",
        tags: [],
        createdAt: TODAY
    },
    {
        id: 16,
        name: "Agustina L.",
        time: "22:15",
        pax: 4,
        date: TODAY,
        phone: "1155550016",
        status: "confirmed",
        origin: "whatsapp",
        tags: [],
        createdAt: TODAY
    },

    // --- TURNO TRASNOCHE 23:00 (Cierre) ---
    {
        id: 17,
        name: "Staff Bar Vecino",
        time: "23:00",
        pax: 6,
        date: TODAY,
        phone: "1155550017",
        status: "confirmed",
        origin: "phone",
        tags: ["Amigos Casa"],
        createdAt: TODAY
    },
    {
        id: 18,
        name: "Pareja Tarde",
        time: "23:15",
        pax: 2,
        date: TODAY,
        phone: "1155550018",
        status: "confirmed",
        origin: "whatsapp",
        tags: [],
        createdAt: TODAY
    },

    // --- MÁS RELLENO (Reservas chicas variadas para hacer bulto) ---
    { id: 19, name: "Lucas M.", time: "20:30", pax: 2, date: TODAY, status: "seated", origin: "whatsapp", tags: [] },
    { id: 20, name: "Flor K.", time: "20:30", pax: 4, date: TODAY, status: "seated", origin: "whatsapp", tags: [] },
    { id: 21, name: "Gonza B.", time: "20:45", pax: 2, date: TODAY, status: "seated", origin: "walk-in", tags: [] },
    { id: 22, name: "Mica T.", time: "21:00", pax: 3, date: TODAY, status: "confirmed", origin: "whatsapp", tags: [] },
    { id: 23, name: "Rodri S.", time: "21:15", pax: 2, date: TODAY, status: "confirmed", origin: "whatsapp", tags: [] },
    { id: 24, name: "Cami V.", time: "21:30", pax: 4, date: TODAY, status: "confirmed", origin: "phone", tags: [] },
    { id: 25, name: "Tomi R.", time: "21:45", pax: 2, date: TODAY, status: "confirmed", origin: "whatsapp", tags: [] },
    { id: 26, name: "Luana P.", time: "22:00", pax: 6, date: TODAY, status: "confirmed", origin: "whatsapp", tags: ["Cumple"] },
    { id: 27, name: "Fede G.", time: "22:15", pax: 2, date: TODAY, status: "confirmed", origin: "whatsapp", tags: [] },
    { id: 28, name: "Matias Q.", time: "22:30", pax: 2, date: TODAY, status: "confirmed", origin: "walk-in", tags: [] },
    { id: 29, name: "Sabrina O.", time: "22:45", pax: 3, date: TODAY, status: "confirmed", origin: "whatsapp", tags: [] },
    { id: 30, name: "Grupo Oficina", time: "19:00", pax: 8, date: TODAY, status: "finished", origin: "whatsapp", tags: ["Happy Hour"] }, // Ya se fueron
    { id: 31, name: "Leo Messi", time: "21:00", pax: 2, date: TODAY, status: "pending", origin: "phone", tags: ["Soñar no cuesta nada"] },

    // --- RESERVAS FUTURAS (Para probar el calendario) ---
    {
        id: 32,
        name: "Reserva Futura 1",
        time: "21:00",
        pax: 4,
        date: "2025-12-31", // Fecha lejana
        phone: "1155559999",
        status: "confirmed",
        origin: "whatsapp",
        tags: ["Año Nuevo"],
        createdAt: TODAY
    },
    {
        id: 33,
        name: "Evento Privado",
        time: "20:00",
        pax: 40,
        date: "2025-01-15",
        phone: "1155558888",
        status: "confirmed",
        origin: "phone",
        tags: ["Seña Paga"],
        createdAt: TODAY
    }
];

// ... (Tus reservas anteriores)

// --- DATOS HISTÓRICOS (Para que funcionen AMBOS turnos) ---
export const historicalAverages = {
    lunch: [
        { time: '11:00', personas: 2 },
        { time: '12:00', personas: 15 },
        { time: '13:00', personas: 45 }, // Pico almuerzo
        { time: '14:00', personas: 30 },
        { time: '15:00', personas: 10 },
        { time: '16:00', personas: 5 },
    ],
    dinner: [
        { time: '19:00', personas: 10 },
        { time: '20:00', personas: 35 },
        { time: '21:00', personas: 85 }, // Pico cena
        { time: '22:00', personas: 70 },
        { time: '23:00', personas: 40 },
        { time: '00:00', personas: 20 },
        { time: '01:00', personas: 5 },
    ]
};