import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Guest {
    id: string;
    cuid: string;
    email?: string;
    phone?: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    nationality?: string;
    passportNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    preferredLanguage?: string;
    specialRequests?: string;
    loyaltyPoints: number;
    isVIP: boolean;
    hotelId?: string;
    propertyId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    reviewCount: number;
    averageRating?: number;
}

interface GuestStore {
    guest: Guest | null;
    guests: Guest[];
    isLoading: boolean;

    setGuest: (guest: Guest) => void;
    updateGuest: (guest: Partial<Guest>) => void;
    clearGuest: () => void;
    setGuests: (guests: Guest[]) => void;
    addGuest: (guest: Guest) => void;
    removeGuest: (guestId: string) => void;
}

export const useGuestStore = create<GuestStore>()(
    devtools((set) => ({
        guest: null,
        guests: [],
        isLoading: false,

        setGuest: (guest) => set({ guest }),
        updateGuest: (guestUpdate) => set((state) => ({
            guest: state.guest ? { ...state.guest, ...guestUpdate } : null,
            guests: state.guests.map(g =>
                g.id === state.guest?.id ? { ...g, ...guestUpdate } : g
            ),
        })),
        clearGuest: () => set({ guest: null }),

        setGuests: (guests) => set({ guests }),
        addGuest: (guest) => set((state) => ({ guests: [...state.guests, guest] })),
        removeGuest: (guestId) => set((state) => ({
            guests: state.guests.filter(g => g.id !== guestId),
        })),
    }))
);
