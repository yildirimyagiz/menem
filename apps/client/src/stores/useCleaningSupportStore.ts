import type { CleaningSupport } from '~/utils/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';



interface CleaningSupportStore {
    cleaningSupport: CleaningSupport | null;
    cleaningSupports: CleaningSupport[];
    isLoading: boolean;

    setCleaningSupport: (support: CleaningSupport) => void;
    updateCleaningSupport: (support: Partial<CleaningSupport>) => void;
    clearCleaningSupport: () => void;
    setCleaningSupports: (supports: CleaningSupport[]) => void;
    addCleaningSupport: (support: CleaningSupport) => void;
    removeCleaningSupport: (supportId: string) => void;

    getByProperty: (propertyId: string) => CleaningSupport[];
    getUpcomingCleanings: () => CleaningSupport[];
    getPastCleanings: () => CleaningSupport[];
    getCleaningsByDateRange: (startDate: Date, endDate: Date) => CleaningSupport[];
}

export const useCleaningSupportStore = create<CleaningSupportStore>()(
    devtools((set, get) => ({
        cleaningSupport: null,
        cleaningSupports: [],
        isLoading: false,

        setCleaningSupport: (support) => set({ cleaningSupport: support }),
        updateCleaningSupport: (supportUpdate) => set((state) => ({
            cleaningSupport: state.cleaningSupport
                ? { ...state.cleaningSupport, ...supportUpdate }
                : null,
            cleaningSupports: state.cleaningSupports.map(s =>
                s.id === state.cleaningSupport?.id ? { ...s, ...supportUpdate } : s
            )
        })),
        clearCleaningSupport: () => set({ cleaningSupport: null }),

        setCleaningSupports: (supports) => set({ cleaningSupports: supports }),
        addCleaningSupport: (support) => set((state) => ({
            cleaningSupports: [...state.cleaningSupports, support]
        })),
        removeCleaningSupport: (supportId) => set((state) => ({
            cleaningSupports: state.cleaningSupports.filter(s => s.id !== supportId)
        })),

        getByProperty: (propertyId) => {
            const { cleaningSupports } = get();
            return cleaningSupports.filter(s => s.propertyId === propertyId);
        },

        getUpcomingCleanings: () => {
            const { cleaningSupports } = get();
            const now = new Date();
            return cleaningSupports
                .filter(s => new Date(s.cleaningDate) > now)
                .sort((a, b) => new Date(a.cleaningDate).getTime() - new Date(b.cleaningDate).getTime());
        },

        getPastCleanings: () => {
            const { cleaningSupports } = get();
            const now = new Date();
            return cleaningSupports
                .filter(s => new Date(s.cleaningDate) < now)
                .sort((a, b) => new Date(b.cleaningDate).getTime() - new Date(a.cleaningDate).getTime());
        },

        getCleaningsByDateRange: (startDate, endDate) => {
            const { cleaningSupports } = get();
            return cleaningSupports.filter(s => {
                const cleaningDate = new Date(s.cleaningDate);
                return cleaningDate >= startDate && cleaningDate <= endDate;
            });
        }
    }))
);