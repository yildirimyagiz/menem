import { z } from "zod";

import { PaymentStatusEnum } from "./payment";

// Tenant Schema
export const TenantSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  propertyId: z.string(),

  leaseStartDate: z.date(),
  leaseEndDate: z.date(),
  paymentStatus: PaymentStatusEnum.default("PAID"), // Ensure PaymentStatusEnum matches Prisma's PaymentStatus
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
  Expense: z.array(z.any()).optional(),
  Increase: z.array(z.any()).optional(),
  Notification: z.array(z.any()).optional(),
  Payment: z.array(z.any()).optional(),

  User: z.any().optional(),
});

// Create Tenant Schema
export const CreateTenantSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  propertyId: z.string(),
  leaseStartDate: z.date(),
  leaseEndDate: z.date(),
  paymentStatus: PaymentStatusEnum.default("PAID"), // Ensure PaymentStatusEnum matches Prisma's PaymentStatus
});

// Update Tenant Schema
export const UpdateTenantSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  propertyId: z.string().optional(),
  leaseStartDate: z.date().optional(),
  leaseEndDate: z.date().optional(),
  paymentStatus: PaymentStatusEnum.optional().default("PAID"), // Ensure PaymentStatusEnum matches Prisma's PaymentStatus
  deletedAt: z.date().optional(),
});

// Tenant Filter Schema
export const TenantFilterSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  propertyId: z.string().optional(),
  leaseStartDateFrom: z.date().optional(),
  leaseStartDateTo: z.date().optional(),
  leaseEndDateFrom: z.date().optional(),
  leaseEndDateTo: z.date().optional(), // Prisma: DateTime?
  paymentStatus: PaymentStatusEnum.optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z
    .enum(["leaseStartDate", "leaseEndDate", "paymentStatus"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Tenant = z.infer<typeof TenantSchema>;
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
export type TenantFilterInput = z.infer<typeof TenantFilterSchema>;
