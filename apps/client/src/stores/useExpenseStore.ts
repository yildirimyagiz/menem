import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FeeType, ExpenseStatus } from '~/utils/types';

interface Expense {
    id: string;
    amount: number;
    description: string;
    accountId: string;
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    bankAddress: string;
    swiftCode: string;
    iban: string;
    feeType: FeeType;
    paymentDate: Date;
    paymentId?: string;
    rentalPropertyId?: string;
    facilityId?: string;
    payerId?: string;
    status: ExpenseStatus;
    ExpenseNumber?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface ExpenseStore {
    expense: Expense | null;
    expenses: Expense[];
    isLoading: boolean;
    filters: {
        status?: ExpenseStatus;
        feeType?: FeeType;
        startDate?: Date;
        endDate?: Date;
    };

    setExpense: (expense: Expense) => void;
    updateExpense: (expense: Partial<Expense>) => void;
    clearExpense: () => void;
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;
    removeExpense: (expenseId: string) => void;
    setFilters: (filters: Partial<ExpenseStore['filters']>) => void;

    getFilteredExpenses: () => Expense[];
    getExpensesByStatus: (status: ExpenseStatus) => Expense[];
    getExpensesByFeeType: (feeType: FeeType) => Expense[];
    getExpensesByDateRange: (startDate: Date, endDate: Date) => Expense[];
    getExpensesByPayer: (payerId: string) => Expense[];
    getTotalExpenses: () => number;
    getExpensesByProperty: (propertyId: string) => Expense[];
}

export const useExpenseStore = create<ExpenseStore>()(
    devtools((set, get) => ({
        expense: null,
        expenses: [],
        isLoading: false,
        filters: {},

        setExpense: (expense) => set({ expense }),
        updateExpense: (expenseUpdate) => set((state) => ({
            expense: state.expense ? { ...state.expense, ...expenseUpdate } : null,
            expenses: state.expenses.map(e =>
                e.id === state.expense?.id ? { ...e, ...expenseUpdate } : e
            )
        })),
        clearExpense: () => set({ expense: null }),

        setExpenses: (expenses) => set({ expenses }),
        addExpense: (expense) => set((state) => ({
            expenses: [...state.expenses, expense]
        })),
        removeExpense: (expenseId) => set((state) => ({
            expenses: state.expenses.filter(e => e.id !== expenseId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredExpenses: () => {
            const { expenses, filters } = get();
            return expenses.filter(exp => {
                if (filters.status && exp.status !== filters.status) return false;
                if (filters.feeType && exp.feeType !== filters.feeType) return false;
                if (filters.startDate && new Date(exp.paymentDate) < filters.startDate) return false;
                if (filters.endDate && new Date(exp.paymentDate) > filters.endDate) return false;
                return true;
            });
        },

        getExpensesByStatus: (status) => {
            const { expenses } = get();
            return expenses.filter(e => e.status === status);
        },

        getExpensesByFeeType: (feeType) => {
            const { expenses } = get();
            return expenses.filter(e => e.feeType === feeType);
        },

        getExpensesByDateRange: (startDate, endDate) => {
            const { expenses } = get();
            return expenses.filter(e => {
                const paymentDate = new Date(e.paymentDate);
                return paymentDate >= startDate && paymentDate <= endDate;
            });
        },

        getExpensesByPayer: (payerId) => {
            const { expenses } = get();
            return expenses.filter(e => e.payerId === payerId);
        },

        getTotalExpenses: () => {
            const { expenses } = get();
            return expenses.reduce((total, exp) => total + exp.amount, 0);
        },

        getExpensesByProperty: (propertyId) => {
            const { expenses } = get();
            return expenses.filter(e => e.rentalPropertyId === propertyId);
        }
    }))
); 