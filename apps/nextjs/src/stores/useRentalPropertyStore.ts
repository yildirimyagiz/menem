import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Price, Room, Expense, Payment, Insurance, User, Report, Task, Workflow } from '~/utils/types';
import { Status } from '~/utils/types';

interface RentalProperty {
    id: string;
    cuid: string;
    title: string;
    description: string;
    price: Price[];
    sizePrefix?: string;
    room: Room;
    bathroom: number;
    size: number;
    sizeUnit: string;
    floor: number;
    insuranceId?: string;
    ownerId: string;
    status: Status;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    // Relations
    expenses?: Expense[];
    payments?: Payment[];
    insurance?: Insurance;
    owner?: User;
    followedBy?: User[];
    reports?: Report[];
    tasks?: Task[];
    workflows?: Workflow[];
}

interface RentalPropertyStore {
    property: RentalProperty | null;
    properties: RentalProperty[];
    isLoading: boolean;
    filters: {
        status?: Status;
        ownerId?: string;
        roomId?: string;
        minSize?: number;
        maxSize?: number;
        minBathrooms?: number;
        floor?: number;
    };

    setProperty: (property: RentalProperty) => void;
    updateProperty: (property: Partial<RentalProperty>) => void;
    clearProperty: () => void;
    setProperties: (properties: RentalProperty[]) => void;
    addProperty: (property: RentalProperty) => void;
    removeProperty: (propertyId: string) => void;
    setFilters: (filters: Partial<RentalPropertyStore['filters']>) => void;

    getFilteredProperties: () => RentalProperty[];
    getPropertiesByOwner: (ownerId: string) => RentalProperty[];
    getPropertiesByStatus: (status: Status) => RentalProperty[];
    getAvailableProperties: () => RentalProperty[];
    getPropertyStatistics: () => {
        totalProperties: number;
        availableProperties: number;
        rentedProperties: number;
        averageSize: number;
    };
}

export const useRentalPropertyStore = create<RentalPropertyStore>()(
    devtools((set, get) => ({
        property: null,
        properties: [],
        isLoading: false,
        filters: {},

        setProperty: (property) => set({ property }),
        updateProperty: (propertyUpdate) => set((state) => ({
            property: state.property ? { ...state.property, ...propertyUpdate } : null,
            properties: state.properties.map(p =>
                p.id === state.property?.id ? { ...p, ...propertyUpdate } : p
            )
        })),
        clearProperty: () => set({ property: null }),

        setProperties: (properties) => set({ properties }),
        addProperty: (property) => set((state) => ({
            properties: [...state.properties, property]
        })),
        removeProperty: (propertyId) => set((state) => ({
            properties: state.properties.filter(p => p.id !== propertyId)
        })),

        setFilters: (newFilters) => set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

        getFilteredProperties: () => {
            const { properties, filters } = get();
            return properties.filter(property => {
                if (filters.status && property.status !== filters.status) return false;
                if (filters.ownerId && property.ownerId !== filters.ownerId) return false;
                if (filters.roomId && property.roomId !== filters.roomId) return false;
                if (filters.minSize && property.size < filters.minSize) return false;
                if (filters.maxSize && property.size > filters.maxSize) return false;
                if (filters.minBathrooms && property.bathroom < filters.minBathrooms) return false;
                if (filters.floor && property.floor !== filters.floor) return false;
                return !property.deletedAt;
            });
        },

        getPropertiesByOwner: (ownerId) => {
            const { properties } = get();
            return properties.filter(p => p.ownerId === ownerId && !p.deletedAt);
        },

        getPropertiesByStatus: (status) => {
            const { properties } = get();
            return properties.filter(p => p.status === status && !p.deletedAt);
        },

        getAvailableProperties: () => {
            const { properties } = get();
            return properties.filter(p => p.status === Status.Available && !p.deletedAt);
        },

        getPropertyStatistics: () => {
            const { properties } = get();
            const activeProperties = properties.filter(p => !p.deletedAt);

            const totalProperties = activeProperties.length;
            const availableProperties = activeProperties.filter(p => p.status === Status.Available).length;
            const rentedProperties = activeProperties.filter(p => p.status === Status.Rented).length;
            const averageSize = activeProperties.reduce((sum, p) => sum + p.size, 0) / totalProperties || 0;

            return {
                totalProperties,
                availableProperties,
                rentedProperties,
                averageSize
            };
        }
    }))
);