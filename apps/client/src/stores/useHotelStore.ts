import type {
  Agency,
  Availability,
  CleaningSupport,
  Contact,
  Document,
  Facility,
  FacilityAmenities,
  Guest,
  Hotel,
  HotelAmenity,
  HotelStaff,
  HotelType,
  ImageRecognition,
  Listing,
  ListingType,
  LocationAmenities,
  Photo,
  Price,
  Property,
  PropertyAmenities,
  PropertyRoom,
  PropertyType,
  PublishedStatus,
  Report,
  Reservation,
  ReservationPolicy,
  Review,
  Status,
  Statuses,
  Task,
  User,
  Workflow,
} from "~/utils/types";
import { createBaseStore } from "./createBaseStore";

// Serialized Hotel Interface
interface SerializedHotel
  extends Omit<
    Hotel,
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "availabilityDate"
    | "checkInTime"
    | "checkOutTime"
  > {
  createdAt: Date; // Serialized creation date as Date
  updatedAt: Date; // Serialized last updated date as Date
  deletedAt?: Date | null; // Serialized deletion date as Date or null
  availabilityDate: string; // Serialized availability date as string
  checkInTime?: string | null; // Serialized check-in time as string
  checkOutTime?: string | null; // Serialized check-out time as string
}

// Create the base store first
const baseStore = createBaseStore<Hotel>({
  name: "hotel-store",
  persist: true,
  version: 1,
  logging: {
    enabled: true,
    level: "debug",
  },
  cache: {
    ttl: 1000 * 60 * 5,
    maxSize: 100,
  },
  transformers: {
    serialize: (hotel: Hotel): SerializedHotel => ({
      ...hotel,
      createdAt: hotel.createdAt, // Convert Date to Date
      updatedAt: hotel.updatedAt,
      deletedAt: hotel.deletedAt ?? undefined,
      availabilityDate: hotel.availabilityDate?.toString() ?? "", // Ensure toString() for Date
      checkInTime: hotel.checkInTime ? hotel.checkInTime.toString() : null, // Serialize checkInTime
      checkOutTime: hotel.checkOutTime ? hotel.checkOutTime.toString() : null, // Serialize checkOutTime
    }),
    deserialize: (data: SerializedHotel): Hotel => ({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
      availabilityDate: new Date(data.availabilityDate), // Convert string back to Date
      checkInTime: data.checkInTime ? new Date(data.checkInTime) : null, // Convert checkInTime back to Date
      checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : null, // Convert checkOutTime back to Date
    }),
  },
});

// Extend the base store with additional functionality
const useHotelStore = () => {
  const store = baseStore();

  return {
    ...store,
    updateHotel: (
      hotelUpdate: Partial<Hotel>,
      _options: { type: "update" },
    ) => {
      if (!hotelUpdate.id) {
        console.error("Hotel ID is missing for update");
        return;
      }
      const currentItems = store.items;
      const updatedItems = currentItems.map((item) =>
        item.id === hotelUpdate.id ? { ...item, ...hotelUpdate } : item,
      );
      store.setItems(updatedItems);
      if (store.data?.id === hotelUpdate.id) {
        store.setItem({ ...store.data, ...hotelUpdate } as Hotel);
      }
    },
  };
};

// Create custom hooks using the extended store
export const useHotels = () => {
  const store = useHotelStore();

  return {
    // Basic state
    hotel: store.data,
    hotels: store.items,
    isLoading: store.isLoading,
    error: store.error,

    // Basic actions
    setHotel: store.setItem,
    updateHotel: store.updateHotel,
    clearHotel: store.clearItem,
    setHotels: store.setItems,
    addHotel: store.addItem,
    removeHotel: store.removeItem,

    // Custom queries
    getHotelById: store.getById,
    getHotelsByType: (hotelType: HotelType) =>
      store.advancedFilter({
        where: { hotelType: { eq: hotelType } },
      }),
    getActiveHotels: () =>
      store.advancedFilter({
        where: {
          status: { eq: "Active" },
          deletedAt: { eq: undefined },
        },
      }),
    getFeaturedHotels: () =>
      store.advancedFilter({
        where: { featured: { eq: true } },
      }),

    // Search functionality
    searchHotels: (query: string) =>
      store.search(query, ["name", "description", "locationId"]),

    // Filter methods
    getHotelsByLocation: (locationId: string) =>
      store.advancedFilter({
        where: { locationId: { eq: locationId } },
      }),

    getHotelsByStatus: (status: Statuses) =>
      store.advancedFilter({
        where: { status: { eq: status } },
      }),

    getHotelsByAmenities: (amenities: HotelAmenity[]) =>
      store.advancedFilter({
        where: { amenities: { in: [amenities] } },
      }),

    getAvailableHotels: (date: Date) =>
      store.advancedFilter({
        where: {
          availabilityDate: { eq: date },
          status: { eq: "Active" },
          deletedAt: { eq: undefined },
        },
      }),

    // Utility methods
    resetStore: store.resetState,
    setLoading: store.setLoading,
    setError: (error: Error | null) => store.setError(error),
  };
};

export { useHotelStore };
