import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, DollarSign, Tag, FileText, List, Utensils } from 'lucide-react';
import { cn } from "../../lib/utils";

// Variantes para Framer Motion (Idénticas a ReservationFormModal)
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.3 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2 }
    }
};

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData, categories }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        image: '',
        ingredients: '',
        available: true
    });

    useEffect(() => {
        if (isOpen) {
            const defaultValues = {
                name: '',
                description: '',
                price: '',
                categoryId: categories.length > 0 ? categories[0].id : '',
                image: '',
                ingredients: '',
                available: true
            };

            if (initialData) {
                setFormData({
                    ...defaultValues,
                    ...initialData,
                    ingredients: Array.isArray(initialData.ingredients)
                        ? initialData.ingredients.join(', ')
                        : (initialData.ingredients || '')
                });
            } else {
                setFormData(defaultValues);
            }
        }
    }, [isOpen, initialData?.id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const priceValue = parseFloat(formData.price);
        if (priceValue < 0) return;

        const payload = {
            ...formData,
            price: priceValue,
            ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0) : []
        };
        onSubmit(payload);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={overlayVariants}
                >
                    {/* BACKDROP */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

                    {/* MODAL CARD */}
                    <motion.div
                        className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden max-h-[90vh]"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border bg-muted/40 flex justify-between items-center shrink-0">
                            <h2 className="text-lg font-bold text-foreground tracking-wide flex items-center gap-2">
                                <Utensils size={18} className="text-primary" />
                                {initialData ? 'Editar Producto' : 'Nuevo Plato'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus:outline-none focus:ring-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Nombre */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                    <Utensils size={10} /> Nombre del Plato
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-muted-foreground font-medium text-lg"
                                    placeholder="Ej. Hamburguesa Doble"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                                <DollarSign size={10} /> Precio
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    required
                                                    min="0"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    className="w-full bg-input border border-border rounded-xl pl-7 pr-4 py-3 text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors font-mono font-medium"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                                <Tag size={10} /> Categoría
                                            </label>
                                            <select
                                                name="categoryId"
                                                value={formData.categoryId}
                                                onChange={handleChange}
                                                className="w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors appearance-none cursor-pointer"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                            <Upload size={10} /> URL de Imagen
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="url"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="flex-1 bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors placeholder:text-muted-foreground"
                                                placeholder="https://..."
                                            />
                                            <div className="w-11 h-11 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload size={16} className="text-muted-foreground/50" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Availability Switch (Styled like Styled Form) */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                                        <span className="text-sm font-medium text-foreground">Disponible para la venta</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="available"
                                                checked={formData.available}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-border rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                            <FileText size={10} /> Descripción
                                        </label>
                                        <textarea
                                            name="description"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-muted-foreground"
                                            placeholder="Describe los sabores..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1.5">
                                            <List size={10} /> Ingredientes
                                        </label>
                                        <textarea
                                            name="ingredients"
                                            rows="3"
                                            value={formData.ingredients}
                                            onChange={handleChange}
                                            className="w-full bg-input border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:border-primary/50 outline-none focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-muted-foreground"
                                            placeholder="Separados por coma..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-colors outline-none focus:outline-none"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all outline-none focus:outline-none"
                                >
                                    {initialData ? 'Guardar Cambios' : 'Crear Plato'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
