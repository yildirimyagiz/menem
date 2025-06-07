import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Tax, TaxType } from '~/utils/types';


interface TaxStore {
    tax: Tax | null;
    taxes: Tax[];
    isLoading: boolean;

    setTax: (tax: Tax) => void;
    updateTax: (tax: Partial<Tax>) => void;
    clearTax: () => void;
    setTaxes: (taxes: Tax[]) => void;
    addTax: (tax: Tax) => void;
    removeTax: (taxId: string) => void;

    getTaxesByType: (type: TaxType) => Tax[];
    getActiveTaxes: () => Tax[];
    searchTaxes: (query: string) => Tax[];
    calculateTaxAmount: (amount: number, taxId: string) => number | null;
}

export const useTaxStore = create<TaxStore>()(
    devtools((set, get) => ({
        tax: null,
        taxes: [],
        isLoading: false,

        setTax: (tax) => set({ tax }),
        updateTax: (taxUpdate) => set((state) => ({
            tax: state.tax ? { ...state.tax, ...taxUpdate } : null,
            taxes: state.taxes.map(t =>
                t.id === state.tax?.id ? { ...t, ...taxUpdate } : t
            )
        })),
        clearTax: () => set({ tax: null }),

        setTaxes: (taxes) => set({ taxes }),
        addTax: (tax) => set((state) => ({
            taxes: [...state.taxes, tax]
        })),
        removeTax: (taxId) => set((state) => ({
            taxes: state.taxes.filter(t => t.id !== taxId)
        })),

        getTaxesByType: (type) => {
            const { taxes } = get();
            return taxes.filter(t => t.type === type);
        },

        getActiveTaxes: () => {
            const { taxes } = get();
            return taxes.filter(t => !t.deletedAt);
        },

        searchTaxes: (query) => {
            const { taxes } = get();
            const searchTerm = query.toLowerCase();
            return taxes.filter(t =>
                t.name.toLowerCase().includes(searchTerm) ||
                t.description?.toLowerCase().includes(searchTerm)
            );
        },

        calculateTaxAmount: (amount, taxId) => {
            const { taxes } = get();
            const tax = taxes.find(t => t.id === taxId);
            if (!tax) return null;
            // Implementation would depend on your tax calculation logic
            // This is just a placeholder
            return amount * 0.1; // 10% tax rate example
        }
    }))
); 