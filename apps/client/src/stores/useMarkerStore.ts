import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Marker {
    id: string;
    cuid: string;
    markerType: string;
    slug: string;
    latitude: number;
    longitude: number;
    locationId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

interface MarkerStore {
    marker: Marker | null;
    markers: Marker[];
    isLoading: boolean;

    setMarker: (marker: Marker) => void;
    updateMarker: (marker: Partial<Marker>) => void;
    clearMarker: () => void;
    setMarkers: (markers: Marker[]) => void;
    addMarker: (marker: Marker) => void;
    removeMarker: (markerId: string) => void;

    getMarkersByType: (markerType: string) => Marker[];
    getMarkersByLocation: (locationId: string) => Marker[];
    getMarkersInBounds: (bounds: {
        north: number;
        south: number;
        east: number;
        west: number
    }) => Marker[];
}

export const useMarkerStore = create<MarkerStore>()(
    devtools((set, get) => ({
        marker: null,
        markers: [],
        isLoading: false,

        setMarker: (marker) => set({ marker }),
        updateMarker: (markerUpdate) => set((state) => ({
            marker: state.marker ? { ...state.marker, ...markerUpdate } : null,
            markers: state.markers.map(m =>
                m.id === state.marker?.id ? { ...m, ...markerUpdate } : m
            )
        })),
        clearMarker: () => set({ marker: null }),

        setMarkers: (markers) => set({ markers }),
        addMarker: (marker) => set((state) => ({
            markers: [...state.markers, marker]
        })),
        removeMarker: (markerId) => set((state) => ({
            markers: state.markers.filter(m => m.id !== markerId)
        })),

        getMarkersByType: (markerType) => {
            const { markers } = get();
            return markers.filter(m => m.markerType === markerType);
        },

        getMarkersByLocation: (locationId) => {
            const { markers } = get();
            return markers.filter(m => m.locationId === locationId);
        },

        getMarkersInBounds: (bounds) => {
            const { markers } = get();
            return markers.filter(m =>
                m.latitude <= bounds.north &&
                m.latitude >= bounds.south &&
                m.longitude <= bounds.east &&
                m.longitude >= bounds.west
            );
        }
    }))
); 