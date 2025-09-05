import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Coupon } from '~/utils/types';



interface CouponStore {
    coupon: Coupon | null;
    coupons: Coupon[];
    isLoading: boolean;
    filters: {
        isActive?: boolean;
        userId?: string;
        isPercentage?: boolean;
        minValue?: number;
        maxValue?: number;
    };

    setCoupon: (coupon: Coupon) => void;
    updateCoupon: (coupon: Partial<Coupon>) => void;
    clearCoupon: () => void;
    setCoupons: (coupons: Coupon[]) => void;
    addCoupon: (coupon: Coupon) => void;
    removeCoupon: (couponId: string) => void;
    setFilters: (filters: Partial<CouponStore['filters']>) => void;

    // Utility functions
    getFilteredCoupons: () => Coupon[];
    getActiveCoupons: () => Coupon[];
    getExpiredCoupons: () => Coupon[];
    getCouponsByUser: (userId: string) => Coupon[];
    validateCoupon: (code: string) => Coupon | null;
    calculateDiscount: (amount: number, couponCode: string) => number | null;
    getUpcomingCoupons: () => Coupon[];
}

export const useCouponStore = create<CouponStore>()(
    devtools((set, get) => ({
        coupon: null,
        coupons: [],
        isLoading: false,
        filters: {},

        setCoupon: (coupon) => set({ coupon }),
        updateCoupon: (couponUpdate) => set((state) => ({
            coupon: state.coupon ? { ...state.coupon, ...couponUpdate } : null,
            coupons: state.coupons.map(c =>
                c.id === state.coupon?.id ? { ...c, ...couponUpdate } : c
            )
        })),
        clearCoupon: () => set({ coupon: null }),

        setCoupons: (coupons) => set({ coupons }),
        addCoupon: (coupon) => set((state) => ({
            coupons: [...state.coupons, coupon]
        })),
        removeCoupon: (couponId) => set((state) => ({
            coupons: state.coupons.filter(c => c.id !== couponId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredCoupons: () => {
            const { coupons, filters } = get();
            return coupons.filter(coupon => {
                if (filters.isActive !== undefined) {
                    const now = new Date();
                    const isActive = now >= new Date(coupon.startDate) &&
                        now <= new Date(coupon.endDate) &&
                        !coupon.deletedAt;
                    if (isActive !== filters.isActive) return false;
                }
                if (filters.userId && coupon.userId !== filters.userId) return false;
                if (filters.isPercentage !== undefined &&
                    coupon.isPercentage !== filters.isPercentage) return false;
                if (filters.minValue && coupon.value < filters.minValue) return false;
                if (filters.maxValue && coupon.value > filters.maxValue) return false;
                return true;
            });
        },

        getActiveCoupons: () => {
            const { coupons } = get();
            const now = new Date();
            return coupons.filter(coupon =>
                now >= new Date(coupon.startDate) &&
                now <= new Date(coupon.endDate) &&
                !coupon.deletedAt
            );
        },

        getExpiredCoupons: () => {
            const { coupons } = get();
            const now = new Date();
            return coupons.filter(coupon =>
                now > new Date(coupon.endDate) ||
                coupon.deletedAt
            );
        },

        getCouponsByUser: (userId) => {
            const { coupons } = get();
            return coupons.filter(c => c.userId === userId);
        },

        validateCoupon: (code) => {
            const { coupons } = get();
            const now = new Date();
            return coupons.find(coupon =>
                coupon.code === code &&
                now >= new Date(coupon.startDate) &&
                now <= new Date(coupon.endDate) &&
                !coupon.deletedAt
            ) ?? null;
        },

        calculateDiscount: (amount, couponCode) => {
            const { validateCoupon } = get();
            const coupon = validateCoupon(couponCode);

            if (!coupon) return null;

            return coupon.isPercentage
                ? amount * (coupon.value / 100)
                : Math.min(coupon.value, amount);
        },

        getUpcomingCoupons: () => {
            const { coupons } = get();
            const now = new Date();
            return coupons.filter(coupon =>
                new Date(coupon.startDate) > now &&
                !coupon.deletedAt
            ).sort((a, b) =>
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
        }
    }))
); 