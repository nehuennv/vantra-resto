import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { motion } from "framer-motion";
import { 
    MessageCircle, CalendarCheck, Users, Clock, 
    ArrowUpRight, Zap, Target, Hourglass, Smartphone // <--- AQUÍ FALTABA ESTE, YA ESTÁ AGREGADO
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

// --- DATOS MOCK (Simulados para la DEMO) ---
const hourlyData = [
  { time: '18:00', mensajes: 15, reservas: 3 },
  { time: '19:00', mensajes: 45, reservas: 12 },
  { time: '20:00', mensajes: 90, reservas: 28 }, // Pico
  { time: '21:00', mensajes: 70, reservas: 22 },
  { time: '22:00', mensajes: 30, reservas: 8 },
  { time: '23:00', mensajes: 10, reservas: 2 },
  { time: '00:00', mensajes: 5, reservas: 0 },
];

const sourceData = [
  { name: 'WhatsApp', value: 82 },
  { name: 'Instagram', value: 12 },
  { name: 'Teléfono', value: 6 },
];

const groupSizeData = [
  { name: 'Parejas (2)', value: 45 },
  { name: 'Grupos (4-6)', value: 35 },
  { name: 'Eventos (8+)', value: 20 },
];

const botLogs = [
    { time: "21:12", text: "Nueva reserva: 4 pax (Mesa 8)", status: "highlight" },
    { time: "21:10", text: "Menú enviado a +54911...", status: "success" },
    { time: "21:05", text: "Consulta: '¿Tienen celíacos?'", status: "info" },
    { time: "20:58", text: "Recordatorio enviado a Juan P.", status: "success" },
    { time: "20:55", text: "Reserva cancelada (Liberada)", status: "error" },
];

// --- COMPONENTE BENTO BOX (Estructura de Cajitas) ---
const BentoBox = ({ children, className, delay = 0, title, icon: Icon, valueHeader }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: delay }}
            className={cn(
                "bg-[#0F0F10] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors",
                className
            )}
        >
            {/* Header de la Caja */}
            {(title || Icon) && (
                <div className="flex items-center justify-between mb-4 z-10">
                    <div className="flex items-center gap-2 text-slate-400">
                        {Icon && <Icon size={16} className="text-slate-500" />}
                        <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
                    </div>
                    {valueHeader && (
                        <span className="text-lg font-bold text-white tabular-nums">{valueHeader}</span>
                    )}
                </div>
            )}
            
            {/* Contenido */}
            <div className="flex-1 z-10 relative min-h-0 flex flex-col">{children}</div>
        </motion.div>
    );
};

