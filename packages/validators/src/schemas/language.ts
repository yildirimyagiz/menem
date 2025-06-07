import { z } from "zod";

// Language Schema
export const LanguageSchema = z.object({
  id: z.string(),
  code: z.string().min(2).max(5),
  name: z.string(),
  nativeName: z.string(),
  isRTL: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  agencyId: z.string().optional(),
  Agency: z.any().optional(),
});

// Create Language Schema
export const CreateLanguageSchema = z.object({
  code: z.string().min(2).max(5),
  name: z.string(),
  nativeName: z.string(),
  isRTL: z.boolean().default(false),
  isActive: z.boolean().default(true),
  agencyId: z.string().optional(),
});

// Update Language Schema
export const UpdateLanguageSchema = z.object({
  id: z.string(),
  code: z.string().min(2).max(5).optional(),
  name: z.string().optional(),
  nativeName: z.string().optional(),
  isRTL: z.boolean().optional(),
  isActive: z.boolean().optional(),
  deletedAt: z.date().optional(),
  agencyId: z.string().optional(),
});

// Language Filter Schema
export const LanguageFilterSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  nativeName: z.string().optional(),
  isRTL: z.boolean().optional(),
  isActive: z.boolean().optional(),
  agencyId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["code", "name", "nativeName", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Language = z.infer<typeof LanguageSchema>;
export type CreateLanguageInput = z.infer<typeof CreateLanguageSchema>;
export type UpdateLanguageInput = z.infer<typeof UpdateLanguageSchema>;
export type LanguageFilterInput = z.infer<typeof LanguageFilterSchema>;
