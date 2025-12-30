// src/data/mockData.js

// Utilidad para generar fechas
const getTodayString = () => new Date().toISOString().split('T')[0];
const TODAY = getTodayString(); // 2025-12-29

// Genera fecha relativa (días hacia atrás o adelante)
const getDateOffset = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

// Nombres realistas argentinos
const nombres = [
    "Martín González", "Lucía Fernández", "Santiago Rodríguez", "Valentina López",
    "Mateo García", "Sofía Martínez", "Lucas Pérez", "Emma Sánchez",
    "Benjamín Romero", "Isabella Torres", "Thiago Silva", "Mía Flores",
    "Joaquín Benítez", "Catalina Morales", "Felipe Castro", "Emilia Ruiz",
    "Nicolás Herrera", "Camila Ortiz", "Agustín Medina", "Victoria Navarro",
    "Tomás Ramírez", "Julieta Ríos", "Diego Vargas", "Abril Molina",
    "Maximiliano Acosta", "Francesca Vega", "Gabriel Mendoza", "Alma Guerrero",
    "Rafael Paredes", "Zoe Campos", "Samuel Ibáñez", "Luna Carrillo",
    "Daniel Reyes", "Olivia Ramos", "Adrián Jiménez", "Renata Domínguez",
    "Pablo Núñez", "Bianca Guzmán", "Ignacio Ponce", "Delfina Rojas",
    "Francisco Cabrera", "Jazmín Sosa", "Facundo Aguirre", "Josefina Vera",
    "Bruno Díaz", "Antonella Miranda", "Esteban Suárez", "Violeta Cruz",
    "Rodrigo Alvarez", "Constanza Peña", "Manuel Figueroa", "Lara Cortés"
];

// Horarios de almuerzo y cena
const horariosAlmuerzo = ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
const horariosCena = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];

// Tamaños de grupo realistas
const gruposPax = [2, 2, 2, 2, 3, 3, 4, 4, 5, 6, 8, 10, 12]; // Más parejas

// Orígenes
const origenes = ["whatsapp", "whatsapp", "whatsapp", "phone", "walk-in"];

// Estados
const estados = ["confirmed", "confirmed", "confirmed", "seated", "pending", "finished"];

// Tags variados
const tagsPosibles = [
    [], [], [], // Mayoría sin tags
    ["VIP"], ["Celíaco"], ["Vegetariano"], ["Aniversario"], ["Cumpleaños"],
    ["Silla Bebé"], ["Ventana"], ["Terraza"], ["Inglés"], ["Adelanto Pago"]
];

// Función helper para generar reserva
const generarReserva = (id, daysOffset, turno) => {
    const horarios = turno === 'almuerzo' ? horariosAlmuerzo : horariosCena;
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const time = horarios[Math.floor(Math.random() * horarios.length)];
    const pax = gruposPax[Math.floor(Math.random() * gruposPax.length)];
    const date = getDateOffset(daysOffset);
    const status = estados[Math.floor(Math.random() * estados.length)];
    const origin = origenes[Math.floor(Math.random() * origenes.length)];
    const tags = tagsPosibles[Math.floor(Math.random() * tagsPosibles.length)];

    return {
        id,
        name: nombre,
        time,
        pax,
        date,
        phone: `11${5550000 + id}`,
        status: daysOffset < 0 ? "finished" : status, // Pasadas = finished
        origin,
        tags,
        createdAt: getDateOffset(daysOffset - Math.floor(Math.random() * 5)) // Creada días antes
    };
};

// --- GENERACIÓN MASIVA DE RESERVAS ---
export const initialReservations = [];
let reservaId = 1;

// HOY (29 Diciembre 2025) - SUPER CARGADO
for (let i = 0; i < 20; i++) {
    initialReservations.push(generarReserva(reservaId++, 0, 'almuerzo'));
}
for (let i = 0; i < 35; i++) {
    initialReservations.push(generarReserva(reservaId++, 0, 'cena'));
}

// AYER (28 Diciembre) - Día completo pasado
for (let i = 0; i < 18; i++) {
    initialReservations.push(generarReserva(reservaId++, -1, 'almuerzo'));
}
for (let i = 0; i < 30; i++) {
    initialReservations.push(generarReserva(reservaId++, -1, 'cena'));
}

