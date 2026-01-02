import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarClock,
    Settings,
    LogOut,
    ChevronLeft,
    Bell,
    Plus,
    Clock,
    User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils"; // Asegurate que esta ruta sea correcta
import SettingsPanel from "../components/SettingsPanel";
import BrandLogo from "../components/ui/BrandLogo";
import { useTheme } from "../context/ThemeContext";
import ReservationFormModal from "../components/reservations/ReservationFormModal";
import { useReservations } from "../context/ReservationsContext";
import { clientConfig } from "../config/client";
import { useAuth } from "../context/AuthContext";

// --- CONFIGURACIÓN DE ANIMACIONES ---
// Extraemos esto para mantener el código limpio y consistente.
const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
};

// --- COMPONENTES AUXILIARES ---

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border/50 text-muted-foreground shadow-sm backdrop-blur-sm">
            <Clock size={14} className="text-primary" />
            <span className="text-xs font-bold text-foreground tabular-nums tracking-wide">
                {time.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
        </div>
    );
};

// Item del Menú: Soluciona el problema de centrado forzando una estructura rígida
const SidebarItem = ({ to, icon: Icon, label, isCollapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            className={cn(
                "relative flex items-center h-12 mb-2 transition-all duration-300 rounded-xl group outline-none",
                // Si está colapsado, centramos el contenido (el icono). Si no, alineación standard.
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {/* Fondo Activo (Pill) con animación Layout para suavidad extrema */}
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.05)]"
                    initial={false}
                    transition={springTransition}
                />
            )}

            {/* Contenedor del Icono: SIEMPRE de ancho fijo para evitar saltos visuales */}
            <div className="relative z-10 flex items-center justify-center w-10 h-10 shrink-0">
                <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                        "transition-transform duration-300",
                        isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                />
            </div>

            {/* Contenedor del Texto: Animamos ancho y opacidad */}
            <div className={cn("relative z-10 overflow-hidden", isCollapsed ? "w-0 flex-none" : "flex-1")}>
                <motion.div
                    initial={false}
                    animate={{
                        width: isCollapsed ? 0 : "auto",
                        opacity: isCollapsed ? 0 : 1,
                        x: isCollapsed ? -10 : 0
                    }}
                    transition={{
                        width: springTransition,
                        x: springTransition,
                        opacity: { duration: 0.2, delay: isCollapsed ? 0 : 0.15 }
                    }}
                    className={cn("whitespace-nowrap", isCollapsed ? "pl-0" : "pl-2")}
                >
                    <span className="text-sm tracking-tight">{label}</span>
                </motion.div>
            </div>

            {/* Tooltip simple para cuando está colapsado (Mejora UX) */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {label}
                </div>
            )}
        </NavLink>
    );
};

// Componente de Perfil de Admin Refactorizado
const AdminProfile = ({ isCollapsed, onClick, onLogout }) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "mt-auto border-t border-border/60 bg-background/30 backdrop-blur-md cursor-pointer transition-colors hover:bg-muted/50 group overflow-hidden",
                isCollapsed ? "p-3 flex justify-center" : "p-4"
            )}
        >
            <div className={cn("flex items-center transition-all", isCollapsed ? "justify-center gap-0" : "gap-3")}>
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg group-hover:border-primary/50 transition-colors">
                        <User size={18} className="text-primary" />
                    </div>
                    {/* Indicador Online */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
                </div>

                {/* Info Text - Se oculta suavemente */}
                <motion.div
                    animate={{
                        width: isCollapsed ? 0 : "auto",
                        opacity: isCollapsed ? 0 : 1,
                    }}
                    transition={{
                        width: springTransition,
                        opacity: { duration: 0.2, delay: isCollapsed ? 0 : 0.15 }
                    }}
                    className="flex flex-col overflow-hidden whitespace-nowrap"
                >
                    <span className="text-sm font-bold text-foreground leading-none mb-1">
                        Admin {clientConfig.shortName}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        Gerente General
                    </span>
                </motion.div>

            </div>
        </div>
    );
};

// --- LAYOUT PRINCIPAL ---

