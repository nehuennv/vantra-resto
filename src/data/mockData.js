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

// HOY (29 Diciembre 2025) - CRITICAL SCENARIO (High Stress/Chaos)
// Simulamos un servicio completamente saturado con baja automatización y cocina colapsada.
// Total aprox: ~30 reservas, muchos grupos grandes, todo telefónico/presencial.

// Almuerzo (Tranqui para contraste)
for (let i = 0; i < 5; i++) {
    initialReservations.push(generarReserva(reservaId++, 0, 'almuerzo'));
}

// CENA - CAOS TOTAL
// 1. Grupos grandes (Eventos) -> Dispara "Riesgo de Colapso en Cocina"
initialReservations.push({
    id: reservaId++, name: "Evento Corp. Globant", time: "20:30", pax: 18, date: TODAY, phone: "1155551001",
    status: "seated", origin: "phone", tags: ["VIP", "Evento", "Menú Pasos"], createdAt: getDateOffset(-10)
});
initialReservations.push({
    id: reservaId++, name: "Cumpleaños Mariana", time: "21:00", pax: 14, date: TODAY, phone: "1155551002",
    status: "confirmed", origin: "walk-in", tags: ["Cumpleaños", "Torta"], createdAt: getDateOffset(-2)
});
initialReservations.push({
    id: reservaId++, name: "Despedida Juan", time: "21:15", pax: 12, date: TODAY, phone: "1155551003",
    status: "pending", origin: "phone", tags: ["Ruidoso"], createdAt: getDateOffset(-1)
});

// 2. Inundación de reservas (Alta Automatización)
// 85% WhatsApp (Bot WhatsApp) para demostrar eficacia del producto
for (let i = 0; i < 15; i++) {
    const r = generarReserva(reservaId++, 0, 'cena');
    // 85% WhatsApp (Bot), resto Phone/Walk-in
    const rand = Math.random();
    r.origin = rand > 0.15 ? 'whatsapp' : (rand > 0.5 ? 'phone' : 'walk-in');

    r.status = Math.random() > 0.5 ? 'seated' : 'confirmed';
    r.pax = Math.floor(Math.random() * 4) + 2;
    r.time = getRandomTime(20, 22);
    initialReservations.push(r);
}

// 3. Algunas reservas con problemas
initialReservations.push({
    id: reservaId++, name: "Mesa Conflictiva", time: "21:30", pax: 4, date: TODAY, phone: "1155559999",
    status: "seated", origin: "walk-in", tags: ["Quejas Previas", "Alergia Grave"], createdAt: TODAY
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