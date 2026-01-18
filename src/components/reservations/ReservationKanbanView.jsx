import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
    Clock, CheckCircle2, Zap, LogOut,
    Users, MessageCircle, Phone, Store, Hash,
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
        color: 'text-amber-600', border: 'border-amber-200', bar: 'bg-amber-500',
        dragParams: "bg-amber-500/5 ring-2 ring-amber-500/30"
    },
    confirmed: {
        id: 'confirmed', label: 'Confirmada', icon: CheckCircle2,
        color: 'text-indigo-600', border: 'border-indigo-200', bar: 'bg-indigo-500',
        dragParams: "bg-indigo-500/5 ring-2 ring-indigo-500/30"
    },
    seated: {
        id: 'seated', label: 'En Mesa', icon: Zap,
        color: 'text-emerald-600', border: 'border-emerald-200', bar: 'bg-emerald-500',
        dragParams: "bg-emerald-500/5 ring-2 ring-emerald-500/30"
    },
    finished: {
        id: 'finished', label: 'Finalizada', icon: LogOut,
        color: 'text-slate-600', border: 'border-slate-200', bar: 'bg-slate-500',
        dragParams: "bg-slate-500/5 ring-2 ring-slate-500/30"
    }
};

const getCurrentTime = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

// --- 1. TARJETA VISUAL (SIN LÓGICA DE DRAG) ---
const KanbanCard = React.forwardRef(({ res, isOverlay, style, className, onClick, ...props }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                ...style,
                // RESET TOTAL: Esto elimina el desfase causado por márgenes heredados
                margin: 0,
                // Optimizamos renderizado para que siga al mouse sin delay
                transform: isOverlay ? style?.transform : undefined,
                transition: isOverlay ? 'none' : 'all 0.2s ease',
            }}
            className={cn(
                "relative flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden touch-none select-none",
                // Si es overlay, le damos estilos de "agarrado" y forzamos un z-index máximo
                isOverlay ? "cursor-grabbing shadow-xl ring-1 ring-primary/40 z-[9999] scale-[1.02]" : "cursor-grab hover:shadow-md hover:border-primary/30",
                className
            )}
            onClick={onClick}
            {...props}
        >
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", STATUS_CONFIG[res.status]?.bar || 'bg-gray-500')} />

            <div className="p-3 pl-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-foreground truncate mr-2">
                        {res.name}
                    </span>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground whitespace-nowrap">
                        {res.time} hs
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users size={12} /> <span className="font-medium">{res.pax}</span>
                    </div>
                    <span className="text-border/40">|</span>
                    <div className="flex items-center gap-1 capitalize">
                        {res.origin === 'whatsapp' ? <MessageCircle size={12} /> : res.origin === 'walk-in' ? <Store size={12} /> : <Phone size={12} />}
                        <span className="truncate max-w-[80px]">{res.origin === 'walk-in' ? 'Presencial' : res.origin}</span>
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
            layoutId={res.id} // Magic: Shared layout identity
            layout // Enable layout animations
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isDragging ? 0 : 1,
                scale: isDragging ? 0.95 : 1,
                transition: { duration: 0.2 }
            }}
            exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.15 }
            }}
            // Brutal / Native feel physics
            transition={{ type: "spring", stiffness: 600, damping: 30, mass: 1 }}
            className="mb-3 outline-none" // outline-none for accessibility clean-up
            {...listeners}
            {...attributes}
        >
            <KanbanCard
                res={res}
                className={isDragging ? "opacity-0" : ""} // Double safety: hide content
                {...props}
            />
        </motion.div>
    );
};

// --- 3. COLUMNA DROPPABLE ---
const DroppableColumn = ({ statusKey, items, ...props }) => {
    const { setNodeRef, isOver } = useDroppable({ id: statusKey });
    const config = STATUS_CONFIG[statusKey];
    const Icon = config.icon;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 min-w-[280px] sm:min-w-[320px] flex flex-col h-full max-h-full bg-muted/30 border border-border/60 rounded-2xl overflow-hidden transition-colors duration-300",
                isOver ? config.dragParams : "hover:border-border"
            )}
        >
            <div className={cn("p-3 border-b flex items-center justify-between bg-background/80 backdrop-blur-sm relative z-10", config.border)}>
                <div className="flex items-center gap-2">
                    <Icon size={16} className={config.color} />
                    <h3 className="font-bold text-sm text-foreground">{config.label}</h3>
                </div>
                <motion.span
                    layout // Animate count badge changes
                    className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                >
                    {items.length}
                </motion.span>
            </div>

            {/* Added overflow-x-hidden to prevent horizontal scrollbars during spring animations */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
                <AnimatePresence mode="popLayout" initial={false}>
                    {items.map(res => (
                        <DraggableKanbanCard
                            key={res.id}
                            res={res}
                            {...props}
                        />
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

    useEffect(() => {
        setMounted(true);
    }, []);

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

    // Configuración de animación al soltar
    const dropAnimation = {
        duration: 0, // Disable return animation for smoother handoff
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.0' }, // Hide drag overlay immediately on drop so LayoutGroup takes over
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Added snap scrolling for mobile/tablet */}
            <div className="flex-1 w-full h-full overflow-x-auto overflow-y-hidden p-4 snap-x snap-mandatory">
                <LayoutGroup>
                    <div className="flex h-full gap-4 min-w-full lg:min-w-0 items-stretch">
                        {Object.keys(STATUS_CONFIG).map(status => (
                            <div key={status} className="snap-center h-full flex-1 min-w-[280px] sm:min-w-[320px]">
                                <DroppableColumn
                                    statusKey={status}
                                    items={grouped[status]}
                                />
                            </div>
                        ))}
                    </div>
                </LayoutGroup>
            </div>

            {mounted ? createPortal(
                <DragOverlay
                    dropAnimation={dropAnimation}
                    style={{ zIndex: 9999 }}
                >
                    {activeRes ? (
                        <KanbanCard
                            res={activeRes}
                            isOverlay={true}
                            className="w-[264px] sm:w-[296px]"
                        />
                    ) : null}
                </DragOverlay>,
                document.body
            ) : null}
        </DndContext>
    );
}