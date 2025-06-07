import { z } from "zod";

// Enum for Mention Type
export const MentionTypeEnum = z.enum(["USER", "PROPERTY", "TASK"]);

// Mention Schema
export const MentionSchema = z.object({
  id: z.string(),
  mentionedById: z.string(),
  mentionedToId: z.string(),
  type: MentionTypeEnum,
  taskId: z.string().optional(),
  propertyId: z.string().optional(),
  content: z.string().optional(),
  isRead: z.boolean().default(false),
  agencyId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
  userId: z.string().optional(),
  Agency: z.any().optional(),

  Property: z.any().optional(),
  Task: z.any().optional(),
  User: z.any().optional(),
});

// Create Mention Schema
export const CreateMentionSchema = z.object({
  mentionedById: z.string(),
  mentionedToId: z.string(),
  type: MentionTypeEnum,
  taskId: z.string().optional(),
  propertyId: z.string().optional(),
  content: z.string().optional(),
  agencyId: z.string().optional(),
  userId: z.string().optional(),
});

// Update Mention Schema
export const UpdateMentionSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
  isRead: z.boolean().optional(),
  deletedAt: z.date().optional(),
});

// Mention Filter Schema
export const MentionFilterSchema = z.object({
  mentionedById: z.string().optional(),
  mentionedToId: z.string().optional(),
  type: MentionTypeEnum.optional(),
  taskId: z.string().optional(),
  propertyId: z.string().optional(),
  isRead: z.boolean().optional(),
  agencyId: z.string().optional(),
  userId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "type", "isRead"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Mention = z.infer<typeof MentionSchema>;
export type CreateMentionInput = z.infer<typeof CreateMentionSchema>;
export type UpdateMentionInput = z.infer<typeof UpdateMentionSchema>;
export type MentionFilterInput = z.infer<typeof MentionFilterSchema>;
