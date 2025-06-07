import type { z } from "zod";

import type { FacilityType } from "@acme/db";
import type {
  BuildingClass,
  ContactMethod,
  EnergyRating,
  GreenCertification,
  HeatingType,
  OwnershipCategory,
  OwnershipType,
  ParkingType,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@acme/validators";

import type {
  FacilityAmenities,
  LocationAmenities,
  Property,
  PropertyAmenities,
} from "~/utils/interfaces";

// Convert Zod enums to TypeScript types
export type PropertyType = z.infer<typeof PropertyType>;
export type PropertyStatus = z.infer<typeof PropertyStatus>;
export type PropertyCondition = z.infer<typeof PropertyCondition>;
export type PropertyFeatures = z.infer<typeof PropertyFeatures>;
export type PropertyCategory = z.infer<typeof PropertyCategory>;
export type BuildingClass = z.infer<typeof BuildingClass>;
export type EnergyRating = z.infer<typeof EnergyRating>;
export type ParkingType = z.infer<typeof ParkingType>;
export type HeatingType = z.infer<typeof HeatingType>;
export type GreenCertification = z.infer<typeof GreenCertification>;
export type OwnershipType = z.infer<typeof OwnershipType>;
export type OwnershipCategory = z.infer<typeof OwnershipCategory>;
export type ContactMethod = z.infer<typeof ContactMethod>;

// Define filter option types
export interface FilterOption {
  id: string;
  label: string;
  value: string | number | boolean | (string | number)[];
  icon?: React.ReactNode;
  isSelected?: boolean;
}

export interface FilterCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  type: "select" | "range" | "checkbox" | "radio";
  allowMultiple?: boolean;
}

// Base property filter parameters
export interface PropertyFilterParams {
  // Pagination and sorting
  page?: number;
  pageSize?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "price" | "size";
  sortOrder: "asc" | "desc";

  // Basic info
  title?: string;
  propertyType?: PropertyType;
  propertyStatus?: PropertyStatus;
  category?: PropertyCategory;
  condition?: PropertyCondition;
  locationId?: string;

  // Property details
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  buildYearStart?: number;
  buildYearEnd?: number;

  // Features and Amenities
  features?: PropertyFeatures[];
  propertyAmenities?: PropertyAmenities[];
  facilityAmenities?: FacilityType[];
  locationAmenities?: LocationAmenities[];
  buildingClass?: BuildingClass;
  energyRating?: EnergyRating;
  parkingType?: ParkingType;
  heatingType?: HeatingType;
  greenCertification?: GreenCertification;

  // Ownership
  ownershipType?: OwnershipType;
  ownershipCategory?: OwnershipCategory;

  // Contact
  contactMethod?: ContactMethod;

  // Additional filters
  furnished?: boolean;
  petFriendly?: boolean;
  featured?: boolean;
  hasVirtualTour?: boolean;
  hasVideo?: boolean;
  isActive?: boolean;

  // Date filters
  createdAtStart?: Date;
  createdAtEnd?: Date;
  updatedAtStart?: Date;
  updatedAtEnd?: Date;
  listedAtFrom?: Date;
  listedAtTo?: Date;
}

// Default filter parameters
export const defaultPropertyFilterParams: PropertyFilterParams = {
  page: 1,
  limit: 12,
  sortBy: "createdAt",
  sortOrder: "desc",
  propertyType: undefined,
  propertyStatus: undefined,
  category: undefined,
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
  buildingClass: undefined,
  energyRating: undefined,
  parkingType: undefined,
  heatingType: undefined,
  greenCertification: undefined,
  ownershipType: undefined,
  ownershipCategory: undefined,
  contactMethod: undefined,
  furnished: undefined,
  petFriendly: undefined,
  featured: undefined,
  hasVirtualTour: undefined,
  hasVideo: undefined,
  isActive: undefined,
  createdAtStart: undefined,
  createdAtEnd: undefined,
  updatedAtStart: undefined,
  updatedAtEnd: undefined,
  listedAtFrom: undefined,
  listedAtTo: undefined,
};

// Property type options
export const typeOfProperty = [
  {
    type: "RESIDENTIAL",
    name: "Residential",
    description: "Homes and apartments",
  },
  {
    type: "COMMERCIAL",
    name: "Commercial",
    description: "Offices and shops",
  },
  {
    type: "LAND",
    name: "Land",
    description: "Land properties",
  },
  {
    type: "INDUSTRIAL",
    name: "Industrial",
    description: "Industrial properties",
  },
  {
    type: "MIXED_USE",
    name: "Mixed Use",
    description: "Properties with multiple uses",
  },
];

// Status options
export const statusOptions = [
  {
    type: "AVAILABLE",
    name: "Available",
    description: "Property is currently available",
  },
  {
    type: "PENDING",
    name: "Pending",
    description: "Property is pending sale or rental",
  },
  {
    type: "SOLD",
    name: "Sold",
    description: "Property has been sold",
  },
  {
    type: "RENTED",
    name: "Rented",
    description: "Property has been rented",
  },
];

// Sort options
export const propertiesSortOptions = [
  {
    value: "price",
    label: "Price",
    description: "Sort by property price",
  },
  {
    value: "size",
    label: "Size",
    description: "Sort by property size",
  },
  {
    value: "createdAt",
    label: "Date Created",
    description: "Sort by listing date",
  },
];

// Property filter handlers
export interface PropertyFilterHandlers {
  onFilterChange?: (filters: Partial<PropertyFilterParams>) => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onTitleSearch?: (title: string) => void;
  onTypeChange?: (type: PropertyType) => void;
  onStatusChange?: (status: PropertyStatus) => void;
  onPriceRangeChange?: (min: number, max: number) => void;
  onSizeRangeChange?: (min: number, max: number) => void;
  onLocationChange?: (locationId: string) => void;
  onFeaturesChange?: (features: {
    furnished?: boolean;
    petFriendly?: boolean;
    hasVirtualTour?: boolean;
    hasVideo?: boolean;
  }) => void;
  onAvailabilityChange?: (dateRange: { start?: Date; end?: Date }) => void;
  isLoading?: boolean;
}

// Combined props type
export type PropertyFilterProps = PropertyFilterParams & PropertyFilterHandlers;

// Utility functions
export const propertyFilterUtils = {
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  },

  formatSize: (size: number, prefix = "sqft"): string => {
    return `${size.toLocaleString()} ${prefix}`;
  },

  slugify: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  },

  getPropertyTypeLabel: (type: PropertyType): string => {
    return typeOfProperty.find((opt) => opt.type === type)?.name ?? type;
  },
};

// Search helper functions
export const propertiesSearchUtils = {
  searchByTitle: (properties: Property[], query: string): Property[] => {
    const searchTerm = query.toLowerCase();
    return properties.filter((property) =>
      property.title.toLowerCase().includes(searchTerm),
    );
  },

  filterByPriceRange: (
    properties: Property[],
    min: number,
    max: number,
  ): Property[] => {
    return properties.filter((property) => {
      const price = property.marketValue ?? 0;
      return price >= min && price <= max;
    });
  },

  filterByType: (properties: Property[], type: PropertyType): Property[] => {
    return properties.filter((property) => property.propertyType === type);
  },

  filterByLocation: (
    properties: Property[],
    locationId: string,
  ): Property[] => {
    return properties.filter((property) => property.locationId === locationId);
  },
};
