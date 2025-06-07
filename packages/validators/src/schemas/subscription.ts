import { z } from "zod";

export const SubscriptionTierEnum = z.enum(["BASIC", "PRO", "ENTERPRISE"]);
export const SubscriptionStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "EXPIRED"]);

// Subscription Schema
export const SubscriptionSchema = z.object({
  id: z.string().optional(),
  entityId: z.string(),
  entityType: z.string(),
  tier: SubscriptionTierEnum.default("BASIC"),
  status: SubscriptionStatusEnum.default("ACTIVE"),
  startDate: z.date(),
  endDate: z.date(),
  features: z.array(z.string()),
  paymentHistoryId: z.string().optional(),
  isAutoRenew: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  agencyId: z.string().optional(),
  agentId: z.string().optional(),
  userId: z.string().optional(),
  pricingRuleId: z.string().optional(),
  Agency: z.any().optional(),
  Agent: z.any().optional(),
  User: z.any().optional(),
  PricingRule: z.any().optional(),
});

// Create Subscription Schema
export const CreateSubscriptionSchema = z.object({
  entityId: z.string(),
  entityType: z.string(),
  tier: SubscriptionTierEnum.default("BASIC"),
  status: SubscriptionStatusEnum.default("ACTIVE"),
  startDate: z.date(),
  endDate: z.date(),
  features: z.array(z.string()),
  paymentHistoryId: z.string().optional(),
  isAutoRenew: z.boolean().default(true),
  agencyId: z.string().optional(),
  agentId: z.string().optional(),
  userId: z.string().optional(),
  pricingRuleId: z.string().optional(),
});

// Update Subscription Schema
export const UpdateSubscriptionSchema = z.object({
  id: z.string(),
  tier: SubscriptionTierEnum.optional(),
  status: SubscriptionStatusEnum.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  features: z.array(z.string()).optional(),
  paymentHistoryId: z.string().optional(),
  isAutoRenew: z.boolean().optional(),
  agencyId: z.string().optional(),
  agentId: z.string().optional(),
  userId: z.string().optional(),
  pricingRuleId: z.string().optional(),
  deletedAt: z.date().nullable().optional(),
  PricingRule: z.any().optional(),
});

// Subscription Filter Schema
export const SubscriptionFilterSchema = z.object({
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  tier: SubscriptionTierEnum.optional(),
  status: SubscriptionStatusEnum.optional(),
  startDateFrom: z.string().datetime().optional(),
  startDateTo: z.string().datetime().optional(),
  endDateFrom: z.string().datetime().optional(),
  endDateTo: z.string().datetime().optional(),
  isAutoRenew: z.boolean().optional(),
  createdAtFrom: z.string().datetime().optional(),
  createdAtTo: z.string().datetime().optional(),
  updatedAtFrom: z.string().datetime().optional(),
  updatedAtTo: z.string().datetime().optional(),
  agencyId: z.string().optional(),
  agentId: z.string().optional(),
  userId: z.string().optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["createdAt", "status", "tier"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Zod Type Inference for TypeScript
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
export type SubscriptionFilterInput = z.infer<typeof SubscriptionFilterSchema>;

// Re-export schemas
export const schemas = {
  SubscriptionSchema,
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SubscriptionFilterSchema
};
