import { z } from "zod";

// Pricing Strategy enum
export const PricingStrategyEnum = z.enum([
  "FIXED",
  "DYNAMIC",
  "SEASONAL",
  "LENGTH_OF_STAY",
  "OCCUPANCY_BASED",
]);

export type PricingStrategy = z.infer<typeof PricingStrategyEnum>;

// PricingRule Schema (output)
export const PricingRuleSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  basePrice: z.number().positive(),
  strategy: PricingStrategyEnum.default("FIXED"),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  minNights: z.number().int().positive().default(1),
  maxNights: z.number().int().positive().max(365).default(30),
  weekdayPrices: z.record(z.number()).optional().nullable(),
  taxRules: z.record(z.unknown()).optional().nullable(),
  discountRules: z.record(z.unknown()).optional().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
  currencyId: z.string(),
  currency: z.any().optional(), // Will be populated by the API
  Property: z.any().optional(), // Will be populated by the API
  Reservations: z.array(z.any()).optional(),
  Availabilities: z.array(z.any()).optional(),
  Subscriptions: z.array(z.any()).optional(),
  Discounts: z.array(z.any()).optional(),
});

// Create PricingRule Schema
export const CreatePricingRuleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  basePrice: z.number().positive("Base price must be positive"),
  strategy: PricingStrategyEnum.optional().default("FIXED"),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  minNights: z.number().int().positive().optional().default(1),
  maxNights: z.number().int().positive().max(365).optional().default(30),
  weekdayPrices: z.record(z.number()).optional().nullable(),
  taxRules: z.record(z.unknown()).optional().nullable(),
  discountRules: z.record(z.unknown()).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  propertyId: z.string().min(1, "Property ID is required"),
  currencyId: z.string().min(1, "Currency ID is required"),
});

// Update PricingRule Schema
export const UpdatePricingRuleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional().nullable(),
  basePrice: z.number().positive("Base price must be positive").optional(),
  strategy: PricingStrategyEnum.optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  minNights: z.number().int().positive().optional(),
  maxNights: z.number().int().positive().max(365).optional(),
  weekdayPrices: z.record(z.number()).optional().nullable(),
  taxRules: z.record(z.unknown()).optional().nullable(),
  discountRules: z.record(z.unknown()).optional().nullable(),
  isActive: z.boolean().optional(),
  propertyId: z.string().min(1, "Property ID is required").optional(),
  currencyId: z.string().min(1, "Currency ID is required").optional(),
});

// PricingRule Filter Schema
export const PricingRuleFilterSchema = z.object({
  propertyId: z.string().optional(),
  name: z.string().optional(),
  strategy: PricingStrategyEnum.optional(),
  isActive: z.boolean().optional(),
  minNights: z.number().int().positive().optional(),
  maxNights: z.number().int().positive().max(365).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["createdAt", "basePrice", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type exports
export type PricingRule = z.infer<typeof PricingRuleSchema>;
export type CreatePricingRuleInput = z.infer<typeof CreatePricingRuleSchema>;
export type UpdatePricingRuleInput = z.infer<typeof UpdatePricingRuleSchema>;
export type PricingRuleFilter = z.infer<typeof PricingRuleFilterSchema>;
