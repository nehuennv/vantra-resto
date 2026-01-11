/**
 * dateUtils.js
 * Centralized utility functions for date and time handling.
 * Ensures strict local time handling to avoid UTC inconsistencies.
 * Locale: es-AR (Argentina)
 */

export const getTodayLocalString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    // Parse input (YYYY-MM-DD) explicitly as local time [Year, Month-1, Day]
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    const dayName = date.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '');
    const dayNum = date.getDate();
    const monthName = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear();

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // Example: "Lun 5 Ene 2026"
    return `${capitalize(dayName)} ${dayNum} ${capitalize(monthName)} ${year}`;
};

export const addDaysToDate = (dateString, days) => {
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    date.setDate(date.getDate() + days);

    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newDay = String(date.getDate()).padStart(2, '0');

    return `${newYear}-${newMonth}-${newDay}`;
};

export const getCurrentTimeLocal = () => {
    return new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const formatDateCreated = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    // Month is 0-indexed in JS Date
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const getNowISO = () => {
    return new Date().toISOString();
};
