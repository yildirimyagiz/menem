import { z } from "zod";

// Define all enums locally since imports are not working
const ArchitecturalStyle = {
  MODERN: "MODERN" as const,
  CONTEMPORARY: "CONTEMPORARY" as const,
  TRADITIONAL: "TRADITIONAL" as const,
  COLONIAL: "COLONIAL" as const,
  VICTORIAN: "VICTORIAN" as const,
  CRAFTSMAN: "CRAFTSMAN" as const,
  MID_CENTURY: "MID_CENTURY" as const,
  MEDITERRANEAN: "MEDITERRANEAN" as const,
  FARMHOUSE: "FARMHOUSE" as const,
  RANCH: "RANCH" as const,
  SPANISH: "SPANISH" as const,
  TUDOR: "TUDOR" as const,
} as const;

const BuildingClass = {
  CLASS_A: "CLASS_A" as const,
  CLASS_B: "CLASS_B" as const,
  CLASS_C: "CLASS_C" as const,
  CLASS_D: "CLASS_D" as const,
  LUXURY: "LUXURY" as const,
  HISTORIC: "HISTORIC" as const,
} as const;

const ConstructionType = {
  WOOD_FRAME: "WOOD_FRAME" as const,
  BRICK: "BRICK" as const,
  CONCRETE: "CONCRETE" as const,
  STEEL: "STEEL" as const,
  STONE: "STONE" as const,
  LOG: "LOG" as const,
  PREFAB: "PREFAB" as const,
  MODULAR: "MODULAR" as const,
} as const;

const ContactMethod = {
  EMAIL: "EMAIL" as const,
  PHONE: "PHONE" as const,
  MESSAGE: "MESSAGE" as const,
  ANY: "ANY" as const,
} as const;

const CoolingType = {
  CENTRAL_AC: "CENTRAL_AC" as const,
  WINDOW_UNIT: "WINDOW_UNIT" as const,
  DUCTLESS_MINI_SPLIT: "DUCTLESS_MINI_SPLIT" as const,
  EVAPORATIVE_COOLER: "EVAPORATIVE_COOLER" as const,
} as const;

const EnergyEfficiencyRating = {
  ENERGY_STAR: "ENERGY_STAR" as const,
  LEED_CERTIFIED: "LEED_CERTIFIED" as const,
  LEED_SILVER: "LEED_SILVER" as const,
  LEED_GOLD: "LEED_GOLD" as const,
  LEED_PLATINUM: "LEED_PLATINUM" as const,
  NET_ZERO: "NET_ZERO" as const,
} as const;

const EnergyRating = {
  A: "A" as const,
  B: "B" as const,
  C: "C" as const,
  D: "D" as const,
  E: "E" as const,
  F: "F" as const,
  G: "G" as const,
} as const;

const FacilityAmenities = {
  COMMUNITY_CENTER: "COMMUNITY_CENTER" as const,
  CO_WORKING_SPACE: "CO_WORKING_SPACE" as const,
  BIKE_STORAGE: "BIKE_STORAGE" as const,
  PARKING_GARAGE: "PARKING_GARAGE" as const,
  EV_CHARGING: "EV_CHARGING" as const,
  SECURITY_DESK: "SECURITY_DESK" as const,
  PACKAGE_ROOM: "PACKAGE_ROOM" as const,
  BBQ_AREA: "BBQ_AREA" as const,
  ROOFTOP_TERRACE: "ROOFTOP_TERRACE" as const,
} as const;

const GreenCertification = {
  ENERGY_STAR: "ENERGY_STAR" as const,
  LEED: "LEED" as const,
  WELL: "WELL" as const,
  BREEAM: "BREEAM" as const,
  GREEN_GLOBES: "GREEN_GLOBES" as const,
} as const;

const HeatingType = {
  FORCED_AIR: "FORCED_AIR" as const,
  RADIANT: "RADIANT" as const,
  ELECTRIC: "ELECTRIC" as const,
  GAS: "GAS" as const,
  OIL: "OIL" as const,
  HEAT_PUMP: "HEAT_PUMP" as const,
  GEOTHERMAL: "GEOTHERMAL" as const,
} as const;

const ListingType = {
  SALE: "SALE" as const,
  RENT: "RENT" as const,
  BOOKING: "BOOKING" as const,
} as const;

