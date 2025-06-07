import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Currency, PaymentType } from '~/utils/types';
import { PayoutStatus } from '~/utils/types';

interface Payout {
    id: string;
    cuid: string;
    amount: number;
    currency: Currency;
    description: string;
    slug: string;
    payoutMethod: PaymentType;
    payoutStatus: PayoutStatus;
    paymentId: string;
    transactionId?: string;
    listingId: string;
    userId: string;
    helpId?: string;
    PayoutNumber?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface PayoutStore {
    payout: Payout | null;
    payouts: Payout[];
    isLoading: boolean;

    setPayout: (payout: Payout) => void;
    updatePayout: (payout: Partial<Payout>) => void;
    clearPayout: () => void;
    setPayouts: (payouts: Payout[]) => void;
    addPayout: (payout: Payout) => void;
    removePayout: (payoutId: string) => void;

    getPayoutsByStatus: (status: PayoutStatus) => Payout[];
    getPayoutsByUser: (userId: string) => Payout[];
    getPayoutsByListing: (listingId: string) => Payout[];
    getTotalPayoutAmount: (currency?: Currency) => number;
    getPendingPayouts: () => Payout[];
}

export const usePayoutStore = create<PayoutStore>()(
    devtools((set, get) => ({
        payout: null,
        payouts: [],
        isLoading: false,

        setPayout: (payout) => set({ payout }),
        updatePayout: (payoutUpdate) => set((state) => ({
            payout: state.payout ? { ...state.payout, ...payoutUpdate } : null,
            payouts: state.payouts.map(p =>
                p.id === state.payout?.id ? { ...p, ...payoutUpdate } : p
            )
        })),
        clearPayout: () => set({ payout: null }),

        setPayouts: (payouts) => set({ payouts }),
        addPayout: (payout) => set((state) => ({
            payouts: [...state.payouts, payout]
        })),
        removePayout: (payoutId) => set((state) => ({
            payouts: state.payouts.filter(p => p.id !== payoutId)
        })),

        getPayoutsByStatus: (status) => {
            const { payouts } = get();
            return payouts.filter(p => p.payoutStatus === status);
        },

        getPayoutsByUser: (userId) => {
            const { payouts } = get();
            return payouts.filter(p => p.userId === userId);
        },

        getPayoutsByListing: (listingId) => {
            const { payouts } = get();
            return payouts.filter(p => p.listingId === listingId);
        },

        getTotalPayoutAmount: (currency) => {
            const { payouts } = get();
            return payouts
                .filter(p => !currency || p.currency === currency)
                .reduce((total, p) => total + p.amount, 0);
        },

        getPendingPayouts: () => {
            const { payouts } = get();
            return payouts.filter(p => p.payoutStatus === PayoutStatus.Pending);
        }
    }))
);