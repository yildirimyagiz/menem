import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Currency } from '~/utils/types';
import { PaymentIntentStatus } from '~/utils/types';

interface PaymentIntent {
    id: string;
    cuid: string;
    amount: number;
    currency: Currency;
    status: PaymentIntentStatus;
    paymentId?: string;
    PaymentIntentNumber?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface PaymentIntentStore {
    paymentIntent: PaymentIntent | null;
    paymentIntents: PaymentIntent[];
    isLoading: boolean;

    setPaymentIntent: (intent: PaymentIntent) => void;
    updatePaymentIntent: (intent: Partial<PaymentIntent>) => void;
    clearPaymentIntent: () => void;
    setPaymentIntents: (intents: PaymentIntent[]) => void;
    addPaymentIntent: (intent: PaymentIntent) => void;
    removePaymentIntent: (intentId: string) => void;

    getIntentsByStatus: (status: PaymentIntentStatus) => PaymentIntent[];
    getIntentsByCurrency: (currency: Currency) => PaymentIntent[];
    getTotalIntentAmount: (currency: Currency) => number;
    getPendingIntents: () => PaymentIntent[];
    getSuccessfulIntents: () => PaymentIntent[];
    getCanceledIntents: () => PaymentIntent[];
    getActiveIntents: () => PaymentIntent[];
}

export const usePaymentIntentStore = create<PaymentIntentStore>()(
    devtools((set, get) => ({
        paymentIntent: null,
        paymentIntents: [],
        isLoading: false,

        setPaymentIntent: (intent) => set({ paymentIntent: intent }),
        updatePaymentIntent: (intentUpdate) => set((state) => ({
            paymentIntent: state.paymentIntent
                ? { ...state.paymentIntent, ...intentUpdate }
                : null,
            paymentIntents: state.paymentIntents.map(i =>
                i.id === state.paymentIntent?.id ? { ...i, ...intentUpdate } : i
            )
        })),
        clearPaymentIntent: () => set({ paymentIntent: null }),

        setPaymentIntents: (intents) => set({ paymentIntents: intents }),
        addPaymentIntent: (intent) => set((state) => ({
            paymentIntents: [...state.paymentIntents, intent]
        })),
        removePaymentIntent: (intentId) => set((state) => ({
            paymentIntents: state.paymentIntents.filter(i => i.id !== intentId)
        })),

        getIntentsByStatus: (status) => {
            const { paymentIntents } = get();
            return paymentIntents.filter(i => i.status === status);
        },

        getIntentsByCurrency: (currency) => {
            const { paymentIntents } = get();
            return paymentIntents.filter(i => i.currency === currency);
        },

        getTotalIntentAmount: (currency) => {
            const { paymentIntents } = get();
            return paymentIntents
                .filter(i => i.currency === currency)
                .reduce((total, i) => total + i.amount, 0);
        },

        getPendingIntents: () => {
            const { paymentIntents } = get();
            return paymentIntents.filter(i => i.status === PaymentIntentStatus.Pending);
        },

        getSuccessfulIntents: () => {
            const { paymentIntents } = get();
            return paymentIntents.filter(i => i.status === PaymentIntentStatus.Succeeded);
        },

        getCanceledIntents: () => {
            const { paymentIntents } = get();
            return paymentIntents.filter(i => i.status === PaymentIntentStatus.Failed);
        },

        getActiveIntents: () => {
            const { paymentIntents } = get();
            return paymentIntents.filter(i =>
                !i.deletedAt &&
                ['PENDING', 'PROCESSING'].includes(i.status)
            );
        }
    }))
); 