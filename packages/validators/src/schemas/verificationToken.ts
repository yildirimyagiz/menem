import { z } from "zod";

// VerificationToken Schema
export const VerificationTokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  token: z.string(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date(),
});

// Create VerificationToken Schema
export const CreateVerificationTokenSchema = z.object({
  userId: z.string(),
  token: z.string(),
});

// Update VerificationToken Schema
export const UpdateVerificationTokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().optional(),
  token: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Filter VerificationToken Schema
export const VerificationTokenFilterSchema = z.object({
  userId: z.string().optional(),
  token: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "userId"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type VerificationToken = z.infer<typeof VerificationTokenSchema>;
export type CreateVerificationTokenInput = z.infer<typeof CreateVerificationTokenSchema>;
export type UpdateVerificationTokenInput = z.infer<typeof UpdateVerificationTokenSchema>;
export type VerificationTokenFilterInput = z.infer<typeof VerificationTokenFilterSchema>;