const DashboardLayout = () => {
    // Estado del sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Modales y Paneles
    const [showSettings, setShowSettings] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialData, setModalInitialData] = useState(null);

    const location = useLocation();
    const { } = useTheme(); // clientConfig imported globally
    const { selectedDate, addReservation, updateReservation } = useReservations();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- MANEJO DE MODALES ---
    const handleOpenModal = (data = null) => {
        setModalInitialData(data || { name: '', pax: 2, time: '', origin: 'walk-in', notes: '', phone: '', date: selectedDate });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalInitialData(null);
    };

    const handleModalSubmit = (formData) => {
        const tags = formData.notes ? [formData.notes] : [];
        if (formData.id) updateReservation(formData.id, { ...formData, tags });
        else addReservation({ ...formData, tags });
        handleCloseModal();
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">

            {/* SIDEBAR */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 80 : 280
                }}
                transition={springTransition}
                className="relative z-40 flex flex-col h-full bg-background/95 backdrop-blur-2xl border-r border-border/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0"
            >
                {/* 1. Header del Sidebar (Logo) */}
                <div className={cn(
                    "h-20 flex items-center transition-all duration-300",
                    isCollapsed ? "justify-center" : "px-6"
                )}>
                    <BrandLogo collapsed={isCollapsed} />
                </div>

                {/* 2. Navegación */}
                <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">

                    {/* Label de Sección (Solo visible expandido) */}
                    <motion.div
                        animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto" }}
                        transition={{
                            height: springTransition,
                            opacity: { duration: 0.2, delay: isCollapsed ? 0 : 0.15 }
                        }}
                        className="mb-2 px-3 overflow-hidden"
                    >
                        <h3 className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.2em] whitespace-nowrap">
                            Plataforma
                        </h3>
                    </motion.div>

                    <SidebarItem to="/dashboard/reservations" icon={CalendarClock} label="Reservas" isCollapsed={isCollapsed} />
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Estadísticas" isCollapsed={isCollapsed} />

                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />

                    {/* Botón Configuración (Reutilizando estilos de SidebarItem manualmente para mantener consistencia) */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className={cn(
                            "w-full relative flex items-center h-12 rounded-xl group outline-none transition-colors",
                            isCollapsed ? "justify-center" : "px-3 hover:bg-muted"
                        )}
                    >
                        <div className="flex items-center justify-center w-10 h-10 shrink-0">
                            <Settings size={20} className="text-muted-foreground group-hover:text-foreground group-hover:rotate-90 transition-all duration-500" />
                        </div>
                        <div className={cn("relative z-10 overflow-hidden text-left", isCollapsed ? "w-0 flex-none" : "flex-1")}>
                            <motion.div
                                animate={{
                                    width: isCollapsed ? 0 : "auto",
                                    opacity: isCollapsed ? 0 : 1,
                                    x: isCollapsed ? -10 : 0
                                }}
                                transition={{
                                    width: springTransition,
                                    x: springTransition,
                                    opacity: { duration: 0.2, delay: isCollapsed ? 0 : 0.15 }
                                }}
                                className={cn("whitespace-nowrap", isCollapsed ? "pl-0" : "pl-2")}
                            >
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Configuración</span>
                            </motion.div>
                        </div>
                    </button>
                </div>

                {/* 3. Footer Admin (Reemplaza la versión anterior) */}
                <AdminProfile isCollapsed={isCollapsed} onClick={() => setShowSettings(true)} onLogout={handleLogout} />

                {/* 4. Botón de Colapso (Flotante) */}
                {/* 4. Botón de Colapso (Flotante) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 -translate-y-1/2 z-50 flex items-center justify-center w-6 h-6 bg-background border border-border shadow-md rounded-full text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronLeft size={14} />
                    </motion.div>
                </button>

            </motion.aside>

            {/* MAIN AREA */}
            <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-muted/5">

                {/* Header Superior */}
                <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">

                    {/* Títulos Animados */}
                    <div className="flex flex-col justify-center gap-0.5">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                                transition={{ duration: 0.3 }}
                                className="text-xl font-bold text-foreground font-jakarta tracking-tight"
                            >
                                {pathnameToTitle(location.pathname)}
                            </motion.h2>
                        </AnimatePresence>

                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {clientConfig.branchName || "Sucursal Central"}
                        </div>
                    </div>

                    {/* Acciones del Header */}
                    <div className="flex items-center gap-4">
                        <LiveClock />

                        <div className="h-8 w-px bg-border/60 mx-2 hidden md:block"></div>

                        {/* Botón Nueva Reserva (Glow Effect) */}
                        <button
                            onClick={() => handleOpenModal()}
                            className="group relative hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(var(--primary),0.23)] hover:-translate-y-[1px] transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            <Plus size={18} strokeWidth={2.5} />
                            <span>Nueva Reserva</span>
                        </button>

                        {/* Botón Mobile */}
                        <button onClick={() => handleOpenModal()} className="md:hidden flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg">
                            <Plus size={20} strokeWidth={3} />
                        </button>

                        {/* Notificaciones */}
                        <button className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"></span>
                        </button>
                    </div>
                </header>

                {/* Contenido Dinámico */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1920px] mx-auto">
                        <Outlet context={{ openModal: handleOpenModal }} />
                    </div>
                </div>

            </main>

            {/* Modales */}
            <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} onLogout={handleLogout} />
            <ReservationFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleModalSubmit} initialData={modalInitialData} />
        </div>
    );
};

// Helper para títulos
const pathnameToTitle = (path) => {
    if (path === "/dashboard") return "Visión General";
    if (path === "/dashboard/reservations") return "Gestión de Reservas";
    return `Sistema ${clientConfig.name}`;
};

export default DashboardLayout;