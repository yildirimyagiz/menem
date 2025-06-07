import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PaymentStatus } from '~/utils/types';

interface BitcoinPayment {
    id: string;
    cuid: string;
    amount: number;
    transactionId: string;
    status: PaymentStatus;
    paymentId: string;
    BitcoinNumber?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface BitcoinPaymentStore {
    bitcoinPayment: BitcoinPayment | null;
    bitcoinPayments: BitcoinPayment[];
    isLoading: boolean;

    setBitcoinPayment: (payment: BitcoinPayment) => void;
    updateBitcoinPayment: (payment: Partial<BitcoinPayment>) => void;
    clearBitcoinPayment: () => void;
    setBitcoinPayments: (payments: BitcoinPayment[]) => void;
    addBitcoinPayment: (payment: BitcoinPayment) => void;
    removeBitcoinPayment: (paymentId: string) => void;

    getPaymentsByStatus: (status: PaymentStatus) => BitcoinPayment[];
    getPaymentByTransaction: (transactionId: string) => BitcoinPayment | null;
    getTotalBitcoinPayments: () => number;
    getPendingPayments: () => BitcoinPayment[];
    getSuccessfulPayments: () => BitcoinPayment[];
    getFailedPayments: () => BitcoinPayment[];
}

export const useBitcoinPaymentStore = create<BitcoinPaymentStore>()(
    devtools((set, get) => ({
        bitcoinPayment: null,
        bitcoinPayments: [],
        isLoading: false,

        setBitcoinPayment: (payment) => set({ bitcoinPayment: payment }),
        updateBitcoinPayment: (paymentUpdate) => set((state) => ({
            bitcoinPayment: state.bitcoinPayment
                ? { ...state.bitcoinPayment, ...paymentUpdate }
                : null,
            bitcoinPayments: state.bitcoinPayments.map(p =>
                p.id === state.bitcoinPayment?.id ? { ...p, ...paymentUpdate } : p
            )
        })),
        clearBitcoinPayment: () => set({ bitcoinPayment: null }),

        setBitcoinPayments: (payments) => set({ bitcoinPayments: payments }),
        addBitcoinPayment: (payment) => set((state) => ({
            bitcoinPayments: [...state.bitcoinPayments, payment]
        })),
        removeBitcoinPayment: (paymentId) => set((state) => ({
            bitcoinPayments: state.bitcoinPayments.filter(p => p.id !== paymentId)
        })),

        getPaymentsByStatus: (status) => {
            const { bitcoinPayments } = get();
            return bitcoinPayments.filter(p => p.status === status);
        },

        getPaymentByTransaction: (transactionId) => {
            const { bitcoinPayments } = get();
            return bitcoinPayments.find(p => p.transactionId === transactionId) ?? null;
        },

        getTotalBitcoinPayments: () => {
            const { bitcoinPayments } = get();
            return bitcoinPayments
                .filter(p => p.status === PaymentStatus.Succeeded)
                .reduce((total, p) => total + p.amount, 0);
        },

        getPendingPayments: () => {
            const { bitcoinPayments } = get();
            return bitcoinPayments.filter(p => p.status === PaymentStatus.Pending);
        },

        getSuccessfulPayments: () => {
            const { bitcoinPayments } = get();
            return bitcoinPayments.filter(p => p.status === PaymentStatus.Succeeded);
        },

        getFailedPayments: () => {
            const { bitcoinPayments } = get();
            return bitcoinPayments.filter(p => p.status === PaymentStatus.Failed);
        }
    }))
);