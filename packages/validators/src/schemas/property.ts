import { z } from "zod";

import { LocationAmenities } from "./facility";
import { LocationSchema } from "./location";
import { PhotoSchema } from "./photo";

// Property Condition enum
export const PropertyCondition = z.enum([
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_RENOVATION",
  "UNDER_CONSTRUCTION",
]);

export const locationAmenitiesSchema = z.array(LocationAmenities);

export const ParkingType = z.enum([
  "COVERED",
  "OPEN",
  "GARAGE",
  "PRIVATE",
  "PUBLIC",
  "STREET",
  "SECURED",
  "UNSECURED",
  "UNDERGROUND",
  "ABOVE_GROUND",
]);

export const HeatingType = z.enum([
  "FORCED_AIR",
  "RADIANT",
  "ELECTRIC",
  "GAS",
  "OIL",
  "HEAT_PUMP",
  "GEOTHERMAL",
]);

export const GreenCertification = z.enum([
  "ENERGY_STAR",
  "LEED",
  "WELL",
  "BREEAM",
  "GREEN_GLOBES",
]);

export const PropertyType = z.enum([
  "SingleFamily",
  "TOWNHOUSE",
  "CONDO",
  "APARTMENT",
  "DUPLEX",
  "TRIPLEX",
  "QUADPLEX",
  "OFFICE_BUILDING",
  "RETAIL_SPACE",
  "WAREHOUSE",
  "INDUSTRIAL_COMPLEX",
  "MIXED_USE",
  "MULTI_FAMILY",
  "MOBILE_HOME",
  "MANUFACTURED_HOME",
  "FARM",
  "RANCH",
]);

export const PropertyStatus = z.enum([
  "AVAILABLE",
  "UNDER_CONTRACT",
  "SOLD",
  "RENTED",
  "PENDING_APPROVAL",
  "OFF_MARKET",
  "MAINTENANCE",
  "FORECLOSURE",
]);

export const PropertyCategory = z.enum([
  "APARTMENT",
  "HOUSE",
  "VILLA",
  "OFFICE",
  "RETAIL",
  "WAREHOUSE",
  "FACTORY",
  "LAND_PLOT",
  "FARM",
  "SHOP",
  "BUILDING",
]);

export const OwnershipType = z.enum([
  "FREEHOLD",
  "LEASEHOLD",
  "COMMONHOLD",
  "COOPERATIVE",
  "TIMESHARE",
  "FRACTIONAL",
]);

export const ContactMethod = z.enum(["EMAIL", "PHONE", "MESSAGE", "ANY"]);
export const OwnershipCategory = z.enum([
  "PERSONAL",
  "COMPANY",
  "BANK",
  "CONSTRUCTION_COMPANY",
  "INVESTMENT_FUND",
  "GOVERNMENT",
  "TRUST",
]);
export const BuildingClass = z.enum(["A", "B", "C", "D", "LUXURY", "HISTORIC"]);
export const EnergyRating = z.enum(["A", "B", "C", "D", "E", "F", "G"]);

export const PropertyFeatures = z.enum([
  "FURNISHED",
  "PARTIALLY_FURNISHED",
  "UNFURNISHED",
  "OPEN_FLOOR_PLAN",
  "HIGH_CEILING",
  "BALCONY",
  "TERRACE",
  "GARDEN",
  "SEA_VIEW",
  "MOUNTAIN_VIEW",
  "CITY_VIEW",
  "SMART_HOME",
  "ENERGY_EFFICIENT",
  "SOLAR_PANELS",
  "EARTHQUAKE_RESISTANT",
  "SOUNDPROOF",
  "WHEELCHAIR_ACCESSIBLE",
  "PET_FRIENDLY",
  "HOME_OFFICE",
  "WALK_IN_CLOSET",
]);

export const PropertyAmenities = z.enum([
  "POOL",
  "GYM",
  "GARDEN",
  "PARKING",
  "SECURITY",
  "ELEVATOR",
  "STORAGE",
  "BALCONY",
  "TERRACE",
  "FURNISHED",
]);

