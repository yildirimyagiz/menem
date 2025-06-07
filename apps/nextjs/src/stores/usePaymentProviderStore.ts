import type { Currency, ProviderType } from '~/utils/types';
import { ProviderStatus } from '~/utils/types';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PaymentProvider {
    id: string;
    cuid: string;
    name: string;
    type: ProviderType;
    apiKey: string;
    secretKey: string;
    webhookUrl?: string;
    isActive: boolean;
    status: ProviderStatus;
    country?: string;
    currency: Currency;
    fees?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface PaymentProviderStore {
    provider: PaymentProvider | null;
    providers: PaymentProvider[];
    isLoading: boolean;

    setProvider: (provider: PaymentProvider) => void;
    updateProvider: (provider: Partial<PaymentProvider>) => void;
    clearProvider: () => void;
    setProviders: (providers: PaymentProvider[]) => void;
    addProvider: (provider: PaymentProvider) => void;
    removeProvider: (providerId: string) => void;
    toggleProviderStatus: (providerId: string) => void;
    getActiveProviders: () => PaymentProvider[];
    getProvidersByType: (type: ProviderType) => PaymentProvider[];
    getProvidersByCountry: (country: string) => PaymentProvider[];
}

export const usePaymentProviderStore = create<PaymentProviderStore>()(
    devtools((set, get) => ({
        provider: null,
        providers: [],
        isLoading: false,

        setProvider: (provider) => set({ provider }),
        updateProvider: (providerUpdate) => set((state) => ({
            provider: state.provider ?
                { ...state.provider, ...providerUpdate } : null,
            providers: state.providers.map(p =>
                p.id === state.provider?.id ? { ...p, ...providerUpdate } : p
            )
        })),
        clearProvider: () => set({ provider: null }),

        setProviders: (providers) => set({ providers }),
        addProvider: (provider) => set((state) => ({
            providers: [...state.providers, provider]
        })),
        removeProvider: (providerId) => set((state) => ({
            providers: state.providers.filter(p => p.id !== providerId)
        })),

        toggleProviderStatus: (providerId) => set((state) => ({
            providers: state.providers.map(p =>
                p.id === providerId ? { ...p, isActive: !p.isActive } : p
            )
        })),

        getActiveProviders: () => {
            const { providers } = get();
            return providers.filter(provider =>
                provider.isActive &&
                provider.status === ProviderStatus.Active
            );
        },

        getProvidersByType: (type) => {
            const { providers } = get();
            return providers.filter(provider =>
                provider.type === type
            );
        },

        getProvidersByCountry: (country) => {
            const { providers } = get();
            return providers.filter(provider =>
                provider.country === country
            );
        },
    }))
); 