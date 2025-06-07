import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Analytics } from "~/utils/types";

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type CountableAnalytics = NumericKeys<Analytics>;

interface AnalyticsStore {
  analytics: Analytics | null;
  analyticsList: Analytics[];
  isLoading: boolean;

  setAnalytics: (analytics: Analytics) => void;
  updateAnalytics: (analytics: Partial<Analytics>) => void;
  clearAnalytics: () => void;
  setAnalyticsList: (analyticsList: Analytics[]) => void;
  addAnalytics: (analytics: Analytics) => void;
  incrementCount: (userId: string, type: CountableAnalytics) => void;
  getAnalyticsByUser: (userId: string) => Analytics[];
  getAnalyticsByDateRange: (startDate: Date, endDate: Date) => Analytics[];
  getTotalCounts: () => Record<CountableAnalytics, number>;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools((set, get) => ({
    analytics: null,
    analyticsList: [],
    isLoading: false,

    setAnalytics: (analytics) => set({ analytics }),
    updateAnalytics: (analyticsUpdate) =>
      set((state) => ({
        analytics: state.analytics
          ? { ...state.analytics, ...analyticsUpdate }
          : null,
        analyticsList: state.analyticsList.map((a) =>
          a.id === state.analytics?.id ? { ...a, ...analyticsUpdate } : a,
        ),
      })),
    clearAnalytics: () => set({ analytics: null }),

    setAnalyticsList: (analyticsList) => set({ analyticsList }),
    addAnalytics: (analytics) =>
      set((state) => ({
        analyticsList: [...state.analyticsList, analytics],
      })),

    incrementCount: (userId: string, type: CountableAnalytics) =>
      set((state) => ({
        analyticsList: state.analyticsList.map((a) => {
          if (a.userId === userId) {
            const currentValue = a[type];
            return { ...a, [type]: currentValue + 1 };
          }
          return a;
        }),
      })),

    getAnalyticsByUser: (userId: string) => {
      const { analyticsList } = get();
      return analyticsList.filter((a) => a.userId === userId);
    },

    getAnalyticsByDateRange: (startDate: Date, endDate: Date) => {
      const { analyticsList } = get();
      return analyticsList.filter(
        (a) => a.timestamp >= startDate && a.timestamp <= endDate,
      );
    },

    getTotalCounts: () => {
      const { analyticsList } = get();
      return analyticsList.reduce<Record<CountableAnalytics, number>>(
        (acc, curr) => {
          const result = { ...acc };

          (Object.keys(curr) as (keyof Analytics)[]).forEach((key) => {
            const value = curr[key];
            if (typeof value === "number") {
              const numericKey = key as CountableAnalytics;
              result[numericKey] = result[numericKey] + value;
            }
          });

          return result;
        },
        {} as Record<CountableAnalytics, number>,
      );
    },
  })),
);
