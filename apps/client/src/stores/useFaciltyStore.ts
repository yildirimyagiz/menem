import type { FacilityType } from '~/utils/types';
import { Statuses } from '~/utils/types';
import { createBaseStore } from './createBaseStore';

// Define the Facility interface
interface Facility {
    id: string;
    cuid: string;
    name: string;
    details: string;
    facilityType: FacilityType;
    status: Statuses;
    slug: string;
    locationId?: string;
    unitCount: number;
    reviewCount?: number | null;
    averageRating?: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | undefined;
    authorizedUserId?: string | undefined;
    locationCoordinates?: Record<string, unknown>;
}

interface SerializedFacility extends Omit<Facility, 'createdAt' | 'updatedAt' | 'deletedAt'> {
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

// Create the base store
const baseStore = createBaseStore<Facility>({
    name: 'facility-store',
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
        serialize: (facility: Facility): SerializedFacility => ({
            ...facility,
            createdAt: facility.createdAt.toISOString(),
            updatedAt: facility.updatedAt.toISOString(),
            deletedAt: facility.deletedAt?.toISOString(),
        }),
        deserialize: (data: SerializedFacility): Facility => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
        }),
    },
});

// Extend the base store with additional functionality
const useFacilityStore = () => {
    const store = baseStore();

    return {
        ...store,
        updateFacility: (facility: Facility, _options: { type: "update" }) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map((item) =>
                item.id === facility.id ? facility : item
            );
            store.setItems(updatedItems);

            if (store.data?.id === facility.id) {
                store.setItem(facility);
            }
        }
    };
};

// Create custom hooks using the extended store
export const useFacilities = () => {
    const store = useFacilityStore();

    return {
        // Basic state
        facility: store.data,
        facilities: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions
        setFacility: store.setItem,
        updateFacility: store.updateFacility,
        clearFacility: store.clearItem,
        setFacilities: store.setItems,
        addFacility: store.addItem,
        removeFacility: store.removeItem,

        // Custom queries using base store methods
        getFacilityById: store.getById,
        getFacilitiesByType: (type: FacilityType) =>
            store.advancedFilter({
                where: { facilityType: { eq: type } }
            }),
        getActiveFacilities: () =>
            store.advancedFilter({
                where: {
                    status: { eq: Statuses.Active },
                    deletedAt: { eq: undefined }
                }
            }),

        // Additional custom queries
        searchFacilities: (query: string) =>
            store.search(query, ['name', 'details', 'slug']),

        getFacilitiesByLocation: (locationId: string) =>
            store.advancedFilter({
                where: { locationId: { eq: locationId } }
            }),

        getFacilitiesByAuthorizedUser: (userId: string) =>
            store.advancedFilter({
                where: { authorizedUserId: { eq: userId } }
            }),

        getFacilitiesByUnitCount: (minUnits: number) =>
            store.advancedFilter({
                where: { unitCount: { gte: minUnits } }
            }),

        getFacilitiesByRating: (minRating: number) =>
            store.advancedFilter({
                where: { averageRating: { gte: minRating } }
            }),

        // Utility methods
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useFacilityStore };