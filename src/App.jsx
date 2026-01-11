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
import MenuManagerPage from "./pages/MenuManagerPage";
import PublicMenuPage from "./pages/PublicMenuPage";

// 👇 UTILS
import { clientConfig } from "./config/client";
import { useAuth } from "./context/AuthContext";
import SplashScreen from "./components/ui/SplashScreen";
import { AnimatePresence } from "framer-motion";

// 🎬 COMPONENTE DE CONTENIDO: Maneja la lógica de visualización basada en Auth
const AppContent = () => {
  const { loading, loadingMessage } = useAuth();

  return (
    <>
      {/* 
        AnimatePresence permite animar la SALIDA (exit) del componente Splash Screen.
        mode="wait": Espera a que termine la salida antes de mostrar lo siguiente (opcional, 
                     pero aquí queremos superposición o transición suave).
        En este caso, como el loading pasa a false, el componente se desmonta.
        Con AnimatePresence, Framer Motion ejecutará la animación 'exit' antes de quitarlo del DOM.
      */}
      <AnimatePresence mode="wait">
        {loading && <SplashScreen key="splash" message={loadingMessage} />}
      </AnimatePresence>

      {/* 
        El resto de la app siempre está "montada" por debajo o lista para mostrarse. 
        Al irse el Splash, esto queda visible.
      */}
      {!loading && (
        <Routes>

          {/* 🟢 RUTA PÚBLICA: Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* 📱 RUTA PÚBLICA: Menú Digital (QR) */}
          <Route path="/menu-digital" element={<PublicMenuPage />} />

          {/* 🔴 RUTAS PRIVADAS: Dashboard */}
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

            {/* Menú: /dashboard/menu */}
            <Route path="menu" element={<MenuManagerPage />} />
          </Route>

          {/* 🔄 REDIRECCIONES */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      )}
    </>
  );
};

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

      {/* 🛡️ NIVEL 1: AUTH PROVIDER */}
      <AuthProvider>

        {/* 🎨 NIVEL 2: THEME PROVIDER */}
        <ThemeProvider>

          {/* 📅 NIVEL 3: DATA PROVIDERS */}
          <ReservationsProvider>

            <AppContent />

          </ReservationsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;