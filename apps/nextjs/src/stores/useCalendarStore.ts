import { createBaseStore } from './createBaseStore';

// Define the Calendar interface
interface Calendar {
    id: string;
    date: Date;
    isBlocked: boolean;
    minNights?: number;
    maxNights?: number;
    maxGuests?: number;

    // Base pricing
    baseRate: number;

    // Dynamic pricing adjustments
    weekendRate?: number;
    weekdayRate?: number;
    weekendMultiplier?: number;
    weekdayMultiplier?: number;
    seasonalMultiplier?: number;

    // Availability
    availableUnits: number;
    minimumStay: number;
    maximumStay: number;
    discountSettings?: Record<string, unknown>;
    listingId: string;
    propertyId?: string;
    carId?: string;
    hotelId?: string;
    isBooked: boolean;
    reservationId?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface SerializedCalendar extends Omit<Calendar, 'date' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    date: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

// Create the base store
const baseCalendarStore = createBaseStore<Calendar>({
    name: 'calendar-store',
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
        serialize: (calendar: Calendar): SerializedCalendar => ({
            ...calendar,
            date: calendar.date.toISOString(),
            createdAt: calendar.createdAt.toISOString(),
            updatedAt: calendar.updatedAt.toISOString(),
            deletedAt: calendar.deletedAt?.toISOString(),
        }),
        deserialize: (data: SerializedCalendar): Calendar => ({
            ...data,
            date: new Date(data.date),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
        }),
    },
});

// Extend the base store with calendar-specific functionality
const useCalendarStore = () => {
    const store = baseCalendarStore();

    return {
        ...store,
        updateCalendar: (calendar: Calendar) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map((item) =>
                item.id === calendar.id ? calendar : item
            );
            store.setItems(updatedItems);

            if (store.data?.id === calendar.id) {
                store.setItem(calendar);
            }
        },
        calculatePrice: (calendarId: string, nights: number) => {
            const calendar = store.items.find(item => item.id === calendarId);
            if (!calendar) return null;

            let totalPrice = calendar.baseRate * nights;

            // Apply multipliers
            if (calendar.seasonalMultiplier) {
                totalPrice *= calendar.seasonalMultiplier;
            }

            return totalPrice;
        },
        blockDates: (dates: Date[]) => {
            const currentItems = store.items;
            const updatedItems = currentItems.map(item =>
                dates.some(date => date.getTime() === item.date.getTime())
                    ? { ...item, isBlocked: true }
                    : item
            );
            store.setItems(updatedItems);
        }
    };
};

// Create custom hooks using the extended store
export const useCalendars = () => {
    const store = useCalendarStore();

    return {
        // Basic state
        calendar: store.data,
        calendars: store.items,
        isLoading: store.isLoading,
        error: store.error,

        // Basic actions
        setCalendar: store.setItem,
        updateCalendar: store.updateCalendar,
        clearCalendar: store.clearItem,
        setCalendars: store.setItems,
        addCalendar: store.addItem,
        removeCalendar: store.removeItem,

        // Custom queries
        getCalendarById: store.getById,

        getAvailableDates: (listingId: string, startDate: Date, endDate: Date) =>
            store.advancedFilter({
                where: {
                    listingId: { eq: listingId },
                    isBlocked: { eq: false },
                    isBooked: { eq: false }
                }
            }).filter(calendar =>
                calendar.date >= startDate &&
                calendar.date <= endDate
            ),

        getBookedDates: (listingId: string) =>
            store.advancedFilter({
                where: {
                    listingId: { eq: listingId },
                    isBooked: { eq: true }
                }
            }),

        getBlockedDates: (listingId: string) =>
            store.advancedFilter({
                where: {
                    listingId: { eq: listingId },
                    isBlocked: { eq: true }
                }
            }),

        getCalendarByReservation: (reservationId: string) =>
            store.advancedFilter({
                where: { reservationId: { eq: reservationId } }
            }),

        getCalendarsByProperty: (propertyId: string) =>
            store.advancedFilter({
                where: { propertyId: { eq: propertyId } }
            }),

        getCalendarsByHotel: (hotelId: string) =>
            store.advancedFilter({
                where: { hotelId: { eq: hotelId } }
            }),

        checkAvailability: (
            listingId: string,
            startDate: Date,
            endDate: Date,
            guests: number
        ) => {
            const dates = store.advancedFilter({
                where: {
                    listingId: { eq: listingId },
                    isBlocked: { eq: false },
                    isBooked: { eq: false },
                    maxGuests: { gte: guests }
                }
            }).filter(calendar =>
                calendar.date >= startDate &&
                calendar.date <= endDate
            );

            return dates.length ===
                Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        },

        // Price calculations
        calculatePrice: store.calculatePrice,

        // Date management
        blockDates: store.blockDates,

        // Utility methods
        resetStore: store.resetState,
        setLoading: store.setLoading,
        setError: (error: Error | null) => store.setError(error),
    };
};

export { useCalendarStore };