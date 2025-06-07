import { z } from "zod";

// Review Schema
export const ReviewSchema = z.object({
  id: z.string().optional(),

  userId: z.string(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),
  title: z.string(),
  content: z.string(),
  rating: z.number().min(1).max(5),
  parentReviewId: z.string().optional(),
  isEdited: z.boolean().default(false),
  helpfulCount: z.number().default(0),
  notHelpfulCount: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),

  Agency: z.any().optional(),
  Agent: z.any().optional(),

  Property: z.any().optional(),
  User: z.any().optional(),
});

// Create Review Schema
export const CreateReviewSchema = z.object({
  userId: z.string(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),
  title: z.string(),
  content: z.string(),
  rating: z.number().min(1).max(5),
  parentReviewId: z.string().optional(),
  isEdited: z.boolean().default(false),
  helpfulCount: z.number().default(0),
  notHelpfulCount: z.number().default(0),
});

// Update Review Schema
export const UpdateReviewSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  isEdited: z.boolean().optional(),
  helpfulCount: z.number().optional(),
  notHelpfulCount: z.number().optional(),
  deletedAt: z.date().optional(),
});

// Review Filter Schema
export const ReviewFilterSchema = z.object({
  userId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  isEdited: z.boolean().optional(),
  helpfulCountFrom: z.number().optional(),
  notHelpfulCountFrom: z.number().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Review = z.infer<typeof ReviewSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewSchema>;
export type ReviewFilterInput = z.infer<typeof ReviewFilterSchema>;
