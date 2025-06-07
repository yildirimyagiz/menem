import { z } from "zod";

export const AgencyStatus = z.enum(["PENDING", "ACTIVE", "SUSPENDED"]);

export const AgencySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  status: AgencyStatus.default("PENDING"),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().optional(),
  settings: z.any().optional(),
  theme: z.string().optional(),
  externalId: z.string().optional(),
  integration: z.any().optional(),

  Agent: z.array(z.any()).optional(),
  Analytics: z.array(z.any()).optional(),
  CommunicationLog: z.array(z.any()).optional(),
  ComplianceRecord: z.array(z.any()).optional(),
  Expense: z.array(z.any()).optional(),
  Hashtag: z.array(z.any()).optional(),
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
  name: z.string(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  status: AgencyStatus.optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().optional(),
  settings: z.any().optional(),
  theme: z.string().optional(),
  externalId: z.string().optional(),
  integration: z.any().optional(),
});

export const UpdateAgencySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  status: AgencyStatus.optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().optional(),
  settings: z.any().optional(),
  theme: z.string().optional(),
  externalId: z.string().optional(),
  integration: z.any().optional(),
  deletedAt: z.date().optional(),
});

export const AgencyFilterSchema = z.object({
  search: z.string().optional(), // free-text search by name, email, etc.
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().optional(),
  hasDeleted: z.boolean().optional(), // include soft-deleted
  createdFrom: z.date().optional(),
  createdTo: z.date().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type Agency = z.infer<typeof AgencySchema>;
export type CreateAgencyInput = z.infer<typeof CreateAgencySchema>;
export type UpdateAgencyInput = z.infer<typeof UpdateAgencySchema>;
export type AgencyFilterInput = z.infer<typeof AgencyFilterSchema>;
