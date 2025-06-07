import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Flight {
    id: string;
    cuid: string;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: Date;
    arrivalTime: Date;
    reviewCount: number;
    averageRating?: number;
    createdAt: Date;
    updatedAt: Date;
}

interface FlightStore {
    flight: Flight | null;
    flights: Flight[];
    isLoading: boolean;

    setFlight: (flight: Flight) => void;
    updateFlight: (flight: Partial<Flight>) => void;
    clearFlight: () => void;
    setFlights: (flights: Flight[]) => void;
    addFlight: (flight: Flight) => void;
    removeFlight: (flightId: string) => void;

    getFlightByNumber: (flightNumber: string) => Flight | null;
    getFlightsByRoute: (departure: string, arrival: string) => Flight[];
    getUpcomingFlights: () => Flight[];
    getTopRatedFlights: (limit?: number) => Flight[];
    updateFlightRating: (flightId: string, rating: number) => void;
}

export const useFlightStore = create<FlightStore>()(
    devtools((set, get) => ({
        flight: null,
        flights: [],
        isLoading: false,

        setFlight: (flight) => set({ flight }),
        updateFlight: (flightUpdate) => set((state) => ({
            flight: state.flight ? { ...state.flight, ...flightUpdate } : null,
            flights: state.flights.map(f =>
                f.id === state.flight?.id ? { ...f, ...flightUpdate } : f
            )
        })),
        clearFlight: () => set({ flight: null }),

        setFlights: (flights) => set({ flights }),
        addFlight: (flight) => set((state) => ({
            flights: [...state.flights, flight]
        })),
        removeFlight: (flightId) => set((state) => ({
            flights: state.flights.filter(f => f.id !== flightId)
        })),

        getFlightByNumber: (flightNumber) => {
            const { flights } = get();
            return flights.find(f => f.flightNumber === flightNumber) ?? null;
        },

        getFlightsByRoute: (departure, arrival) => {
            const { flights } = get();
            return flights.filter(f =>
                f.departureAirport === departure &&
                f.arrivalAirport === arrival
            );
        },

        getUpcomingFlights: () => {
            const { flights } = get();
            const now = new Date();
            return flights.filter(f => new Date(f.departureTime) > now);
        },

        getTopRatedFlights: (limit = 10) => {
            const { flights } = get();
            return [...flights]
                .filter(f => f.averageRating == null)
                .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
                .slice(0, limit);
        },

        updateFlightRating: (flightId, rating) => set((state) => ({
            flights: state.flights.map(f =>
                f.id === flightId ? {
                    ...f,
                    reviewCount: f.reviewCount + 1,
                    averageRating: f.averageRating
                        ? (f.averageRating * f.reviewCount + rating) / (f.reviewCount + 1)
                        : rating
                } : f
            )
        }))
    }))
); 