// --- PÁGINA DASHBOARD ---
const DashboardPage = () => {
    const { theme } = useTheme();
    const themeColor = theme.color;

    return (
        <div className="space-y-6 h-full flex flex-col pb-10">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight font-jakarta">
                        Métricas de Sala
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Análisis de rendimiento: Bot de Reservas y Ocupación.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-mono text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                    LIVE DEMO
                </div>
            </div>

            {/* GRID PRINCIPAL (Bento Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                
                {/* --- FILA 1: KPIs SUPERIORES (4 columnas) --- */}
                
                {/* KPI 1 */}
                <BentoBox title="Reservas Totales" icon={CalendarCheck} delay={0.1}>
                    <div className="flex items-baseline gap-2 mt-auto">
                        <h2 className="text-4xl font-bold text-white tabular-nums">54</h2>
                        <span className="text-sm font-medium text-emerald-400 flex items-center">
                            <ArrowUpRight size={14} /> 15%
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">8 pendientes de confirmar</p>
                </BentoBox>

                {/* KPI 2 */}
                <BentoBox title="Volumen Chats" icon={MessageCircle} delay={0.15}>
                    <div className="flex items-baseline gap-2 mt-auto">
                        <h2 className="text-4xl font-bold text-white tabular-nums">218</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Interacciones procesadas hoy</p>
                </BentoBox>

                {/* KPI 3 */}
                <BentoBox title="Tasa de Conversión" icon={Target} delay={0.2}>
                    <div className="flex items-baseline gap-2 mt-auto">
                        <h2 className="text-4xl font-bold text-white tabular-nums">24.8%</h2>
                    </div>
                    <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="h-full w-[24.8%]" style={{ backgroundColor: themeColor }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Chat a Reserva Confirmada</p>
                </BentoBox>

                 {/* KPI 4 */}
                 <BentoBox title="Tiempo Ahorrado" icon={Hourglass} delay={0.25}>
                    <div className="flex items-baseline gap-2 mt-auto">
                        <h2 className="text-4xl font-bold text-white tabular-nums">4.5<span className="text-lg">h</span></h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Calculado en atención auto.</p>
                </BentoBox>


                {/* --- FILA 2: GRÁFICO CENTRAL + LOG (Layout 3+1) --- */}

                {/* CHART PRINCIPAL (Ocupa 3 de ancho) */}
                <BentoBox title="Actividad por Hora (Impacto del Bot)" icon={Clock} delay={0.3} className="lg:col-span-3 min-h-[300px]">
                    <div className="w-full h-full flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMensajes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="mensajes" 
                                    stroke={themeColor} 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorMensajes)" 
                                    name="Consultas"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="reservas" 
                                    stroke="#fff" 
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    fill="transparent"
                                    name="Reservas"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </BentoBox>

                {/* LOG EN VIVO (Ocupa 1 de ancho) */}
                <BentoBox title="Log en Vivo" icon={Zap} delay={0.35} className="lg:col-span-1 min-h-[300px]">
                    <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                         <div className="absolute left-[21px] top-10 bottom-4 w-px bg-white/5" />
                         
                         {botLogs.map((log, i) => (
                            <div key={i} className="flex gap-3 relative z-10">
                                <div className={cn(
                                    "w-2 h-2 rounded-full mt-1.5 ring-4 ring-[#0F0F10]",
                                    log.status === 'highlight' ? "bg-white" : 
                                    log.status === 'error' ? "bg-red-500" :
                                    "bg-slate-700"
                                )} style={log.status === 'highlight' ? { backgroundColor: themeColor } : {}} />
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                         <p className={cn(
                                             "text-xs truncate font-medium",
                                             log.status === 'highlight' ? "text-white" : "text-slate-400"
                                         )}>{log.text}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-mono">{log.time}</p>
                                </div>
                            </div>
                         ))}
                    </div>
                </BentoBox>


                {/* --- FILA 3: ANÁLISIS PROFUNDO (4 columnas) --- */}

                {/* FUENTE DE RESERVAS (1 col) */}
                <BentoBox title="Origen" icon={Smartphone} delay={0.4} className="lg:col-span-1 min-h-[200px]">
                    <div className="flex-1 flex items-center justify-center">
                         <ResponsiveContainer width="100%" height={140}>
                            <BarChart data={sourceData} layout="vertical" barSize={20}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={70} tick={{fill:'#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', border: 'none'}} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {sourceData.map((entry, index) => (
                                        <Cell key={index} fill={entry.name === 'WhatsApp' ? themeColor : '#334155'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </BentoBox>

                {/* TAMAÑO DE GRUPOS (1 col) */}
                <BentoBox title="Distribución Pax" icon={Users} delay={0.45} className="lg:col-span-1 min-h-[200px]">
                     <div className="flex-1 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={groupSizeData}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {groupSizeData.map((entry, index) => (
                                        <Cell key={index} fill={index === 0 ? themeColor : index === 1 ? '#475569' : '#1e293b'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#000', borderRadius:'8px', border: '1px solid #333'}} itemStyle={{color:'#fff'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Texto central */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xs font-bold text-slate-500">GRUPOS</span>
                        </div>
                     </div>
                </BentoBox>

                {/* METRICA FINAL: CAPACIDAD (2 cols) */}
                <BentoBox title="Ocupación Proyectada" icon={Users} delay={0.5} className="lg:col-span-2 min-h-[200px]">
                    <div className="h-full flex flex-col justify-center gap-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-bold text-white tabular-nums">85%</h3>
                                <p className="text-xs text-slate-400">Capacidad total para esta noche</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-white">120 / 140 Pax</span>
                            </div>
                        </div>
                        
                        {/* Barra de Progreso Custom */}
                        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden relative">
                             {/* Fondo rayado */}
                             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }} />
                             
                             {/* Progreso Sólido */}
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="h-full rounded-full relative"
                                style={{ backgroundColor: themeColor }}
                             >
                                 <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />
                             </motion.div>
                        </div>
                        <p className="text-[10px] text-slate-500 text-right">Se recomienda liberar 2 mesas de reserva para Walk-ins.</p>
                    </div>
                </BentoBox>

            </div>
        </div>
    );
};

export default DashboardPage;