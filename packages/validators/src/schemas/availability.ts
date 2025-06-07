import { z } from "zod";

// Base Availability Schema
export const AvailabilitySchema = z.object({
  id: z.string(),
  date: z.date(),
  isBlocked: z.boolean().default(false),
  isBooked: z.boolean().default(false),

  // Relationships
  propertyId: z.string(),
  property: z.any().optional(), // Will be populated by Prisma
  reservationId: z.string().optional().nullable(),
  reservation: z.any().optional().nullable(), // Will be populated by Prisma
  pricingRuleId: z.string().optional().nullable(),
  pricingRule: z.any().optional().nullable(), // Will be populated by Prisma

  // Availability Tracking
  totalUnits: z.number().default(1),
  availableUnits: z.number().default(1),
  bookedUnits: z.number().default(0),
  blockedUnits: z.number().default(0),
  specialPricing: z.array(z.object({
    startDate: z.date(),
    endDate: z.date(),
    price: z.number()
  })).optional(),

  // Pricing
  basePrice: z.number().default(0),
  currentPrice: z.number().default(0),
  priceSettings: z.any().optional(), // Json type in Prisma
  minNights: z.number().optional().default(1),
  maxNights: z.number().optional().default(365),
  maxGuests: z.number().default(2),

  discountSettings: z.any().optional(), // Json type in Prisma

  // Dynamic Pricing Adjustments
  weekendRate: z.number().optional().nullable(),
  weekdayRate: z.number().optional().nullable(),
  weekendMultiplier: z.number().default(1),
  weekdayMultiplier: z.number().default(1),
  seasonalMultiplier: z.number().default(1),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
});

// Create Availability Schema
export const CreateAvailabilitySchema = z.object({
  date: z.date(),
  isBlocked: z.boolean().default(false),
  isBooked: z.boolean().default(false),
  propertyId: z.string(),
  reservationId: z.string().optional().nullable(),
  pricingRuleId: z.string().optional().nullable(),
  totalUnits: z.number().default(1),
  availableUnits: z.number().default(1),
  bookedUnits: z.number().default(0),
  blockedUnits: z.number().default(0),
  specialPricing: z.array(z.object({
    startDate: z.date(),
    endDate: z.date(),
    price: z.number()
  })).optional(),
  basePrice: z.number().default(0),
  currentPrice: z.number().default(0),
  priceSettings: z.any().optional(),
  minNights: z.number().optional().default(1),
  maxNights: z.number().optional().default(365),
  maxGuests: z.number().default(2),
  discountSettings: z.any().optional(),
  weekendRate: z.number().optional().nullable(),
  weekdayRate: z.number().optional().nullable(),
  weekendMultiplier: z.number().default(1),
  weekdayMultiplier: z.number().default(1),
  seasonalMultiplier: z.number().default(1),
});

// Update Availability Schema
export const UpdateAvailabilitySchema = z.object({
  id: z.string(),
  date: z.date().optional(),
  isBlocked: z.boolean().optional(),
  isBooked: z.boolean().optional(),
  propertyId: z.string().optional(),
  reservationId: z.string().optional().nullable(),
  pricingRuleId: z.string().optional().nullable(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  bookedUnits: z.number().optional(),
  blockedUnits: z.number().optional(),
  specialPricing: z.array(z.object({
    startDate: z.date(),
    endDate: z.date(),
    price: z.number()
  })).optional(),
  basePrice: z.number().optional(),
  currentPrice: z.number().optional(),
  priceSettings: z.any().optional(),
  minNights: z.number().optional(),
  maxNights: z.number().optional(),
  maxGuests: z.number().optional(),
  discountSettings: z.any().optional(),
  weekendRate: z.number().optional().nullable(),
  weekdayRate: z.number().optional().nullable(),
  weekendMultiplier: z.number().optional(),
  weekdayMultiplier: z.number().optional(),
  seasonalMultiplier: z.number().optional(),
  deletedAt: z.date().optional().nullable(),
});

// Availability Filter Schema
export const AvailabilityFilterSchema = z.object({
  propertyId: z.string().optional(),
  date: z.date().optional(),
  isBlocked: z.boolean().optional(),
  minAvailableUnits: z.number().optional(),
  maxAvailableUnits: z.number().optional(),
  sortBy: z.enum(["date", "availableUnits", "basePrice", "currentPrice"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Availability = z.infer<typeof AvailabilitySchema>;
export type CreateAvailabilityInput = z.infer<typeof CreateAvailabilitySchema>;
export type UpdateAvailabilityInput = z.infer<typeof UpdateAvailabilitySchema>;
export type AvailabilityFilterInput = z.infer<typeof AvailabilityFilterSchema>;
