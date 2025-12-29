import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarCheck, Users, Clock, Smartphone, UserCog, Percent,
    Bot, Sun, Moon, Sparkles, TrendingUp, Activity
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";
import { useReservations } from "../context/ReservationsContext";
import { clientConfig } from "../config/client";
import { historicalAverages } from "../data/mockData";
import { analyzeOperations } from "../lib/intelligence"; // <--- CEREBRO LÓGICO
import BentoCard from "../components/dashboard/BentoCard"; // <--- COMPONENTE UI
import IntelligenceModal from "../components/dashboard/IntelligenceModal"; // <--- MODAL NUEVO

// --- TOOLTIP PREMIUM (Se mantiene aquí por ser específico de gráficos) ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0F0F10]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[180px] animate-in fade-in zoom-in-95 duration-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Clock size={12} /> {label} HS
                </p>
                <div className="space-y-2">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full shadow-[0_0_8px_currentcolor]"
                                    style={{ backgroundColor: entry.color, color: entry.color }}
                                />
                                <span className="text-slate-200 font-medium">{entry.name}</span>
                            </div>
                            <span className="font-bold text-white tabular-nums">
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const DashboardPage = () => {
    const { theme } = useTheme();
    const { reservations } = useReservations();
    const themeColor = theme.color;

    // --- ESTADOS ---
    const [currentShift, setCurrentShift] = useState('dinner');
    const [isInsightModalOpen, setInsightModalOpen] = useState(false); // <--- ESTADO DEL MODAL
    const isSplitMode = clientConfig.businessLogic.serviceMode === 'split';

    // --- LÓGICA DE FILTRADO (TURNOS) ---
    const activeShiftConfig = clientConfig.businessLogic.shifts[currentShift];

    const filteredReservations = useMemo(() => {
        if (!isSplitMode) return reservations;

        const startHour = parseInt(activeShiftConfig.start.split(':')[0]);
        let endHour = parseInt(activeShiftConfig.end.split(':')[0]);
        if (endHour < startHour) endHour += 24; // Ajuste madrugada

        return reservations.filter(res => {
            let h = parseInt(res.time.split(':')[0]);
            if (h < 10) h += 24;
            return h >= startHour && h <= endHour;
        });
    }, [reservations, currentShift, isSplitMode, activeShiftConfig]);

    // --- KPI CALCULATIONS ---
    const totalReservations = filteredReservations.length;
    const totalPax = filteredReservations.reduce((acc, curr) => acc + curr.pax, 0);
    const maxCap = clientConfig.businessLogic.maxCapacityPax;
    const occupancyPercentage = Math.min(Math.round((totalPax / maxCap) * 100), 100);
    const botCount = filteredReservations.filter(r => r.origin === 'whatsapp').length;

    // --- PREPARACIÓN DE DATOS PARA GRÁFICOS E INTELIGENCIA ---

    // Datos crudos de grupos (para la IA y Gráficos)
    const groupStats = useMemo(() => {
        let c = 0, g = 0, e = 0;
        filteredReservations.forEach(r => {
            if (r.pax <= 2) c++; else if (r.pax <= 6) g++; else e++;
        });
        return { couples: c, groups: g, events: e };
    }, [filteredReservations]);

    // VANTRA INTELLIGENCE (MOTOR DE REGLAS)
    // Ahora obtenemos el reporte completo con status, healthScore y details
    const aiReport = useMemo(() => {
        return analyzeOperations({
            occupancyPercentage,
            botCount,
            totalReservations,
            totalPax,
            groupData: groupStats
        });
    }, [occupancyPercentage, botCount, totalReservations, totalPax, groupStats]);

    // Extraemos el insight más relevante para mostrar en la tarjeta pequeña
    const featuredInsight = aiReport.details.find(d => d.type === 'critical')
        || aiReport.details.find(d => d.type === 'warning')
        || aiReport.details[0];

    // GRÁFICO COMPARATIVO
    const comparisonChartData = useMemo(() => {
        const historyData = historicalAverages[currentShift] || [];
        const todayMap = {};

        filteredReservations.forEach(res => {
            const h = res.time.split(':')[0] + ":00";
            todayMap[h] = (todayMap[h] || 0) + res.pax;
        });

        return historyData.map(hItem => ({
            time: hItem.time,
            historical: hItem.personas,
            actual: todayMap[hItem.time] || 0
        }));
    }, [filteredReservations, currentShift]);

    // GRÁFICO DE GRUPOS (Visual)
    const groupSizeChartData = useMemo(() => {
        const data = [
            { name: 'Parejas (2)', value: groupStats.couples, color: themeColor },
            { name: 'Grupos (4-6)', value: groupStats.groups, color: '#64748b' },
            { name: 'Eventos (7+)', value: groupStats.events, color: '#1e293b' }
        ].filter(d => d.value > 0);
        return data.length > 0 ? data : [{ name: 'Sin datos', value: 1, color: '#1e293b20' }];
    }, [groupStats, themeColor]);

    // GRÁFICO DE ORIGEN
    const sourceData = useMemo(() => {
        const data = [
            { name: 'Bot', value: botCount, color: themeColor },
            { name: 'Manual', value: totalReservations - botCount, color: '#334155' },
        ].filter(d => d.value > 0);
        return data.length > 0 ? data : [{ name: 'Sin datos', value: 1, color: '#1e293b20' }];
    }, [botCount, totalReservations, themeColor]);


    return (
        <div className="h-full flex flex-col space-y-5 pb-6 overflow-x-hidden relative">

            {/* --- HEADER CONTROL --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">

                {/* Selector de Turnos */}
                <div className="flex items-center gap-4">
                    {isSplitMode && (
                        <div className="flex bg-[#18181b] p-1 rounded-2xl border border-white/10 relative">
                            {/* Fondo animado */}
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bg-white/10 rounded-xl inset-y-1"
                                style={{
                                    left: currentShift === 'lunch' ? '4px' : '50%',
                                    width: 'calc(50% - 4px)'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            {[
                                { id: 'lunch', label: 'Mediodía', icon: Sun },
                                { id: 'dinner', label: 'Noche', icon: Moon }
                            ].map((shift) => (
                                <button
                                    key={shift.id}
                                    onClick={() => setCurrentShift(shift.id)}
                                    className={cn(
                                        "relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200",
                                        currentShift === shift.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    <shift.icon size={14} /> {shift.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="flex items-center justify-end gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-bold text-white tracking-widest">EN VIVO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- KPIs PRINCIPALES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                <BentoCard title="Mesas Activas" icon={CalendarCheck} delay={0.1}>
                    <div className="flex items-baseline gap-2 mt-auto">
                        <span className="text-4xl font-bold text-white tabular-nums">{totalReservations}</span>
                        {totalReservations > 0 && (
                            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center">
                                <TrendingUp size={10} className="mr-1" /> ON
                            </span>
                        )}
                    </div>
                </BentoCard>

                <BentoCard title="Comensales" icon={Users} delay={0.15}>
                    <div className="flex items-baseline gap-2 mt-auto">
                        <span className="text-4xl font-bold text-white tabular-nums">{totalPax}</span>
                        <span className="text-slate-500 text-xs font-medium">pax</span>
                    </div>
                </BentoCard>

                <BentoCard title="Ocupación" icon={Percent} delay={0.2}>
                    <div className="flex justify-between items-end mb-2 mt-auto">
                        <span className="text-4xl font-bold text-white tabular-nums">{occupancyPercentage}%</span>
                        <span className="text-xs font-mono text-slate-400">{totalPax}/{maxCap}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${occupancyPercentage}%` }}
                            transition={{ duration: 1 }}
                            className={cn("h-full", occupancyPercentage > 90 ? "bg-red-500" : "bg-primary")}
                            style={{ backgroundColor: occupancyPercentage > 90 ? undefined : themeColor }}
                        />
                    </div>
                </BentoCard>

                <BentoCard title="Automatización" icon={Bot} delay={0.25}>
                    <div className="flex items-baseline gap-2 mt-auto">
                        <span className="text-4xl font-bold text-white tabular-nums">
                            {totalReservations > 0 ? Math.round((botCount / totalReservations) * 100) : 0}%
                        </span>
                        <span className="text-slate-500 text-xs">vía Bot</span>
                    </div>
                </BentoCard>
            </div>

            {/* --- GRÁFICOS E INTELIGENCIA --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">

                {/* 1. CURVA DE DEMANDA */}
                <BentoCard title="Demanda vs. Histórico" icon={Clock} delay={0.3} className="lg:col-span-2 min-h-[350px]">
                    <div className="flex-1 w-full min-h-0 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={comparisonChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={themeColor} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#64748b"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}p`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }} />

                                <Area
                                    type="monotone"
                                    dataKey="historical"
                                    stroke="#475569"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    fill="transparent"
                                    name="Promedio"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="actual"
                                    stroke={themeColor}
                                    strokeWidth={3}
                                    fill="url(#colorActual)"
                                    name="Hoy"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </BentoCard>

                {/* 2. CANAL DE ENTRADA */}
                <BentoCard title="Canal de Entrada" icon={Smartphone} delay={0.35} className="lg:col-span-1 min-h-[350px]">
                    <div className="flex flex-col h-full justify-center gap-6">
                        <div className="h-[200px] relative">
                            {totalReservations > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={sourceData}
                                                innerRadius={55}
                                                outerRadius={75}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                                cornerRadius={4}
                                            >
                                                {sourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <Bot size={24} className="text-white mb-1" />
                                        <span className="text-2xl font-bold text-white">{botCount}</span>
                                        <span className="text-[9px] uppercase tracking-widest text-slate-500">Auto</span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-30">
                                    <Bot size={40} className="mb-2" />
                                    <p className="text-xs">Sin datos aún</p>
                                </div>
                            )}
                        </div>

                        {totalReservations > 0 && (
                            <div className="space-y-2">
                                {sourceData.map((source, idx) => (
                                    <div key={idx} className="flex justify-between items-center px-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                                            <span className="text-xs text-slate-300 font-medium">{source.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-white">{source.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </BentoCard>

                {/* 3. VANTRA INTELLIGENCE (TARJETA QUE ABRE MODAL) */}
                <BentoCard
                    title="Vantra Intelligence"
                    icon={Sparkles}
                    delay={0.4}
                    className="lg:col-span-1 min-h-[180px]"
                    // Gradiente sutil si el estado NO es nominal
                    gradient={aiReport.color !== 'emerald'}
                >
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-start gap-3 mt-2">
                            <div className={cn(
                                "p-2 rounded-lg shrink-0 transition-colors",
                                aiReport.color === 'rose' ? "bg-rose-500/20 text-rose-400" :
                                    aiReport.color === 'amber' ? "bg-amber-500/20 text-amber-400" :
                                        aiReport.color === 'blue' ? "bg-blue-500/20 text-blue-400" :
                                            "bg-emerald-500/20 text-emerald-400"
                            )}>
                                <Activity size={20} className={cn(aiReport.color === 'rose' && "animate-pulse")} />
                            </div>
                            <div>
                                <h4 className={cn("text-sm font-bold mb-1",
                                    aiReport.color === 'rose' ? "text-rose-400" :
                                        aiReport.color === 'amber' ? "text-amber-400" : "text-white"
                                )}>
                                    {featuredInsight?.title || aiReport.mainHeadline}
                                </h4>
                                <p className="text-xs font-medium text-slate-300 leading-relaxed line-clamp-2">
                                    "{featuredInsight?.text || "Analizando flujo de datos en tiempo real..."}"
                                </p>
                            </div>
                        </div>

                        {/* EL BOTÓN AHORA ABRE EL MODAL */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">

                            {/* Status Badge (Reemplazó al Health Score) */}
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full",
                                    aiReport.color === 'rose' ? "bg-rose-500 animate-pulse" :
                                        aiReport.color === 'amber' ? "bg-amber-500" :
                                            aiReport.color === 'blue' ? "bg-blue-500" : "bg-emerald-500"
                                )} />
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider",
                                    aiReport.color === 'rose' ? "text-rose-400" :
                                        aiReport.color === 'amber' ? "text-amber-400" :
                                            aiReport.color === 'blue' ? "text-blue-400" : "text-emerald-400"
                                )}>
                                    {aiReport.label}
                                </span>
                            </div>

                            <button
                                onClick={() => setInsightModalOpen(true)}
                                className={cn(
                                    "text-xs font-bold hover:text-white transition-colors flex items-center gap-1 cursor-pointer",
                                    aiReport.color === 'rose' ? "text-rose-400" :
                                        aiReport.color === 'amber' ? "text-amber-400" :
                                            "text-slate-400"
                                )}
                            >
                                Ver Diagnóstico &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Fondo Alerta (Solo si es crítico) */}
                    {aiReport.color === 'rose' && (
                        <div className="absolute inset-0 bg-rose-500/5 z-0 pointer-events-none" />
                    )}
                </BentoCard>

                {/* 4. TIPOS DE MESA */}
                <BentoCard title="Tipos de Mesa" icon={UserCog} delay={0.45} className="lg:col-span-2 min-h-[180px]">
                    <div className="flex flex-col h-full justify-center space-y-4">
                        {totalReservations > 0 ? groupSizeChartData.map((group, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-slate-300 font-medium flex items-center gap-2">
                                        {group.name}
                                    </span>
                                    <span className="text-slate-400"><strong className="text-white">{group.value}</strong> mesas</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-800/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(group.value / totalReservations) * 100}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: group.color }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-slate-500 text-xs py-4">
                                Esperando primeras reservas del turno...
                            </div>
                        )}
                    </div>
                </BentoCard>
            </div>

            {/* --- MODAL DE INTELIGENCIA (RENDERIZADO AL FINAL) --- */}
            <AnimatePresence>
                {isInsightModalOpen && (
                    <IntelligenceModal
                        isOpen={isInsightModalOpen}
                        onClose={() => setInsightModalOpen(false)}
                        data={aiReport}
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default DashboardPage;