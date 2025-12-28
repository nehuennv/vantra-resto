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

// Mantenemos la de contraste
export const getContrastColor = (hex) => {
    const rgb = hexToRgb(hex);
    const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    return (yiq >= 128) ? '222 47% 11%' : '210 40% 98%';
};