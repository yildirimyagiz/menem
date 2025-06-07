import { z } from "zod";

// Location Schema
export const LocationSchema = z.object({
  id: z.string().optional(),
  country: z.string(), // e.g., "US", "TR"
  city: z.string(),
  district: z.string().optional(),
  address: z.string(),
  postalCode: z.string().optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

// Create Location Schema
export const CreateLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
  district: z.string().optional(),
  address: z.string(),
  postalCode: z.string().optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

// Update Location Schema
export const UpdateLocationSchema = z.object({
  id: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const LocationFilterSchema = LocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  coordinates: true,
});

export type Location = z.infer<typeof LocationSchema>;
export type CreateLocationInput = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;
export type LocationFilterInput = z.infer<typeof LocationFilterSchema>;
