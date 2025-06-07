import { z } from "zod";

// Enum for Photo Type
export const PhotoTypeEnum = z.enum([
  "COVER",
  "GALLERY",
  "PROFILE",
  "DOCUMENT",
  "INTERIOR",
  "EXTERIOR",
  "AERIAL",
  "FLOOR_PLAN",
]);

// Photo Schema
export const PhotoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  type: PhotoTypeEnum.default("GALLERY"),
  caption: z.string().optional(),
  featured: z.boolean().default(false),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().max(100).optional(),
  dominantColor: z.string().max(7).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),

  userId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  postId: z.string().optional(),
  deletedAt: z.date().optional(),
  Agency: z.any().optional(),
  Agent: z.any().optional(),

  Post: z.any().optional(),
  Property: z.any().optional(),
  User: z.any().optional(),
});

// Create Photo Schema
export const CreatePhotoSchema = z.object({
  url: z.string().url(),
  type: PhotoTypeEnum.default("GALLERY"),
  caption: z.string().optional(),
  featured: z.boolean().default(false),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().max(100).optional(),
  dominantColor: z.string().max(7).optional(),

  userId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  postId: z.string().optional(),
  deletedAt: z.date().optional(),
});

// Update Photo Schema
export const UpdatePhotoSchema = z.object({
  id: z.string(),
  url: z.string().url().optional(),
  type: PhotoTypeEnum.optional(),
  caption: z.string().optional(),
  featured: z.boolean().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().max(100).optional(),
  dominantColor: z.string().max(7).optional(),

  userId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  postId: z.string().optional(),
  deletedAt: z.date().optional(),
});

// Photo Filter Schema
export const PhotoFilterSchema = z.object({
  type: PhotoTypeEnum.optional(),
  featured: z.boolean().optional(),

  userId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  postId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "type", "featured"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Photo = z.infer<typeof PhotoSchema>;
export type CreatePhotoInput = z.infer<typeof CreatePhotoSchema>;
export type UpdatePhotoInput = z.infer<typeof UpdatePhotoSchema>;
export type PhotoFilterInput = z.infer<typeof PhotoFilterSchema>;
