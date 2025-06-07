import type { PaymentType, PaymentStatus } from '~/utils/types';
import { offerStatus } from '~/utils/types';
import { createBaseStore } from './createBaseStore';

// Define the Offer interface
interface Offer {
    id: string;
    cuid: string;
    name: string;
    description: string;
    amount: number;
    offerStatus: offerStatus;
    isPercentage: boolean;
    startDate: Date;
    endDate: Date;
    deadline: Date;
    paymentType: PaymentType;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    userId?: string;
    listingId?: string;
    helpId?: string;
}

// Define the SerializedOffer interface
interface SerializedOffer extends Omit<Offer, 'createdAt' | 'updatedAt' | 'deletedAt' | 'startDate' | 'endDate' | 'deadline'> {
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    startDate: string;
    endDate: string;
    deadline: string;
}

// Create the base store first
const baseStore = createBaseStore<Offer>({
    name: 'offer-store',
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
        serialize: (offer: Offer): SerializedOffer => ({
            ...offer,
            createdAt: offer.createdAt.toISOString(),
            updatedAt: offer.updatedAt.toISOString(),
            deletedAt: offer.deletedAt?.toISOString(),
            startDate: offer.startDate.toISOString(),
            endDate: offer.endDate.toISOString(),
            deadline: offer.deadline.toISOString(),
        }),
        deserialize: (data: SerializedOffer): Offer => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            deadline: new Date(data.deadline),
        }),
    },
});

// Extend the base store with additional functionality
const useOfferStore = () => {
    const store = baseStore();

    return {
        ...store,
        updateOffer: (offer: Offer, _options: { type: "update" }) => {
            // First get the current items
            const currentItems = store.items;
            // Create new array with updated offer
            const updatedItems = currentItems.map((item) =>
                item.id === offer.id ? offer : item
            );
            // Update items
            store.setItems(updatedItems);

            // Update current item if it matches
            if (store.data?.id === offer.id) {
                store.setItem(offer);
            }
        }
    };
};

// Create custom hooks using the extended store
export const useOffers = () => {
    const store = useOfferStore();

    return {
        // Basic state
        offer: store.data,
        offers: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions (inherited from base store)
        setOffer: store.setItem,
        updateOffer: store.updateOffer,
        clearOffer: store.clearItem,
        setOffers: store.setItems,
        addOffer: store.addItem,
        removeOffer: store.removeItem,

        // Custom queries using base store methods
        getOfferById: store.getById,
        getActiveOffers: () =>
            store.advancedFilter({
                where: {
                    offerStatus: { eq: offerStatus.Accepted },
                    deletedAt: { eq: undefined }
                }
            }),

        // Additional custom queries
        searchOffers: (query: string) =>
            store.search(query, ['name', 'description']),

        getOffersByUserId: (userId: string) =>
            store.advancedFilter({
                where: { userId: { eq: userId } }
            }),

        // Utility methods
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useOfferStore };