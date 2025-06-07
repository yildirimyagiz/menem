import { z } from "zod";

// Enums matching Prisma schema
export const TaskStatusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);
export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const TaskTypeEnum = z.enum([
  "PROPERTY_MAINTENANCE",
  "LISTING_REVIEW",
  "CLIENT_FOLLOW_UP",
  "DOCUMENT_PROCESSING",
  "MARKETING_TASK",
  "SALES_ACTIVITY",
  "COMPLIANCE_CHECK",
  "COMMUNICATION_FOLLOW_UP",
]);

// Task Schema
export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  status: TaskStatusEnum.default("TODO"),
  type: TaskTypeEnum,
  priority: TaskPriorityEnum.default("MEDIUM"),
  createdById: z.string().optional(),
  assignedToId: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
  Analytics: z.array(z.any()).optional(),
  Mention: z.array(z.any()).optional(),
  Agency: z.any().optional(),
  Agent: z.any().optional(),
  createdBy: z.any().optional(),
  assignedTo: z.any().optional(),

  Property: z.any().optional(),
  Facility: z.any().optional(),
  IncludedService: z.any().optional(),
  ExtraCharge: z.any().optional(),
});

// Create Task Schema
export const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: TaskStatusEnum.default("TODO"),
  type: TaskTypeEnum,
  priority: TaskPriorityEnum.default("MEDIUM"),
  createdById: z.string().optional(),
  assignedToId: z.string().optional(),

  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
});

// Update Task Schema
export const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: TaskStatusEnum.optional(),
  type: TaskTypeEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  createdById: z.string().optional(),
  assignedToId: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
});

// Task Filter Schema
export const TaskFilterSchema = z.object({
  title: z.string().optional(),
  status: TaskStatusEnum.optional(),
  type: TaskTypeEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  createdById: z.string().optional(),
  assignedToId: z.string().optional(),

  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
  completedAtFrom: z.date().optional(),
  completedAtTo: z.date().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
  sortBy: z.enum(["dueDate", "createdAt", "priority"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskFilterInput = z.infer<typeof TaskFilterSchema>;
