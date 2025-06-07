import type {
  Car,
  CarFeature,
  Condition,
  Currency,
  DriveType,
  FuelType,
  ListingType,
  PublishedStatus,
  Transmission,
  VehicleType,
} from "~/utils/types";
import { CarStatus } from "~/utils/types";
import { createBaseStore } from "./createBaseStore";

// Define the Car interface

interface SerializedCar
  extends Omit<
    Car,
    "availabilityDate" | "createdAt" | "updatedAt" | "deletedAt"
  > {
  availabilityDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Create the base store
const baseStore = createBaseStore<Car>({
  name: "car-store",
  persist: true,
  version: 1,
  logging: {
    enabled: true,
    level: "debug",
  },
  cache: {
    ttl: 1000 * 60 * 5, // 5 minutes
    maxSize: 100,
  },
  transformers: {
    serialize: (car: Car): SerializedCar => ({
      ...car,
      availabilityDate: car.availabilityDate.toISOString(),
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
      deletedAt: car.deletedAt?.toISOString(),
      price: {
        ...car.price,
        finalAmount: Number(car.price.finalAmount),
        baseAmount: Number(car.price.baseAmount),
        currency: car.price.currency,
        isActive: car.price.isActive,
      },
    }),
    deserialize: (data: SerializedCar): Car => ({
      ...data,
      availabilityDate: new Date(data.availabilityDate),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
    }),
  },
});

// Extend the base store with additional functionality
const useCarStore = () => {
  const store = baseStore();

  return {
    ...store,
    updateCar: (car: Car, _options: { type: "update" }) => {
      const currentItems = store.items;
      const updatedItems = currentItems.map((item) =>
        item.id === car.id ? car : item,
      );
      store.setItems(updatedItems);

      if (store.data?.id === car.id) {
        store.setItem(car);
      }
    },
  };
};

// Create custom hooks using the extended store
export const useCars = () => {
  const store = useCarStore();

  return {
    // Basic state
    car: store.data,
    cars: store.items,
    isLoading: store.isLoading,
    error: store.error,

    // Basic actions
    setCar: store.setItem,
    updateCar: store.updateCar,
    clearCar: store.clearItem,
    setCars: store.setItems,
    addCar: store.addItem,
    removeCar: store.removeItem,

    // Custom queries using base store methods
    getCarById: store.getById,
    getCarsByType: (type: VehicleType) =>
      store.advancedFilter({
        where: { type: { eq: type } },
      }),
    getActiveCars: () =>
      store.advancedFilter({
        where: {
          status: { eq: CarStatus.New },
          deletedAt: { eq: undefined },
        },
      }),

    // Additional custom queries
    searchCars: (query: string) =>
      store.search(query, ["title", "description", "brand", "model"]),

    getCarsByLocation: (locationId: string) =>
      store.advancedFilter({
        where: { locationId: { eq: locationId } },
      }),

    getCarsByUser: (userId: string) =>
      store.advancedFilter({
        where: { userId: { eq: userId } },
      }),

    getCarsByPrice: (maxPrice: number) =>
      store.advancedFilter({
        where: { saleOff: { lte: maxPrice } },
      }),

    getCarsByBrand: (brand: string) =>
      store.advancedFilter({
        where: { brand: { eq: brand } },
      }),

    getCarsByYear: (minYear: number) =>
      store.advancedFilter({
        where: { year: { gte: minYear } },
      }),

    getFeaturedCars: () =>
      store.advancedFilter({
        where: { featured: { eq: true } },
      }),

    getCarsByTransmission: (transmission: Transmission) =>
      store.advancedFilter({
        where: { transmission: { eq: transmission } },
      }),

    getCarsByFuelType: (fuelType: FuelType) =>
      store.advancedFilter({
        where: { fuelType: { eq: fuelType } },
      }),

    // Utility methods
    resetStore: store.resetState,
    setLoading: store.setLoading,
    setError: (error: Error | null) => store.setError(error),
  };
};

export { useCarStore };
