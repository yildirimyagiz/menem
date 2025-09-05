import { createBaseStore } from './createBaseStore';

interface Airline {
    id: string;
    cuid: string;
    name: string;
    code: string;
    country: string;
    website: string;
    logoUrl: string;
    establishedYear?: number;
    fleetSize?: number;
    reviewCount: number;
    averageRating?: number;
    destinations?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

// Create a type for the serialized data
type SerializedAirline = Omit<Airline, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
};

// Create the base store first
const baseStore = createBaseStore<Airline>({
    name: 'airline-store',
    persist: true,
    version: 1,
    logging: {
        enabled: true,
        level: 'debug'
    },
    cache: {
        ttl: 1000 * 60 * 5,
        maxSize: 100
    },
    transformers: {
        serialize: (airline: Airline): SerializedAirline => ({
            ...airline,
            createdAt: airline.createdAt.toISOString(),
            updatedAt: airline.updatedAt.toISOString(),
            deletedAt: airline.deletedAt?.toISOString(),
        }),
        deserialize: (data: SerializedAirline): Airline => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
        }),
    },
});

// Extend the base store with additional functionality
const useAirlineStore = () => {
    const store = baseStore();

    return {
        ...store,
        updateAverageRating: (airlineId: string, newRating: number) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map(a =>
                a.id === airlineId
                    ? {
                        ...a,
                        averageRating: a.averageRating
                            ? (a.averageRating * a.reviewCount + newRating) / (a.reviewCount + 1)
                            : newRating
                    }
                    : a
            );
            store.setItems(updatedItems);
        },
        incrementReviewCount: (airlineId: string) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map(a =>
                a.id === airlineId
                    ? { ...a, reviewCount: a.reviewCount + 1 }
                    : a
            );
            store.setItems(updatedItems);
        }
    };
};

// Create custom hooks using the extended store
export const useAirlines = () => {
    const store = useAirlineStore();

    return {
        // Basic state
        airline: store.data,
        airlines: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions
        setAirline: store.setItem,
        updateAirline: store.updateItem,
        clearAirline: store.clearItem,
        setAirlines: store.setItems,
        addAirline: store.addItem,
        removeAirline: store.removeItem,

        // Custom actions
        incrementReviewCount: store.incrementReviewCount,
        updateAverageRating: store.updateAverageRating,

        // Custom queries
        getAirlinesByCountry: (country: string) =>
            store.advancedFilter({
                where: { country: { eq: country } }
            }),

        getTopRatedAirlines: (limit = 10) =>
            store.advancedFilter({
                where: { averageRating: { gt: 0 } },

                limit
            }),

        // Utility methods
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useAirlineStore, type Airline }; 