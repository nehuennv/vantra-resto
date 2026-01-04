import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, CheckCircle2, Zap, LogOut,
    Users, MessageCircle, Phone, Store, Hash,
    Trash2, Pencil, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DndContext,
    useDraggable,
    useDroppable,
    closestCorners,
    DragOverlay,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    PointerSensor
} from '@dnd-kit/core';

// --- COMPONENTES UI MICRO ---
// Configuración de visualización por estado
const STATUS_CONFIG = {
    pending: {
        id: 'pending',
        label: 'Pendiente',
        icon: Clock,
        headerColor: 'text-amber-600',
        bg: 'bg-amber-50/50 dark:bg-amber-900/10',
        border: 'border-amber-200 dark:border-amber-500/20',
        barColor: 'bg-amber-500'
    },
    confirmed: {
        id: 'confirmed',
        label: 'Confirmada',
        icon: CheckCircle2,
        headerColor: 'text-indigo-600',
        bg: 'bg-indigo-50/50 dark:bg-indigo-900/10',
        border: 'border-indigo-200 dark:border-indigo-500/20',
        barColor: 'bg-indigo-500'
    },
    seated: {
        id: 'seated',
        label: 'En Mesa',
        icon: Zap,
        headerColor: 'text-emerald-600',
        bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
        border: 'border-emerald-200 dark:border-emerald-500/20',
        barColor: 'bg-emerald-500'
    },
    finished: {
        id: 'finished',
        label: 'Finalizada',
        icon: LogOut,
        headerColor: 'text-slate-600',
        bg: 'bg-slate-50/50 dark:bg-slate-800/30',
        border: 'border-slate-200 dark:border-slate-700',
        barColor: 'bg-slate-500'
    }
};

const getCurrentTime = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

// --- DRAGGABLE WRAPPER ---
const DraggableKanbanCard = ({ res, isSelected, onClick, onUpdate, onDelete, onEdit }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: res.id,
        data: { res }
    });

    if (isDragging) {
        return (
            <div ref={setNodeRef} className="opacity-0 h-auto">
                {/* Invisible placeholder to keep space, opacity-0 instead of 30 for cleaner 'lift' */}
                <KanbanCard res={res} />
            </div>
        );
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="touch-none h-auto">
            <KanbanCard
                res={res}
                isSelected={isSelected}
                onClick={onClick}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </div>
    );
};

// --- DROPPABLE COLUMN WRAPPER ---
const DroppableColumn = ({ statusKey, children, className }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: statusKey,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                className,
                "transition-colors duration-200",
                isOver ? "bg-muted/60 ring-2 ring-primary/20 ring-inset" : ""
            )}
        >
            {children}
        </div>
    );
};


