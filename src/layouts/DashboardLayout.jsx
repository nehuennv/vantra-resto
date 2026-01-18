import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarClock,
    Settings,
    ChevronLeft,
    Bell,
    Plus,
    Clock,
    User,
    BookOpen,
    Menu,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import SettingsPanel from "../components/SettingsPanel";
import BrandLogo from "../components/ui/BrandLogo";
import { useTheme } from "../context/ThemeContext";
import ReservationFormModal from "../components/reservations/ReservationFormModal";
import { useReservations } from "../context/ReservationsContext";
import { clientConfig } from "../config/client";
import { useAuth } from "../context/AuthContext";

// --- CONFIGURACIÓN DE ANIMACIONES ---
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

const SidebarItem = ({ to, icon: Icon, label, isCollapsed, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={cn(
                "relative flex items-center h-12 mb-2 transition-all duration-300 rounded-xl group outline-none",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.05)]"
                    initial={false}
                    transition={springTransition}
                />
            )}

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

            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {label}
                </div>
            )}
        </NavLink>
    );
};

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
                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg group-hover:border-primary/50 transition-colors">
                        <User size={18} className="text-primary" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
                </div>

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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Global Header Action State
    const [headerAction, setHeaderAction] = useState(null);

    const [showSettings, setShowSettings] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialData, setModalInitialData] = useState(null);

    const location = useLocation();
    const { } = useTheme();
    const { addReservation, updateReservation } = useReservations();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenModal = (data = null) => {
        setModalInitialData(data);
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
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={springTransition}
                className="relative z-40 hidden lg:flex flex-col h-full bg-background/95 backdrop-blur-2xl border-r border-border/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0"
            >
                <div className={cn("h-20 flex items-center transition-all duration-300", isCollapsed ? "justify-center" : "px-6")}>
                    <BrandLogo collapsed={isCollapsed} />
                </div>

                <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <motion.div
                        animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto" }}
                        transition={{ height: springTransition, opacity: { duration: 0.2, delay: isCollapsed ? 0 : 0.15 } }}
                        className="mb-2 px-3 overflow-hidden"
                    >
                        <h3 className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.2em] whitespace-nowrap">
                            Plataforma
                        </h3>
                    </motion.div>

                    <SidebarItem to="/dashboard/reservations" icon={CalendarClock} label="Reservas" isCollapsed={isCollapsed} />
                    <SidebarItem to="/dashboard/menu" icon={BookOpen} label="Gestión de Menú" isCollapsed={isCollapsed} />
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Estadísticas" isCollapsed={isCollapsed} />

                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />

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

                <AdminProfile isCollapsed={isCollapsed} onClick={() => setShowSettings(true)} onLogout={handleLogout} />

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 -translate-y-1/2 z-50 flex items-center justify-center w-6 h-6 bg-background border border-border shadow-md rounded-full text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                >
                    <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronLeft size={14} />
                    </motion.div>
                </button>
            </motion.aside>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-background border-r border-border z-50 lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="h-20 px-6 flex items-center justify-between border-b border-border/40">
                                <BrandLogo collapsed={false} />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                                <SidebarItem to="/dashboard/reservations" icon={CalendarClock} label="Reservas" isCollapsed={false} onClick={() => setIsMobileMenuOpen(false)} />
                                <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Estadísticas" isCollapsed={false} onClick={() => setIsMobileMenuOpen(false)} />
                                <div className="my-4 h-px bg-border/50 w-full" />
                                <button
                                    onClick={() => { setShowSettings(true); setIsMobileMenuOpen(false); }}
                                    className="w-full relative flex items-center h-12 px-3 rounded-xl group outline-none transition-colors hover:bg-muted"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 shrink-0">
                                        <Settings size={20} className="text-muted-foreground group-hover:text-foreground" />
                                    </div>
                                    <div className="ml-2">
                                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Configuración</span>
                                    </div>
                                </button>
                            </div>
                            <AdminProfile isCollapsed={false} onClick={() => { setShowSettings(true); setIsMobileMenuOpen(false); }} onLogout={handleLogout} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN AREA */}
            <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-muted/5">
                <header className="h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
                            <Menu size={24} />
                        </button>

                        <div className="flex flex-col justify-center gap-0.5">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={location.pathname}
                                    initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                                    transition={{ duration: 0.3 }}
                                    className="text-lg md:text-xl font-bold text-foreground font-jakarta tracking-tight truncate max-w-[200px] md:max-w-none"
                                >
                                    {pathnameToTitle(location.pathname)}
                                </motion.h2>
                            </AnimatePresence>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {clientConfig.branchName || "Sucursal Central"}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <LiveClock />
                        <div className="h-8 w-px bg-border/60 mx-2 hidden md:block"></div>

                        {/* Botón de Acción Principal (Dinámico) */}
                        <motion.button
                            onClick={() => headerAction ? headerAction.onClick() : handleOpenModal()}
                            className="group relative hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(var(--primary),0.23)] hover:-translate-y-[1px] transition-all duration-300 overflow-hidden w-[170px] justify-between"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            <div className="flex items-center justify-between w-full">
                                <Plus size={18} strokeWidth={2.5} className="shrink-0" />
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={headerAction ? headerAction.label : "Nueva Reserva"}
                                        initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                                        transition={{ duration: 0.2 }}
                                        className="whitespace-nowrap text-right flex-1"
                                    >
                                        {headerAction ? headerAction.label : "Nueva Reserva"}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </motion.button>

                        {/* Botón Mobile (Dinámico) */}
                        <AnimatePresence mode="wait">
                            <motion.button
                                key={headerAction ? 'custom-mobile' : 'default-mobile'}
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 45 }}
                                onClick={() => headerAction ? headerAction.onClick() : handleOpenModal()}
                                className="md:hidden flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform"
                            >
                                <Plus size={20} strokeWidth={3} />
                            </motion.button>
                        </AnimatePresence>

                        <button className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto  scroll-smooth custom-scrollbar">
                    <div className="max-w-[1920px] mx-auto h-full">
                        {/* Se pasa setHeaderAction al contexto del Outlet */}
                        <Outlet context={{ openModal: handleOpenModal, setHeaderAction: setHeaderAction }} />
                    </div>
                </div>
            </main>

            <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} onLogout={handleLogout} />
            <ReservationFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleModalSubmit} initialData={modalInitialData} />
        </div>
    );
};

const pathnameToTitle = (path) => {
    if (path === "/dashboard") return "Visión General";
    if (path === "/dashboard/reservations") return "Gestión de Reservas";
    if (path === "/dashboard/menu") return "Gestión de Menú";
    return `Sistema ${clientConfig.name}`;
};

export default DashboardLayout;