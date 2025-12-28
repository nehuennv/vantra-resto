import { UtensilsCrossed } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const BrandLogo = ({ collapsed }) => {
    const { theme, clientConfig } = useTheme();

    const hasLogo = theme.logo && theme.logo.length > 0;

    // 1. COLAPSADO (Solo Icono)
    if (collapsed) {
        return (
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-500">
                <UtensilsCrossed className="text-white" size={20} />
            </div>
        );
    }

    // 2. CON LOGO (Solo Imagen)
    if (hasLogo) {
        return (
            <div className="h-10 flex items-center transition-all duration-500">
                <img
                    src={theme.logo}
                    alt={clientConfig.name}
                    className="h-full w-auto max-w-[180px] object-contain object-left"
                />
            </div>
        );
    }

    // 3. SIN LOGO (Fallback Premium Corregido)
    return (
        <div className="h-10 flex items-center gap-3 transition-all duration-500">
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <UtensilsCrossed className="text-white" size={20} />
            </div>

            <div className="flex flex-col justify-center min-w-0"> {/* min-w-0 es clave para que el truncate funcione en flex */}
                {/* CORRECCIÓN AQUÍ: 
            - Quitamos leading-none 
            - Ponemos leading-tight (más altura)
            - Agregamos pb-0.5 o pb-1 para dar espacio a la 'g' 
        */}
                <h1 className="text-lg font-bold tracking-tight text-white font-jakarta truncate max-w-[150px] leading-tight pb-0.5">
                    {clientConfig.name}
                </h1>
                <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
                    RESTO
                </span>
            </div>
        </div>
    );
};

export default BrandLogo;