const LocationAmenities = {
  CITY_CENTER: "CITY_CENTER" as const,
  BEACH: "BEACH" as const,
  PARK: "PARK" as const,
  SHOPPING_MALL: "SHOPPING_MALL" as const,
  HOSPITAL: "HOSPITAL" as const,
  SCHOOL: "SCHOOL" as const,
  UNIVERSITY: "UNIVERSITY" as const,
  POLICE_STATION: "POLICE_STATION" as const,
  FIRE_STATION: "FIRE_STATION" as const,
  PUBLIC_TRANSPORT: "PUBLIC_TRANSPORT" as const,
  SUBWAY_STATION: "SUBWAY_STATION" as const,
  BUS_STOP: "BUS_STOP" as const,
  AIRPORT: "AIRPORT" as const,
  RESTAURANT_DISTRICT: "RESTAURANT_DISTRICT" as const,
  ENTERTAINMENT_ZONE: "ENTERTAINMENT_ZONE" as const,
  BUSINESS_DISTRICT: "BUSINESS_DISTRICT" as const,
  CULTURAL_CENTER: "CULTURAL_CENTER" as const,
  MUSEUM: "MUSEUM" as const,
  LIBRARY: "LIBRARY" as const,
  SPORTS_COMPLEX: "SPORTS_COMPLEX" as const,
} as const;

const OwnershipCategory = {
  PERSONAL: "PERSONAL" as const,
  COMPANY: "COMPANY" as const,
  BANK: "BANK" as const,
  CONSTRUCTION_COMPANY: "CONSTRUCTION_COMPANY" as const,
  INVESTMENT_FUND: "INVESTMENT_FUND" as const,
  GOVERNMENT: "GOVERNMENT" as const,
  TRUST: "TRUST" as const,
} as const;

const OwnershipType = {
  FREEHOLD: "FREEHOLD" as const,
  LEASEHOLD: "LEASEHOLD" as const,
  COMMONHOLD: "COMMONHOLD" as const,
  COOPERATIVE: "COOPERATIVE" as const,
  TIMESHARE: "TIMESHARE" as const,
  FRACTIONAL: "FRACTIONAL" as const,
} as const;

const ParkingType = {
  STREET: "STREET" as const,
  DRIVEWAY: "DRIVEWAY" as const,
  GARAGE: "GARAGE" as const,
  CARPORT: "CARPORT" as const,
  UNDERGROUND: "UNDERGROUND" as const,
  ASSIGNED_PARKING: "ASSIGNED_PARKING" as const,
} as const;


const PropertyAmenities = {
  POOL: "POOL" as const,
  GYM: "GYM" as const,
  GARDEN: "GARDEN" as const,
  PARKING: "PARKING" as const,
  SECURITY: "SECURITY" as const,
  ELEVATOR: "ELEVATOR" as const,
  STORAGE: "STORAGE" as const,
  BALCONY: "BALCONY" as const,
  TERRACE: "TERRACE" as const,
  AIR_CONDITIONING: "AIR_CONDITIONING" as const,
  HEATING: "HEATING" as const,
  WIFI: "WIFI" as const,
  SAUNA: "SAUNA" as const,
  JACUZZI: "JACUZZI" as const,
  FIREPLACE: "FIREPLACE" as const,
  BBQ: "BBQ" as const,
  PET_FRIENDLY: "PET_FRIENDLY" as const,
  WHEELCHAIR_ACCESS: "WHEELCHAIR_ACCESS" as const,
  LAUNDRY: "LAUNDRY" as const,
  DISHWASHER: "DISHWASHER" as const,
  SMART_HOME: "SMART_HOME" as const,
  SOLAR_PANELS: "SOLAR_PANELS" as const,
  CONCIERGE: "CONCIERGE" as const,
  PLAYGROUND: "PLAYGROUND" as const,
  TENNIS_COURT: "TENNIS_COURT" as const,
  BASKETBALL_COURT: "BASKETBALL_COURT" as const,
  CINEMA_ROOM: "CINEMA_ROOM" as const,
  GAME_ROOM: "GAME_ROOM" as const,
  ROOFTOP: "ROOFTOP" as const,
  SEA_VIEW: "SEA_VIEW" as const,
  MOUNTAIN_VIEW: "MOUNTAIN_VIEW" as const,
  CITY_VIEW: "CITY_VIEW" as const,
} as const;

