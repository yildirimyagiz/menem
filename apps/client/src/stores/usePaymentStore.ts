import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Payment {
    id: string;
    cuid: string;
    amount: number;
    currency: string;
    description: string;
    slug: string;
    status: string;
    paymentType: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    userId: string;
    reservationId: string;
    commission?: number;
    taxType: string;
    taxAmount?: number;
    totalAmount?: number;
    installment?: number;
    couponId?: string;
    payoutMethod: string;
    guestId?: string;
    providerId: string;
    offerId?: string;
    rentalPropertyId?: string;
    insuranceId?: string;
    helpId?: string;
    PaymentNumber?: number;
    membershipId?: string;
}

interface PaymentStore {
    payment: Payment | null;
    payments: Payment[];
    isLoading: boolean;

    setPayment: (payment: Payment) => void;
    updatePayment: (paymentUpdate: Partial<Payment>) => void;
    clearPayment: () => void;
    setPayments: (payments: Payment[]) => void;
    addPayment: (payment: Payment) => void;
    removePayment: (paymentId: string) => void;
}

export const usePaymentStore = create<PaymentStore>()(
    devtools((set) => ({
        payment: null,
        payments: [],
        isLoading: false,

        setPayment: (payment) => set({ payment }),
        updatePayment: (paymentUpdate) => set((state) => ({
            payment: state.payment ? { ...state.payment, ...paymentUpdate } : null,
            payments: state.payments.map(p =>
                p.id === state.payment?.id ? { ...p, ...paymentUpdate } : p
            ),
        })),
        clearPayment: () => set({ payment: null }),

        setPayments: (payments) => set({ payments }),
        addPayment: (payment) => set((state) => ({
            payments: [...state.payments, payment],
        })),
        removePayment: (paymentId) => set((state) => ({
            payments: state.payments.filter(p => p.id !== paymentId),
        })),
    }))
);
