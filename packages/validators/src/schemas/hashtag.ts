import { HashtagType } from "@prisma/client";
import { z } from "zod";

// Hashtag Schema
export const HashtagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.nativeEnum(HashtagType).default(HashtagType.GENERAL),
  description: z.string().optional(),
  usageCount: z.number().int().min(0).default(1),
  relatedTags: z.array(z.string()),
  createdById: z.string().optional(),
  agencyId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  Agency: z.any().optional(),
  User: z.any().optional(),

  Post: z.array(z.any()).optional(),
  Property: z.array(z.any()).optional(),
});

// Create Hashtag Schema
export const CreateHashtagSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(HashtagType).default(HashtagType.GENERAL),
  description: z.string().optional(),
  relatedTags: z.array(z.string()).optional(),
  createdById: z.string().optional(),
  agencyId: z.string().optional(),
});

// Update Hashtag Schema
export const UpdateHashtagSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  type: z.nativeEnum(HashtagType).optional(),
  description: z.string().optional(),
  usageCount: z.number().int().min(0).optional(),
  relatedTags: z.array(z.string()).optional(),
  deletedAt: z.date().optional(),
  createdById: z.string().optional(),
  agencyId: z.string().optional(),
});

// Hashtag Filter Schema
export const HashtagFilterSchema = z.object({
  name: z.string().optional(),
  type: z.nativeEnum(HashtagType).optional(),
  createdById: z.string().optional(),
  agencyId: z.string().optional(),
  usageCountMin: z.number().optional(),
  usageCountMax: z.number().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["name", "usageCount", "createdAt", "type"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Hashtag = z.infer<typeof HashtagSchema>;
export type CreateHashtagInput = z.infer<typeof CreateHashtagSchema>;
export type UpdateHashtagInput = z.infer<typeof UpdateHashtagSchema>;
export type HashtagFilterInput = z.infer<typeof HashtagFilterSchema>;
