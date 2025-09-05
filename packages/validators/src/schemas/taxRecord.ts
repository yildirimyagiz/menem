import { z } from "zod";

// Tax Types Enum
export const TaxTypeEnum = z.enum([
  "PROPERTY_TAX",
  "INCOME_TAX", 
  "SALES_TAX",
  "OCCUPANCY_TAX",
  "CITY_TAX",
  "STATE_TAX",
  "FEDERAL_TAX",
  "UTILITY_TAX",
  "MAINTENANCE_TAX",
  "LUXURY_TAX",
  "TRANSFER_TAX",
  "STAMP_DUTY",
  "VAT",
  "MUNICIPALITY_TAX",
  "COMMISSION_TAX",
  "AGENCY_TAX",
  "AGENT_TAX",
  "OTHER"
]);

// Payment Method Enum
export const PaymentMethodEnum = z.enum([
  "CASH",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "PAYPAL",
  "STRIPE",
  "CHECK",
  "MONEY_ORDER",
  "CRYPTO",
  "OTHER"
]);

// Tax Status Enum
export const TaxStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "DISPUTED",
  "PARTIALLY_PAID",
  "WAIVED",
  "EXTENDED"
]);

// Priority Enum
export const PriorityEnum = z.enum([
  "LOW",
  "MEDIUM", 
  "HIGH",
  "URGENT"
]);

// Recurring Frequency Enum
export const RecurringFrequencyEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "CUSTOM"
]);

// Tax Record Schema
export const TaxRecordSchema = z.object({
  id: z.string().uuid(),
  propertyId: z.string().uuid(),
  year: z.number().int().min(2000).max(2100),
  amount: z.number().positive(),
  percentage: z.number().min(0).max(100).optional(),
  taxType: TaxTypeEnum.default("PROPERTY_TAX"),
  paid: z.boolean().default(false),
  paidAmount: z.number().min(0).default(0),
  dueDate: z.date(),
  paidDate: z.date().nullable(),
  notes: z.string().max(1000).nullable(),
  status: TaxStatusEnum.default("PENDING"),
  paymentMethod: PaymentMethodEnum.nullable(),
  transactionId: z.string().nullable(),
  receiptNumber: z.string().nullable(),
  invoiceNumber: z.string().nullable(),
  clientId: z.string().uuid(),
  createdById: z.string().uuid(),
  updatedById: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  
  // Additional fields for enhanced functionality
  lateFees: z.number().min(0).default(0),
  interestRate: z.number().min(0).max(100).default(0),
  gracePeriod: z.number().int().min(0).default(0), // days
  isRecurring: z.boolean().default(false),
  recurringFrequency: RecurringFrequencyEnum.nullable(),
  nextDueDate: z.date().nullable(),
  reminderSent: z.boolean().default(false),
  reminderDate: z.date().nullable(),
  
  // Related records
  parentTaxRecordId: z.string().uuid().nullable(),
  relatedTaxRecords: z.array(z.string().uuid()).default([]),
  
  // Metadata
  tags: z.array(z.string()).default([]),
  priority: PriorityEnum.default("MEDIUM"),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  
  // Currency and financial tracking
  currencyId: z.string().nullable(),
  
  // Audit and tracking fields
  auditTrail: z.record(z.unknown()).nullable(), // Store audit trail as JSON
  attachments: z.record(z.unknown()).nullable(), // Store attachments as JSON
});

// Create TaxRecord Schema
export const CreateTaxRecordSchema = z.object({
  propertyId: z.string().uuid(),
  year: z.number().int().min(2000).max(2100),
  amount: z.number().positive(),
  percentage: z.number().min(0).max(100).optional(),
  taxType: TaxTypeEnum.default("PROPERTY_TAX"),
  dueDate: z.date(),
  notes: z.string().max(1000).optional(),
  clientId: z.string().uuid(),
  
  // Additional fields
  lateFees: z.number().min(0).optional(),
  interestRate: z.number().min(0).max(100).optional(),
  gracePeriod: z.number().int().min(0).optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: RecurringFrequencyEnum.optional(),
  nextDueDate: z.date().optional(),
  
  // Metadata
  tags: z.array(z.string()).optional(),
  priority: PriorityEnum.optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  
  // Related records
  parentTaxRecordId: z.string().uuid().optional(),
  relatedTaxRecords: z.array(z.string().uuid()).optional(),
  
  // Currency
  currencyId: z.string().optional(),
});

