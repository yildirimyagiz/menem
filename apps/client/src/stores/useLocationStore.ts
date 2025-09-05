import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { BaseEntity } from './createBaseStore';

interface Location {
    id: string;
    cuid: string;
    title: string;
    unitNo?: number;
    block?: string;
    buildingNo?: number;
    details?: string;
    address: string;
    street: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
    countryCode: string;
    latitude?: number;
    longitude?: number;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface FilterState {
    city?: string;
    state?: string;
    country?: string;
    searchQuery?: string;
    radius?: number;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    page: number;
    limit: number;
}

// Modify Location type to match BaseEntity constraints
type LocationEntity = Location & BaseEntity;

interface LocationState {
    // Base store state
    data: LocationEntity | null;
    items: LocationEntity[];
    isLoading: boolean;
    error: Error | null;

    // Additional state
    filters: FilterState;
    totalCount: number;
    selectedLocation: LocationEntity | null;
    editedLocation: LocationEntity | null;
    editMode: boolean;
    currentPage: number;
    searchTerm: string;

    // Base store actions
    setItem: (item: LocationEntity, updates: { type: "set" | "update" | "add" }) => void;
    setItems: (items: LocationEntity[]) => void;
    updateItem: (id: string, updates: Partial<LocationEntity>) => void;
    addItem: (item: LocationEntity) => void;
    removeItem: (id: string) => void;
    clearItem: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: Error | null) => void;
    resetState: () => void;

    // Additional actions
    setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    setFilters: (newFilters: Partial<FilterState>) => void;
    resetFilters: () => void;
    setTotalCount: (count: number) => void;
    setSelectedLocation: (location: LocationEntity | null) => void;
    setEditedLocation: (location: LocationEntity | null) => void;
    setEditMode: (mode: boolean) => void;
    setCurrentPage: (page: number) => void;
    setSearchTerm: (term: string) => void;
    handleInputChange: <K extends keyof LocationEntity>(
        field: K,
        value: LocationEntity[K]
    ) => void;
}

const initialFilterState: FilterState = {
    page: 1,
    limit: 10
};

export const useLocationStore = create<LocationState>()(
    devtools(
        (set) => {
            return {
                // Base store state
                data: null,
                items: [],
                isLoading: false,
                error: null,

                // Additional state
                filters: initialFilterState,
                totalCount: 0,
                selectedLocation: null,
                editedLocation: null,
                editMode: false,
                currentPage: 1,
                searchTerm: "",

                // Base store actions
                setItem: (item, updates) => {
                    switch (updates.type) {
                        case "set":
                            set({ data: item });
                            break;
                        case "update":
                            set((state) => ({
                                items: state.items.map((i) =>
                                    i.id === item.id ? item : i
                                )
                            }));
                            break;
                        case "add":
                            set((state) => ({
                                items: [...state.items, item]
                            }));
                            break;
                    }
                },
                setItems: (items) => set({ items }),
                updateItem: (id, updates) => set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, ...updates } : item
                    )
                })),
                addItem: (item) => set((state) => ({
                    items: [...state.items, item]
                })),
                removeItem: (id) => set((state) => ({
                    items: state.items.filter((item) => item.id !== id)
                })),
                clearItem: () => set({ data: null }),
                setLoading: (loading) => set({ isLoading: loading }),
                setError: (error) => set({ error }),
                resetState: () => set({
                    data: null,
                    items: [],
                    isLoading: false,
                    error: null
                }),

                // Additional actions
                setFilter: (key, value) => set((state) => ({
                    filters: { ...state.filters, [key]: value }
                })),
                setFilters: (newFilters) => set((state) => ({
                    filters: { ...state.filters, ...newFilters }
                })),
                resetFilters: () => set({ filters: initialFilterState }),
                setTotalCount: (count) => set({ totalCount: count }),
                setSelectedLocation: (location) => set({ selectedLocation: location }),
                setEditedLocation: (location) => set({ editedLocation: location }),
                setEditMode: (mode) => set({ editMode: mode }),
                setCurrentPage: (page) => set({ currentPage: page }),
                setSearchTerm: (term) => set({ searchTerm: term }),
                handleInputChange: (field, value) => set((state) => ({
                    editedLocation: state.editedLocation
                        ? { ...state.editedLocation, [field]: value }
                        : null
                }))
            };
        },
        { name: 'location-store' }
    )
);

// Helper function to add a location
export const addLocation = (location: Location): void => {
    const { addItem } = useLocationStore.getState();
    const locationEntity: LocationEntity = {
        ...location,
        deletedAt: location.deletedAt ?? undefined,
    };
    addItem(locationEntity);
};

// Helper function to calculate distance between two coordinates
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};