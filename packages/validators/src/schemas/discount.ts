import { z } from "zod";

export const DISCOUNT_TYPES = [
  "FIRST_BOOKING",
  "LONG_TERM",
  "REFERRAL",
  "SEASONAL",
  "CUSTOM",
  "PERCENTAGE",
  "FIXED_AMOUNT",
  "FREE_NIGHTS",
] as const;

export const discountTypeSchema = z.enum(DISCOUNT_TYPES);

// Base Discount Schema matching Prisma model
export const DiscountSchema = z.object({
  id: z.string().uuid(),

  name: z.string().max(100),
  description: z.string().optional(),
  code: z.string().max(20).optional(),
  value: z.number().positive(),
  type: discountTypeSchema,
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  maxUsage: z.number().int().positive().optional(),
  currentUsage: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
  pricingRuleId: z.string().uuid().optional(),
  propertyId: z.string().optional(),
});

// Create Discount Schema
export const CreateDiscountSchema = z.object({
  name: z.string().max(100),
  description: z.string().optional(),
  code: z.string().max(20).optional(),
  value: z.number().positive(),
  type: discountTypeSchema,
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  maxUsage: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  pricingRuleId: z.string().uuid().optional(),
  propertyId: z.string().optional(),
});

// Update Discount Schema
export const UpdateDiscountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100).optional(),
  description: z.string().optional(),
  code: z.string().max(20).optional(),
  value: z.number().positive().optional(),
  type: discountTypeSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  maxUsage: z.number().int().positive().optional(),
  currentUsage: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  deletedAt: z.date().optional(),
  pricingRuleId: z.string().uuid().optional(),
});

// Get Discount Schema
export const GetDiscountSchema = z.object({
  id: z.string().uuid(),
});

// Validate Discount Code Schema
export const ValidateDiscountCodeSchema = z.object({
  code: z.string().max(20),
});

// Apply Discount Schema
export const ApplyDiscountSchema = z.object({
  id: z.string().uuid(),
});

// Get Discounts Schema (for filtering/listing)
export const GetDiscountsSchema = z
  .object({
    name: z.string().optional(),
    code: z.string().optional(),
    type: discountTypeSchema.optional(),
    isActive: z.boolean().optional(),
    startDateFrom: z.date().optional(),
    startDateTo: z.date().optional(),
    endDateFrom: z.date().optional(),
    endDateTo: z.date().optional(),
    valueMin: z.number().optional(),
    valueMax: z.number().optional(),
    createdAtFrom: z.date().optional(),
    createdAtTo: z.date().optional(),
    deletedAt: z.date().optional(),
    sortBy: z
      .enum(["name", "value", "startDate", "endDate", "currentUsage"])
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
  })
  .optional();

// Type Exports
export type Discount = z.infer<typeof DiscountSchema>;
export type CreateDiscountInput = z.infer<typeof CreateDiscountSchema>;
export type UpdateDiscountInput = z.infer<typeof UpdateDiscountSchema>;
export type GetDiscountInput = z.infer<typeof GetDiscountSchema>;
export type ValidateDiscountCodeInput = z.infer<
  typeof ValidateDiscountCodeSchema
>;
export type ApplyDiscountInput = z.infer<typeof ApplyDiscountSchema>;
export type GetDiscountsInput = z.infer<typeof GetDiscountsSchema>;
