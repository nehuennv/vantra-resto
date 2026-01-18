import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, DollarSign, Tag, FileText, List, Utensils, Check } from 'lucide-react';

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
        available: true,
        hasDiscount: false,
        discountPrice: ''
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
                available: true,
                hasDiscount: false,
                discountPrice: ''
            };

            if (initialData) {
                setFormData({
                    ...defaultValues,
                    ...initialData,
                    ingredients: Array.isArray(initialData.ingredients)
                        ? initialData.ingredients.join(', ')
                        : (initialData.ingredients || ''),
                    hasDiscount: !!initialData.discountPrice,
                    discountPrice: initialData.discountPrice || ''
                });
            } else {
                setFormData(defaultValues);
            }
        }
    }, [isOpen, initialData?.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const priceValue = parseFloat(formData.price);
        if (priceValue < 0) return;

        const payload = {
            ...formData,
            price: priceValue,
            ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0) : [],
            discountPrice: formData.hasDiscount && formData.discountPrice ? parseFloat(formData.discountPrice) : null
        };

        if (payload.discountPrice && payload.discountPrice >= payload.price) {
            alert("El precio de oferta debe ser menor al precio normal.");
            return;
        }

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

    // Clases comunes para inputs (Estilo Original Restaurado)
    const inputClasses = "w-full h-11 bg-input border border-border rounded-xl px-4 text-foreground focus:border-primary/50 outline-none focus:ring-0 transition-colors placeholder:text-muted-foreground font-medium";

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

                    {/* MODAL CARD (Estilos Originales: bg-card, border-border) */}
                    <motion.div
                        className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden max-h-[90vh]"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border bg-muted/40 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Utensils size={18} className="text-primary" />
                                    {initialData ? 'Editar Producto' : 'Nuevo Plato'}
                                </h2>
                                <p className="text-xs text-muted-foreground">Completa la información del menú</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            
                            {/* SECCIÓN 1: DATOS PRINCIPALES (Grid Harmoniosa) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Nombre</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Ej. Hamburguesa Vantra"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Categoría</label>
                                    <div className="relative">
                                        <select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <Tag size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 2: PRECIOS Y OFERTAS (Agrupados con Estilo 'Muted') */}
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Precio Regular</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className={`${inputClasses} pl-8 font-bold`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center h-5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">¿Es Oferta?</label>
                                        <input
                                            type="checkbox"
                                            name="hasDiscount"
                                            checked={formData.hasDiscount}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${formData.hasDiscount ? 'text-primary' : 'text-muted-foreground'}$`}>$</span>
                                        <input
                                            type="number"
                                            name="discountPrice"
                                            disabled={!formData.hasDiscount}
                                            value={formData.discountPrice}
                                            onChange={handleChange}
                                            className={`w-full h-11 border rounded-xl pl-8 pr-4 font-bold outline-none transition-all
                                                ${formData.hasDiscount 
                                                    ? 'bg-input border-primary/50 text-primary focus:border-primary' 
                                                    : 'bg-muted/50 border-transparent text-muted-foreground cursor-not-allowed'}
                                            `}
                                            placeholder={formData.hasDiscount ? "Precio Oferta" : "-"}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 3: IMAGEN */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Imagen (URL)</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Upload size={16} />
                                        </div>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className={`${inputClasses} pl-10`}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                    </div>
                                    <div className="w-11 h-11 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-muted-foreground/50">
                                                <Utensils size={16} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 4: DETALLES */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Descripción</label>
                                    <textarea
                                        name="description"
                                        rows="2"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary/50 outline-none resize-none placeholder:text-muted-foreground font-medium"
                                        placeholder="Describe los sabores, texturas y detalles..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Ingredientes</label>
                                    <textarea
                                        name="ingredients"
                                        rows="2"
                                        value={formData.ingredients}
                                        onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary/50 outline-none resize-none placeholder:text-muted-foreground font-medium"
                                        placeholder="Carne, Queso, Pan, Tomate (Separados por comas)"
                                    />
                                </div>
                            </div>

                            {/* SECCIÓN 5: DISPONIBILIDAD (Footer Switch) */}
                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`
                                        w-10 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out
                                        ${formData.available ? 'bg-primary' : 'bg-muted border border-border'}
                                    `}>
                                        <div className={`
                                            bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out
                                            ${formData.available ? 'translate-x-4' : 'translate-x-0'}
                                        `} />
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        name="available" 
                                        checked={formData.available} 
                                        onChange={handleChange} 
                                        className="hidden" 
                                    />
                                    <span className={`text-sm font-medium transition-colors ${formData.available ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {formData.available ? 'Producto Visible' : 'Producto Oculto'}
                                    </span>
                                </label>
                            </div>

                        </form>

                        {/* Footer Buttons */}
                        <div className="p-4 border-t border-border bg-muted/40 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                            >
                                {initialData ? 'Guardar Cambios' : 'Crear Plato'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}