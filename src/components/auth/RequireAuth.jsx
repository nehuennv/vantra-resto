import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RequireAuth = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    // 1. Si no hay usuario, mandarlo al Login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. (Opcional) Si hay roles y el usuario no tiene el rol correcto
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Podrías redirigirlo a una página de "Acceso Denegado" o al dashboard básico
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RequireAuth;