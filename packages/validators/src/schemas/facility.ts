import { z } from "zod";

// Enum for FacilityType - matches Prisma schema exactly
export const FacilityType = z.enum([
  "RESIDENTIAL",
  "COMMERCIAL",
  "MIXED_USE",
  "INDUSTRIAL",
  "OFFICE",
  "RETAIL",
  "WAREHOUSE",
  "PARKING",
  "GYM",
  "SWIMMING_POOL",
  "YOGA",
  "FITNESS",
  "GOLF",
  "CAFETERIA",
  "RESTAURANT",
  "THEATER",
  "CONCERT_HALL",
  "MUSEUM",
  "GALLERY",
  "CINEMA",
  "ZOO",
  "BOTANIC_GARDEN",
  "THEME_PARK",
  "GOLF_COURSE",
  "BEACH",
  "PARK",
]);
export const FacilityStatus = z.enum(["ACTIVE", "INACTIVE"]);

export const LocationAmenities = z.enum([
  "CITY_CENTER",
  "BEACH",
  "PARK",
  "SHOPPING_MALL",
  "HOSPITAL",
  "SCHOOL",
  "UNIVERSITY",
  "POLICE_STATION",
  "FIRE_STATION",
  "PUBLIC_TRANSPORT",
  "SUBWAY_STATION",
  "BUS_STOP",
  "AIRPORT",
  "RESTAURANT_DISTRICT",
  "ENTERTAINMENT_ZONE",
  "BUSINESS_DISTRICT",
  "CULTURAL_CENTER",
  "MUSEUM",
  "LIBRARY",
  "SPORTS_COMPLEX",
]);

export const FacilityAmenities = z.array(z.string());

export const FacilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  logo: z.string().optional(),
  locationId: z.string().optional(),
  Location: z.object({ id: z.string() }).optional(), // Relation to Location model
  type: FacilityType.default("RESIDENTIAL"),
  status: FacilityStatus.default("ACTIVE"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  properties: z.array(z.any()).optional(),

  agencies: z.array(z.any()).optional(),
  users: z.array(z.any()).optional(),
  tasks: z.array(z.any()).optional(),
  reports: z.array(z.any()).optional(),
  FacilityAmenities: FacilityAmenities.optional(),
  locationAmenities: z.array(LocationAmenities).optional(),
  expenses: z.array(z.any()).optional(),
  includedServices: z.array(z.any()).optional(),
  extraCharges: z.array(z.any()).optional(),
});

export const CreateFacilitySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  logo: z.string().optional(),
  locationId: z.string().optional(),
  type: FacilityType.default("RESIDENTIAL"),
  status: FacilityStatus.default("ACTIVE"),
});

export const UpdateFacilitySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  logo: z.string().optional(),
  locationId: z.string().optional(),
  type: FacilityType.optional(),
  status: FacilityStatus.optional(),
  deletedAt: z.date().optional(),
});

export const FacilityFilterSchema = z.object({
  name: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type Facility = z.infer<typeof FacilitySchema>;
export type CreateFacilityInput = z.infer<typeof CreateFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof UpdateFacilitySchema>;
export type FacilityFilterInput = z.infer<typeof FacilityFilterSchema>;
