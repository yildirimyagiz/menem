import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Insurance {
    id: string;
    provider: string;
    coverage: number;
    premium: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface InsuranceStore {
    insurance: Insurance | null;
    insurances: Insurance[];
    isLoading: boolean;

    setInsurance: (insurance: Insurance) => void;
    updateInsurance: (insuranceUpdate: Partial<Insurance>) => void;
    clearInsurance: () => void;
    setInsurances: (insurances: Insurance[]) => void;
    addInsurance: (insurance: Insurance) => void;
    removeInsurance: (insuranceId: string) => void;
}

export const useInsuranceStore = create<InsuranceStore>()(
    devtools((set) => ({
        insurance: null,
        insurances: [],
        isLoading: false,

        setInsurance: (insurance) => set({ insurance }),
        updateInsurance: (insuranceUpdate) => set((state) => ({
            insurance: state.insurance ? { ...state.insurance, ...insuranceUpdate } : null,
            insurances: state.insurances.map(i =>
                i.id === state.insurance?.id ? { ...i, ...insuranceUpdate } : i
            ),
        })),
        clearInsurance: () => set({ insurance: null }),

        setInsurances: (insurances) => set({ insurances }),
        addInsurance: (insurance) => set((state) => ({
            insurances: [...state.insurances, insurance],
        })),
        removeInsurance: (insuranceId: string) => set((state) => ({
            insurances: state.insurances.filter(i => i.id !== insuranceId),
        })),
    }))
);
