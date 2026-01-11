import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTodayLocalString } from '../lib/dateUtils';
import { reservationService } from '../services/reservationService';

const ReservationsContext = createContext();

export const ReservationsProvider = ({ children }) => {
    // Estado local sincronizado con el Servicio
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. NUEVO ESTADO GLOBAL: La fecha seleccionada
    // Iniciamos con la fecha de hoy por defecto (Local Time)
    const [selectedDate, setSelectedDate] = useState(getTodayLocalString());

    // --- CARGA INICIAL Y SUSCRIPCIÓN ---
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                // 1. Carga inicial
                const data = await reservationService.getReservations();
                if (isMounted) {
                    setReservations(data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch reservations", error);
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();

        // 2. Suscripción a eventos "Real-Time" (Simulados o WebSockets reales)
        // El callback recibe la NUEVA lista completa de reservas actualizada por el servicio
        const unsubscribe = reservationService.subscribe((updatedReservations) => {
            if (isMounted) {
                console.log("🔄 Real-Time Update Received");
                setReservations(updatedReservations);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    // --- WRAPPERS ASÍNCRONOS ---
    // Ya no modificamos el estado local manualmente. 
    // Llamamos al servicio -> El servicio actualiza su "DB" -> El servicio emite evento -> El subscribe actualiza el estado.

    const addReservation = async (data) => {
        // isLoading(true) si quisiéramos bloquear UI global, 
        // pero mejor dejar que la UI maneje estados de carga locales o usar Optimistic UI.
        // Aquí confiamos en la velocidad del servicio mock.
        return await reservationService.createReservation(data);
    };

    const updateReservation = async (id, data) => {
        return await reservationService.updateReservation(id, data);
    };

    const deleteReservation = async (id) => {
        return await reservationService.deleteReservation(id);
    };

    return (
        <ReservationsContext.Provider value={{
            reservations,
            isLoading,
            addReservation,
            updateReservation,
            deleteReservation,
            // 2. EXPONEMOS LA FECHA Y SU SETTER
            selectedDate,
            setSelectedDate
        }}>
            {children}
        </ReservationsContext.Provider>
    );
};

export const useReservations = () => {
    const context = useContext(ReservationsContext);
    if (!context) throw new Error("useReservations debe usarse dentro de ReservationsProvider");
    return context;
};