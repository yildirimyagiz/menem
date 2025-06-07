import { z } from "zod";

// Enum for Expense Type
export enum ExpenseType {
  MAINTENANCE = "MAINTENANCE",
  CLEANING = "CLEANING",
  UTILITIES = "UTILITIES",
  MANAGEMENT_FEE = "MANAGEMENT_FEE",
  TAX = "TAX",
  INSURANCE = "INSURANCE",
  REPAIR = "REPAIR",
  SECURITY = "SECURITY",
  OTHER = "OTHER",
}

// Enum for Expense Status
export enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

// Expense Schema
export const ExpenseSchema = z.object({
  id: z.string(),
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),

  agencyId: z.string().optional(),
  type: z.enum([
    ExpenseType.MAINTENANCE,
    ExpenseType.CLEANING,
    ExpenseType.UTILITIES,
    ExpenseType.MANAGEMENT_FEE,
    ExpenseType.TAX,
    ExpenseType.INSURANCE,
    ExpenseType.REPAIR,
    ExpenseType.SECURITY,
    ExpenseType.OTHER,
  ]),
  amount: z.number().positive(),
  currencyId: z.string(),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  status: z
    .enum([
      ExpenseStatus.PENDING,
      ExpenseStatus.PAID,
      ExpenseStatus.OVERDUE,
      ExpenseStatus.CANCELLED,
    ])
    .default(ExpenseStatus.PENDING),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
  Agency: z.any().optional(),
  Currency: z.any().optional(),

  Property: z.any().optional(),
  Tenant: z.any().optional(),
  Facility: z.any().optional(),
  IncludedService: z.any().optional(),
  ExtraCharge: z.any().optional(),
});

// Create Expense Schema
export const CreateExpenseSchema = z.object({
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),

  agencyId: z.string().optional(),
  type: z.enum([
    ExpenseType.MAINTENANCE,
    ExpenseType.CLEANING,
    ExpenseType.UTILITIES,
    ExpenseType.MANAGEMENT_FEE,
    ExpenseType.TAX,
    ExpenseType.INSURANCE,
    ExpenseType.REPAIR,
    ExpenseType.SECURITY,
    ExpenseType.OTHER,
  ]),
  amount: z.number().positive(),
  currencyId: z.string(),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  status: z
    .enum([
      ExpenseStatus.PENDING,
      ExpenseStatus.PAID,
      ExpenseStatus.OVERDUE,
      ExpenseStatus.CANCELLED,
    ])
    .default(ExpenseStatus.PENDING),
  notes: z.string().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
});

// Update Expense Schema
export const UpdateExpenseSchema = z.object({
  id: z.string(),
  type: z
    .enum([
      ExpenseType.MAINTENANCE,
      ExpenseType.CLEANING,
      ExpenseType.UTILITIES,
      ExpenseType.MANAGEMENT_FEE,
      ExpenseType.TAX,
      ExpenseType.INSURANCE,
      ExpenseType.REPAIR,
      ExpenseType.SECURITY,
      ExpenseType.OTHER,
    ])
    .optional(),
  amount: z.number().positive().optional(),
  currencyId: z.string().optional(),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  status: z
    .enum([
      ExpenseStatus.PENDING,
      ExpenseStatus.PAID,
      ExpenseStatus.OVERDUE,
      ExpenseStatus.CANCELLED,
    ])
    .optional(),
  notes: z.string().optional(),
  deletedAt: z.date().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
});

// Expense Filter Schema
export const ExpenseFilterSchema = z.object({
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),

  agencyId: z.string().optional(),
  type: z
    .enum([
      ExpenseType.MAINTENANCE,
      ExpenseType.CLEANING,
      ExpenseType.UTILITIES,
      ExpenseType.MANAGEMENT_FEE,
      ExpenseType.TAX,
      ExpenseType.INSURANCE,
      ExpenseType.REPAIR,
      ExpenseType.SECURITY,
      ExpenseType.OTHER,
    ])
    .optional(),
  status: z
    .enum([
      ExpenseStatus.PENDING,
      ExpenseStatus.PAID,
      ExpenseStatus.OVERDUE,
      ExpenseStatus.CANCELLED,
    ])
    .optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  currencyId: z.string().optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
  paidDateFrom: z.date().optional(),
  paidDateTo: z.date().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  facilityId: z.string().optional(),
  includedServiceId: z.string().optional(),
  extraChargeId: z.string().optional(),
  sortBy: z
    .enum(["amount", "dueDate", "paidDate", "status", "type"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type Expense = z.infer<typeof ExpenseSchema>;
export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof UpdateExpenseSchema>;
export type ExpenseFilterInput = z.infer<typeof ExpenseFilterSchema>;
