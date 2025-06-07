import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Passenger {
    id: string;
    cuid: string;
    firstName: string;
    lastName: string;
    age: number;
    gender?: string;
    passportNumber: string;
    flightId?: string;
    hotelId?: string;
    carId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    PassengerNumber?: number;
}

interface PassengerStore {
    passenger: Passenger | null;
    passengers: Passenger[];
    isLoading: boolean;

    setPassenger: (passenger: Passenger) => void;
    updatePassenger: (passengerUpdate: Partial<Passenger>) => void;
    clearPassenger: () => void;
    setPassengers: (passengers: Passenger[]) => void;
    addPassenger: (passenger: Passenger) => void;
    removePassenger: (passengerId: string) => void;
}

export const usePassengerStore = create<PassengerStore>()(
    devtools((set) => ({
        passenger: null,
        passengers: [],
        isLoading: false,

        setPassenger: (passenger) => set({ passenger }),
        updatePassenger: (passengerUpdate) => set((state) => ({
            passenger: state.passenger ? { ...state.passenger, ...passengerUpdate } : null,
            passengers: state.passengers.map(p =>
                p.id === state.passenger?.id ? { ...p, ...passengerUpdate } : p
            ),
        })),
        clearPassenger: () => set({ passenger: null }),

        setPassengers: (passengers) => set({ passengers }),
        addPassenger: (passenger) => set((state) => ({
            passengers: [...state.passengers, passenger],
        })),
        removePassenger: (passengerId) => set((state) => ({
            passengers: state.passengers.filter(p => p.id !== passengerId),
        })),
    }))
);
