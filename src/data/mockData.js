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

// Generador de horarios aleatorios y realistas
const getRandomTime = (startHour, endHour) => {
    const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    const minute = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Tamaños de grupo realistas (más mesas de 2 y 4)
const gruposPax = [2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 6];

// Orígenes
const origenes = ["whatsapp", "whatsapp", "phone", "walk-in", "web"];

// Estados
const estados = ["confirmed", "confirmed", "confirmed", "seated", "pending"];

// Tags variados
const tagsPosibles = [
    [], [], [], [], [], // Mayoría sin tags
    ["VIP"], ["Celíaco"], ["Vegetariano"], ["Aniversario"], ["Cumpleaños"],
    ["Silla Bebé"], ["Ventana"], ["Terraza"], ["Inglés"]
];

// Función helper para generar reserva
const generarReserva = (id, daysOffset, turno) => {
    // Generar horario random según turno
    const time = turno === 'almuerzo'
        ? getRandomTime(11, 14) // 11:00 a 14:59
        : getRandomTime(19, 23); // 19:00 a 23:59

    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const pax = gruposPax[Math.floor(Math.random() * gruposPax.length)];
    const date = getDateOffset(daysOffset);

    // Estado lógico según fecha
    let status;
    if (daysOffset < 0) {
        status = "finished";
    } else if (daysOffset === 0) {
        // Hoy: mezcla de seated, confirmed, pending
        status = estados[Math.floor(Math.random() * estados.length)];
    } else {
        // Futuro: confirmed o pending
        status = Math.random() > 0.3 ? "confirmed" : "pending";
    }

    const origin = origenes[Math.floor(Math.random() * origenes.length)];
    const tags = tagsPosibles[Math.floor(Math.random() * tagsPosibles.length)];

    return {
        id,
        name: nombre,
        time,
        pax,
        date,
        phone: `11${5550000 + id}`,
        status,
        origin,
        tags,
        createdAt: getDateOffset(daysOffset - Math.floor(Math.random() * 5))
    };
};

// --- GENERACIÓN MASIVA DE RESERVAS ---
export const initialReservations = [];
let reservaId = 1;

// HOY (29 Diciembre 2025) - Normal
for (let i = 0; i < 3; i++) {
    initialReservations.push(generarReserva(reservaId++, 0, 'almuerzo'));
}
for (let i = 0; i < 7; i++) {
    initialReservations.push(generarReserva(reservaId++, 0, 'cena'));
}

// AYER (28 Diciembre)
for (let i = 0; i < 2; i++) {
    initialReservations.push(generarReserva(reservaId++, -1, 'almuerzo'));
}
for (let i = 0; i < 5; i++) {
    initialReservations.push(generarReserva(reservaId++, -1, 'cena'));
}

// ANTEAYER (27 Diciembre)
for (let i = 0; i < 2; i++) {
    initialReservations.push(generarReserva(reservaId++, -2, 'almuerzo'));
}
for (let i = 0; i < 4; i++) {
    initialReservations.push(generarReserva(reservaId++, -2, 'cena'));
}

// HACE 3 DÍAS (26 Diciembre)
for (let i = 0; i < 3; i++) {
    initialReservations.push(generarReserva(reservaId++, -3, 'almuerzo'));
}
for (let i = 0; i < 6; i++) {
    initialReservations.push(generarReserva(reservaId++, -3, 'cena'));
}

// HACE 4 DÍAS (25 Diciembre - Navidad)
for (let i = 0; i < 4; i++) {
    initialReservations.push(generarReserva(reservaId++, -4, 'almuerzo'));
}
for (let i = 0; i < 8; i++) {
    initialReservations.push(generarReserva(reservaId++, -4, 'cena'));
}

// HACE 5-10 DÍAS
for (let d = -5; d >= -10; d--) {
    for (let i = 0; i < 1; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'almuerzo'));
    }
    for (let i = 0; i < 3; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'cena'));
    }
}

// MAÑANA (30 Diciembre)
for (let i = 0; i < 2; i++) {
    initialReservations.push(generarReserva(reservaId++, 1, 'almuerzo'));
}
for (let i = 0; i < 5; i++) {
    initialReservations.push(generarReserva(reservaId++, 1, 'cena'));
}

// AÑO NUEVO (31 Diciembre)
for (let i = 0; i < 4; i++) {
    initialReservations.push(generarReserva(reservaId++, 2, 'almuerzo'));
}
for (let i = 0; i < 15; i++) { // Noche de año nuevo
    const reserva = generarReserva(reservaId++, 2, 'cena');
    reserva.status = 'confirmed';
    reserva.tags = [...reserva.tags, 'Año Nuevo'];
    initialReservations.push(reserva);
}

// ENERO 2026
for (let d = 3; d <= 10; d++) {
    for (let i = 0; i < 1; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'almuerzo'));
    }
    for (let i = 0; i < 3; i++) {
        initialReservations.push(generarReserva(reservaId++, d, 'cena'));
    }
}

// RESERVAS VIP ESPECIALES HOY
initialReservations.push({
    id: reservaId++,
    name: "Carlos Tevez",
    time: "21:15",
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
    time: "21:45",
    pax: 15,
    date: TODAY,
    phone: "1155558888",
    status: "confirmed",
    origin: "whatsapp",
    tags: ["Adelanto Pago", "Ruido", "Cumpleaños"],
    createdAt: getDateOffset(-3)
});

// RESERVAS FINALIZADAS HOY (Para probar filtros y scroll)
for (let i = 0; i < 8; i++) {
    const r = generarReserva(reservaId++, 0, 'almuerzo');
    r.status = 'finished';
    r.time = getRandomTime(12, 13); // Finalizaron temprano
    initialReservations.push(r);
}

initialReservations.push({
    id: reservaId++,
    name: "Cena Empresarial Tech",
    time: "20:10",
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
        { time: '11:00', personas: 4 },
        { time: '12:00', personas: 15 },
        { time: '13:00', personas: 20 }, // Pico almuerzo
        { time: '14:00', personas: 10 },
        { time: '15:00', personas: 3 },
    ],
    dinner: [
        { time: '19:00', personas: 10 },
        { time: '20:00', personas: 30 },
        { time: '21:00', personas: 45 }, // Pico cena
        { time: '22:00', personas: 25 },
        { time: '23:00', personas: 15 },
        { time: '00:00', personas: 5 },
    ]
};

console.log(`✅ ${initialReservations.length} reservas generadas exitosamente`);