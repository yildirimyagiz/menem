import { z } from "zod";

export const TicketStatusEnum = z.enum([
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
  status: TicketStatusEnum.default("OPEN"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  closedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  CommunicationLogs: z.array(z.any()).optional(),
});

export const CreateTicketSchema = z.object({
  subject: z.string(),
  description: z.string().optional(),
  status: TicketStatusEnum.optional(),
});

export const UpdateTicketSchema = z.object({
  id: z.string(),
  subject: z.string().optional(),
  description: z.string().optional(),
  status: TicketStatusEnum.optional(),
  closedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const TicketFilterSchema = z.object({
  status: TicketStatusEnum.optional(),
  subject: z.string().optional(),
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
