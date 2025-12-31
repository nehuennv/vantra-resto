import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import { clientConfig } from "./config/client";

// 👇 IMPORTAMOS LAS PÁGINAS REALES
import DashboardPage from "./pages/DashboardPage";
import ReservationsPage from "./pages/ReservationsPage";

// (Aquí borramos el const ReservationsPage viejo para que no choque)

function App() {

  // 🎨 Dynamic Favicon: Se actualiza según el color del cliente
  useEffect(() => {
    const color = clientConfig.themeColor;
    // SVG Favicon Template
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
    // Future flags para evitar warnings
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        {/* Layout Principal */}
        <Route path="/" element={<DashboardLayout />}>

          {/* Dashboard de Estadísticas */}
          <Route index element={<DashboardPage />} />

          {/* 👇 Gestión de Reservas (La página nueva con Timeline) */}
          <Route path="reservations" element={<ReservationsPage />} />

          {/* Redirect por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;