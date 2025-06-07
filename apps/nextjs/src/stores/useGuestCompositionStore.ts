import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GuestComposition {
    id: string;
    guestId: string;
    adultCount: number;
    childCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface GuestCompositionStore {
    guestComposition: GuestComposition | null;
    guestCompositions: GuestComposition[];
    isLoading: boolean;

    setGuestComposition: (guestComposition: GuestComposition) => void;
    updateGuestComposition: (guestComposition: Partial<GuestComposition>) => void;
    clearGuestComposition: () => void;
    setGuestCompositions: (guestCompositions: GuestComposition[]) => void;
    addGuestComposition: (guestComposition: GuestComposition) => void;
    removeGuestComposition: (compositionId: string) => void;
}

export const useGuestCompositionStore = create<GuestCompositionStore>()(
    devtools((set) => ({
        guestComposition: null,
        guestCompositions: [],
        isLoading: false,

        setGuestComposition: (guestComposition) => set({ guestComposition }),
        updateGuestComposition: (compositionUpdate) => set((state) => ({
            guestComposition: state.guestComposition
                ? { ...state.guestComposition, ...compositionUpdate }
                : null,
            guestCompositions: state.guestCompositions.map(c =>
                c.id === state.guestComposition?.id ? { ...c, ...compositionUpdate } : c
            ),
        })),
        clearGuestComposition: () => set({ guestComposition: null }),

        setGuestCompositions: (guestCompositions) => set({ guestCompositions }),
        addGuestComposition: (guestComposition) => set((state) => ({
            guestCompositions: [...state.guestCompositions, guestComposition],
        })),
        removeGuestComposition: (compositionId) => set((state) => ({
            guestCompositions: state.guestCompositions.filter(c => c.id !== compositionId),
        })),
    }))
);
