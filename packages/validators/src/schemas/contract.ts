import { z } from "zod";

// Contract Status Enum
export const ContractStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
  "PUBLISHED",
  "EXPIRED",
  "TERMINATED",
  "CANCELLED",
  "OVERDUE",
  "RENEWED",
]);

// Contract Schema
export const ContractSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: ContractStatus,
  startDate: z.date().or(z.string().pipe(z.coerce.date())),
  endDate: z.date().or(z.string().pipe(z.coerce.date())),
  tenantId: z.string(),
  propertyId: z.string(),
  agencyId: z.string(),
  terms: z.record(z.any()).optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),
  createdAt: z.date().or(z.string().pipe(z.coerce.date())),
  updatedAt: z.date().or(z.string().pipe(z.coerce.date())),
  deletedAt: z
    .date()
    .or(z.string().pipe(z.coerce.date()))
    .optional()
    .nullable(),
});

// Create Contract Schema
export const CreateContractSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    status: ContractStatus.optional().default("DRAFT"),
    startDate: z.date().or(z.string().pipe(z.coerce.date())),
    endDate: z.date().or(z.string().pipe(z.coerce.date())),
    tenantId: z.string().min(1, "Tenant ID is required"),
    propertyId: z.string().min(1, "Property ID is required"),
    agencyId: z.string().min(1, "Agency ID is required"),
    terms: z.record(z.any()).optional().nullable(),
    metadata: z.record(z.any()).optional().nullable(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Update Contract Schema
export const UpdateContractSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    status: ContractStatus.optional(),
    startDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
    endDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
    terms: z.record(z.any()).optional().nullable(),
    metadata: z.record(z.any()).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

// Contract Filter Schema
export const ContractFilterSchema = z.object({
  status: ContractStatus.optional(),
  tenantId: z.string().optional(),
  propertyId: z.string().optional(),
  agencyId: z.string().optional(),
  startDateFrom: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  startDateTo: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  endDateFrom: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  endDateTo: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  sortBy: z.enum(["startDate", "endDate", "status", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Contract = z.infer<typeof ContractSchema>;
export type ContractStatusType = z.infer<typeof ContractStatus>;
export type CreateContractInput = z.infer<typeof CreateContractSchema>;
export type UpdateContractInput = z.infer<typeof UpdateContractSchema>;
export type ContractFilterInput = z.infer<typeof ContractFilterSchema>;
