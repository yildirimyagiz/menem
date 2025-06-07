import { z } from "zod";

// Enum for Payment Status
export const PaymentStatusEnum = z.enum([
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "REFUNDED",
  "OVERDUE",
  "CANCELLED",
]);

// Payment Schema
export const PaymentSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  amount: z.number().positive(),
  currencyId: z.string(),
  paymentDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: PaymentStatusEnum.default("UNPAID"),
  paymentMethod: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),

  // Stripe specific fields
  stripePaymentIntentId: z.string().nullable().optional(),
  stripePaymentMethodId: z.string().nullable().optional(),
  stripeClientSecret: z.string().nullable().optional(),
  stripeStatus: z.string().nullable().optional(),
  stripeError: z.string().nullable().optional(),

  Currency: z.any().optional(), // Consider typing this if you know the structure
  Tenant: z.any().optional(),
});

// Create Payment Schema
export const CreatePaymentSchema = z.object({
  tenantId: z.string(),
  amount: z.number().positive(),
  currencyId: z.string(),
  paymentDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: PaymentStatusEnum.default("UNPAID"),
  paymentMethod: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  stripePaymentIntentId: z.string().nullable().optional(),
  stripePaymentMethodId: z.string().nullable().optional(),
  stripeClientSecret: z.string().nullable().optional(),
  stripeStatus: z.string().nullable().optional(),
  stripeError: z.string().nullable().optional(),
});

// Update Payment Schema
export const UpdatePaymentSchema = z.object({
  id: z.string(),
  amount: z.number().positive().optional(),
  status: PaymentStatusEnum.optional(),
  paymentDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  paymentMethod: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  stripePaymentIntentId: z.string().nullable().optional(),
  stripePaymentMethodId: z.string().nullable().optional(),
  stripeClientSecret: z.string().nullable().optional(),
  stripeStatus: z.string().nullable().optional(),
  stripeError: z.string().nullable().optional(),
});

// Payment Filter Schema
export const PaymentFilterSchema = z.object({
  tenantId: z.string().optional(),
  currencyId: z.string().optional(),
  status: PaymentStatusEnum.optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  paymentDateFrom: z.coerce.date().optional(),
  paymentDateTo: z.coerce.date().optional(),
  dueDateFrom: z.coerce.date().optional(),
  dueDateTo: z.coerce.date().optional(),
  paymentMethod: z.string().optional(),
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
  stripePaymentIntentId: z.string().optional(),
  stripeStatus: z.string().optional(),
  sortBy: z
    .enum(["amount", "paymentDate", "dueDate", "status", "createdAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Type Inference
export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;
export type PaymentFilterInput = z.infer<typeof PaymentFilterSchema>;
