import { z } from "zod";

export const CommissionRuleType = z.enum([
  "SEASONAL",
  "VOLUME",
  "PROPERTY_TYPE",
  "LOCATION_BASED",
  "BOOKING_VALUE",
  "LOYALTY",
  "SPECIAL_PROMOTION",
  "PACKAGE_DEAL",
  "PRICE_COMPARISON",
  "COMMISSION_SUMMARY",
  "BOOKING_VOLUME",
  "REVENUE",
  "PERFORMANCE",
]);

export const CommissionRuleSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  ruleType: CommissionRuleType,
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  commission: z.number(),
  minVolume: z.number().int().optional(),
  maxVolume: z.number().int().optional(),
  conditions: z.any().optional(),
  provider: z.any().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const CreateCommissionRuleSchema = z.object({
  providerId: z.string(),
  ruleType: CommissionRuleType,
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  commission: z.number(),
  minVolume: z.number().int().optional(),
  maxVolume: z.number().int().optional(),
  conditions: z.any().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const UpdateCommissionRuleSchema = z.object({
  id: z.string(),
  providerId: z.string().optional(),
  ruleType: CommissionRuleType.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  commission: z.number().optional(),
  minVolume: z.number().int().optional(),
  maxVolume: z.number().int().optional(),
  conditions: z.any().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const CommissionRuleFilterSchema = z.object({
  providerId: z.string().optional(),
  ruleType: CommissionRuleType.optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  endDateFrom: z.date().optional(),
  endDateTo: z.date().optional(),
  commissionMin: z.number().optional(),
  commissionMax: z.number().optional(),
  minVolume: z.number().int().optional(),
  maxVolume: z.number().int().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  deletedAtFrom: z.date().optional(),
  deletedAtTo: z.date().optional(),
  sortBy: z.enum(["startDate", "endDate", "commission"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type CommissionRule = z.infer<typeof CommissionRuleSchema>;
export type CreateCommissionRuleInput = z.infer<
  typeof CreateCommissionRuleSchema
>;
export type UpdateCommissionRuleInput = z.infer<
  typeof UpdateCommissionRuleSchema
>;
export type CommissionRuleFilterInput = z.infer<
  typeof CommissionRuleFilterSchema
>;
