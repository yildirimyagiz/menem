import { z } from "zod";

export const TicketStatus = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "ARCHIVED",
]);

export const TicketSchema = z.object({
  id: z.string(),
  cuid: z.string(),
  subject: z.string(),
  description: z.string().optional(),
  status: TicketStatus.default("OPEN"),
  createdAt: z.date(),
  updatedAt: z.date(),
  closedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  CommunicationLogs: z.array(z.any()).optional(),
  userId: z.string(),
  agentId: z.string().nullable(),
  User: z.object({
    id: z.string(),
    name: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
  Agent: z.object({
    id: z.string(),
    name: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
  }).nullable().optional(),
});

export const CreateTicketSchema = z.object({
  subject: z.string(),
  description: z.string().optional(),
  status: TicketStatus.optional(),
  agentId: z.string().optional(),
});

export const UpdateTicketSchema = z.object({
  id: z.string(),
  subject: z.string().optional(),
  description: z.string().optional(),
  status: TicketStatus.optional(),
  closedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const TicketFilterSchema = z.object({
  status: TicketStatus.optional(),
  subject: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  closedAtFrom: z.date().optional(),
  closedAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type Ticket = z.infer<typeof TicketSchema>;
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;
export type TicketFilterInput = z.infer<typeof TicketFilterSchema>;
