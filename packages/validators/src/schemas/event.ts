import { z } from "zod";

// EventType enum aligned with Prisma
export const EventType = z.enum([
  "VIEWING",
  "OPEN_HOUSE",
  "VIRTUAL_TOUR",
  "INSPECTION",
  "OTHER",
]);

// Event Schema
export const EventSchema = z.object({
  id: z.string().optional(),
  propertyId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  eventType: EventType.optional(),
  scheduledAt: z.date(),
  duration: z.number().int().optional(), // minutes
  createdById: z.string().optional(),
  attendees: z.array(z.string()).optional(), // user IDs
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const CreateEventSchema = EventSchema.omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true });

export const UpdateEventSchema = EventSchema.pick({
  id: true,
  title: true,
  description: true,
  eventType: true,
  scheduledAt: true,
  duration: true,
  attendees: true,
  isActive: true,
  deletedAt: true,
});

export const EventFilterSchema = z.object({
  isActive: z.boolean().optional(),
  deletedAt: z.date().optional(),
  propertyId: z.string().optional(),
  eventType: EventType.optional(),
  scheduledAtFrom: z.date().optional(),
  scheduledAtTo: z.date().optional(),
  createdById: z.string().optional(),
  sortBy: z.enum(["scheduledAt", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type Event = z.infer<typeof EventSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type EventFilterInput = z.infer<typeof EventFilterSchema>;