// --- CARD COMPONENT (VISUAL ONLY) ---
const KanbanCard = ({ res, isSelected, onClick, onUpdate, onDelete, onEdit, isOverlay }) => {
    const [confirmAction, setConfirmAction] = useState(null);

    const handleAction = (e, type, callback) => {
        e.stopPropagation();
        if (confirmAction === type) {
            callback();
            setConfirmAction(null);
        } else {
            setConfirmAction(type);
            setTimeout(() => setConfirmAction(null), 3000);
        }
    };

    return (
        <motion.div
            layout={!isSelected && !isOverlay} // Diable layout during drag (overlay)
            initial={false}
            animate={isOverlay ?
                { scale: 1.05, rotate: 2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : // Stronger lift effect
                { scale: 1, rotate: 0 }
            }
            transition={isOverlay ? { duration: 0.15, ease: "easeOut" } : { duration: 0.2 }}
            className={cn(
                "group bg-card relative flex flex-col overflow-hidden select-none", // select-none to avoid text highlighting
                isSelected
                    ? "rounded-xl border border-primary/30 shadow-md ring-1 ring-primary/10 z-20 cursor-default"
                    : "rounded-xl border border-border shadow-sm hover:shadow-md hover:brightness-125 cursor-grab active:cursor-grabbing", // Generic cursor classes
                isOverlay && "cursor-grabbing border-primary/50 z-50 ring-2 ring-primary/20" // Explicit cursor-grabbing on overlay
            )}
            onClick={(!isSelected && onClick && !isOverlay) ? () => onClick(res.id) : undefined}
        >
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-all",
                STATUS_CONFIG[res.status]?.barColor
            )} />

            <div className="p-3 pl-4 relative">
                {isSelected && onClick && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(null); }}
                        className="absolute right-2 top-2 p-1.5 rounded-full bg-muted text-foreground transition-all duration-200 z-30"
                    >
                        <ChevronDown size={14} className="rotate-180" />
                    </button>
                )}

                <div className="flex justify-between items-start mb-2 pr-6">
                    <span className="text-sm font-bold text-foreground line-clamp-1 mr-2 leading-tight pointer-events-none">
                        {res.name}
                    </span>
                    <span className={cn(
                        "text-[11px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap transition-colors pointer-events-none",
                        isSelected ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-muted"
                    )}>
                        {res.time} hs
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pointer-events-none">
                    <div className="flex items-center gap-1">
                        <Users size={12} strokeWidth={2.5} />
                        <span className="font-medium text-foreground">{res.pax}</span>
                    </div>
                    <span className="text-border/60">|</span>
                    <div className="flex items-center gap-1 capitalize">
                        {res.origin === 'whatsapp' ? <MessageCircle size={12} /> :
                            res.origin === 'walk-in' ? <Store size={12} /> : <Phone size={12} />}
                        <span className="truncate max-w-[70px]">{res.origin}</span>
                    </div>
                    {res.tags?.length > 0 && !isSelected && (
                        <div className="flex items-center gap-0.5 ml-1" title="Tiene notas">
                            <span className="text-border/60 mr-1">|</span>
                            <Hash size={11} /> <span>{res.tags.length}</span>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isSelected && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
                            collapsed: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
                        }}
                        className="overflow-hidden bg-muted/30 border-t border-border/50"
                    >
                        <div className="p-3 pt-2 space-y-3">
                            {res.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {res.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 bg-background border border-border/50 rounded-full text-muted-foreground font-medium flex items-center gap-1 shadow-sm">
                                            <Hash size={8} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <button onClick={(e) => { e.stopPropagation(); onEdit(res); }} className="flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold bg-background border border-border text-muted-foreground hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer">
                                    <Pencil size={12} /> Editar
                                </button>
                                <button onClick={(e) => handleAction(e, 'delete', () => { onDelete(res.id); onClick(null); })} className={cn("flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold border transition-colors cursor-pointer", confirmAction === 'delete' ? "bg-red-600 border-red-600 text-white" : "bg-background border-border text-muted-foreground hover:text-red-600 hover:border-red-200")}>
                                    <Trash2 size={12} /> {confirmAction === 'delete' ? "Confirmar" : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- COLUMN COMPONENT ---
const KanbanColumn = ({ statusKey, items, selectedId, onSelect, onUpdate, onDelete, onEdit }) => {
    const config = STATUS_CONFIG[statusKey];
    const Icon = config.icon;

    return (
        <DroppableColumn statusKey={statusKey} className="flex-shrink-0 w-72 sm:w-80 flex flex-col h-full bg-muted/30 border border-border/60 rounded-2xl overflow-hidden shadow-inner">
            <div className={cn("p-3 border-b flex items-center justify-between bg-background/80 backdrop-blur-sm z-10", config.border)}>
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-md shadow-sm border border-border/50", config.bg, config.headerColor)}>
                        <Icon size={16} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{config.label}</h3>
                </div>
                <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border tabular-nums">
                    {items.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
                {items.map(res => (
                    <DraggableKanbanCard
                        key={res.id}
                        res={res}
                        isSelected={selectedId === res.id}
                        onClick={onSelect}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </DroppableColumn>
    );
};

const ReservationKanbanView = ({ reservations, selectedId, onSelect, onUpdate, onDelete, onEdit }) => {

    // Config sensors for instant activation (0 distance) for snappy feel
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // Small threshold to distinguish click from drag
            },
        }),
        useSensor(TouchSensor),
        useSensor(MouseSensor)
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const res = active.data.current?.res;
            const newStatus = over.id;

            if (res && res.status !== newStatus) {
                let updates = { status: newStatus };
                if (newStatus === 'seated') {
                    updates.time = getCurrentTime();
                }

                onUpdate(res.id, updates);
            }
        }
    };

    const grouped = useMemo(() => {
        const groups = { pending: [], confirmed: [], seated: [], finished: [] };
        reservations.forEach(res => { if (groups[res.status]) groups[res.status].push(res); });
        Object.keys(groups).forEach(key => groups[key].sort((a, b) => a.time.localeCompare(b.time)));
        return groups;
    }, [reservations]);

    const columns = ['pending', 'confirmed', 'seated', 'finished'];
    const [activeRes, setActiveRes] = useState(null);

    // Global cursor overriding style for true "Grabbing" feel everywhere
    useEffect(() => {
        if (activeRes) {
            document.body.style.cursor = 'grabbing';
            document.body.classList.add('select-none'); // Prevent text selection
        } else {
            document.body.style.cursor = '';
            document.body.classList.remove('select-none');
        }
        return () => {
            document.body.style.cursor = '';
            document.body.classList.remove('select-none');
        };
    }, [activeRes]);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={(e) => setActiveRes(e.active.data.current?.res)}
            onDragEnd={(e) => { handleDragEnd(e); setActiveRes(null); }}
            collisionDetection={closestCorners}
        >
            <div className="flex-1 h-full overflow-x-auto overflow-y-hidden p-4">
                <div className="flex gap-4 h-full min-w-max pb-2">
                    {columns.map(status => (
                        <KanbanColumn
                            key={status}
                            statusKey={status}
                            items={grouped[status]}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: { opacity: '0.5' },
                    },
                }),
            }}>
                {activeRes ? (
                    // NO Wrapper divs with extra width. Use pure component with explicit width if needed or inherent.
                    // The column dictates width usually, but in Overlay we are free.
                    // We force width to match the column standard (w-72 sm:w-80) to avoid resize.
                    <div className="w-72 sm:w-80 cursor-grabbing">
                        <KanbanCard res={activeRes} isSelected={false} isOverlay={true} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default ReservationKanbanView;
