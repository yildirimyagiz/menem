import { z } from "zod";

// Enum for AnalyticsType based on your Prisma schema
export const AnalyticsType = z.enum([
  "LISTING_VIEW",
  "BOOKING_CONVERSION",
  "ML_PROPERTY_SCORE",
  "USER_ENGAGEMENT",
  "REVENUE",
  "PERFORMANCE",
  "AGENT_PERFORMANCE",
  "AGENCY_PERFORMANCE",
  // Tax Analytics Types
  "TAX_PAYMENT",
  "TAX_OVERDUE",
  "TAX_COMPLIANCE",
  "TAX_REVENUE",
  "TAX_PERFORMANCE",
  "TAX_REMINDER",
  "TAX_AUDIT",
  "TAX_REPORT"
]);

// Analytics Schema
export const AnalyticsSchema = z.object({
  id: z.string(),
  entityId: z.string(),
  entityType: z.string(),
  type: AnalyticsType,
  data: z.record(z.unknown()).optional().nullable(), // For JSON data
  timestamp: z.date(),
  deletedAt: z.date().optional().nullable(),

  // Optional relational IDs - adjust based on how you plan to use/query them
  propertyId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  agencyId: z.string().optional().nullable(),
  reservationId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  taxRecordId: z.string().optional().nullable(),

  // You might want to include related objects if you fetch them,
  // but for basic validation, IDs are often sufficient.
  // Property: z.any().optional(),
  // User: z.any().optional(),
  // Agent: z.any().optional(),
  // Agency: z.any().optional(),
  // Reservation: z.any().optional(),
  // Task: z.any().optional(),
  // TaxRecord: z.any().optional(),
});

// Create Analytics Schema
export const CreateAnalyticsSchema = z.object({
  entityId: z.string(),
  entityType: z.string(),
  type: AnalyticsType,
  data: z.record(z.unknown()).optional().nullable(),
  timestamp: z.date().optional(), // Often set by default in DB

  // Optional relational IDs on creation
  propertyId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  agencyId: z.string().optional().nullable(),
  reservationId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  taxRecordId: z.string().optional().nullable(),
});

// Update Analytics Schema (Analytics records are often immutable, but for completeness)
export const UpdateAnalyticsSchema = z.object({
  id: z.string(),
  data: z.record(z.unknown()).optional().nullable(),
  deletedAt: z.date().optional().nullable(), // For soft deletes
});

// Analytics Filter Schema
export const AnalyticsFilterSchema = z.object({
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  type: AnalyticsType.optional(),
  propertyId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  taxRecordId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  sortBy: z.enum(["timestamp", "type", "entityType"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

// Zod Type Inference for TypeScript
export type Analytics = z.infer<typeof AnalyticsSchema>;
export type CreateAnalyticsInput = z.infer<typeof CreateAnalyticsSchema>;
export type UpdateAnalyticsInput = z.infer<typeof UpdateAnalyticsSchema>;
export type AnalyticsFilterInput = z.infer<typeof AnalyticsFilterSchema>;
