import { z } from "zod";

export const BookingSourceEnum = z.enum([
  "Direct",
  "Airbnb",
  "Booking",
  "Expedia",
  "Other",
  "Agency",
  "Provider",
]);
export type BookingSource = z.infer<typeof BookingSourceEnum>;

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  baseUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  commission: z.number(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  source: BookingSourceEnum,
  // Relations (arrays for related entities, can be refined if needed)
  report: z.array(z.any()).optional(),
  reservations: z.array(z.any()).optional(),
  commissionRule: z.array(z.any()).optional(),
});

export const CreateProviderSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  baseUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  commission: z.number(),
  source: BookingSourceEnum,
});

export const UpdateProviderSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  logo: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  baseUrl: z.string().optional(),
  isActive: z.boolean().optional(),
  commission: z.number().optional(),
  deletedAt: z.date().optional(),
  source: BookingSourceEnum.optional(),
});

export const ProviderFilterSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  source: BookingSourceEnum.optional(),
  commissionMin: z.number().optional(),
  commissionMax: z.number().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type Provider = z.infer<typeof ProviderSchema>;
export type CreateProviderInput = z.infer<typeof CreateProviderSchema>;
export type UpdateProviderInput = z.infer<typeof UpdateProviderSchema>;
export type ProviderFilterInput = z.infer<typeof ProviderFilterSchema>;