const PropertyCategory = {
  RESIDENTIAL: "RESIDENTIAL" as const,
  COMMERCIAL: "COMMERCIAL" as const,
  LAND: "LAND" as const,
  INDUSTRIAL: "INDUSTRIAL" as const,
  OTHER: "OTHER" as const,
} as const;

const PropertyCondition = {
  EXCELLENT: "EXCELLENT" as const,
  GOOD: "GOOD" as const,
  FAIR: "FAIR" as const,
  NEEDS_RENOVATION: "NEEDS_RENOVATION" as const,
  UNDER_CONSTRUCTION: "UNDER_CONSTRUCTION" as const,
} as const;

const PropertyFeatures = {
  FURNISHED: "FURNISHED" as const,
  PARTIALLY_FURNISHED: "PARTIALLY_FURNISHED" as const,
  UNFURNISHED: "UNFURNISHED" as const,
  OPEN_FLOOR_PLAN: "OPEN_FLOOR_PLAN" as const,
  HIGH_CEILING: "HIGH_CEILING" as const,
  BALCONY: "BALCONY" as const,
  TERRACE: "TERRACE" as const,
  GARDEN: "GARDEN" as const,
  SEA_VIEW: "SEA_VIEW" as const,
  MOUNTAIN_VIEW: "MOUNTAIN_VIEW" as const,
  CITY_VIEW: "CITY_VIEW" as const,
  SMART_HOME: "SMART_HOME" as const,
  ENERGY_EFFICIENT: "ENERGY_EFFICIENT" as const,
  SOLAR_PANELS: "SOLAR_PANELS" as const,
  EARTHQUAKE_RESISTANT: "EARTHQUAKE_RESISTANT" as const,
  SOUNDPROOF: "SOUNDPROOF" as const,
  WHEELCHAIR_ACCESSIBLE: "WHEELCHAIR_ACCESSIBLE" as const,
  PET_FRIENDLY: "PET_FRIENDLY" as const,
  HOME_OFFICE: "HOME_OFFICE" as const,
  WALK_IN_CLOSET: "WALK_IN_CLOSET" as const,
} as const;

const PropertyStatus = {
  AVAILABLE: "AVAILABLE" as const,
  UNDER_CONTRACT: "UNDER_CONTRACT" as const,
  SOLD: "SOLD" as const,
  RENTED: "RENTED" as const,
  PENDING_APPROVAL: "PENDING_APPROVAL" as const,
  OFF_MARKET: "OFF_MARKET" as const,
  MAINTENANCE: "MAINTENANCE" as const,
  FORECLOSURE: "FORECLOSURE" as const,
} as const;

const PropertyType = {
  APARTMENT: "APARTMENT" as const,
  HOUSE: "HOUSE" as const,
  VILLA: "VILLA" as const,
  DUPLEX: "DUPLEX" as const,
  PENTHOUSE: "PENTHOUSE" as const,
  STUDIO: "STUDIO" as const,
  CONDO: "CONDO" as const,
  TOWNHOUSE: "TOWNHOUSE" as const,
  LOFT: "LOFT" as const,
  COTTAGE: "COTTAGE" as const,
  BUNGALOW: "BUNGALOW" as const,
  CHALET: "CHALET" as const,
  CABIN: "CABIN" as const,
  MANSION: "MANSION" as const,
  RANCH: "RANCH" as const,
  FARM: "FARM" as const,
  OFFICE: "OFFICE" as const,
  SHOP: "SHOP" as const,
  RETAIL: "RETAIL" as const,
  WAREHOUSE: "WAREHOUSE" as const,
  HOTEL: "HOTEL" as const,
  HOSTEL: "HOSTEL" as const,
  GUESTHOUSE: "GUESTHOUSE" as const,
  BEDANDBREAKFAST: "BEDANDBREAKFAST" as const,
  RESORT: "RESORT" as const,
  GARAGE: "GARAGE" as const,
  PARKING: "PARKING" as const,
  AGRICULTURAL: "AGRICULTURAL" as const,
  DEVELOPMENT: "DEVELOPMENT" as const,
  FACTORY: "FACTORY" as const,
  PLANT: "PLANT" as const,
  OTHER: "OTHER" as const,
} as const;

