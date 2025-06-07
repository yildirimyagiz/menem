import { z } from "zod";

export const MortgageStatus = z.enum([
  "ACTIVE",
  "PAID",
  "DEFAULTED",
  "CANCELLED",
]);

// Mortgage Schema
export const MortgageSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  lender: z.string(),
  principal: z.number(),
  interestRate: z.number(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: MortgageStatus.optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

// Create Mortgage Schema
export const CreateMortgageSchema = z.object({
  propertyId: z.string(),
  lender: z.string(),
  principal: z.number(),
  interestRate: z.number(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: MortgageStatus.optional(),
  notes: z.string().optional(),
});

// Update Mortgage Schema
export const UpdateMortgageSchema = z.object({
  id: z.string(),
  lender: z.string().optional(),
  principal: z.number().optional(),
  interestRate: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: MortgageStatus.optional(),
  notes: z.string().optional(),
});

// Mortgage Filter Schema
export const MortgageFilterSchema = z.object({
  propertyId: z.string().optional(),
  lender: z.string().optional(),
  status: MortgageStatus.optional(),
  sortBy: z.enum(["lender", "principal", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Mortgage = z.infer<typeof MortgageSchema>;
export type CreateMortgageInput = z.infer<typeof CreateMortgageSchema>;
export type UpdateMortgageInput = z.infer<typeof UpdateMortgageSchema>;
export type MortgageFilterInput = z.infer<typeof MortgageFilterSchema>;
