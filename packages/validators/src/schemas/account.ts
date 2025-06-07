import { z } from "zod";

// Account Schema
export const AccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["OAUTH", "EMAIL", "OIDC", "CREDENTIALS", "GOOGLE", "FACEBOOK"]),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  user: z.any().optional(),
});

// Create Account Schema
export const CreateAccountSchema = z.object({
  userId: z.string(),
  type: z.enum(["OAUTH", "EMAIL", "OIDC", "CREDENTIALS", "GOOGLE", "FACEBOOK"]),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
});

// Update Account Schema
export const UpdateAccountSchema = z.object({
  id: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  isActive: z.boolean().optional(), // Add this
});

// Account Filter Schema
export const AccountFilterSchema = z.object({
  userId: z.string().optional(),
  type: z
    .enum(["OAUTH", "EMAIL", "OIDC", "CREDENTIALS", "GOOGLE", "FACEBOOK"])
    .optional(),
  provider: z.string().optional(),
  providerAccountId: z.string().optional(),
  sortBy: z.enum(["provider", "type", "userId"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Account = z.infer<typeof AccountSchema>;
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
export type AccountFilterInput = z.infer<typeof AccountFilterSchema>;