import { LocationSchema } from "./location";
import { PhotoSchema } from "./photo";

export const PropertySchema = z.object({
  Facility: z
    .object({
      amenities: z.array(z.nativeEnum(FacilityAmenities)).optional(),
    })
    .nullable()
    .optional(),
  facilityAmenities: z.array(z.nativeEnum(FacilityAmenities)).optional(),
  // Identification
  id: z.string(),
  propertyNumber: z.string(),
  title: z.string(),
  description: z.string(),
  propertyType: z.nativeEnum(PropertyType),
  propertyStatus: z.nativeEnum(PropertyStatus),
  category: z.nativeEnum(PropertyCategory),

  // Location (normalized)
  locationId: z.string().nullable().optional(),
  Location: LocationSchema.nullable().optional(),

  // Physical Characteristics
  size: z.number(),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  floors: z.number().nullable().optional(),
  yearBuilt: z.number().nullable().optional(),
  condition: z.nativeEnum(PropertyCondition),
  features: z.array(z.nativeEnum(PropertyFeatures)),
  amenities: z.array(z.nativeEnum(PropertyAmenities)),
  locationAmenities: z.array(z.nativeEnum(LocationAmenities)).optional(),

  // Technical Details
  constructionType: z.nativeEnum(ConstructionType).nullable().optional(),
  buildingClass: z.nativeEnum(BuildingClass).optional(),
  energyRating: z.nativeEnum(EnergyRating).optional(),
  parkingSpaces: z.number().optional(),
  parkingType: z.nativeEnum(ParkingType).optional(),
  heatingType: z.nativeEnum(HeatingType).optional(),
  cancellationPolicy: z.string().nullable().optional(),
  checkInTime: z.date().nullable().optional(),
  checkOutTime: z.date().nullable().optional(),
  specialNotes: z.string().nullable().optional(),
  rules: z.string().nullable().optional(),
  nearbyAttractions: z.string().nullable().optional(),
  transportOptions: z.string().nullable().optional(),
  greenCertification: z.nativeEnum(GreenCertification).optional(),
  // Newly added enums for property technical details
  energyEfficiencyRating: z.nativeEnum(EnergyEfficiencyRating).optional(),
  coolingType: z.nativeEnum(CoolingType).optional(),
  architecturalStyle: z.nativeEnum(ArchitecturalStyle).optional(),

  // Ownership & Legal
  ownershipType: z.nativeEnum(OwnershipType),
  ownershipCategory: z.nativeEnum(OwnershipCategory).optional(),
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
  contactMethod: z.nativeEnum(ContactMethod).optional(),
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
  propertyType: z.nativeEnum(PropertyType),
  propertyStatus: z.nativeEnum(PropertyStatus).optional(),
  category: z.nativeEnum(PropertyCategory),
  locationId: z.string().optional(),
  Location: LocationSchema.optional(),
  size: z.number().positive(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  floors: z.number().optional(),
  yearBuilt: z.number().optional(),
  condition: z.nativeEnum(PropertyCondition).optional(),
  features: z.array(z.nativeEnum(PropertyFeatures)).optional(),
  amenities: z.array(z.nativeEnum(PropertyAmenities)).optional(),
  constructionType: z.nativeEnum(ConstructionType).optional(),
  buildingClass: z.nativeEnum(BuildingClass).optional(),
  energyRating: z.nativeEnum(EnergyRating).optional(),
  parkingSpaces: z.number().optional(),
  cancellationPolicy: z.string().optional(),
  checkInTime: z.date().optional(),
  checkOutTime: z.date().optional(),
  specialNotes: z.string().optional(),
  rules: z.string().optional(),
  nearbyAttractions: z.string().optional(),
  transportOptions: z.string().optional(),
  favoriteCount: z.number().optional(),
  listingType: z.nativeEnum(ListingType).optional(),
  ownershipType: z.nativeEnum(OwnershipType).optional(),
  ownershipCategory: z.nativeEnum(OwnershipCategory).optional(),
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
  contactMethod: z.nativeEnum(ContactMethod).optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  isActive: z.boolean().optional(),
  mlScore: z.number().optional(),
  featured: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  PricingRules: z.array(z.any()).optional(),
  photos: z.array(z.string()).optional(),
});

export type PropertyPricingRulesInput = z.infer<
  typeof CreatePropertySchema
>["PricingRules"];

// Update Property Schema
export const UpdatePropertySchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  locationId: z.string().optional(),
  Location: LocationSchema.optional(),
  size: z.number().positive().optional(),
  yearBuilt: z.number().int().optional(),
  category: z.nativeEnum(PropertyCategory).optional(),
  propertyStatus: z.nativeEnum(PropertyStatus).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  condition: z.nativeEnum(PropertyCondition).optional(),
  features: z.array(z.nativeEnum(PropertyFeatures)).optional(),
  amenities: z.array(z.nativeEnum(PropertyAmenities)).optional(),
  listedAt: z.date().optional(),
  ownerId: z.string().optional(),
  agencyId: z.string().optional(),
  buildingClass: z.nativeEnum(BuildingClass).optional(),
  deletedAt: z.date().optional(),
  PricingRules: z.array(z.any()).optional(),
  photos: z.array(z.string()).optional(),
});

