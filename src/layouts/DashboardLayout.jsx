import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarClock,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    Plus,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import SettingsPanel from "../components/SettingsPanel";
import BrandLogo from "../components/ui/BrandLogo";
import { useTheme } from "../context/ThemeContext";

const getPageTitle = (pathname) => {
    switch (pathname) {
        case "/": return "Visión General";
        case "/reservations": return "Gestión de Sala & Reservas";
        default: return "Sistema Vantra";
    }
};

// --- RELOJ CORREGIDO (24HS + ACTUALIZACIÓN REAL) ---
const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Actualizamos cada 1 segundo para que el minuto cambie EXACTO
        // cuando tiene que cambiar, sin esperar.
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white-alpha text-slate-400">
            <Clock size={15} className="text-primary" />
            <span className="text-sm font-semibold text-slate-200 tabular-nums tracking-tight">
                {/* FORZAMOS FORMATO ARGENTINA 24HS */}
                {time.toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // <--- ESTO ES CLAVE
                })}
            </span>
        </div>
    );
};

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink
            to={to}
            className="relative flex items-center gap-3 px-3 py-3 group select-none z-10 outline-none"
        >
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-xl shadow-md shadow-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <div className={cn(
                "relative z-10 flex items-center transition-colors duration-200",
                isActive ? "text-primary-foreground font-semibold" : "text-slate-400 group-hover:text-slate-100",
                collapsed && "w-full justify-center"
            )}>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {!collapsed && (
                    <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 text-sm font-medium tracking-tight whitespace-nowrap"
                    >
                        {label}
                    </motion.span>
                )}
            </div>
        </NavLink>
    );
};

const DashboardLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const location = useLocation();
    const { clientConfig } = useTheme();

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30 transition-colors duration-700">

            {/* --- SIDEBAR --- */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? "80px" : "260px" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative z-50 flex flex-col h-full bg-sidebar border-r border-white-alpha shadow-2xl"
            >
                <div className="p-6 pb-2 flex flex-col gap-6">
                    <div className={cn("flex items-center transition-all duration-300", isCollapsed ? "justify-center" : "")}>
                        <BrandLogo collapsed={isCollapsed} />
                    </div>
                </div>

                <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {!isCollapsed && (
                        <h3 className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-80">
                            Principal
                        </h3>
                    )}

                    <SidebarItem to="/reservations" icon={CalendarClock} label="Reservas" collapsed={isCollapsed} />
                    <SidebarItem to="/" icon={LayoutDashboard} label="Estadísticas" collapsed={isCollapsed} />

                    <div className="my-6 mx-2 h-px bg-white-alpha" />

                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full relative flex items-center gap-3 px-3 py-3 group select-none rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-slate-100 outline-none"
                    >
                        <div className={cn("flex items-center", isCollapsed && "w-full justify-center")}>
                            <Settings size={20} strokeWidth={1.5} />
                            {!isCollapsed && <span className="ml-3 text-sm font-medium">Configuración</span>}
                        </div>
                    </button>
                </div>

                <div className="p-3 mt-auto border-t border-white-alpha bg-black/20">
                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/5 cursor-pointer group",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white-alpha flex items-center justify-center text-xs font-bold text-slate-300">
                            AD
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-slate-200 truncate">Admin</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 z-50 flex items-center justify-center w-6 h-6 bg-sidebar border border-white-alpha rounded-full text-slate-400 hover:text-white hover:border-primary transition-all shadow-md outline-none"
                >
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>
            </motion.aside>


            {/* --- MAIN AREA --- */}
            <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-background">

                <header className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-white-alpha bg-background/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-700">

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
                                {getPageTitle(location.pathname)}
                            </motion.h2>
                        </AnimatePresence>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium h-4">
                            {clientConfig.branchName ? (
                                <span>{clientConfig.branchName}</span>
                            ) : (
                                <span>{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">

                        {/* AQUI ESTÁ EL RELOJ FIXEADO */}
                        <LiveClock />

                        <div className="h-6 w-px bg-white-alpha hidden md:block"></div>

                        <button className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20">
                            <Plus size={16} strokeWidth={3} />
                            <span>Nueva Reserva</span>
                        </button>

                        <button className="md:hidden flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg">
                            <Plus size={20} strokeWidth={3} />
                        </button>

                        <button className="relative text-slate-400 hover:text-white transition-colors outline-none">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1920px] mx-auto animate-in fade-in zoom-in-95 duration-300">
                        <Outlet />
                    </div>
                </div>
            </main>

            <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
    );
};

export default DashboardLayout;