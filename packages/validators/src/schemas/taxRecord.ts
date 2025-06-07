import { z } from "zod";

// TaxRecord Schema
export const TaxRecordSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  year: z.number(),
  amount: z.number(),
  paid: z.boolean().optional(),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create TaxRecord Schema
export const CreateTaxRecordSchema = z.object({
  propertyId: z.string(),
  year: z.number(),
  amount: z.number(),
  paid: z.boolean().optional(),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  notes: z.string().optional(),
});

// Update TaxRecord Schema
export const UpdateTaxRecordSchema = z.object({
  id: z.string(),
  year: z.number().optional(),
  amount: z.number().optional(),
  paid: z.boolean().optional(),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  notes: z.string().optional(),
});

// TaxRecord Filter Schema
export const TaxRecordFilterSchema = z.object({
  propertyId: z.string().optional(),
  year: z.number().optional(),
  paid: z.boolean().optional(),
  sortBy: z.enum(["year", "amount", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type TaxRecord = z.infer<typeof TaxRecordSchema>;
export type CreateTaxRecordInput = z.infer<typeof CreateTaxRecordSchema>;
export type UpdateTaxRecordInput = z.infer<typeof UpdateTaxRecordSchema>;
export type TaxRecordFilterInput = z.infer<typeof TaxRecordFilterSchema>;