// ANTEAYER (27 Diciembre)
for (let i = 0; i < 15; i++) {
    initialReservations.push(generarReserva(reservaId++, -2, 'almuerzo'));
}
for (let i = 0; i < 28; i++) {
    initialReservations.push(generarReserva(reservaId++, -2, 'cena'));
}

// HACE 3 DÍAS (26 Diciembre - Boxing Day)
for (let i = 0; i < 22; i++) {
    initialReservations.push(generarReserva(reservaId++, -3, 'almuerzo'));
}
for (let i = 0; i < 32; i++) {
    initialReservations.push(generarReserva(reservaId++, -3, 'cena'));
}

// HACE 4 DÍAS (25 Diciembre - Navidad) - Más reservas
for (let i = 0; i < 25; i++) {
    initialReservations.push(generarReserva(reservaId++, -4, 'almuerzo'));
}
for (let i = 0; i < 40; i++) {
    initialReservations.push(generarReserva(reservaId++, -4, 'cena'));
}

// HACE 5-10 DÍAS (Semana pasada)
for (let d = -5; d >= -10; d--) {
    for (let i = 0; i < 12; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'almuerzo'));
    }
    for (let i = 0; i < 25; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'cena'));
    }
}

// MAÑANA (30 Diciembre) - Reservas confirmadas futuras
for (let i = 0; i < 15; i++) {
    initialReservations.push(generarReserva(reservaId++, 1, 'almuerzo'));
}
for (let i = 0; i < 28; i++) {
    initialReservations.push(generarReserva(reservaId++, 1, 'cena'));
}

// AÑO NUEVO (31 Diciembre) - EXPLOTADO
for (let i = 0; i < 10; i++) {
    initialReservations.push(generarReserva(reservaId++, 2, 'almuerzo'));
}
for (let i = 0; i < 50; i++) { // Noche de año nuevo a full
    const reserva = generarReserva(reservaId++, 2, 'cena');
    reserva.status = 'confirmed';
    reserva.tags = [...reserva.tags, 'Año Nuevo'];
    initialReservations.push(reserva);
}

// ENERO 2026 (próximos días)
for (let d = 3; d <= 10; d++) {
    for (let i = 0; i < 10; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'almuerzo'));
    }
    for (let i = 0; i < 20; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'cena'));
    }
}

// RESERVAS VIP ESPECIALES HOY
initialReservations.push({
    id: reservaId++,
    name: "Carlos Tevez",
    time: "21:00",
    pax: 6,
    date: TODAY,
    phone: "1155559999",
    status: "confirmed",
    origin: "phone",
    tags: ["VIP", "Mesa Privada"],
    createdAt: TODAY
});

initialReservations.push({
    id: reservaId++,
    name: "Despedida Soltera",
    time: "21:30",
    pax: 15,
    date: TODAY,
    phone: "1155558888",
    status: "confirmed",
    origin: "whatsapp",
    tags: ["Adelanto Pago", "Ruido", "Cumpleaños"],
    createdAt: getDateOffset(-3)
});

initialReservations.push({
    id: reservaId++,
    name: "Cena Empresarial Tech",
    time: "20:00",
    pax: 20,
    date: TODAY,
    phone: "1155557777",
    status: "seated",
    origin: "phone",
    tags: ["VIP", "Factura A", "Menú Ejecutivo"],
    createdAt: getDateOffset(-7)
});

// --- DATOS HISTÓRICOS (Para gráficos) ---
export const historicalAverages = {
    lunch: [
        { time: '11:00', personas: 3 },
        { time: '11:30', personas: 8 },
        { time: '12:00', personas: 18 },
        { time: '12:30', personas: 32 },
        { time: '13:00', personas: 48 }, // Pico almuerzo
        { time: '13:30', personas: 42 },
        { time: '14:00', personas: 28 },
        { time: '14:30', personas: 15 },
        { time: '15:00', personas: 8 },
    ],
    dinner: [
        { time: '19:00', personas: 12 },
        { time: '19:30', personas: 25 },
        { time: '20:00', personas: 45 },
        { time: '20:30', personas: 65 },
        { time: '21:00', personas: 90 }, // Pico cena
        { time: '21:30', personas: 85 },
        { time: '22:00', personas: 70 },
        { time: '22:30', personas: 50 },
        { time: '23:00', personas: 30 },
        { time: '23:30', personas: 15 },
        { time: '00:00', personas: 8 },
    ]
};

console.log(`✅ ${initialReservations.length} reservas generadas exitosamente`);