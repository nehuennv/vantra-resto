import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
    Clock, CheckCircle2, Zap, LogOut,
    Users, MessageCircle, Phone, Store,
    ChevronDown, Pencil, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragOverlay,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    PointerSensor,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';

// --- CONFIGURACIÓN DE ESTADO ---
const STATUS_CONFIG = {
    pending: {
        id: 'pending', label: 'Pendiente', icon: Clock,
        color: 'text-amber-500',
        dragParams: "bg-amber-500/10 border-amber-500/30"
    },
    confirmed: {
        id: 'confirmed', label: 'Confirmada', icon: CheckCircle2,
        color: 'text-indigo-500',
        dragParams: "bg-indigo-500/10 border-indigo-500/30"
    },
    seated: {
        id: 'seated', label: 'En Mesa', icon: Zap,
        color: 'text-emerald-500',
        dragParams: "bg-emerald-500/10 border-emerald-500/30"
    },
    finished: {
        id: 'finished', label: 'Finalizada', icon: LogOut,
        color: 'text-slate-500',
        dragParams: "bg-slate-500/10 border-slate-500/30"
    }
};

const getCurrentTime = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

// --- 1. TARJETA VISUAL (VISUAL REFINEMENT) ---
const KanbanCard = React.forwardRef(({ res, isOverlay, style, className, onClick, ...props }, ref) => {
    // Get config for specific color mapping based on status
    const statusColor =
        res.status === 'pending' ? 'amber' :
            res.status === 'confirmed' ? 'indigo' :
                res.status === 'seated' ? 'emerald' : 'slate';

    // Map base styles to status colors for dynamic feedback
    const statusStyles = {
        amber: "hover:border-amber-500/50 hover:shadow-amber-500/20",
        indigo: "hover:border-indigo-500/50 hover:shadow-indigo-500/20",
        emerald: "hover:border-emerald-500/50 hover:shadow-emerald-500/20",
        slate: "hover:border-slate-500/50 hover:shadow-slate-500/20",
    };

    const overlayStyles = {
        amber: "ring-amber-500/50",
        indigo: "ring-indigo-500/50",
        emerald: "ring-emerald-500/50",
        slate: "ring-slate-500/50",
    };

    return (
        <div
            ref={ref}
            style={{
                ...style,
                margin: 0,
                transform: isOverlay ? style?.transform : undefined,
                transition: isOverlay ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className={cn(
                // REFINED STYLE: Semantic colors, status-based feedback
                "relative flex flex-col rounded-xl border border-border/40 shadow-sm overflow-hidden touch-none select-none transition-all",
                "bg-card/90 backdrop-blur-sm", // Subtle transparency for depth, uses theme color

                // Status-specific hover effects (instead of generic primary)
                !isOverlay && statusStyles[statusColor],
                !isOverlay && "hover:shadow-lg", // Softened shadow, removed lift transform

                isOverlay
                    ? cn("cursor-grabbing shadow-2xl ring-1 z-[9999] scale-105", overlayStyles[statusColor])
                    : "cursor-grab",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {/* Status Indicator - Slim & Integrated */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-[4px]",
                res.status === 'pending' ? 'bg-amber-500' :
                    res.status === 'confirmed' ? 'bg-indigo-500' :
                        res.status === 'seated' ? 'bg-emerald-500' : 'bg-slate-500'
            )} />

            <div className="p-3 pl-4">
                {/* Top Row: Name & Time */}
                <div className="flex justify-between items-start mb-2.5">
                    <span className="text-sm font-semibold text-foreground truncate mr-2 leading-tight">
                        {res.name}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/50 border border-white/5 text-muted-foreground whitespace-nowrap">
                        {res.time}
                    </span>
                </div>

                {/* Bottom Row: Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 ">
                        <Users size={12} className="opacity-70" />
                        <span className="font-medium">{res.pax}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium opacity-70">
                        {res.origin === 'whatsapp' ? <MessageCircle size={10} /> : res.origin === 'walk-in' ? <Store size={10} /> : <Phone size={10} />}
                        <span>{res.origin === 'walk-in' ? 'Walk-in' : res.origin}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

// --- 2. WRAPPER DRAGGABLE ---
const DraggableKanbanCard = ({ res, ...props }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: res.id,
        data: { res }
    });

    return (
        <motion.div
            ref={setNodeRef}
            layoutId={res.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: isDragging ? 0 : 1,
                scale: isDragging ? 0.95 : 1,
                transition: { duration: 0.2 }
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-3 outline-none"
            {...listeners}
            {...attributes}
        >
            <KanbanCard
                res={res}
                className={isDragging ? "opacity-0" : ""}
                {...props}
            />
        </motion.div>
    );
};

// --- 3. COLUMNA DROPPABLE (GHOST STYLE) ---
const DroppableColumn = ({ statusKey, items, ...props }) => {
    const { setNodeRef, isOver } = useDroppable({ id: statusKey });
    const config = STATUS_CONFIG[statusKey];
    const Icon = config.icon;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                // ESTRUCTURA BASE INVISIBLE
                "flex-1 min-w-[280px] sm:min-w-[300px] flex flex-col h-full max-h-full rounded-3xl transition-all duration-300 border-2",
                // FEEDBACK DE ARRASTRE: Solo visible si isOver es true
                isOver ? cn("border-dashed", config.dragParams) : "border-transparent bg-transparent"
            )}
        >
            {/* Header Flotante */}
            <div className="px-4 py-3 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-lg bg-background/40 shadow-sm ring-1 ring-white/5", config.color)}>
                        <Icon size={14} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground/80">{config.label}</h3>
                </div>
                <span className="text-[10px] font-bold bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground border border-white/5">
                    {items.length}
                </span>
            </div>

            {/* Area de scroll limpia */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-4 custom-scrollbar">
                <AnimatePresence mode="popLayout" initial={false}>
                    {items.map(res => (
                        <DraggableKanbanCard key={res.id} res={res} {...props} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- 4. VISTA PRINCIPAL ---
export default function ReservationKanbanView({ reservations, onUpdate }) {
    const [activeRes, setActiveRes] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    const handleDragStart = (e) => setActiveRes(e.active.data.current?.res);

    const handleDragEnd = (e) => {
        const { active, over } = e;
        setActiveRes(null);
        if (over && active.id !== over.id) {
            const res = active.data.current?.res;
            const newStatus = over.id;
            if (res && res.status !== newStatus && STATUS_CONFIG[newStatus]) {
                const updates = { status: newStatus };
                if (newStatus === 'seated') updates.time = getCurrentTime();
                onUpdate(res.id, updates);
            }
        }
    };

    const grouped = useMemo(() => {
        const g = { pending: [], confirmed: [], seated: [], finished: [] };
        reservations.forEach(r => { if (g[r.status]) g[r.status].push(r) });
        return g;
    }, [reservations]);

    const dropAnimation = {
        duration: 0,
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.0' } } }),
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex-1 w-full h-full overflow-x-auto overflow-y-hidden p-2 snap-x snap-mandatory">
                <LayoutGroup>
                    <div className="flex h-full gap-2 lg:gap-6 min-w-full lg:min-w-0 items-stretch">
                        {Object.keys(STATUS_CONFIG).map(status => (
                            <div key={status} className="snap-center h-full flex-1 min-w-[280px] sm:min-w-[300px]">
                                <DroppableColumn statusKey={status} items={grouped[status]} />
                            </div>
                        ))}
                    </div>
                </LayoutGroup>
            </div>
            {mounted ? createPortal(
                <DragOverlay dropAnimation={dropAnimation} style={{ zIndex: 9999 }}>
                    {activeRes ? <KanbanCard res={activeRes} isOverlay={true} className="w-[280px]" /> : null}
                </DragOverlay>,
                document.body
            ) : null}
        </DndContext>
    );
}