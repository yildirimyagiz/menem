import type {
  BuildingClass,
  ContactMethod,
  EnergyRating,
  FacilityType,
  GreenCertification,
  HeatingType,
  LocationAmenities,
  OwnershipCategory,
  OwnershipType,
  ParkingType,
  Property,
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "~/utils/interfaces";

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
  limit?: number; // pageSize is not used in backend, prefer limit
  sortBy?: "createdAt" | "updatedAt" | "price" | "size";
  sortOrder: "asc" | "desc";

  // Basic info
  title?: string;
  propertyType?: PropertyType;
  propertyStatus?: PropertyStatus;
  category?: PropertyCategory;
  condition?: PropertyCondition;
  locationId?: string;

  // Property details - using range objects to match backend
  price?: {
    gte?: number;
    lte?: number;
  };
  size?: {
    gte?: number;
    lte?: number;
  };
  bedrooms?: {
    gte?: number;
    lte?: number;
  };
  bathrooms?: {
    gte?: number;
    lte?: number;
  };
  yearBuilt?: {
    gte?: number;
    lte?: number;
  };

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
  ownerId?: string;
  agencyId?: string;

  // Contact
  contactMethod?: ContactMethod;

  // Additional filters
  furnished?: boolean;
  featured?: boolean;
  isActive?: boolean;

  // Date filters (new format)
  createdAtFrom?: Date;
  createdAtTo?: Date;
  updatedAtFrom?: Date;
  updatedAtTo?: Date;
  listedAtFrom?: Date;
  listedAtTo?: Date;

  // Legacy date filters (will be transformed to new format)
  createdAtStart?: Date;
  createdAtEnd?: Date;
  updatedAtStart?: Date;
  updatedAtEnd?: Date;

  // Legacy fields (kept for backward compatibility)
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
}

// Default filter parameters
export const defaultPropertyFilterParams: PropertyFilterParams = {
  // Pagination and sorting
  page: 1,
  limit: 12,
  sortBy: "createdAt",
  sortOrder: "desc",

  // Ranges
  price: {},
  size: {},
  bedrooms: {},
  bathrooms: {},
  yearBuilt: {},

  // Arrays
  features: [],
  propertyAmenities: [],
  facilityAmenities: [],
  locationAmenities: [],

  // Other fields
  isActive: true,
  featured: false,

  // Legacy fields (initialize to undefined)
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
  onBedroomsRangeChange?: (min: number, max: number) => void;
  onBathroomsRangeChange?: (min: number, max: number) => void;
  onYearBuiltRangeChange?: (min: number, max: number) => void;
  onLocationChange?: (locationId: string) => void;
  onFeaturesChange?: (features: {
    furnished?: boolean;
    featured?: boolean;
  }) => void;
  onDateRangeChange?: (params: {
    createdAtFrom?: Date;
    createdAtTo?: Date;
    updatedAtFrom?: Date;
    updatedAtTo?: Date;
    listedAtFrom?: Date;
    listedAtTo?: Date;
  }) => void;
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

  // Transform legacy flat filters to range-based filters
  transformToRangeFilters: (
    filters: Partial<PropertyFilterParams>,
  ): Partial<PropertyFilterParams> => {
    const transformed = { ...filters };

    // Transform price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      transformed.price = {
        gte: filters.minPrice,
        lte: filters.maxPrice,
      };
      delete transformed.minPrice;
      delete transformed.maxPrice;
    }

    // Transform size range
    if (filters.minSize !== undefined || filters.maxSize !== undefined) {
      transformed.size = {
        gte: filters.minSize,
        lte: filters.maxSize,
      };
      delete transformed.minSize;
      delete transformed.maxSize;
    }

    // Transform bedrooms range
    if (
      filters.minBedrooms !== undefined ||
      filters.maxBedrooms !== undefined
    ) {
      transformed.bedrooms = {
        gte: filters.minBedrooms,
        lte: filters.maxBedrooms,
      };
      delete transformed.minBedrooms;
      delete transformed.maxBedrooms;
    }

    // Transform bathrooms range
    if (
      filters.minBathrooms !== undefined ||
      filters.maxBathrooms !== undefined
    ) {
      transformed.bathrooms = {
        gte: filters.minBathrooms,
        lte: filters.maxBathrooms,
      };
      delete transformed.minBathrooms;
      delete transformed.maxBathrooms;
    }

    // Transform year built range
    if (
      filters.buildYearStart !== undefined ||
      filters.buildYearEnd !== undefined
    ) {
      transformed.yearBuilt = {
        gte: filters.buildYearStart,
        lte: filters.buildYearEnd,
      };
      delete transformed.buildYearStart;
      delete transformed.buildYearEnd;
    }

    // Transform date ranges from legacy to new format
    if (filters.createdAtStart || filters.createdAtEnd) {
      if (filters.createdAtStart)
        transformed.createdAtFrom = filters.createdAtStart;
      if (filters.createdAtEnd) transformed.createdAtTo = filters.createdAtEnd;
      delete transformed.createdAtStart;
      delete transformed.createdAtEnd;
    }

    if (filters.updatedAtStart || filters.updatedAtEnd) {
      if (filters.updatedAtStart)
        transformed.updatedAtFrom = filters.updatedAtStart;
      if (filters.updatedAtEnd) transformed.updatedAtTo = filters.updatedAtEnd;
      delete transformed.updatedAtStart;
      delete transformed.updatedAtEnd;
    }

    return transformed;
  },

  // Clean up undefined values from filters
  cleanFilters: (
    filters: Partial<PropertyFilterParams>,
  ): Partial<PropertyFilterParams> => {
    const cleaned = { ...filters };

    // Define range field types
    type RangeField = "price" | "size" | "bedrooms" | "bathrooms" | "yearBuilt";
    interface RangeValue {
      gte?: number;
      lte?: number;
    }

    // Process range fields
    (
      ["price", "size", "bedrooms", "bathrooms", "yearBuilt"] as RangeField[]
    ).forEach((field) => {
      const range = cleaned[field] as RangeValue | undefined;
      if (range && typeof range === "object") {
        // Create a new object with only defined values
        const filteredRange: RangeValue = {};
        if (range.gte !== undefined) filteredRange.gte = range.gte;
        if (range.lte !== undefined) filteredRange.lte = range.lte;

        // Update or remove the range object
        if (Object.keys(filteredRange).length > 0) {
          cleaned[field] = filteredRange as never; // Type assertion to any to resolve the type error
        } else {
          delete cleaned[field];
        }
      }
    });

    // Process array fields
    (
      [
        "features",
        "propertyAmenities",
        "facilityAmenities",
        "locationAmenities",
      ] as const
    ).forEach((field) => {
      const value = cleaned[field];
      if (Array.isArray(value) && value.length === 0) {
        delete cleaned[field];
      }
    });

    // Remove undefined values
    (Object.keys(cleaned) as (keyof typeof cleaned)[]).forEach((key) => {
      if (cleaned[key] === undefined) {
        delete cleaned[key];
      }
    });

    return cleaned;
  },

  // Prepare filters for API request
  prepareForApi: (
    filters: Partial<PropertyFilterParams>,
  ): Partial<PropertyFilterParams> => {
    // First transform any legacy filters
    const transformed = propertyFilterUtils.transformToRangeFilters(filters);
    // Then clean up any undefined values
    return propertyFilterUtils.cleanFilters(transformed);
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