// Property Filter Schema
export const PropertyFilterSchema = z.object({
  title: z.string().optional(),
  locationId: z.string().optional(),
  category: z.nativeEnum(PropertyCategory).optional(),
  propertyStatus: z.nativeEnum(PropertyStatus).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  condition: z.nativeEnum(PropertyCondition).optional(),
  features: z.array(z.nativeEnum(PropertyFeatures)).optional(),
  amenities: z.array(z.nativeEnum(PropertyAmenities)).optional(),
  facilityAmenities: z.array(z.nativeEnum(FacilityAmenities)).optional(),
  locationAmenities: z.array(z.nativeEnum(LocationAmenities)).optional(),
  ownerId: z.string().optional(),
  agencyId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  listedAtFrom: z.date().optional(),
  listedAtTo: z.date().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  listingType: z.nativeEnum(ListingType).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  size: z
    .object({
      gte: z.number().optional(),
      lte: z.number().optional(),
    })
    .optional(),
  bedrooms: z
    .object({
      gte: z.number().optional(),
      lte: z.number().optional(),
    })
    .optional(),
  bathrooms: z
    .object({
      gte: z.number().optional(),
      lte: z.number().optional(),
    })
    .optional(),
  yearBuilt: z
    .object({
      gte: z.number().optional(),
      lte: z.number().optional(),
    })
    .optional(),
});

// Zod Type Inference for TypeScript
export type Property = z.infer<typeof PropertySchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;
export type PropertyFilterInput = z.infer<typeof PropertyFilterSchema>;

// Export new enums for external usage
export { ArchitecturalStyle, CoolingType, EnergyEfficiencyRating };

// Export property feature/amenity enums and their types
    export { PropertyAmenities, PropertyFeatures } from "@prisma/client";
  export type {
    PropertyAmenities as PropertyAmenity, PropertyFeatures as PropertyFeature
  } from "@prisma/client";

// =========================
// Admin (UI-lean) Schemas
// =========================
// Provide simplified schemas tailored for admin UI usage to avoid coupling to the
// very large full PropertySchema. These accept Date or ISO string inputs and keep
// a minimal set of fields commonly used in forms and filters.

const DateLike = z.preprocess((v) => {
  if (v instanceof Date) return v;
  if (typeof v === "string") {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d;
  }
  return v;
}, z.date());

export const AdminPropertyCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  propertyStatus: z.nativeEnum(PropertyStatus).optional(),
  category: z.nativeEnum(PropertyCategory).optional(),
  locationId: z.string().optional(),
  size: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  price: z.number().nonnegative().optional(),
  currencyId: z.string().optional(),
  listedAt: DateLike.optional(),
  featured: z.boolean().optional(),
  photos: z.array(z.string()).optional(),
});

export const AdminPropertyUpdateSchema = AdminPropertyCreateSchema.partial().extend({
  id: z.string(),
});

export const AdminPropertyFilterSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(PropertyCategory).optional(),
  propertyStatus: z.nativeEnum(PropertyStatus).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  listedAtFrom: DateLike.optional(),
  listedAtTo: DateLike.optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type AdminPropertyCreateInput = z.infer<typeof AdminPropertyCreateSchema>;
export type AdminPropertyUpdateInput = z.infer<typeof AdminPropertyUpdateSchema>;
export type AdminPropertyFilterInput = z.infer<typeof AdminPropertyFilterSchema>;

