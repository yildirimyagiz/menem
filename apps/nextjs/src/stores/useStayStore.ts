
import { create } from 'zustand';

import { devtools } from 'zustand/middleware';
import type { Stay } from '~/utils/types';



interface StayStore {
    stay: Stay | null;
    stays: Stay[];
    isLoading: boolean;

    setStay: (stay: Stay) => void;
    updateStay: (stayUpdate: Partial<Stay>) => void;
    clearStay: () => void;
    setStays: (stays: Stay[]) => void;
    addStay: (stay: Stay) => void;
    removeStay: (stayId: string) => void;
}

export const useStayStore = create<StayStore>()(
    devtools((set) => ({
        stay: null,
        stays: [],
        isLoading: false,

        setStay: (stay) => set({ stay }),
        updateStay: (stayUpdate) => set((state) => ({
            stay: state.stay ? { ...state.stay, ...stayUpdate } : null,
            stays: state.stays.map((s) => (s.id === state.stay?.id ? { ...s, ...stayUpdate } : s)),
        })),
        clearStay: () => set({ stay: null }),

        setStays: (stays) => set({ stays }),
        addStay: (stay) => set((state) => ({
            stays: [...state.stays, stay],
        })),
        removeStay: (stayId) => set((state) => ({
            stays: state.stays.filter((s) => s.id !== stayId),
        })),
    }))
);
