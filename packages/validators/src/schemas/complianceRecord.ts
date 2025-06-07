import { z } from "zod";

// ComplianceRecord Schema
export const ComplianceRecordSchema = z.object({
  id: z.string(),
  entityId: z.string(),
  entityType: z.string(),
  type: z.enum([
    "DATA_PROTECTION",
    "FINANCIAL_REGULATION",
    "PROPERTY_LAW",
    "TAX_COMPLIANCE",
    "LICENSE_VERIFICATION",
    "INSURANCE",
    "PROFESSIONAL_STANDARDS",
  ]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  documentUrl: z.string().url().optional(),
  expiryDate: z.date().optional(),
  notes: z.string().optional(),
  isVerified: z.boolean().default(false),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  reservationId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  Agency: z.any().optional(),
  Agent: z.any().optional(),

  Property: z.any().optional(),
  Reservation: z.any().optional(),
});

// Create ComplianceRecord Schema
export const CreateComplianceRecordSchema = z.object({
  entityId: z.string(),
  entityType: z.string(),
  type: z.enum([
    "DATA_PROTECTION",
    "FINANCIAL_REGULATION",
    "PROPERTY_LAW",
    "TAX_COMPLIANCE",
    "LICENSE_VERIFICATION",
    "INSURANCE",
    "PROFESSIONAL_STANDARDS",
  ]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  documentUrl: z.string().url().optional(),
  expiryDate: z.date().optional(),
  notes: z.string().optional(),
  isVerified: z.boolean().default(false),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  reservationId: z.string().optional(),
});

// Update ComplianceRecord Schema
export const UpdateComplianceRecordSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  documentUrl: z.string().url().optional(),
  expiryDate: z.date().optional(),
  notes: z.string().optional(),
  isVerified: z.boolean().optional(),
  deletedAt: z.date().optional(),

  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  reservationId: z.string().optional(),
});

// ComplianceRecord Filter Schema
export const ComplianceRecordFilterSchema = z.object({
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  type: z
    .enum([
      "DATA_PROTECTION",
      "FINANCIAL_REGULATION",
      "PROPERTY_LAW",
      "TAX_COMPLIANCE",
      "LICENSE_VERIFICATION",
      "INSURANCE",
      "PROFESSIONAL_STANDARDS",
      "SHORT_TERM_RENTAL_LICENSE",
      "AUTHORIZATION_PAPER",
    ])
    .optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  isVerified: z.boolean().optional(),

  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  reservationId: z.string().optional(),
  expiryDateFrom: z.date().optional(),
  expiryDateTo: z.date().optional(),
  createdAtFrom: z.date().optional(),
  createdAtTo: z.date().optional(),
  updatedAtFrom: z.date().optional(),
  updatedAtTo: z.date().optional(),
  deletedAt: z.date().optional(),
  sortBy: z.enum(["expiryDate", "createdAt", "status", "type"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

// Zod Type Inference for TypeScript
export type ComplianceRecord = z.infer<typeof ComplianceRecordSchema>;
export type CreateComplianceRecordInput = z.infer<
  typeof CreateComplianceRecordSchema
>;
export type UpdateComplianceRecordInput = z.infer<
  typeof UpdateComplianceRecordSchema
>;
export type ComplianceRecordFilterInput = z.infer<
  typeof ComplianceRecordFilterSchema
>;
