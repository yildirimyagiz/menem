import type { Review, User } from "~/utils/types";
import type { BaseEntity } from "./createBaseStore";
import { createBaseStore } from './createBaseStore';

// Define the ReviewWithUser interface
type ReviewWithUser = Omit<Review, 'createdAt' | 'updatedAt' | 'deletedAt'> & BaseEntity & {
    user: User | null;
    roomId: string | null;
};

// Create the base store
const baseStore = createBaseStore<ReviewWithUser>({
    name: 'review-store',
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
        serialize: (review: ReviewWithUser) => {
            if (!review.createdAt || !review.updatedAt) {
                throw new Error('Missing required date fields');
            }
            return {
                ...review,
                createdAt: review.createdAt.toISOString(),
                updatedAt: review.updatedAt.toISOString(),
                deletedAt: review.deletedAt?.toISOString(),
            };
        },
        deserialize: (serializedData: {
            id: string;
            userId: string;
            content: string;
            stars: number | null;
            user: User | null;
            reviewCount: number | null;
            averageRating: number | null;
            listingId: string | null;
            propertyId: string | null;
            hotelId: string | null;
            roomId: string | null;
            reservationId: string | null;
            parentId: string | null;
            date: Date | null;
            hotelStaffId: string | null;
            createdAt: string;
            updatedAt: string;
            deletedAt?: string;
            [key: string]: unknown;
        }): ReviewWithUser => {
            const review = {
                ...serializedData,
                createdAt: new Date(serializedData.createdAt),
                updatedAt: new Date(serializedData.updatedAt),
                deletedAt: serializedData.deletedAt ? new Date(serializedData.deletedAt) : undefined,
            };
            return review as ReviewWithUser;
        },
    },
});

// Extend the base store
const useReviewStore = () => {
    const store = baseStore();

    return {
        ...store,
        updateReview: (review: ReviewWithUser) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map((item) =>
                item.id === review.id ? review : item
            );
            store.setItems(updatedItems);

            if (store.data?.id === review.id) {
                store.setItem(review);
            }
        }
    };
};

// Create custom hooks
export const useReviews = () => {
    const store = useReviewStore();

    return {
        // Basic state
        review: store.data,
        reviews: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions
        setReview: store.setItem,
        updateReview: store.updateReview,
        clearReview: store.clearItem,
        setReviews: store.setItems,
        addReview: store.addItem,
        removeReview: store.removeItem,

        // Custom queries
        getReviewById: store.getById,
        getReviewsByHotel: (hotelId: string) =>
            store.advancedFilter({
                where: { hotelId: { eq: hotelId } }
            }),
        getReviewsByUser: (userId: string) =>
            store.advancedFilter({
                where: { userId: { eq: userId } }
            }),

        // Additional queries
        searchReviews: (query: string) =>
            store.search(query, ['content']),

        // Utility methods
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useReviewStore };
