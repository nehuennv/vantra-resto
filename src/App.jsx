import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

// 👇 IMPORTAMOS LAS PÁGINAS REALES
import DashboardPage from "./pages/DashboardPage";
import ReservationsPage from "./pages/ReservationsPage";

// (Aquí borramos el const ReservationsPage viejo para que no choque)

function App() {
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