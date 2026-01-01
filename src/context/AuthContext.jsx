import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
const AuthContext = createContext(null);

// 2. Definimos usuarios "Mock" (de prueba) para simular la base de datos
const MOCK_USERS = [
    {
        id: 1,
        email: 'admin@vantra.com',
        password: '123',
        name: 'Nehuén (Dueño)',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=admin'
    },
    {
        id: 2,
        email: 'staff@vantra.com',
        password: '123',
        name: 'Host Entrada',
        role: 'staff', // El "patovica" o recepcionista
        avatar: 'https://i.pravatar.cc/150?u=staff'
    }
];

export const AuthProvider = ({ children }) => {
    // Estado para guardar el usuario actual. 
    // Intentamos leer de localStorage al iniciar para "recordar" la sesión.
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('vantra_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función de Login
    const login = (email, password) => {
        setLoading(true);
        setError(null);

        // Simulamos un delay de red para que se sienta real (UX)
        setTimeout(() => {
            const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

            if (foundUser) {
                // ¡Éxito! Guardamos en estado y en memoria del navegador
                setUser(foundUser);
                localStorage.setItem('vantra_user', JSON.stringify(foundUser));
            } else {
                setError('Credenciales inválidas. Probá con admin@vantra.com / 123');
            }
            setLoading(false);
        }, 1000);
    };

    // Función de Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('vantra_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar esto fácil en cualquier componente
export const useAuth = () => useContext(AuthContext);