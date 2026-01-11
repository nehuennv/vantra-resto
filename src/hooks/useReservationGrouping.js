import { useMemo } from 'react';

/**
 * Hook para agrupar reservas en buckets de 1 hora.
 * 
 * @param {Array} reservations - Array crudo de objetos de reserva.
 * @returns {Array} - Array estructurado de grupos: [{ time: "HH:00", items: [...] }]
 */
export const useReservationGrouping = (reservations) => {
    return useMemo(() => {
        if (!reservations) return [];

        const groups = {};

        reservations.forEach(res => {
            // Extraer solo la hora (Ej: "21:30" -> "21")
            const hour = res.time.split(':')[0];
            // Crear la llave del bucket (Ej: "21:00")
            const bucketKey = `${hour}:00`;

            if (!groups[bucketKey]) {
                groups[bucketKey] = [];
            }
            groups[bucketKey].push(res);
        });

        // 1. Convertir objeto a array
        // 2. Ordenar los buckets por hora (11:00 antes que 12:00)
        return Object.keys(groups).sort().map(time => {
            // 3. Ordenar las reservas DENTRO del bucket (21:15 antes que 21:45)
            const sortedItems = groups[time].sort((a, b) => a.time.localeCompare(b.time));

            return {
                time,
                items: sortedItems
            };
        });
    }, [reservations]);
};
