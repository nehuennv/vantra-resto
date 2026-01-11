// Función auxiliar: Convierte Hex a RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// Nueva función: Devuelve objeto HSL { h, s, l } numérico
export const hexToHSLValues = (hex) => {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Retornamos valores limpios para manipular
    return { h: h * 360, s: s * 100, l: l * 100 };
};

// Mantenemos la anterior por compatibilidad
export const hexToTailwindHsl = (hex) => {
    const { h, s, l } = hexToHSLValues(hex);
    return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
};

// Helper para Luminancia Relativa (WCAG)
const getLuminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Contraste robusto usando Ratios WCAG
export const getContrastColor = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '210 40% 98%'; // Fallback a claro si falla

    const L = getLuminance(rgb.r, rgb.g, rgb.b);

    // Calcular ratio con Blanco (L=1) y Negro (L=0)
    // Formula: (L1 + 0.05) / (L2 + 0.05)
    // Usamos un umbral de luminancia (L > 0.45) para preferir texto blanco
    // en colores medios/saturados (como Blue-500) que matemáticamente tienen mejor
    // contraste con negro pero estéticamente y por convención usan blanco.
    // El umbral estándar suele ser 0.179, pero para UI moderna ~0.45 es más común.

    return (L > 0.45) ? '222 47% 11%' : '210 40% 98%';
};