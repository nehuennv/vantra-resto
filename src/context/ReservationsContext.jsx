import React, { createContext, useContext, useState } from 'react';
import { initialReservations } from '../data/mockData'; // <--- IMPORTAMOS DATA LIMPIA

const ReservationsContext = createContext();

export const ReservationsProvider = ({ children }) => {
    // Usamos los datos importados
    const [reservations, setReservations] = useState(initialReservations);

    const addReservation = (data) => {
        const newId = Math.max(...reservations.map(r => r.id), 0) + 1;
        const newRes = { 
            id: newId, 
            ...data, 
            status: 'confirmed', 
            createdAt: new Date().toISOString() 
        };
        setReservations(prev => [...prev, newRes]);
    };

    const updateReservation = (id, data) => {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const deleteReservation = (id) => {
        setReservations(prev => prev.filter(r => r.id !== id));
    };

    return (
        <ReservationsContext.Provider value={{ 
            reservations, 
            addReservation, 
            updateReservation, 
            deleteReservation 
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