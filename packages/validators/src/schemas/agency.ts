import { z } from "zod";

export const AgencyStatus = z.enum(["PENDING", "ACTIVE", "SUSPENDED"]);

export const AgencySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Agency name is required").max(255),
  description: z.string().max(1000).optional(),
  email: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  website: z.string().url("Invalid website URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  status: AgencyStatus.default("PENDING"),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  isActive: z.boolean().default(true),
  ownerId: z.string().uuid().optional(),
  settings: z.record(z.any()).optional(),
  theme: z.string().max(50).optional(),
  externalId: z.string().max(100).optional(),
  integration: z.record(z.any()).optional(),

  Agent: z.array(z.any()).optional(),
  Analytics: z.array(z.any()).optional(),
  CommunicationLog: z.array(z.any()).optional(),
  ComplianceRecord: z.array(z.any()).optional(),
  Expense: z.array(z.any()).optional(),
  Hashtag: z.array(z.any()).optional(),
  location: z.array(z.any()).optional(),
  Language: z.array(z.any()).optional(),

  Mention: z.array(z.any()).optional(),
  Notification: z.array(z.any()).optional(),
  Photo: z.array(z.any()).optional(),
  Post: z.array(z.any()).optional(),
  Report: z.array(z.any()).optional(),
  Reservation: z.array(z.any()).optional(),
  Review: z.array(z.any()).optional(),
  Subscription: z.array(z.any()).optional(),
  Task: z.array(z.any()).optional(),
  User: z.array(z.any()).optional(),
});

export const CreateAgencySchema = z.object({
  name: z.string().min(1, "Agency name is required").max(255),
  description: z.string().max(1000).optional(),
  email: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  website: z.string().url("Invalid website URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  status: AgencyStatus.optional(),
  isActive: z.boolean().default(true),
  ownerId: z.string().uuid().optional(),
  settings: z.record(z.any()).optional(),
  theme: z.string().max(50).optional(),
  externalId: z.string().max(100).optional(),
  integration: z.record(z.any()).optional(),
});

export const UpdateAgencySchema = z.object({
  id: z.string().uuid("Invalid agency ID"),
  name: z.string().min(1, "Agency name is required").max(255).optional(),
  description: z.string().max(1000).optional(),
  email: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  website: z.string().url("Invalid website URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  status: AgencyStatus.optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().uuid().optional(),
  settings: z.record(z.any()).optional(),
  theme: z.string().max(50).optional(),
  externalId: z.string().max(100).optional(),
  integration: z.record(z.any()).optional(),
  deletedAt: z.date().nullable().optional(),
});

export const AgencyFilterSchema = z.object({
  search: z
    .string()
    .min(1, "Search term must be at least 1 character")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().uuid("Invalid owner ID").optional(),
  status: AgencyStatus.optional(),
  hasDeleted: z.boolean().optional(),
  createdFrom: z.date().optional(),
  createdTo: z.date().optional(),
  updatedFrom: z.date().optional(),
  updatedTo: z.date().optional(),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt", "status", "isActive"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1, "Page must be at least 1").optional(),
  pageSize: z
    .number()
    .min(1, "Page size must be at least 1")
    .max(100, "Page size cannot exceed 100")
    .optional(),
});

export type Agency = z.infer<typeof AgencySchema>;
export type CreateAgencyInput = z.infer<typeof CreateAgencySchema>;
export type UpdateAgencyInput = z.infer<typeof UpdateAgencySchema>;
export type AgencyFilterInput = z.infer<typeof AgencyFilterSchema>;
