import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarClock,
    Settings,
    LogOut,
    ChevronLeft,
    Bell,
    Plus,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import SettingsPanel from "../components/SettingsPanel";
import BrandLogo from "../components/ui/BrandLogo";
import { useTheme } from "../context/ThemeContext";
import ReservationFormModal from "../components/reservations/ReservationFormModal";
import { useReservations } from "../context/ReservationsContext";

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-muted-foreground">
            <Clock size={15} className="text-primary" />
            <span className="text-sm font-semibold text-foreground tabular-nums tracking-tight">
                {time.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
        </div>
    );
};

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            className={cn(
                "relative flex items-center h-12 mb-1 transition-colors rounded-xl group outline-none overflow-hidden",
                isActive ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}

            <div className="flex items-center w-full z-10">
                {/* W-10 (40px) Fijo para alinearse con el Logo */}
                <div className="flex items-center justify-center w-10 h-10 shrink-0">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className="transition-transform duration-300 group-hover:scale-110" />
                </div>

                <div className="flex-1 overflow-hidden h-full flex items-center">
                    <motion.span
                        initial={false}
                        animate={{
                            width: isCollapsed ? 0 : "auto",
                            opacity: isCollapsed ? 0 : 1,
                            marginLeft: isCollapsed ? 0 : 8
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden pl-1"
                    >
                        {label}
                    </motion.span>
                </div>
            </div>
        </NavLink>
    );
};

const DashboardLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialData, setModalInitialData] = useState(null);

    const location = useLocation();
    const { clientConfig } = useTheme();
    const { selectedDate, addReservation, updateReservation } = useReservations();

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

    // --- VARIANTES DE ANIMACIÓN ---
    const sidebarVariants = {
        expanded: {
            width: "260px",
            paddingLeft: "24px",
            paddingRight: "24px"
        },
        collapsed: {
            width: "80px",
            // CLAVE: 20px padding + 40px icono + 20px padding = 80px total.
            // Esto centra matemáticamente el contenido sin usar justify-center.
            paddingLeft: "20px",
            paddingRight: "20px"
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">

            <motion.aside
                initial={false}
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={sidebarVariants}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-40 flex flex-col h-full bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl flex-shrink-0"
            >
                {/* 1. HEADER LOGO */}
                {/* padding-bottom para separar, overflow-visible por si las dudas, pero con el padding interno basta */}
                <div className="pt-6 pb-6 flex-shrink-0 min-h-[80px] flex items-center overflow-visible">
                    <BrandLogo collapsed={isCollapsed} />
                </div>

                {/* 2. NAV SECTION */}
                <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-1">

                    <motion.div
                        initial={false}
                        animate={{
                            height: isCollapsed ? 0 : "auto",
                            opacity: isCollapsed ? 0 : 1,
                            marginBottom: isCollapsed ? 0 : 8
                        }}
                        className="overflow-hidden"
                    >
                        <h3 className="px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                            Principal
                        </h3>
                    </motion.div>

                    <SidebarItem to="/reservations" icon={CalendarClock} label="Reservas" isCollapsed={isCollapsed} />
                    <SidebarItem to="/" icon={LayoutDashboard} label="Estadísticas" isCollapsed={isCollapsed} />

                    <div className="my-6 h-px bg-border w-full" />

                    {/* Botón Settings */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full relative flex items-center h-12 transition-colors rounded-xl group overflow-hidden outline-none text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <div className="flex items-center w-full z-10">
                            <div className="flex items-center justify-center w-10 h-10 shrink-0">
                                <Settings size={20} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 overflow-hidden h-full flex items-center">
                                <motion.span
                                    animate={{
                                        width: isCollapsed ? 0 : "auto",
                                        opacity: isCollapsed ? 0 : 1,
                                        marginLeft: isCollapsed ? 0 : 8
                                    }}
                                    className="text-sm font-medium whitespace-nowrap overflow-hidden pl-1"
                                >
                                    Configuración
                                </motion.span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* 3. ADMIN FOOTER */}
                <div className="p-0 mt-auto border-t border-border bg-background/50 flex-shrink-0 overflow-hidden">
                    <div className="py-3">
                        <div
                            onClick={() => setShowSettings(true)}
                            className="flex items-center h-12 rounded-xl transition-all hover:bg-muted cursor-pointer overflow-hidden relative group"
                        >
                            <div className="flex items-center justify-center w-10 h-10 shrink-0 z-20">
                                <div className="w-8 h-8 rounded-full bg-primary/10 border border-border flex items-center justify-center text-xs font-bold text-primary group-hover:border-primary/50 transition-colors">
                                    AD
                                </div>
                            </div>

                            <motion.div
                                animate={{
                                    width: isCollapsed ? 0 : "auto",
                                    opacity: isCollapsed ? 0 : 1,
                                }}
                                className="flex flex-1 items-center overflow-hidden pr-2 ml-2"
                            >
                                <div className="flex flex-col min-w-[80px]">
                                    <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">Administrador</span>
                                    <span className="text-[10px] text-muted-foreground truncate">Gerente</span>
                                </div>

                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Logout");
                                    }}
                                    className="ml-auto p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors text-muted-foreground"
                                >
                                    <LogOut size={16} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 z-50 flex items-center justify-center w-6 h-6 bg-background border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-md outline-none hover:scale-110 active:scale-95"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ChevronLeft size={12} />
                    </motion.div>
                </button>
            </motion.aside>

            {/* MAIN AREA (SIN CAMBIOS) */}
            <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-background">
                <header className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-lg font-bold text-foreground font-jakarta tracking-tight"
                            >
                                {pathnameToTitle(location.pathname)}
                            </motion.h2>
                        </AnimatePresence>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium h-4">
                            {clientConfig.branchName ? <span>{clientConfig.branchName}</span> : <span>{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <LiveClock />
                        <div className="h-6 w-px bg-border hidden md:block"></div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="group/btn relative hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] hover:scale-[1.01] border border-white/10 active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
                            <Plus size={16} strokeWidth={3} className="relative z-20" />
                            <span className="relative z-20">Nueva Reserva</span>
                        </button>
                        <button onClick={() => handleOpenModal()} className="md:hidden flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg">
                            <Plus size={20} strokeWidth={3} />
                        </button>
                        <button className="relative text-muted-foreground hover:text-foreground transition-colors outline-none p-2 rounded-full hover:bg-muted">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1920px] mx-auto animate-in fade-in zoom-in-95 duration-300">
                        <Outlet context={{ openModal: handleOpenModal }} />
                    </div>
                </div>
            </main>

            <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
            <ReservationFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleModalSubmit} initialData={modalInitialData} />
        </div>
    );
};

const pathnameToTitle = (path) => {
    if (path === "/") return "Visión General";
    if (path === "/reservations") return "Gestión de Sala & Reservas";
    return "Sistema Vantra";
};

export default DashboardLayout;