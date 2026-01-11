import { initialReservations } from '../data/mockData';
import { getNowISO } from '../lib/dateUtils';

/*
 * ReservationService.js
 * Serves as the data layer facade.
 * Supports "Real-Time" event subscriptions via subscribe().
 * Currently mocks a backend with simulated latency.
 */

class ReservationService {
    constructor() {
        // In-memory "Database"
        this.reservations = [...initialReservations];
        this.subscribers = new Set();
        this.latency = 400; // ms to simulate network delay
    }

    // --- HELPER: Simulate Async Latency ---
    _wait() {
        return new Promise(resolve => setTimeout(resolve, this.latency));
    }

    // --- REAL-TIME: Event System ---
    subscribe(callback) {
        this.subscribers.add(callback);
        // Return unsubscribe function
        return () => this.subscribers.delete(callback);
    }

    _notify(event, payload) {
        // event could be 'update', 'create', 'delete'
        // For simple React Context integration, we mostly just need to signal "Data Changed" or send the new list.
        // For this architecture, let's send the specific event data OR the full new list.
        // Sending full list is easier for the context to just setReservations(newList).
        const newData = [...this.reservations];
        this.subscribers.forEach(callback => callback(newData, event, payload));
    }

    // --- CRUD METHODS ---

    async getReservations() {
        await this._wait();
        return [...this.reservations];
    }

    async createReservation(data) {
        await this._wait();
        const newId = Math.max(...this.reservations.map(r => r.id), 0) + 1;
        const newRes = {
            id: newId,
            ...data,
            status: 'confirmed', // Default status
            createdAt: getNowISO()
        };
        this.reservations.push(newRes);
        this._notify('create', newRes);
        return newRes;
    }

    async updateReservation(id, data) {
        await this._wait();
        const index = this.reservations.findIndex(r => r.id === id);
        if (index === -1) throw new Error("Reservation not found");

        const updatedRes = { ...this.reservations[index], ...data };
        this.reservations[index] = updatedRes;

        this._notify('update', updatedRes);
        return updatedRes;
    }

    async deleteReservation(id) {
        await this._wait();
        this.reservations = this.reservations.filter(r => r.id !== id);
        this._notify('delete', id);
        return true;
    }

    // --- SIMULATION TOOLS ---
    // Simula que otro usuario creó una reserva (para probar Real-Time UI)
    simulateExternalEvent() {
        console.log("⚡ Simulating External Event...");
        const randomNames = ["Cliente Fantasma", "Tester Remoto", "Admin Socket"];
        const fakeRes = {
            name: randomNames[Math.floor(Math.random() * randomNames.length)],
            time: "22:00",
            pax: 2,
            date: new Date().toISOString().split('T')[0],
            origin: "web",
            tags: ["RealTime"],
            phone: "1100000000"
        };

        // No wait for simulation, or minimal wait
        setTimeout(() => {
            this.createReservation(fakeRes);
        }, 1000);
    }
}

// Singleton Instance
export const reservationService = new ReservationService();
