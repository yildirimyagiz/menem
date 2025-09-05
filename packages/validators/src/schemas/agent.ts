import { z } from "zod";

export const AgentStatusEnum = z.enum(["PENDING", "ACTIVE", "SUSPENDED"]);

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  locationId: z.string().optional(),
  language: z.array(z.any()).optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  status: AgentStatusEnum.default("PENDING"),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
  agencyId: z.string().optional(),
  settings: z.any().optional(),
  externalId: z.string().optional(),
  integration: z.any().optional(),
  ownerId: z.string().optional(),
  Owner: z.any().optional(),
  lastActive: z.date().optional(),

  Agency: z.any().optional(),
  Analytics: z.array(z.any()).optional(),
  ComplianceRecord: z.array(z.any()).optional(),

  Notification: z.array(z.any()).optional(),
  Photo: z.array(z.any()).optional(),
  Post: z.array(z.any()).optional(),
  Property: z.array(z.any()).optional(),
  Report: z.array(z.any()).optional(),
  Reservation: z.array(z.any()).optional(),
  Review: z.array(z.any()).optional(),
  Subscription: z.array(z.any()).optional(),
  Task: z.array(z.any()).optional(),
});

export const CreateAgentSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  locationId: z.string().optional(),
  language: z.array(z.any()).optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  status: AgentStatusEnum.optional(),
  agencyId: z.string().optional(),
  settings: z.any().optional(),
  externalId: z.string().optional(),
  integration: z.any().optional(),
  ownerId: z.string().optional(),
  lastActive: z.date().optional(),
});

export const UpdateAgentSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  locationId: z.string().optional(),
  language: z.array(z.any()).optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  status: AgentStatusEnum.optional(),
  agencyId: z.string().optional(),
  settings: z.any().optional(),
  externalId: z.string().optional(),
  integration: z.any().optional(),
  ownerId: z.string().optional(),
  lastActive: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const AgentFilterSchema = z.object({
  search: z.string().optional(), // for name or related data
  agencyId: z.string().optional(),
  status: AgentStatusEnum.optional(),
  ownerId: z.string().optional(),
  hasDeleted: z.boolean().optional(),
  createdFrom: z.date().optional(),
  createdTo: z.date().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type Agent = z.infer<typeof AgentSchema>;
export type CreateAgentInput = z.infer<typeof CreateAgentSchema>;
export type UpdateAgentInput = z.infer<typeof UpdateAgentSchema>;
export type AgentFilterInput = z.infer<typeof AgentFilterSchema>;