export const ListingType = z.enum([
  "SALE",
  "RENT",
  "SHORT_TERM",
  "AUCTION",
  "LEASE",
]);

export const PhotoType = z.enum([
  "COVER",
  "GALLERY",
  "PROFILE",
  "DOCUMENT",
  "INTERIOR",
  "EXTERIOR",
  "AERIAL",
  "FLOOR_PLAN",
]);

export const PropertySchema = z.object({
  // Identification
  id: z.string(),
  propertyNumber: z.string(),
  title: z.string(),
  description: z.string(),
  propertyType: PropertyType,
  propertyStatus: PropertyStatus,
  category: PropertyCategory,

  // Location (normalized)
  locationId: z.string().nullable().optional(),
  Location: LocationSchema.nullable().optional(),

  // Physical Characteristics
  size: z.number(),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  floors: z.number().nullable().optional(),
  yearBuilt: z.number().nullable().optional(),
  condition: z.enum([
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "NEEDS_RENOVATION",
    "UNDER_CONSTRUCTION",
  ]),
  features: z.array(PropertyFeatures),
  amenities: z.array(PropertyAmenities),
  locationAmenities: z.array(LocationAmenities).optional(),

  // Technical Details
  constructionType: z.string().nullable().optional(),
  buildingClass: BuildingClass.optional(),
  energyRating: EnergyRating.optional(),
  parkingSpaces: z.number().optional(),
  parkingType: ParkingType.optional(),
  heatingType: HeatingType.optional(),
  cancellationPolicy: z.string().nullable().optional(),
  checkInTime: z.date().nullable().optional(),
  checkOutTime: z.date().nullable().optional(),
  specialNotes: z.string().nullable().optional(),
  rules: z.string().nullable().optional(),
  nearbyAttractions: z.string().nullable().optional(),
  transportOptions: z.string().nullable().optional(),
  greenCertification: GreenCertification.optional(),

  // Ownership & Legal
  ownershipType: OwnershipType,
  ownershipCategory: OwnershipCategory.optional(),
  titleDeedNumber: z.string().nullable().optional(),
  titleDeedDate: z.date().nullable().optional(),
  facilityId: z.string().nullable().optional(),

  // Financial
  marketValue: z.number().nullable().optional(),
  taxValue: z.number().nullable().optional(),
  insuranceValue: z.number().nullable().optional(),
  mortgageEligible: z.boolean(),

  // Relationships
  agentId: z.string().nullable().optional(),
  ownerId: z.string().nullable().optional(),
  sellerId: z.string().nullable().optional(),
  buyerId: z.string().nullable().optional(),
  agencyId: z.string().nullable().optional(),
  eventId: z.string().nullable().optional(),
  events: z.array(z.any()).optional(),

  // Contact
  contactMethod: ContactMethod.optional(),
  contactEmail: z.string().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  isActive: z.boolean(),
  mlScore: z.number().nullable().optional(),
  featured: z.boolean(),
  averageRating: z.number().nullable().optional(),

  // Metadata
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  favoriteCount: z.number().optional(),

  // Relations (arrays/objects, use z.any for now)
  Analytics: z.array(z.any()).optional(),
  ComplianceRecord: z.array(z.any()).optional(),
  Expense: z.array(z.any()).optional(),
  Increase: z.array(z.any()).optional(),

  Mention: z.array(z.any()).optional(),
  Photo: z.array(PhotoSchema).optional(),
  Agent: z.any().optional(),
  Owner: z.any().optional(),
  Seller: z.any().optional(),
  Buyer: z.any().optional(),
  Agency: z.any().optional(),
  Review: z.array(z.any()).optional(),
  Task: z.array(z.any()).optional(),
  Hashtag: z.array(z.any()).optional(),
  PricingRules: z.array(z.any()).optional(),
  Facility: z.any().optional(),
  IncludedService: z.any().optional(),
  ExtraCharge: z.any().optional(),
  Availability: z.array(z.any()).optional(),
  TaxRecord: z.array(z.any()).optional(),
  Mortgage: z.array(z.any()).optional(),
});

