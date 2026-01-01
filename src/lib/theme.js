import { clientConfig } from '../config/client';

/**
 * Convierte un color Hex (#RRGGBB) a valores HSL.
 * @param {string} H - Hex color
 * @returns {{h: number, s: number, l: number}}
 */
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0)
        h = 0;
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    else if (cmax === g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}

/**
 * Lee la configuración del cliente y aplica las variables CSS globales para el tema.
 * Esto asegura que toda la app se adapte al 'themeColor' definido en client.js
 */
export function applyClientTheme() {
    try {
        const themeColor = clientConfig.themeColor || '#0AD3A4'; // Fallback a turquesa
        const { h, s, l } = hexToHSL(themeColor);

        const root = document.documentElement;

        // Establecemos el Matiz (Hue) y Saturación base para toda la "Aura" de la app
        root.style.setProperty('--base-hue', h);
        root.style.setProperty('--base-sat', `${s}%`);

        // Opcional: Si quisiéramos que el Primary sea EXACTAMENTE la luminosidad del cliente:
        // root.style.setProperty('--base-light', `${l}%`);

        console.log(`[Vantra Theme] Applied theme for ${clientConfig.name}: ${themeColor} -> HSL(${h}, ${s}%, ${l}%)`);
    } catch (error) {
        console.error("Error applying client theme:", error);
    }
}