// Update TaxRecord Schema
export const UpdateTaxRecordSchema = z.object({
  id: z.string().uuid(),
  paid: z.boolean().optional(),
  paidAmount: z.number().min(0).optional(),
  paidDate: z.date().optional(),
  notes: z.string().max(1000).optional(),
  status: TaxStatusEnum.optional(),
  paymentMethod: PaymentMethodEnum.optional(),
  transactionId: z.string().optional(),
  receiptNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  
  // Additional fields
  lateFees: z.number().min(0).optional(),
  interestRate: z.number().min(0).max(100).optional(),
  gracePeriod: z.number().int().min(0).optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: RecurringFrequencyEnum.optional(),
  nextDueDate: z.date().optional(),
  reminderSent: z.boolean().optional(),
  reminderDate: z.date().optional(),
  
  // Metadata
  tags: z.array(z.string()).optional(),
  priority: PriorityEnum.optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  
  // Currency
  currencyId: z.string().optional(),
});

// TaxRecord Filter Schema
export const TaxRecordFilterSchema = z.object({
  propertyId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  year: z.number().int().optional(),
  status: TaxStatusEnum.optional(),
  taxType: TaxTypeEnum.optional(),
  paid: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  priority: PriorityEnum.optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  dueDateStart: z.date().optional(),
  dueDateEnd: z.date().optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional(),
  paymentMethod: PaymentMethodEnum.optional(),
  createdById: z.string().uuid().optional(),
  parentTaxRecordId: z.string().uuid().optional(),
  hasAttachments: z.boolean().optional(),
  overdue: z.boolean().optional(),
  currencyId: z.string().optional(),
  sortBy: z
    .enum(["year", "amount", "dueDate", "paidDate", "createdAt", "updatedAt", "priority", "status"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

// Bulk Operations Schema
export const BulkTaxRecordOperationSchema = z.object({
  ids: z.array(z.string().uuid()),
  operation: z.enum(["MARK_PAID", "MARK_OVERDUE", "DELETE", "UPDATE_STATUS", "UPDATE_PRIORITY"]),
  data: z.object({
    status: TaxStatusEnum.optional(),
    priority: PriorityEnum.optional(),
    notes: z.string().optional(),
    paymentMethod: PaymentMethodEnum.optional(),
    transactionId: z.string().optional()
  }).optional()
});

// Tax Summary Schema
export const TaxSummarySchema = z.object({
  totalAmount: z.number(),
  totalPaid: z.number(),
  totalPending: z.number(),
  totalOverdue: z.number(),
  totalLateFees: z.number(),
  totalInterest: z.number(),
  countByStatus: z.record(z.string(), z.number()),
  countByType: z.record(z.string(), z.number()),
  countByYear: z.record(z.string(), z.number()),
  averageAmount: z.number(),
  overdueAmount: z.number(),
  upcomingDueAmount: z.number(),
  nextDueDate: z.date().nullable()
});

// Tax Report Schema
export const TaxReportSchema = z.object({
  period: z.object({
    startDate: z.date(),
    endDate: z.date()
  }),
  summary: TaxSummarySchema,
  records: z.array(TaxRecordSchema),
  generatedAt: z.date(),
  generatedBy: z.string().uuid()
});

// Zod Type Inference for TypeScript
export type TaxRecord = z.infer<typeof TaxRecordSchema>;
export type CreateTaxRecordInput = z.infer<typeof CreateTaxRecordSchema>;
export type UpdateTaxRecordInput = z.infer<typeof UpdateTaxRecordSchema>;
export type TaxRecordFilterInput = z.infer<typeof TaxRecordFilterSchema>;
export type BulkTaxRecordOperationInput = z.infer<typeof BulkTaxRecordOperationSchema>;
export type TaxSummary = z.infer<typeof TaxSummarySchema>;
export type TaxReport = z.infer<typeof TaxReportSchema>;
export type TaxType = z.infer<typeof TaxTypeEnum>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
export type TaxStatus = z.infer<typeof TaxStatusEnum>;
export type Priority = z.infer<typeof PriorityEnum>;
export type RecurringFrequency = z.infer<typeof RecurringFrequencyEnum>;
