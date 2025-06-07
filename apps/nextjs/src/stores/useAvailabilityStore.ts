import { createBaseStore } from './createBaseStore';

// Define the Availability interface
interface Availability {
    id: string;
    date: Date;
    isBlocked: boolean;
    isBooked: boolean;
    listingId: string;
    roomId?: string;
    totalUnits: number;
    availableUnits: number;
    bookedUnits: number;
    blockedUnits: number;
    basePrice: number;
    currentPrice: number;
    minNights?: number;
    maxNights?: number;
    maxGuests?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Create the base store for availability
const baseStore = createBaseStore<Availability>({
    name: 'availability-store',
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
        serialize: (availability: Availability) => ({
            ...availability,
            date: availability.date.toISOString(),
            createdAt: availability.createdAt.toISOString(),
            updatedAt: availability.updatedAt.toISOString(),
        }),
        deserialize: (data: {
            id: string;
            date: string;
            isBlocked: boolean;
            isBooked: boolean;
            listingId: string;
            roomId?: string;
            totalUnits: number;
            availableUnits: number;
            bookedUnits: number;
            blockedUnits: number;
            basePrice: number;
            currentPrice: number;
            minNights?: number;
            maxNights?: number;
            maxGuests?: number;
            createdAt: string;
            updatedAt: string;
        }): Availability => ({
            ...data,
            date: new Date(data.date),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        }),
    },
});

// Extend the base store with additional functionality
const useAvailabilityStore = () => {
    const store = baseStore();

    return {
        ...store,
        updateAvailability: (availability: Availability, _options: { type: "update" }) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map((item) =>
                item.id === availability.id ? availability : item
            );
            store.setItems(updatedItems);

            if (store.data?.id === availability.id) {
                store.setItem(availability);
            }
        }
    };
};

// Create custom hooks using the extended store
export const useAvailability = () => {
    const store = useAvailabilityStore();

    return {
        availability: store.data,
        availabilities: store.items,
        isLoading: store.isLoading,
        error: store.error,
        setAvailability: store.setItem,
        updateAvailability: store.updateAvailability,
        clearAvailability: store.clearItem,
        setAvailabilities: store.setItems,
        addAvailability: store.addItem,
        removeAvailability: store.removeItem,
        getAvailabilityById: store.getById,
        getAvailableUnitsByDate: (date: Date) =>
            store.advancedFilter({
                where: { date: { eq: date } }
            }),
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useAvailabilityStore };