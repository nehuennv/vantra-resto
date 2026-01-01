import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 👇 CONTEXTOS (El cerebro de la app)
// Es vital importarlos aquí para que "envuelvan" a toda la aplicación
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ReservationsProvider } from "./context/ReservationsContext";

// 👇 LAYOUTS Y SEGURIDAD
import DashboardLayout from "./layouts/DashboardLayout";
import RequireAuth from "./components/auth/RequireAuth"; // Nuestro "Patovica"

// 👇 PÁGINAS
import LoginPage from "./pages/LoginPage"; // La nueva entrada
import DashboardPage from "./pages/DashboardPage";
import ReservationsPage from "./pages/ReservationsPage";

// 👇 UTILS
import { clientConfig } from "./config/client";

function App() {

  // 🎨 Dynamic Favicon (Mantenemos tu lógica, ¡está genial!)
  useEffect(() => {
    const color = clientConfig.themeColor;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <mask id="round">
          <circle cx="50" cy="50" r="50" fill="white" />
        </mask>
        <rect width="100" height="100" fill="${color}" mask="url(#round)" />
        <path d="M50 25 L75 75 H25 Z" fill="white" transform="translate(0, 5) scale(0.6) translate(33, 10)" opacity="0.95" />
      </svg>
    `.trim();

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = `data:image/svg+xml;base64,${btoa(svg)}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

      {/* 🛡️ NIVEL 1: AUTH PROVIDER 
          Todo lo que esté aquí adentro sabrá si el usuario está logueado o no. */}
      <AuthProvider>

        {/* 🎨 NIVEL 2: THEME PROVIDER 
            Para manejar modo oscuro/claro en toda la app. */}
        <ThemeProvider>

          {/* 📅 NIVEL 3: DATA PROVIDERS
              Inyectamos los datos de reservas para que estén listos. */}
          <ReservationsProvider>

            <Routes>

              {/* 🟢 RUTA PÚBLICA: Login 
                  No tiene "RequireAuth", así que cualquiera puede entrar. */}
              <Route path="/login" element={<LoginPage />} />

              {/* 🔴 RUTAS PRIVADAS: Dashboard
                  Aquí cambiamos la estructura un poco:
                  1. Usamos "/dashboard" como base para separar la app del login.
                  2. Envolvemos el Layout con <RequireAuth>. Si no hay usuario, te patea al login. */}
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                {/* Index: Lo que se ve al entrar a /dashboard */}
                <Route index element={<DashboardPage />} />

                {/* Reservas: /dashboard/reservations */}
                <Route path="reservations" element={<ReservationsPage />} />
              </Route>

              {/* 🔄 REDIRECCIONES
                  Si el usuario entra a la raíz "/" (ej: vantra.com),
                  lo mandamos directo a /dashboard.
                  
                  Si NO está logueado, el RequireAuth de /dashboard lo mandará a /login.
                  Si SÍ está logueado, verá el dashboard. 
                  ¡Magia! ✨ */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch-all para rutas rotas (404) */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>

          </ReservationsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;