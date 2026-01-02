import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
const AuthContext = createContext(null);

// 2. Definimos usuarios "Mock" (de prueba) para simular la base de datos
const MOCK_USERS = [
    {
        id: 1,
        email: 'admin@cabrera.com',
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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Arranca cargando (Splash)
    const [loadingMessage, setLoadingMessage] = useState("Sincronizando Entorno..."); // Mensaje dinámico
    const [error, setError] = useState(null);

    // Efecto de Carga Inicial (Simula "Sincronizando Entorno")
    useEffect(() => {
        const checkSession = async () => {
            setLoadingMessage("Sincronizando Entorno...");
            const savedUser = localStorage.getItem('vantra_user');

            // Tiempo mínimo de Splash Screen al abrir la app
            // Si hay usuario: 2s (simula fetch de datos)
            // Si no hay usuario: 1.5s (presentación de marca)
            const waitTime = savedUser ? 2000 : 1500;

            await new Promise(resolve => setTimeout(resolve, waitTime));

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }

            setLoading(false);
        };

        checkSession();
    }, []);

    // Función de Login
    const login = async (email, password) => {
        setLoadingMessage("Iniciando Sesión...");
        setLoading(true); // Esto activará el Splash Screen nuevamente
        setError(null);

        // Simulamos delay de backend + carga de recursos (Min 2s)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('vantra_user', JSON.stringify(foundUser));
        } else {
            setError('Credenciales inválidas. Probá con admin@vantra.com / 123');
            setLoading(false); // Solo bajamos el loading si falló, para mostrar el error en Login
            // Si tuvo éxito, dejaremos que el sistema redirija (aunque el estado cambiará a !loading eventualmente por el re-render, 
            // pero es mejor explicitamente bajarlo para que el Router haga su trabajo)
        }

        if (foundUser) setLoading(false);
    };

    // Función de Logout
    const logout = async () => {
        setLoadingMessage("Cerrando Sesión...");
        setLoading(true);

        // Pequeño delay dramático para que se lea el mensaje y cierre "bien"
        await new Promise(resolve => setTimeout(resolve, 1500));

        setUser(null);
        localStorage.removeItem('vantra_user');
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, loadingMessage, error, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar esto fácil en cualquier componente
export const useAuth = () => useContext(AuthContext);