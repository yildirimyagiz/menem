import type {
    NotificationType,
    Message,
    Listing,
    Offer,
    Reservation,
    Payment,
    BitcoinPayment,
    Refund,
    Insurance,
    Help,
    CleaningSupport,
    Review,
    Expense,
    Task,
    Hotel,
    Mention
} from '~/utils/types';
import { createBaseStore } from './createBaseStore';
import { useSession } from "next-auth/react";

// Define the Notification interface
interface Notification {
    id: string;
    cuid: string;
    name: string;
    title: string;
    image: string;
    link?: string;
    type: NotificationType;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    readAt?: Date;
    deletedAt?: Date;
    userId: string;
    messageId?: string;
    mentionId?: string;
    message?: Message;
    listingId?: string;
    listing?: Listing;
    offerId?: string;
    offer?: Offer;
    reservationId?: string;
    reservation?: Reservation;
    paymentId?: string;
    payment?: Payment;
    bitcoinPaymentId?: string;
    bitcoinPayment?: BitcoinPayment;
    refundId?: string;
    refund?: Refund;
    insuranceId?: string;
    insurance?: Insurance;
    helpId?: string;
    help?: Help;
    cleaningSupportId?: string;
    cleaningSupport?: CleaningSupport;
    reviewId?: string;
    review?: Review;
    expenseId?: string;
    expense?: Expense;
    taskId?: string;
    task?: Task;
    hotelId?: string;
    hotel?: Hotel;
    mentions: Mention[];
}

// Create the base store
const baseStore = createBaseStore<Notification>({
    name: 'notification-store',
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
        serialize: (notification: Notification) => ({
            ...notification,
            createdAt: notification.createdAt.toISOString(),
            updatedAt: notification.updatedAt.toISOString(),
            readAt: notification.readAt?.toISOString(),
            deletedAt: notification.deletedAt?.toISOString(),
        }),
        deserialize: (data: any) => ({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            readAt: data.readAt ? new Date(data.readAt) : undefined,
            deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
        }),
    },
});

// Extend the base store with notification-specific functionality
const useNotificationStore = () => {
    const store = baseStore();

    return {
        ...store,
        updateNotification: (notification: Notification, options: { type: "update" }) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map((item) =>
                item.id === notification.id ? notification : item
            );
            store.setItems(updatedItems);

            if (store.data?.id === notification.id) {
                store.setItem(notification);
            }
        }
    };
};

// Create custom hooks using the extended store
export const useNotifications = () => {
    const store = useNotificationStore();
    const { data: session } = useSession();

    return {
        // Basic state
        notification: store.data,
        notifications: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions
        setNotification: store.setItem,
        updateNotification: store.updateNotification,
        clearNotification: store.clearItem,
        setNotifications: store.setItems,
        addNotification: store.addItem,
        removeNotification: store.removeItem,

        // Custom queries using base store methods
        getNotificationById: store.getById,
        getNotificationsByType: (type: NotificationType) =>
            store.advancedFilter({
                where: { type: { eq: type } }
            }),
        getUnreadNotifications: () =>
            store.advancedFilter({
                where: {
                    isRead: { eq: false },
                    deletedAt: { eq: undefined }
                }
            }),
        getNotificationsByUser: (userId: string) =>
            store.advancedFilter({
                where: { userId: { eq: userId } }
            }),

        // Additional custom queries
        markAsRead: (notificationId: string) =>
            store.updateNotification({
                id: notificationId,
                isRead: true,
                readAt: new Date(),
                cuid: '',
                name: '',
                title: '',
                image: '',
                type: 'MESSAGE',
                content: '',

                createdAt: new Date(),
                updatedAt: new Date(),
                userId: '',
                mentions: []
            }, { type: "update" }),

        markAllAsRead: (userId: string) => {
            const userNotifications = store.items.filter(n => n.userId === userId);
            userNotifications.forEach(notification => {
                store.updateNotification({
                    ...notification,
                    isRead: true,
                    readAt: new Date()
                }, { type: "update" });
            });
        },

        // User-specific methods
        getCurrentUserNotifications: () =>
            store.advancedFilter({
                where: {
                    userId: { eq: session?.user.id ?? "" },
                    deletedAt: { eq: undefined }
                }
            }),

        markAllAsReadForCurrentUser: () => {
            if (session?.user.id) {
                const userNotifications = store.items.filter(n =>
                    n.userId === session.user.id && !n.isRead
                );
                userNotifications.forEach(notification => {
                    store.updateNotification({
                        id: notification.id,
                        isRead: true,
                        readAt: new Date(),
                        cuid: '',
                        name: '',
                        title: '',
                        image: '',
                        type: 'MESSAGE',
                        content: '',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        userId: '',
                        mentions: []
                    }, { type: "update" });
                });
            }
        },

        // Utility methods
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useNotificationStore };