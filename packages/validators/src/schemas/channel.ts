import { z } from "zod";

export const ChannelSchema = z.object({
  id: z.string(),
  cuid: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.enum([
    "AGENT",
    "AGENCY",
    "TENANT",
    "PROPERTY",
    "PAYMENT",
    "SYSTEM",
    "REPORT",
    "RESERVATION",
    "TASK",
    "TICKET",
  ]),
  type: z.enum(["PUBLIC", "PRIVATE", "GROUP"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  CommunicationLogs: z.array(z.any()).optional(),
});

export const CreateChannelSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  category: z.enum([
    "AGENT",
    "AGENCY",
    "TENANT",
    "PROPERTY",
    "PAYMENT",
    "SYSTEM",
    "REPORT",
    "RESERVATION",
    "TASK",
    "TICKET",
  ]),
  type: z.enum(["PUBLIC", "PRIVATE", "GROUP"]),
});

export const UpdateChannelSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  category: z
    .enum([
      "AGENT",
      "AGENCY",
      "TENANT",
      "PROPERTY",
      "PAYMENT",
      "SYSTEM",
      "REPORT",
      "RESERVATION",
      "TASK",
      "TICKET",
    ])
    .optional(),
  type: z.enum(["PUBLIC", "PRIVATE", "GROUP"]).optional(),
  deletedAt: z.date().optional(),
});

export const ChannelFilterSchema = z.object({
  name: z.string().optional(),
  category: z
    .enum([
      "AGENT",
      "AGENCY",
      "TENANT",
      "PROPERTY",
      "PAYMENT",
      "SYSTEM",
      "REPORT",
      "RESERVATION",
      "TASK",
      "TICKET",
    ])
    .optional(),
  type: z.enum(["PUBLIC", "PRIVATE", "GROUP"]).optional(),
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

export type Channel = z.infer<typeof ChannelSchema>;
export type CreateChannelInput = z.infer<typeof CreateChannelSchema>;
export type UpdateChannelInput = z.infer<typeof UpdateChannelSchema>;
export type ChannelFilterInput = z.infer<typeof ChannelFilterSchema>;