// Create Property Schema
export const CreatePropertySchema = z.object({
  title: z.string(),
  description: z.string(),
  propertyType: PropertyType,
  propertyStatus: PropertyStatus.optional(),
  category: PropertyCategory,
  locationId: z.string().optional(),
  Location: LocationSchema.optional(),
  size: z.number().positive(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  floors: z.number().optional(),
  yearBuilt: z.number().optional(),
  condition: z
    .enum([
      "EXCELLENT",
      "GOOD",
      "FAIR",
      "NEEDS_RENOVATION",
      "UNDER_CONSTRUCTION",
    ])
    .optional(),
  features: z.array(PropertyFeatures).optional(),
  amenities: z.array(PropertyAmenities).optional(),
  constructionType: z.string().optional(),
  buildingClass: BuildingClass.optional(),
  energyRating: EnergyRating.optional(),
  parkingSpaces: z.number().optional(),
  cancellationPolicy: z.string().optional(),
  checkInTime: z.date().optional(),
  checkOutTime: z.date().optional(),
  specialNotes: z.string().optional(),
  rules: z.string().optional(),
  nearbyAttractions: z.string().optional(),
  transportOptions: z.string().optional(),
  favoriteCount: z.number().optional(),
  listingType: ListingType.optional(),
  ownershipType: OwnershipType.optional(),
  ownershipCategory: OwnershipCategory.optional(),
  titleDeedNumber: z.string().optional(),
  titleDeedDate: z.date().optional(),
  marketValue: z.number().optional(),
  taxValue: z.number().optional(),
  insuranceValue: z.number().optional(),
  mortgageEligible: z.boolean().optional(),
  agentId: z.string().optional(),
  ownerId: z.string().optional(),
  sellerId: z.string().optional(),
  buyerId: z.string().optional(),
  agencyId: z.string().optional(),
  eventId: z.string().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
  currencyId: z.string().optional(),
  guestId: z.string().optional(),
  contactMethod: ContactMethod.optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  isActive: z.boolean().optional(),
  mlScore: z.number().optional(),
  featured: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  pricingRules: z.array(z.any()).optional(),
});

export type PropertyPricingRulesInput = z.infer<
  typeof CreatePropertySchema
>["pricingRules"];

// Update Property Schema
export const UpdatePropertySchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  locationId: z.string().optional(),
  Location: LocationSchema.optional(),
  size: z.number().positive().optional(),
  yearBuilt: z.number().int().optional(),
  category: PropertyCategory.optional(),
  status: PropertyStatus.optional(),
  propertyType: PropertyType.optional(),
  condition: z
    .enum([
      "EXCELLENT",
      "GOOD",
      "FAIR",
      "NEEDS_RENOVATION",
      "UNDER_CONSTRUCTION",
    ])
    .optional(),
  features: z.array(PropertyFeatures).optional(),
  amenities: z.array(PropertyAmenities).optional(),
  listedAt: z.date().optional(),
  ownerId: z.string().optional(),
  agencyId: z.string().optional(),
  buildingClass: BuildingClass.optional(),
  deletedAt: z.date().optional(),
  PricingRules: z.array(z.any()).optional(), // Added for alignment with Prisma model
});

// Property Filter Schema
export const PropertyFilterSchema = z.object({
  title: z.string().optional(),
  locationId: z.string().optional(),
  category: PropertyCategory.optional(),
  status: PropertyStatus.optional(),
  condition: z
    .enum([
      "EXCELLENT",
      "GOOD",
      "FAIR",
      "NEEDS_RENOVATION",
      "UNDER_CONSTRUCTION",
    ])
    .optional(),
  ownerId: z.string().optional(),
  agencyId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  listedAtFrom: z.date().optional(),
  listedAtTo: z.date().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Property = z.infer<typeof PropertySchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;
export type PropertyFilterInput = z.infer<typeof PropertyFilterSchema>;
