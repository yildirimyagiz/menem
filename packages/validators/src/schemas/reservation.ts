import { z } from "zod";

import { PaymentStatusEnum } from "./payment";

// Reservation Schema
export const ReservationStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
]);

export const ReservationSchema = z
  .object({
    id: z.string().optional(),
    propertyId: z.string({
      required_error: "Property ID is required",
      invalid_type_error: "Property ID must be a string",
    }),
    guestId: z.string({
      required_error: "Guest ID is required",
      invalid_type_error: "Guest ID must be a string",
    }),
    userId: z.string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    }),
    agentId: z.string().optional(),
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    endDate: z.date({
      required_error: "End date is required",
      invalid_type_error: "End date must be a valid date",
    }),
    guests: z
      .number({
        required_error: "Number of guests is required",
        invalid_type_error: "Number of guests must be a number",
      })
      .int()
      .positive("Number of guests must be positive")
      .default(1),
    status: ReservationStatusEnum.default("PENDING"),
    totalPrice: z.number({
      required_error: "Total price is required",
      invalid_type_error: "Total price must be a number",
    }),
    currencyId: z.string({
      required_error: "Currency ID is required",
      invalid_type_error: "Currency ID must be a string",
    }),
    paymentStatus: PaymentStatusEnum.default("UNPAID"),
    specialRequests: z.string().optional(),
    checkInTime: z.date().optional(),
    checkOutTime: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date(),
    pricingRuleId: z.string().optional(),
    discountId: z.string().optional(),
    agencyId: z.string().optional(),
    reportId: z.string().optional(),
    providerId: z.string().optional(),
    deletedAt: z.date().optional(),
    // Relations
    Analytics: z.any().optional(),
    ComplianceRecord: z.any().optional(),
    Offer: z.any().optional(),
    Agency: z.any().optional(),
    Agent: z.any().optional(),
    Currency: z.any().optional(),
    Discount: z.any().optional(),
    Property: z.any().optional(),
    PricingRule: z.any().optional(),
    Report: z.any().optional(),
    User: z.any().optional(),
    Provider: z.any().optional(),
    Guest: z.any().optional(),
  })
  .refine(
    (data) => data.endDate && data.startDate && data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

// Create Reservation Schema
export const CreateReservationSchema = z
  .object({
    propertyId: z.string({
      required_error: "Property ID is required",
      invalid_type_error: "Property ID must be a string",
    }),
    guestId: z.string({
      required_error: "Guest ID is required",
      invalid_type_error: "Guest ID must be a string",
    }),
    userId: z.string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    }),
    agentId: z.string().optional(),
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    endDate: z.date({
      required_error: "End date is required",
      invalid_type_error: "End date must be a valid date",
    }),
    guests: z
      .number({
        required_error: "Number of guests is required",
        invalid_type_error: "Number of guests must be a number",
      })
      .int()
      .positive("Number of guests must be positive")
      .default(1),
    status: ReservationStatusEnum.default("PENDING"),
    totalPrice: z.number({
      required_error: "Total price is required",
      invalid_type_error: "Total price must be a number",
    }),
    currencyId: z.string({
      required_error: "Currency ID is required",
      invalid_type_error: "Currency ID must be a string",
    }),
    paymentStatus: PaymentStatusEnum.default("UNPAID"),
    specialRequests: z.string().optional(),
    checkInTime: z.date().optional(),
    checkOutTime: z.date().optional(),
    pricingRuleId: z.string().optional(),
    discountId: z.string().optional(),
    agencyId: z.string().optional(),
    reportId: z.string().optional(),
    providerId: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Update Reservation Schema
export const UpdateReservationSchema = z
  .object({
    id: z.string({
      required_error: "Reservation ID is required",
      invalid_type_error: "Reservation ID must be a string",
    }),
    propertyId: z.string().optional(),
    guestId: z.string().optional(),
    userId: z.string().optional(),
    agentId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    guests: z
      .number()
      .int()
      .positive("Number of guests must be positive")
      .optional(),
    status: ReservationStatusEnum.optional(),
    totalPrice: z.number().optional(),
    currencyId: z.string().optional(),
    paymentStatus: PaymentStatusEnum.optional(),
    specialRequests: z.string().optional(),
    checkInTime: z.date().optional(),
    checkOutTime: z.date().optional(),
    pricingRuleId: z.string().optional(),
    discountId: z.string().optional(),
    agencyId: z.string().optional(),
    reportId: z.string().optional(),
    providerId: z.string().optional(),
    deletedAt: z.date().optional(),
  })
  .refine(
    (data) => !data.endDate || !data.startDate || data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

// Reservation Filter Schema
export const ReservationFilterSchema = z
  .object({
    propertyId: z.string().optional(),
    guestId: z.string().optional(),
    userId: z.string().optional(),
    agentId: z.string().optional(),
    status: ReservationStatusEnum.optional(),
    startDateFrom: z.date().optional(),
    startDateTo: z.date().optional(),
    endDateFrom: z.date().optional(),
    endDateTo: z.date().optional(),
    paymentStatus: PaymentStatusEnum.optional(),
    currencyId: z.string().optional(),
    agencyId: z.string().optional(),
    providerId: z.string().optional(),
    totalPriceFrom: z.number().optional(),
    totalPriceTo: z.number().optional(),
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
    sortBy: z.enum(["createdAt", "status", "startDate", "endDate"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .refine(
    (data) => {
      // Validate date ranges
      if (
        data.startDateFrom &&
        data.startDateTo &&
        data.startDateFrom > data.startDateTo
      ) {
        return false;
      }
      if (
        data.endDateFrom &&
        data.endDateTo &&
        data.endDateFrom > data.endDateTo
      ) {
        return false;
      }
      if (
        data.totalPriceFrom &&
        data.totalPriceTo &&
        data.totalPriceFrom > data.totalPriceTo
      ) {
        return false;
      }
      return true;
    },
    {
      message: "'To' date/price must be after 'From' date/price",
      path: ["dateRange"],
    },
  );

// Zod Type Inference for TypeScript
export type Reservation = z.infer<typeof ReservationSchema>;
export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;
export type UpdateReservationInput = z.infer<typeof UpdateReservationSchema>;
export type ReservationFilterInput = z.infer<typeof ReservationFilterSchema>;
