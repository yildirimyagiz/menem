import { z } from "zod";

export const IncludedServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  logo: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  properties: z.array(z.any()).optional(),
  listings: z.array(z.any()).optional(),
  agencies: z.array(z.any()).optional(),
  users: z.array(z.any()).optional(),
  tasks: z.array(z.any()).optional(),
  reports: z.array(z.any()).optional(),
  FacilityAmenities: z.array(z.any()).optional(),
  locationAmenities: z.array(z.any()).optional(),
  expenses: z.array(z.any()).optional(),
  extraCharges: z.array(z.any()).optional(),
  Facility: z.any().optional(),
  facilityId: z.string().optional(),
});

export const CreateIncludedServiceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  logo: z.string().optional(),
  facilityId: z.string().optional(),
});

export const UpdateIncludedServiceSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  logo: z.string().optional(),
  deletedAt: z.date().optional(),
  facilityId: z.string().optional(),
});

export const IncludedServiceFilterSchema = z.object({
  name: z.string().optional(),
  facilityId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type IncludedService = z.infer<typeof IncludedServiceSchema>;
export type CreateIncludedServiceInput = z.infer<typeof CreateIncludedServiceSchema>;
export type UpdateIncludedServiceInput = z.infer<typeof UpdateIncludedServiceSchema>;
export type IncludedServiceFilterInput = z.infer<typeof IncludedServiceFilterSchema>;
