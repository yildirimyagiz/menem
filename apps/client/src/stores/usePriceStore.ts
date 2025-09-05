import type { Currency } from '~/utils/types';
import { createBaseStore } from './createBaseStore';

// Define the Price interface
interface Price {
    id: string;
    baseAmount: number;
    finalAmount: number;
    currency: Currency;
    isActive: boolean;
    rateConfig?: Record<string, unknown>;
    stayConstraints?: Record<string, unknown>;
    propertyId?: string;
    listingId?: string;
    reservationId?: string;
    carId?: string;
    ticketId?: string;
    experienceId?: string;
    hotelId?: string;
    rentalPropertyId?: string;

    createdAt: Date;
    updatedAt: Date;
}

interface SerializedPrice extends Omit<Price, 'createdAt' | 'updatedAt'> {
    createdAt: string;
    updatedAt: string;
}

// Create the base store
const basePriceStore = createBaseStore<Price>({
    name: 'price-store',
    persist: true,
    version: 1,
    logging: {
        enabled: true,
        level: 'debug'
    },
    cache: {
        ttl: 1000 * 60 * 5, // 5 minutes
        maxSize: 100
    },
    transformers: {
        serialize: (price: Price): SerializedPrice => ({
            ...price,
            createdAt: price.createdAt.toISOString(),
            updatedAt: price.updatedAt.toISOString(),
        }),
        deserialize: (data: SerializedPrice): Price => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        }),
    },
});

// Extend the base store with price-specific functionality
const usePriceStore = () => {
    const store = basePriceStore();

    return {
        ...store,
        updatePrice: (price: Price) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map((item) =>
                item.id === price.id ? price : item
            );
            store.setItems(updatedItems);

            if (store.data?.id === price.id) {
                store.setItem(price);
            }
        }
    };
};

// Create custom hooks using the extended store
export const usePrices = () => {
    const store = usePriceStore();

    return {
        // Basic state
        price: store.data,
        prices: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions
        setPrice: store.setItem,
        updatePrice: store.updatePrice,
        clearPrice: store.clearItem,
        setPrices: store.setItems,
        addPrice: store.addItem,
        removePrice: store.removeItem,

        // Custom queries
        getPriceById: store.getById,

        getActivePrices: () =>
            store.advancedFilter({
                where: { isActive: { eq: true } }
            }),

        getPricesByProperty: (propertyId: string) =>
            store.advancedFilter({
                where: {
                    propertyId: { eq: propertyId },
                    isActive: { eq: true }
                }
            }),

        getPricesByListing: (listingId: string) =>
            store.advancedFilter({
                where: {
                    listingId: { eq: listingId },
                    isActive: { eq: true }
                }
            }),

        getPricesByReservation: (reservationId: string) =>
            store.advancedFilter({
                where: { reservationId: { eq: reservationId } }
            }),

        getPricesByCurrency: (currency: Currency) =>
            store.advancedFilter({
                where: { currency: { eq: currency } }
            }),

        getPricesInRange: (min: number, max: number) =>
            store.advancedFilter({
                where: {
                    finalAmount: {
                        gte: min,
                        lte: max
                    }
                }
            }),

        // Utility methods
        calculateTotalAmount: (prices: Price[]) =>
            prices.reduce((sum, price) => sum + price.finalAmount, 0),

        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { usePriceStore };