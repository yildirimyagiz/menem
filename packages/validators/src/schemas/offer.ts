import { z } from "zod";

// Enum for Offer Type
export const OfferTypeEnum = z.enum([
  "STANDARD",
  "PROMOTIONAL",
  "LAST_MINUTE",
  "GROUP",
  "EXTENDED_STAY",
]);

// Enum for Offer Status
export const OfferStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
]);

// Offer Schema
export const OfferSchema = z.object({
  id: z.string(),
  increaseId: z.string().optional(),

  offerType: OfferTypeEnum.default("STANDARD"),
  status: OfferStatusEnum.default("PENDING"),
  basePrice: z.number().positive(),
  discountRate: z.number().min(0).max(100).optional(),
  finalPrice: z.number().positive(),
  guestId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  specialRequirements: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
  reservationId: z.string().optional(),
  User: z.any().optional(),
  Increase: z.any().optional(),
  Property: z.any().optional(),

  Reservation: z.any().optional(),
});

// Create Offer Schema
export const CreateOfferSchema = z.object({
  propertyId: z.string(),
  increaseId: z.string().optional(),
  offerType: OfferTypeEnum.default("STANDARD"),
  basePrice: z.number().positive(),
  discountRate: z.number().min(0).max(100).optional(),
  finalPrice: z.number().positive(),
  guestId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  specialRequirements: z.string().optional(),
  notes: z.string().optional(),
});

// Update Offer Schema
export const UpdateOfferSchema = z.object({
  id: z.string(),
  propertyId: z.string().optional(),
  status: OfferStatusEnum.optional(),
  basePrice: z.number().positive().optional(),
  discountRate: z.number().min(0).max(100).optional(),
  finalPrice: z.number().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  specialRequirements: z.string().optional(),
  notes: z.string().optional(),
  deletedAt: z.date().optional(),
  reservationId: z.string().optional(),
});

// Offer Filter Schema
export const OfferFilterSchema = z.object({
  propertyId: z.string().optional(),
  increaseId: z.string().optional(),
  offerType: OfferTypeEnum.optional(),
  status: OfferStatusEnum.optional(),
  guestId: z.string().optional(),
  basePriceMin: z.number().optional(),
  basePriceMax: z.number().optional(),
  finalPriceMin: z.number().optional(),
  finalPriceMax: z.number().optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  endDateFrom: z.date().optional(),
  endDateTo: z.date().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  reservationId: z.string().optional(),
  sortBy: z
    .enum([
      "createdAt",
      "startDate",
      "endDate",
      "basePrice",
      "finalPrice",
      "status",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Offer = z.infer<typeof OfferSchema>;
export type CreateOfferInput = z.infer<typeof CreateOfferSchema>;
export type UpdateOfferInput = z.infer<typeof UpdateOfferSchema>;
export type OfferFilterInput = z.infer<typeof OfferFilterSchema>;
