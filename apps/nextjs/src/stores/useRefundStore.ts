import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RefundStatus } from '~/utils/types';

interface Refund {
    id: string;
    cuid: string;
    amount: number;
    reason: string;
    status: RefundStatus;
    paymentId: string;
    helpId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    RefundNumber?: number;
}

interface RefundStore {
    refund: Refund | null;
    refunds: Refund[];
    isLoading: boolean;
    filters: {
        status?: RefundStatus;
        paymentId?: string;
        helpId?: string;
        minAmount?: number;
        maxAmount?: number;
    };

    setRefund: (refund: Refund) => void;
    updateRefund: (refund: Partial<Refund>) => void;
    clearRefund: () => void;
    setRefunds: (refunds: Refund[]) => void;
    addRefund: (refund: Refund) => void;
    removeRefund: (refundId: string) => void;
    setFilters: (filters: Partial<RefundStore['filters']>) => void;

    getFilteredRefunds: () => Refund[];
    getRefundsByStatus: (status: RefundStatus) => Refund[];
    getRefundsByPayment: (paymentId: string) => Refund[];
    getRefundsByHelp: (helpId: string) => Refund[];
    getPendingRefunds: () => Refund[];
    getCompletedRefunds: () => Refund[];
    getTotalRefundAmount: () => number;
}

export const useRefundStore = create<RefundStore>()(
    devtools((set, get) => ({
        refund: null,
        refunds: [],
        isLoading: false,
        filters: {},

        setRefund: (refund) => set({ refund }),
        updateRefund: (refundUpdate) => set((state) => ({
            refund: state.refund ? { ...state.refund, ...refundUpdate } : null,
            refunds: state.refunds.map(r =>
                r.id === state.refund?.id ? { ...r, ...refundUpdate } : r
            )
        })),
        clearRefund: () => set({ refund: null }),

        setRefunds: (refunds) => set({ refunds }),
        addRefund: (refund) => set((state) => ({
            refunds: [...state.refunds, refund]
        })),
        removeRefund: (refundId) => set((state) => ({
            refunds: state.refunds.filter(r => r.id !== refundId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredRefunds: () => {
            const { refunds, filters } = get();
            return refunds.filter(refund => {
                if (filters.status && refund.status !== filters.status) return false;
                if (filters.paymentId && refund.paymentId !== filters.paymentId) return false;
                if (filters.helpId && refund.helpId !== filters.helpId) return false;
                if (filters.minAmount && refund.amount < filters.minAmount) return false;
                if (filters.maxAmount && refund.amount > filters.maxAmount) return false;
                return true;
            });
        },

        getRefundsByStatus: (status) => {
            const { refunds } = get();
            return refunds.filter(r => r.status === status);
        },

        getRefundsByPayment: (paymentId) => {
            const { refunds } = get();
            return refunds.filter(r => r.paymentId === paymentId);
        },

        getRefundsByHelp: (helpId) => {
            const { refunds } = get();
            return refunds.filter(r => r.helpId === helpId);
        },

        getPendingRefunds: () => {
            const { refunds } = get();
            return refunds.filter(r => r.status === RefundStatus.Pending);
        },

        getCompletedRefunds: () => {
            const { refunds } = get();
            return refunds.filter(r => r.status === RefundStatus.Completed);
        },

        getTotalRefundAmount: () => {
            const { refunds } = get();
            return refunds
                .filter(r => r.status === RefundStatus.Completed)
                .reduce((total, r) => total + r.amount, 0);
        }
    }))
); 