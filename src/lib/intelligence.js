// src/lib/intelligence.js

/**
 * VANTRA INTELLIGENCE CORE v4.0 (Deep Heuristics Engine)
 * ----------------------------------------------------
 * Motor de análisis heurístico de profundidad para gastronomía.
 * Evalúa micro-fricciones y optimización de revenue en tiempo real.
 * Diseñado para ser crítico y detectar "sintomas silenciosos".
 */

export const analyzeOperations = (metrics) => {
    const {
        occupancyPercentage,
        botCount,
        totalReservations,
        totalPax,
        groupData // { couples, groups, events }
    } = metrics;

    if (totalReservations === 0) {
        return {
            healthScore: 100,
            status: "neutral",
            mainHeadline: "Esperando Flujo de Servicio",
            label: "En Espera",
            color: "emerald",
            state: "NOMINAL",
            details: [{
                area: "Sistema",
                type: "neutral",
                title: "Modo Standby Activo",
                text: "Monitores listos. El análisis predictivo iniciará con la primera comanda.",
                action: "Verificar mise en place"
            }]
        };
    }

    // --- 1. CÁLCULO DE METRICAS COMPUESTAS ---

    // A. Densidad de Revenue (Pax/Mesa) -> Eficiencia del espacio
    const avgPaxPerTable = totalPax / totalReservations;

    // B. Índice de Presión Operativa (Kitchen Stress) -> Carga mental
    // Ponderación: Pareja(1), Grupo(1.8), Evento(4.5 - mucho más disruptivo)
    const operationalLoadScore = (groupData.events * 4.5) + (groupData.groups * 1.8) + groupData.couples;
    const loadPerTable = operationalLoadScore / totalReservations;

    // C. Tasa de Automatización Real
    const botRate = (botCount / totalReservations) * 100;

    // D. Fragmentación de Sala
    // Si hay muchas parejas, el servicio es más "roto" (más idas y vueltas a mesas distintas)
    const fragmentationIndex = groupData.couples / totalReservations; // 0 a 1

    // --- 2. ALGORITMO DE PUNTUACIÓN (CRÍTICO) ---
    // Partimos de 95 (nadie es perfecto) y castigamos micro-ineficiencias.
    let score = 95;
    const details = [];

    // [CRITICO] Saturación o Vacío (Las puntas de la curva)
    if (occupancyPercentage >= 95) {
        score -= 30; // Peligro inminente
        details.push({
            area: "Operativa",
            type: "critical",
            title: "Saturación Crítica",
            text: "Local al límite. Riesgo alto de demoras y quejas. La cocina no podrá mantener el ritmo si entran más mesas.",
            action: "Cerrar reservas / Frenar entrada"
        });
    } else if (occupancyPercentage < 25 && totalReservations > 0) {
        score -= 25; // Costo hundido
        details.push({
            area: "Financiera",
            type: "warning",
            title: "Operación Deficitaria",
            text: "La facturación actual no cubre el costo operativo del turno. Estructura subutilizada.",
            action: "Lanzar promo flash / Happy hour"
        });
    }

    // [ALERTA] Ineficiencia de Asignación (El 'Tetris' de mesas)
    // Si tenemos mucha gente (>70%) pero densidad baja (<2.2), estamos desperdiciando sillas.
    if (occupancyPercentage > 60 && avgPaxPerTable < 2.3) {
        score -= 15;
        details.push({
            area: "Revenue",
            type: "alert",
            title: "Fuga de Asientos",
            text: `Mesas ocupadas con baja densidad (${avgPaxPerTable.toFixed(1)} pax/mesa). Estamos sentando parejas en mesas de 4.`,
            action: "Priorizar grupos de 4+ en espera"
        });
    }

    // [ALERTA] Riesgo de Servicio (Fragmentación)
    // Muchas mesas de 2 personas = camareros corriendo más = peor servicio.
    if (totalReservations > 6 && fragmentationIndex > 0.7) {
        score -= 10;
        details.push({
            area: "Servicio",
            type: "warning",
            title: "Fragmentación Alta",
            text: "El 70%+ de las mesas son parejas. El staff tendrá que hacer más viajes a cocina/barra por el mismo ticket.",
            action: "Asignar rangos más pequeños a camareros"
        });
    }

    // [ALERTA] Embudo en Cocina (Load Per Table)
    // Si hay pocos eventos pero complejos.
    if (loadPerTable > 2.5) {
        score -= 20;
        details.push({
            area: "Cocina",
            type: "critical",
            title: "Cocina Bajo Presión",
            text: "La complejidad de los platos/mesas actuales excede el flujo lineal. Riesgo de cuello de botella en despacho.",
            action: "Simplificar carta / Alertar demora"
        });
    }

    // [MEJORA] Automatización Baja
    if (totalReservations > 5 && botRate < 40) {
        score -= 10;
        details.push({
            area: "Digital",
            type: "info",
            title: "Subutilización de IA",
            text: `Solo el ${botRate.toFixed(0)}% de reservas entraron por Bot. El personal pierde tiempo cargando datos manuales.`,
            action: "Revisar link en Bio / Google Maps"
        });
    }

    // [TIKECTING] Mix de Ventas
    if (groupData.groups > groupData.couples * 2) {
        // Muchos grupos, pocas parejas = Mucho ruido, ticket alto, rotación lenta.
        details.push({
            area: "Ambiente",
            type: "info",
            title: "Nivel de Ruido Alto",
            text: "Predominancia de grupos grandes. El ambiente estará ruidoso y la rotación de mesas será lenta (>90 min).",
            action: "Ajustar música / Iluminación"
        });
    }

    // --- 3. DEFINICIÓN FINAL DE ESTADO ---

    // Clamp score
    score = Math.max(10, Math.min(100, Math.round(score)));

    let stateColor = 'emerald';
    let stateLabel = 'Óptimo';
    let stateCode = 'OPTIMAL';

    if (score < 50) {
        stateColor = 'rose';
        stateLabel = 'Crítico';
        stateCode = 'CRITICAL';
    } else if (score < 75) {
        stateColor = 'yellow';
        stateLabel = 'Atención'; // Ya no es "Saludable" tan facil, ahora es "Atención"
        stateCode = 'WARNING';
    } else if (score < 90) {
        stateColor = 'blue';
        stateLabel = 'Estable'; // 75-90 es solo "Estable", no "Perfecto"
        stateCode = 'STABLE';
    }

    // Si después de todo no hay insights (raro con este algoritmo), damos uno positivo.
    if (details.length === 0) {
        details.push({
            area: "Gestión",
            type: "good",
            title: "Sincronización Perfecta",
            text: "Equilibrio ideal entre cocina, salón y reservas. Momento perfecto para realizar up-selling de productos premium.",
            action: "Impulsar venta de vinos/postres"
        });
    }

    // Ordenar: Critical > Alert > Warning > Info > Good
    const prio = { critical: 0, alert: 1, warning: 2, info: 3, good: 4, neutral: 5 };
    details.sort((a, b) => prio[a.type] - prio[b.type]);

    return {
        healthScore: score,
        state: stateCode,
        label: stateLabel, // Título corto (ej: ALERTA)
        mainHeadline: details[0].title, // Título principal del insight más importante
        color: stateColor,
        details: details
    };
};