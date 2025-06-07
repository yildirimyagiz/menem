import { create } from "zustand"; // Import CreatePropertyInput and UpdatePropertyInput

import type { Property } from "@acme/db";
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@acme/validators";

import type { PropertyFilterParams } from "~/app/[locale]/filters/PropertyFilter.jsx";

interface PropertyResponse {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Define state types
interface PropertyState {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  selectedProperty: Property | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: Error | null;
  filters: PropertyFilterParams;
}

// Define action types
interface PropertyActions {
  setFilters: (filters: Partial<PropertyFilterParams>) => void;
  fetchProperties: () => Promise<void>;
  fetchProperty: (id: string) => Promise<Property>;
  createProperty: (data: any) => Promise<Property>; // Replace 'any' with actual type if available
  updateProperty: (id: string, data: any) => Promise<Property>; // Replace 'any' with actual type if available
  deleteProperty: (id: string) => Promise<void>;
  clearSelectedProperty: () => void;
}

// Create store
export const usePropertyStore = create<PropertyState & PropertyActions>(
  (set, get) => ({
    // Initial state
    properties: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    selectedProperty: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    filters: {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      title: undefined,
      type: undefined,
      status: undefined,
      condition: undefined,
      locationId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minSize: undefined,
      maxSize: undefined,
      minBedrooms: undefined,
      maxBedrooms: undefined,
      minBathrooms: undefined,
      maxBathrooms: undefined,
      buildYearStart: undefined,
      buildYearEnd: undefined,
      features: undefined,
      propertyAmenities: undefined,
      facilityAmenities: undefined,
      locationAmenities: undefined,
      furnished: undefined,
      petFriendly: undefined,
      featured: undefined,
      hasVirtualTour: undefined,
      hasVideo: undefined,
      availableFrom: undefined,
      availableTo: undefined,
      isActive: undefined,
      createdAtStart: undefined,
      createdAtEnd: undefined,
      updatedAtStart: undefined,
      updatedAtEnd: undefined,
    },

    // Actions
    setFilters: (filters: Partial<PropertyFilterParams>) => {
      set((state) => ({
        filters: { ...state.filters, ...filters },
      }));
    },

    fetchProperties: async () => {
      try {
        set({ isLoading: true, error: null });

        const searchParams = new URLSearchParams();
        const currentFilters = get().filters;
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });

        const response = await fetch(
          `/api/properties?${searchParams.toString()}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message ?? "Failed to fetch properties",
          );
        }

        const data = (await response.json()) as ApiResponse<PropertyResponse>;
        if (data.error) {
          throw new Error(data.error.message);
        }

        // Validate response data
        if (!data.data || !Array.isArray(data.data.properties)) {
          throw new Error("Invalid response format");
        }

        set({
          properties: data.data.properties,
          totalCount: data.data.totalCount,
          currentPage: data.data.currentPage,
          totalPages: data.data.totalPages,
          isLoading: false,
        });
      } catch (error) {
        set({ isLoading: false, error: error as Error });
      }
    },

    fetchProperty: async (id: string) => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch property");
        }

        const data = await response.json();
        set({ selectedProperty: data });
        return data as Property;
      } catch (error) {
        set({ error: error as Error });
        throw error;
      }
    },

    createProperty: async (data: CreatePropertyInput) => {
      try {
        set({ isCreating: true, error: null });

        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create property");
        }

        const createdProperty = await response.json();
        set((state) => ({
          properties: [...state.properties, createdProperty],
          isCreating: false,
        }));
        return createdProperty as Property;
      } catch (error) {
        set({ isCreating: false, error: error as Error });
        throw error;
      }
    },

    updateProperty: async (id: string, data: UpdatePropertyInput) => {
      try {
        set({ isUpdating: true, error: null });

        const response = await fetch(`/api/properties/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update property");
        }

        const updatedProperty = await response.json();
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? updatedProperty : p,
          ),
          selectedProperty:
            state.selectedProperty?.id === id
              ? updatedProperty
              : state.selectedProperty,
          isUpdating: false,
        }));
        return updatedProperty as Property;
      } catch (error) {
        set({ isUpdating: false, error: error as Error });
        throw error;
      }
    },

    deleteProperty: async (id: string) => {
      try {
        set({ isDeleting: true, error: null });

        const response = await fetch(`/api/properties/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete property");
        }

        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
          selectedProperty:
            state.selectedProperty?.id === id ? null : state.selectedProperty,
          isDeleting: false,
        }));
      } catch (error) {
        set({ isDeleting: false, error: error as Error });
        throw error;
      }
    },

    clearSelectedProperty: () => {
      set({ selectedProperty: null });
    },
  }),
);
