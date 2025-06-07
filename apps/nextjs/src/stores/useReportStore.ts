import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ReportCategory } from '~/utils/types';

interface Report {
    id: string;
    cuid: string;
    title: string;
    content: string;
    propertyId: string;
    userId: string;
    visitors: number;
    stayers: number;
    payments: number;
    amount: number;
    checkInDays: number;
    emptyDays: number;
    offersCount: number;
    problems: number;
    expenses: number;
    ReportCategory: ReportCategory;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    rentalPropertyId?: string;
}

interface ReportStore {
    report: Report | null;
    reports: Report[];
    isLoading: boolean;
    filters: {
        category?: ReportCategory;
        propertyId?: string;
        userId?: string;
        dateRange?: { start: Date; end: Date };
    };

    setReport: (report: Report) => void;
    updateReport: (report: Partial<Report>) => void;
    clearReport: () => void;
    setReports: (reports: Report[]) => void;
    addReport: (report: Report) => void;
    removeReport: (reportId: string) => void;
    setFilters: (filters: Partial<ReportStore['filters']>) => void;

    getFilteredReports: () => Report[];
    getReportsByProperty: (propertyId: string) => Report[];
    getReportsByUser: (userId: string) => Report[];
    getReportsByCategory: (category: ReportCategory) => Report[];
    getReportStatistics: () => {
        totalVisitors: number;
        totalStayers: number;
        totalPayments: number;
        totalAmount: number;
        averageOccupancy: number;
    };
}

export const useReportStore = create<ReportStore>()(
    devtools((set, get) => ({
        report: null,
        reports: [],
        isLoading: false,
        filters: {},

        setReport: (report) => set({ report }),
        updateReport: (reportUpdate) => set((state) => ({
            report: state.report ? { ...state.report, ...reportUpdate } : null,
            reports: state.reports.map(r =>
                r.id === state.report?.id ? { ...r, ...reportUpdate } : r
            )
        })),
        clearReport: () => set({ report: null }),

        setReports: (reports) => set({ reports }),
        addReport: (report) => set((state) => ({
            reports: [...state.reports, report]
        })),
        removeReport: (reportId) => set((state) => ({
            reports: state.reports.filter(r => r.id !== reportId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredReports: () => {
            const { reports, filters } = get();
            return reports.filter(report => {
                if (filters.category && report.ReportCategory !== filters.category) return false;
                if (filters.propertyId && report.propertyId !== filters.propertyId) return false;
                if (filters.userId && report.userId !== filters.userId) return false;
                if (filters.dateRange) {
                    const reportDate = new Date(report.createdAt);
                    if (reportDate < filters.dateRange.start || reportDate > filters.dateRange.end) {
                        return false;
                    }
                }
                return !report.deletedAt;
            });
        },

        getReportsByProperty: (propertyId) => {
            const { reports } = get();
            return reports.filter(r => r.propertyId === propertyId && !r.deletedAt);
        },

        getReportsByUser: (userId) => {
            const { reports } = get();
            return reports.filter(r => r.userId === userId && !r.deletedAt);
        },

        getReportsByCategory: (category) => {
            const { reports } = get();
            return reports.filter(r => r.ReportCategory === category && !r.deletedAt);
        },

        getReportStatistics: () => {
            const { reports } = get();
            const activeReports = reports.filter(r => !r.deletedAt);

            const totalVisitors = activeReports.reduce((sum, r) => sum + r.visitors, 0);
            const totalStayers = activeReports.reduce((sum, r) => sum + r.stayers, 0);
            const totalPayments = activeReports.reduce((sum, r) => sum + r.payments, 0);
            const totalAmount = activeReports.reduce((sum, r) => sum + r.amount, 0);

            const totalDays = activeReports.reduce((sum, r) => sum + r.checkInDays + r.emptyDays, 0);
            const occupiedDays = activeReports.reduce((sum, r) => sum + r.checkInDays, 0);
            const averageOccupancy = totalDays > 0 ? (occupiedDays / totalDays) * 100 : 0;

            return {
                totalVisitors,
                totalStayers,
                totalPayments,
                totalAmount,
                averageOccupancy
            };
        }
    }))
); 