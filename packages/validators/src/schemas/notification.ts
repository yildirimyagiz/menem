import { NotificationType } from "@prisma/client";
import { z } from "zod";

export const NotificationTypeEnum = z.nativeEnum(NotificationType);

// Notification Schema
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotificationTypeEnum,
  content: z.string(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  isRead: z.boolean().default(false),
  tenantId: z.string().optional(),
  agencyId: z.string().optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
  deletedAt: z.date().optional(),
  reviewId: z.string().optional(),
  agentId: z.string().optional(),
  Agency: z.any().optional(),
  Agent: z.any().optional(),
  Review: z.any().optional(),
  Tenant: z.any().optional(),
  User: z.any(), // User is required due to onDelete: Cascade relation
});

// Create Notification Schema
export const CreateNotificationSchema = z.object({
  userId: z.string(),
  type: NotificationTypeEnum,
  content: z.string(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  tenantId: z.string().optional(),
  agencyId: z.string().optional(),
  reviewId: z.string().optional(),
  agentId: z.string().optional(),
});

// Update Notification Schema
export const UpdateNotificationSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
  isRead: z.boolean().optional(),
  deletedAt: z.date().optional(),
});

// Notification Filter Schema
export const NotificationFilterSchema = z.object({
  userId: z.string().optional(),
  type: NotificationTypeEnum.optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  isRead: z.boolean().optional(),
  tenantId: z.string().optional(),
  agencyId: z.string().optional(),
  reviewId: z.string().optional(),
  agentId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "type", "isRead"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;
export type NotificationFilterInput = z.infer<typeof NotificationFilterSchema>;
