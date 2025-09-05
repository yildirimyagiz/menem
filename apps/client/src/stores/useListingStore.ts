import type {
    Category,
    ListingType
} from '~/utils/types';
import {
    PublishedStatus
} from '~/utils/types';
import { createBaseStore } from './createBaseStore';

// Define the Listing interface
interface Listing {
    id: string;
    providerId: string;
    cuid: string;
    title: string;
    description: string;
    category: Category;
    listingType: ListingType;
    slug: string;
    publishedStatus: PublishedStatus;
    likesCount: number;
    reviewCount: number;
    averageRating?: number | null;
    featuredImage: string | null;// Change this to match the Json type
    isActive: boolean;
    featured: boolean;

    // Optional references
    userId?: string | null;
    agentId?: string | null;
    agencyId?: string | null;
    helpId?: string | null;
    reportId?: string | null;
    facilityId?: string | null;
    locationId?: string | null;
    hotelStaffId?: string | null;

    // Tracking
    listingNumber?: number | null;
    createdAt: Date; // Keep as Date
    updatedAt: Date; // Keep as Date
    deletedAt?: Date; // Keep as Date
}

interface SerializedListing extends Omit<Listing, 'createdAt' | 'updatedAt' | 'deletedAt'> {
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

// Define the state type for the store
interface ListingStoreState {
    items: Listing[];
    data?: Listing;
    isLoading: boolean;
    error: Error | null;
    addListing: {
        updateListing: (listing: Listing, options: { type: "update" }) => void;
    };
}

// Create the base store
const baseStore = createBaseStore<Listing>({
    name: 'listing-store',
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
        serialize: (listing: Listing): SerializedListing => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            updatedAt: listing.updatedAt.toISOString(),
            deletedAt: listing.deletedAt?.toISOString(),
        }),
        deserialize: (data: SerializedListing): Listing => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
        }),
    },
});

// Extend the base store with listing-specific functionality
const useListingStore = (_selector: (state: ListingStoreState) => ListingStoreState) => {
    const store = baseStore();

    const updateListing = (listing: Listing, _options: { type: "update" }) => {
        const currentItems = store.items;
        const updatedItems = currentItems.map((item) =>
            item.id === listing.id ? listing : item
        );
        store.setItems(updatedItems);

        if (store.data?.id === listing.id) {
            store.setItem(listing);
        }
    };

    return {
        ...store,
        updateListing,
        incrementLikes: (listingId: string) => {
            const listing = store.items.find(item => item.id === listingId);
            if (listing) {
                const updated = { ...listing, likesCount: listing.likesCount + 1 };
                updateListing(updated, { type: "update" });
            }
        },
        updateRating: (listingId: string, newRating: number) => {
            const listing = store.items.find(item => item.id === listingId);
            if (listing) {
                const newAverage = listing.averageRating
                    ? (listing.averageRating * listing.reviewCount + newRating) / (listing.reviewCount + 1)
                    : newRating;
                const updated = {
                    ...listing,
                    averageRating: newAverage,
                    reviewCount: listing.reviewCount + 1
                };
                updateListing(updated, { type: "update" });
            }
        }
    };
};

// Create custom hooks using the extended store
export const useListings = () => {
    const store = useListingStore((state) => state);

    return {
        // Basic state
        listing: store.data,
        listings: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions
        setListing: store.setItem,
        updateListing: store.updateListing,
        clearListing: store.clearItem,
        setListings: store.setItems,
        addListing: store.addItem,
        removeListing: store.removeItem,

        // Custom queries
        getListingById: store.getById,
        getListingBySlug: (slug: string) =>
            store.advancedFilter({
                where: { slug: { eq: slug } }
            })[0],

        getFeaturedListings: () =>
            store.advancedFilter({
                where: {
                    featured: { eq: true },
                    isActive: { eq: true }
                }
            }),

        getListingsByCategory: (category: Category) =>
            store.advancedFilter({
                where: {
                    category: { eq: category },
                    isActive: { eq: true }
                }
            }),

        getListingsByType: (type: ListingType) =>
            store.advancedFilter({
                where: {
                    listingType: { eq: type },
                    isActive: { eq: true }
                }
            }),

        getListingsByProvider: (providerId: string) =>
            store.advancedFilter({
                where: { providerId: { eq: providerId } }
            }),

        getListingsByUser: (userId: string) =>
            store.advancedFilter({
                where: { userId: { eq: userId } }
            }),

        getPublishedListings: () =>
            store.advancedFilter({
                where: {
                    publishedStatus: { eq: PublishedStatus.ACTIVE },
                    isActive: { eq: true }
                }
            }),

        searchListings: (query: string) =>
            store.search(query, ['title', 'description']),

        getTopRatedListings: (limit = 10) =>
            store.advancedFilter({
                where: {
                    isActive: { eq: true }
                },
                limit
            })
                .filter(item => item.averageRating !== undefined)
                .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
                .slice(0, limit),

        getMostLikedListings: (limit = 10) =>
            store.advancedFilter({
                where: {
                    isActive: { eq: true }
                },
                limit
            }).sort((a, b) => b.likesCount - a.likesCount)
                .slice(0, limit),

        // Rating and likes management
        incrementLikes: store.incrementLikes,
        updateRating: store.updateRating,

        // Utility methods
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useListingStore };