// src/lib/intelligence.js

/**
 * VANTRA INTELLIGENCE CORE v3.0 (Heuristics Engine)
 * ----------------------------------------------------
 * Motor de análisis heurístico avanzado para gastronomía.
 * Cruza dimensiones (Operativa, Comercial, Técnica, Humana) para generar
 * diagnósticos precisos, score de salud y evitar falsos positivos.
 */

export const analyzeOperations = (metrics) => {
    const {
        occupancyPercentage,
        botCount,
        totalReservations,
        totalPax,
        groupData // { couples, groups, events }
    } = metrics;

    // --- 1. COMPUTACIÓN DE VARIABLES DERIVADAS (Contexto) ---
    const hasData = totalReservations > 0;

    // A. Densidad de Mesa (Revenue Efficiency)
    // ¿Qué tan bien estamos usando las sillas? (Ideal > 2.5 pax/mesa)
    // Si es bajo (ej: 2.0), indica que estamos sentando muchas parejas en mesas de 4.
    const avgPaxPerTable = hasData ? (totalPax / totalReservations) : 0;

    // B. Índice de Automatización
    // Porcentaje real de reservas gestionadas por el bot.
    const botRate = hasData ? (botCount / totalReservations) * 100 : 0;

    // C. Índice de Complejidad de Cocina (Kitchen Stress Index)
    // Las mesas grandes (>6 pax) estresan la cocina exponencialmente más que las parejas.
    // Fórmula ponderada: (Eventos * 3) + (Grupos * 1.5) + (Parejas * 1)
    const kitchenStressScore = (groupData.events * 3) + (groupData.groups * 1.5) + groupData.couples;
    // Intensidad promedio por mesa
    const kitchenIntensity = hasData ? (kitchenStressScore / totalReservations) : 0;

    // --- 2. CÁLCULO DE HEALTH SCORE (Algoritmo Dinámico Ponderado) ---
    // Empezamos con un puntaje perfecto (100) y descontamos por ineficiencias detectadas.
    let rawScore = 100;
    let scorePenalties = []; // Útil para debugging si quisieras mostrar por qué bajó

    // A. Penalización por Saturación/Vacío (Curva de eficiencia)
    if (occupancyPercentage > 95) {
        rawScore -= 20;
        scorePenalties.push("Saturación extrema");
    } else if (occupancyPercentage < 20) {
        rawScore -= 20;
        scorePenalties.push("Local vacío (costo operativo)");
    } else if (occupancyPercentage < 40) {
        rawScore -= 10;
        scorePenalties.push("Baja demanda");
    }

    // B. Penalización por Riesgo Operativo (Cocina)
    // Si la intensidad es alta (>2.2) y el local está lleno (>80%), es peligroso.
    if (occupancyPercentage > 80 && kitchenIntensity > 2.2) {
        rawScore -= 15;
        scorePenalties.push("Cocina bajo alta presión");
    }

    // C. Penalización por Fricción Administrativa (Bot subutilizado)
    // Solo penalizamos si hay volumen real (>8 mesas). Si hay 2 mesas, no importa si son manuales.
    if (totalReservations > 8 && botRate < 30) {
        rawScore -= 15;
        scorePenalties.push("Exceso carga manual staff");
    }

    // D. Penalización por Ineficiencia de Espacio (Tetris fallido)
    if (hasData && occupancyPercentage > 70 && avgPaxPerTable < 2.2) {
        rawScore -= 10; // Perdiendo revenue potencial
    }

    // Bonus: Eficiencia "Tetris" (Alta ocupación + Alta densidad)
    if (occupancyPercentage > 80 && avgPaxPerTable > 3.0) {
        rawScore += 5; // Recupera puntos por ser muy rentable
    }

    // Clamp (Asegurar que quede entre 0 y 100)
    const healthScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    // --- 3. DETERMINACIÓN DE ESTADO VISUAL (Output para Modal) ---
    let color = 'emerald';
    let label = 'Operación Saludable';
    let state = 'NOMINAL'; // Código interno del estado

    if (healthScore < 60) {
        color = 'rose';
        label = 'Atención Requerida';
        state = 'CRITICAL';
    } else if (healthScore < 85) {
        color = 'amber';
        label = 'Oportunidades de Mejora';
        state = 'WARNING';
    } else if (occupancyPercentage > 90) {
        color = 'blue';
        label = 'Alta Demanda';
        state = 'HIGH_LOAD';
    }

    // --- 4. GENERACIÓN DE INSIGHTS TÁCTICOS (Consejos Reales) ---
    const details = [];

    // CASO 1: Ineficiencia de Espacio (Tetris)
    if (occupancyPercentage > 70 && avgPaxPerTable < 2.2) {
        details.push({
            area: "Rentabilidad",
            type: "warning",
            title: "Fuga de Ingresos Detectada",
            text: `Sala al ${occupancyPercentage}% pero con baja densidad (${avgPaxPerTable.toFixed(1)} pax/mesa). Muchas mesas grandes están bloqueadas por parejas.`,
            action: "Priorizar reservas de grupos >4 pax"
        });
    }

    // CASO 2: Riesgo en Cocina
    if (occupancyPercentage > 80 && kitchenIntensity > 2.0) {
        details.push({
            area: "Operativa",
            type: "critical",
            title: "Riesgo de Colapso en Cocina",
            text: `Alta ocupación combinada con ${groupData.events} eventos complejos simultáneos. Los tiempos de despacho podrían superar los 40 min.`,
            action: "Coordinar freno de marchas con cocina"
        });
    } else if (occupancyPercentage >= 95) {
        details.push({
            area: "Operativa",
            type: "critical",
            title: "Capacidad Máxima Alcanzada",
            text: "Local al límite físico. Detener ingresos walk-in inmediatamente para evitar quejas por servicio y espera.",
            action: "Activar lista de espera física"
        });
    }

    // CASO 3: Sobrecarga de Staff (Bot bajo)
    if (hasData && totalReservations > 10 && botRate < 25) {
        details.push({
            area: "Staff",
            type: "alert",
            title: "Sobrecarga Administrativa",
            text: "El personal está atendiendo demasiadas llamadas. El Bot se está usando muy poco hoy.",
            action: "Verificar visibilidad del link de WhatsApp"
        });
    }

    // CASO 4: Oportunidad Comercial (Vacío)
    if (hasData && occupancyPercentage < 25 && totalReservations < 5) {
        details.push({
            area: "Comercial",
            type: "warning",
            title: "Capacidad Ociosa Crítica",
            text: "Turno por debajo del punto de equilibrio operativo. El costo de staff supera la facturación proyectada actual.",
            action: "Lanzar historia con disponibilidad inmediata"
        });
    }

    // CASO 5: Éxito (Nominal)
    if (healthScore >= 90 && hasData) {
        details.push({
            area: "General",
            type: "good",
            title: "Máxima Eficiencia Detectada",
            text: "La sala opera en su punto óptimo: Alta ocupación con flujo automatizado y carga de cocina controlada. Mantener ritmo.",
            action: "Mantener el ritmo de servicio actual"
        });
    }

    // CASO 6: TENDENCIA DE CONSUMO
    if (hasData && groupData.couples > (totalReservations * 0.6)) {
        details.push({
            area: "Tendencia",
            type: "info",
            title: "Patrón: Noche de Citas",
            text: `Predominio de parejas (${groupData.couples} mesas). Se prevé rotación rápida (60-75 min) y menor consumo de alcohol por ticket.`,
            action: "Sugerir Vino/Postre para aumentar ticket"
        });
    } else if (hasData && groupData.events > 2) {
        details.push({
            area: "Logística",
            type: "info",
            title: "Logística de Grupos",
            text: `Hay ${groupData.events} mesas grandes activas. Verificar stock de vajilla y tiempos de servicio en esos sectores específicos.`,
            action: "Revisar sectores de grupos"
        });
    }

    // Fallback por si no hay nada específico
    if (details.length === 0 && hasData) {
        details.push({
            area: "Monitoreo",
            type: "neutral",
            title: "Flujo Estable",
            text: `Operación dentro de parámetros normales. Ocupación al ${occupancyPercentage}%. Sin anomalías detectadas por el momento.`,
            action: null
        });
    }

    // Caso Borde: Sin Datos
    if (!hasData) {
        return {
            healthScore: 100,
            status: "neutral",
            mainHeadline: "Sistema Activo. Esperando Ingresos.",
            label: "En Espera",
            color: "emerald",
            state: "NOMINAL",
            details: [{
                area: "Sistema",
                type: "neutral",
                title: "Aguardando Datos",
                text: "Los modelos predictivos requieren al menos una reserva activa para iniciar el análisis.",
                action: null
            }]
        };
    }

    // Ordenar por gravedad (Critical primero)
    const priorityMap = { critical: 0, alert: 1, warning: 2, info: 3, good: 4, neutral: 5 };
    details.sort((a, b) => priorityMap[a.type] - priorityMap[b.type]);

    return {
        healthScore,
        state,
        label,
        color,
        details,
        mainHeadline: label // Compatibilidad
    };
};