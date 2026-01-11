import React, { useState, useEffect } from 'react';
import { X, Save, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        if (isOpen && initialData) {
            setFormData({
                ...initialData,
                ingredients: Array.isArray(initialData.ingredients) ? initialData.ingredients.join(', ') : initialData.ingredients || ''
            });
        } else if (isOpen && !initialData) {
            setFormData({
                name: '',
                description: '',
                price: '',
                categoryId: categories.length > 0 ? categories[0].id : '',
                image: '',
                ingredients: '',
                available: true
            });
        }
    }, [isOpen, initialData?.id, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const priceValue = parseFloat(formData.price);
        if (priceValue < 0) {
            alert("El precio no puede ser negativo.");
            return;
        }

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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                        <h2 className="text-2xl font-light text-zinc-900 dark:text-white">
                            {initialData ? 'Editar Producto' : 'Crear Nuevo Plato'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nombre del Plato</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm"
                                        placeholder="Ej. Royal Truffle Burger"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Precio</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-zinc-400">$</span>
                                            <input
                                                type="number"
                                                name="price"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-8 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm font-mono"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Categoría</label>
                                        <select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">URL de Imagen</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm text-sm"
                                            placeholder="https://..."
                                        />
                                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload size={16} className="text-zinc-300" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Descripción</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm resize-none"
                                        placeholder="Describe los sabores y la experiencia..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Ingredientes <span className="text-zinc-300 font-normal lowercase">(separados por coma)</span></label>
                                    <textarea
                                        name="ingredients"
                                        rows="3"
                                        value={formData.ingredients}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm resize-none"
                                        placeholder="Ej: Pan Brioche, Carne Wagyu, Queso Brie..."
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                                    <input
                                        type="checkbox"
                                        id="available"
                                        name="available"
                                        checked={formData.available}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-zinc-300 text-black focus:ring-black dark:focus:ring-white"
                                    />
                                    <label htmlFor="available" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none cursor-pointer">
                                        Disponible en Menu
                                    </label>
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold shadow-lg shadow-zinc-200 dark:shadow-none hover:translate-y-[-1px] active:translate-y-[0px] transition-all flex items-center gap-2"
                            >
                                <Save size={18} />
                                {initialData ? 'Guardar Cambios' : 'Crear Plato'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
