import { z } from "zod";

// Define IncreaseStatus locally since import is not working
const IncreaseStatus = {
  PENDING: "PENDING" as const,
  ACCEPTED: "ACCEPTED" as const,
  REJECTED: "REJECTED" as const,
  WITHDRAWN: "WITHDRAWN" as const,
} as const;

type IncreaseStatus = typeof IncreaseStatus[keyof typeof IncreaseStatus];

// Increase Schema
export const IncreaseSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  tenantId: z.string(),
  proposedBy: z.string(),
  oldRent: z.number().positive(),
  newRent: z.number().positive(),
  effectiveDate: z.date(),
  status: z
    .enum([
      IncreaseStatus.PENDING,
      IncreaseStatus.ACCEPTED,
      IncreaseStatus.REJECTED,
      IncreaseStatus.WITHDRAWN,
    ])
    .default(IncreaseStatus.PENDING),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  Property: z.any().optional(),
  Tenant: z.any().optional(),
  Offer: z.any().optional(),
});

// Create Increase Schema
export const CreateIncreaseSchema = z.object({
  propertyId: z.string(),
  tenantId: z.string(),
  proposedBy: z.string(),
  oldRent: z.number().positive(),
  newRent: z.number().positive(),
  effectiveDate: z.date(),
  status: z
    .enum([
      IncreaseStatus.PENDING,
      IncreaseStatus.ACCEPTED,
      IncreaseStatus.REJECTED,
      IncreaseStatus.WITHDRAWN,
    ])
    .default(IncreaseStatus.PENDING),
  contractId: z.string().uuid().optional().nullable(), // Allow contract to be optional
});

// Update Increase Schema
export const UpdateIncreaseSchema = z.object({
  id: z.string(),
  newRent: z.number().positive().optional(),
  effectiveDate: z.date().optional(),
  status: z
    .enum([
      IncreaseStatus.PENDING,
      IncreaseStatus.ACCEPTED,
      IncreaseStatus.REJECTED,
      IncreaseStatus.WITHDRAWN,
    ])
    .optional(),
});

// Increase Filter Schema
export const IncreaseFilterSchema = z.object({
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),
  proposedBy: z.string().optional(),
  status: z
    .enum([
      IncreaseStatus.PENDING,
      IncreaseStatus.ACCEPTED,
      IncreaseStatus.REJECTED,
      IncreaseStatus.WITHDRAWN,
    ])
    .optional(),
  effectiveDateFrom: z.date().optional(),
  effectiveDateTo: z.date().optional(),
  oldRentMin: z.number().optional(),
  oldRentMax: z.number().optional(),
  newRentMin: z.number().optional(),
  newRentMax: z.number().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  sortBy: z
    .enum(["effectiveDate", "oldRent", "newRent", "status", "createdAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  deletedAt: z.date().optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Increase = z.infer<typeof IncreaseSchema>;
export type CreateIncreaseInput = z.infer<typeof CreateIncreaseSchema>;
export type UpdateIncreaseInput = z.infer<typeof UpdateIncreaseSchema>;
export type IncreaseFilterInput = z.infer<typeof IncreaseFilterSchema>;

// Export the enum for use in other packages
export { IncreaseStatus };
