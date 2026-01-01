import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { clientConfig } from '../config/client';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirección si ya hay sesión
    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    // Color del branding
    const brandColor = clientConfig.themeColor || '#F97316';

    // Variantes de animación - "Smooth & Premium"
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">

            {/* 1. TINTE BASE: Hace que el negro no sea negro puro, sino tintado con el color de la marca */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundColor: brandColor }}
            />

            {/* 2. GRADIENTE INFERIOR: Brillo sutil desde abajo ("un poquito verdoso") */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `linear-gradient(to top, ${brandColor}15 0%, transparent 40%)`
                }}
            />

            {/* 3. LUZ SUPERIOR: Más clara y brillante (Mezcla brandColor con un núcleo más claro) */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% -20%, ${brandColor} 0%, transparent 60%)`
                }}
            />
            {/* Núcleo de luz blanca para aclarar la parte superior */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] opacity-10 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at top, white 0%, transparent 70%)`
                }}
            />

            {/* Líneas Sutiles */}
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* --- CARD PRINCIPAL --- */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-[420px] px-6 relative z-10"
            >
                {/* 1. Header con Branding - MÁS GRANDE */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
                    <div className="scale-150 mb-8 p-4">
                        <BrandLogo />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mt-2 transition-colors duration-300 hover:bg-white/10 hover:border-white/20 cursor-default group">
                        <ShieldCheck size={12} className="text-zinc-500 group-hover:text-[var(--brand-color)] transition-colors opacity-80 group-hover:opacity-100" style={{ '--brand-color': brandColor }} />
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest opacity-80 group-hover:opacity-100 group-hover:text-zinc-300 transition-all">
                            Portal Administrativo
                        </span>
                    </div>
                </motion.div>

                {/* 2. Formulario Sólido */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email Input */}
                    <motion.div variants={itemVariants} className="group relative">
                        {/* Icono con z-index alto para evitar glitcheo visual */}
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[var(--brand-color)] transition-colors duration-300 z-10">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 h-14 bg-white/[0.03] border border-white/[0.05] rounded-xl focus:border-[var(--brand-color)] focus:ring-1 focus:ring-[var(--brand-color)] focus:outline-none text-zinc-200 placeholder:text-zinc-600 transition-colors duration-300 text-sm font-medium backdrop-blur-md hover:bg-white/[0.05] hover:border-white/10 caret-[var(--brand-color)]"
                            placeholder={`usuario@${clientConfig.name.toLowerCase().replace(/\s+/g, '')}.com`}
                            style={{ '--brand-color': brandColor }}
                            required
                        />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} className="group relative">
                        {/* Icono con z-index alto */}
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[var(--brand-color)] transition-colors duration-300 z-10">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 h-14 bg-white/[0.03] border border-white/[0.05] rounded-xl focus:border-[var(--brand-color)] focus:ring-1 focus:ring-[var(--brand-color)] focus:outline-none text-zinc-200 placeholder:text-zinc-600 transition-colors duration-300 text-sm font-medium backdrop-blur-md hover:bg-white/[0.05] hover:border-white/10 caret-[var(--brand-color)]"
                            placeholder="Contraseña"
                            style={{ '--brand-color': brandColor }}
                            required
                        />
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-center overflow-hidden"
                        >
                            <span className="text-red-500 text-xs font-medium tracking-wide bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 inline-block">
                                {error}
                            </span>
                        </motion.div>
                    )}

                    {/* Botón Principal (Senior Disruptive Hover) */}
                    <motion.div variants={itemVariants} className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 relative overflow-hidden rounded-xl font-bold text-white shadow-[0_0_20px_-10px_var(--brand-color)] transition-all duration-500 group border border-white/10"
                            style={{
                                background: `linear-gradient(135deg, ${brandColor}cc 0%, ${brandColor} 100%)`
                            }}
                        >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />

                            {/* Inner Glow Pulse */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] mix-blend-overlay" />

                            <div className="relative flex items-center justify-center gap-3 z-10">
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span className="text-sm">Accediendo</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm tracking-widest uppercase">Iniciar Sesión</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                    </>
                                )}
                            </div>
                        </button>
                    </motion.div>
                </form>

            </motion.div>

            {/* Footer Senior Legible */}
            <div className="absolute bottom-6 w-full text-center">
                <p className="text-[11px] font-medium text-zinc-500 tracking-wider hover:text-zinc-300 transition-colors cursor-default uppercase">
                    Desarrollado por Vantra
                </p>
            </div>
        </div>
    );
};

export default LoginPage;