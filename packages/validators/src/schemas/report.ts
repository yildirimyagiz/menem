import { ReportStatus, ReportType } from "@prisma/client";
import { z } from "zod";

// Report Schema
export const ReportSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  reportType: z.nativeEnum(ReportType),
  generatedById: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  entityId: z.string().uuid().optional(),
  entityType: z.string().optional(),
  totalRevenue: z.number().optional(),
  totalBookings: z.number().int().optional(),
  averagePrice: z.number().optional(),
  occupancyRate: z.number().optional(),
  fileUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  data: z.any().optional().nullable(),
  status: z.nativeEnum(ReportStatus).default(ReportStatus.GENERATED),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date(),
  agencyId: z.string().uuid().optional().nullable(),
  facilityId: z.string().uuid().optional().nullable(),
  includedServiceId: z.string().uuid().optional().nullable(),
  extraChargeId: z.string().uuid().optional().nullable(),
  providerId: z.string().uuid().optional().nullable(),
  reservationIds: z.array(z.string().uuid()),
  totalReservations: z.number().int().optional(),
  cancelledReservations: z.number().int().optional(),
  completedReservations: z.number().int().optional(),
  averageReservationLength: z.number().optional(),
  totalPaidReservations: z.number().optional(),
  totalUnpaidReservations: z.number().optional(),

  // Relations
  Agency: z.any().optional().nullable(),
  Facility: z.any().optional().nullable(),
  IncludedService: z.any().optional().nullable(),
  ExtraCharge: z.any().optional().nullable(),
  Provider: z.any().optional().nullable(),
  Reservation: z.any().optional(),
});

// Create Report Schema
export const CreateReportSchema = ReportSchema.pick({
  title: true,
  reportType: true,
  generatedById: true,
  startDate: true,
  endDate: true,
  entityId: true,
  entityType: true,
  description: true,
  agencyId: true,
  facilityId: true,
  includedServiceId: true,
  extraChargeId: true,
  providerId: true,
  reservationIds: true,
}).extend({
  reservationIds: z.array(z.string().uuid()).default([]),
});

// Update Report Schema
export const UpdateReportSchema = CreateReportSchema.partial().extend({
  id: z.string().uuid(),
});

// Report Filter Schema
export const ReportFilterSchema = z.object({
  title: z.string().optional(),
  reportType: z.nativeEnum(ReportType).optional(),
  generatedById: z.string().uuid().optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  endDateFrom: z.date().optional(),
  endDateTo: z.date().optional(),
  status: z.nativeEnum(ReportStatus).optional(),
  agencyId: z.string().uuid().optional().nullable(),
  facilityId: z.string().uuid().optional().nullable(),
  includedServiceId: z.string().uuid().optional().nullable(),
  extraChargeId: z.string().uuid().optional().nullable(),
  providerId: z.string().uuid().optional().nullable(),
  totalRevenueFrom: z.number().optional(),
  totalRevenueTo: z.number().optional(),
  totalBookingsFrom: z.number().int().optional(),
  totalBookingsTo: z.number().int().optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z
    .enum(["createdAt", "updatedAt", "startDate", "endDate", "status"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Zod Type Inference for TypeScript
export type Report = z.infer<typeof ReportSchema>;
export type CreateReportInput = z.infer<typeof CreateReportSchema>;
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
export type ReportFilterInput = z.infer<typeof ReportFilterSchema>;
