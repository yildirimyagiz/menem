import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import type {
  ReportListResponse,
  ReportSummary,
} from "@reservatior/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { ReportStatus, ReportType } from "@prisma/client";
import {
  BulkReportOperationSchema,
  CreateReportSchema,
  GenerateReportSchema,
  ReportFilterSchema,
  UpdateReportSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { ReportSchedule } from "../services/scheduledReports";
import { globalCache } from "../helpers/cache";
import { getPaginationParams } from "../helpers/pagination";
import { scheduledReportService } from "../services/scheduledReports";
import {
  agencyFilteredProcedure,
  protectedProcedure,
} from "../trpc";

// Type for report with includes
export type ReportWithIncludes = Prisma.ReportGetPayload<{
  include: {
    Agency: true;
    Facility: true;
    IncludedService: true;
    ExtraCharge: true;
    Provider: true;
    Property: true;
    Tenant: true;
    Agent: true;
    Reservation: true;
    generatedBy: true;
  };
}>;

const sanitizeReport = (report: ReportWithIncludes) => {
  return {
    ...report,
    // Keep explicit null coalescing for nullable relations; arrays are always present
    Agency: report.Agency ?? null,
    Facility: report.Facility ?? null,
    IncludedService: report.IncludedService ?? null,
    ExtraCharge: report.ExtraCharge ?? null,
    Provider: report.Provider ?? null,
    Property: report.Property ?? null,
    Tenant: report.Tenant ?? null,
    Agent: report.Agent ?? null,
    Reservation: report.Reservation,
    generatedBy: report.generatedBy ?? null,
  };
};

export const reportRouter = {
  all: agencyFilteredProcedure
    .input(ReportFilterSchema.optional())
    .query(async ({ ctx, input }): Promise<ReportListResponse> => {
      const { skip, take, page, limit } = getPaginationParams({
        page: typeof input?.page === "number" ? input.page : undefined,
        limit:
          typeof input?.pageSize === "number" ? input.pageSize : undefined,
      });

      const i = input ?? ({} as z.infer<typeof ReportFilterSchema>);
      const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;

      const where: Prisma.ReportWhereInput = {
        // Always exclude soft-deleted reports unless explicitly requested
        ...(i.includeDeleted ? {} : { deletedAt: null }),

        // User-based filtering based on role and agency
        ...(agencyId ? { agencyId } : {}),

        title:
          typeof i.title === "string" && i.title.trim() !== ""
            ? { contains: i.title, mode: "insensitive" }
            : undefined,
        reportType:
          i.reportType && typeof i.reportType === "string"
            ? (i.reportType as ReportType)
            : undefined,
        status:
          i.status && typeof i.status === "string"
            ? (i.status as ReportStatus)
            : undefined,
        agencyId: typeof i.agencyId === "string" ? i.agencyId : undefined,
        facilityId: typeof i.facilityId === "string" ? i.facilityId : undefined,
        includedServiceId:
          typeof i.includedServiceId === "string"
            ? i.includedServiceId
            : undefined,
        extraChargeId:
          typeof i.extraChargeId === "string" ? i.extraChargeId : undefined,
        providerId: typeof i.providerId === "string" ? i.providerId : undefined,
        propertyId: typeof i.propertyId === "string" ? i.propertyId : undefined,
        tenantId: typeof i.tenantId === "string" ? i.tenantId : undefined,
        agentId: typeof i.agentId === "string" ? i.agentId : undefined,
        generatedById:
          typeof i.generatedById === "string"
            ? i.generatedById
            : undefined,
        startDate:
          i.startDateFrom instanceof Date || i.startDateTo instanceof Date
            ? {
                ...(i.startDateFrom instanceof Date && {
                  gte: i.startDateFrom,
                }),
                ...(i.startDateTo instanceof Date && {
                  lte: i.startDateTo,
                }),
              }
            : undefined,
        endDate:
          i.endDateFrom instanceof Date || i.endDateTo instanceof Date
            ? {
                ...(i.endDateFrom instanceof Date && {
                  gte: i.endDateFrom,
                }),
                ...(i.endDateTo instanceof Date && {
                  lte: i.endDateTo,
                }),
              }
            : undefined,
        totalRevenue:
          i.totalRevenueFrom !== undefined || i.totalRevenueTo !== undefined
            ? {
                ...(i.totalRevenueFrom !== undefined && {
                  gte: i.totalRevenueFrom,
                }),
                ...(i.totalRevenueTo !== undefined && {
                  lte: i.totalRevenueTo,
                }),
              }
            : undefined,
        totalBookings:
          i.totalBookingsFrom !== undefined || i.totalBookingsTo !== undefined
            ? {
                ...(i.totalBookingsFrom !== undefined && {
                  gte: i.totalBookingsFrom,
                }),
                ...(i.totalBookingsTo !== undefined && {
                  lte: i.totalBookingsTo,
                }),
              }
            : undefined,
      };

      const filterKey = JSON.stringify({ ...i });
      const cacheKey = `reports:${page}:${limit}:${filterKey}`;

      // Use cache directly without withCacheAndFormat to maintain correct return type
      const cached = globalCache.get<ReportListResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const sortBy = typeof i.sortBy === "string" ? i.sortBy : undefined;
      const sortOrder: "asc" | "desc" = i.sortOrder === "desc" ? "desc" : "asc";

      const [reports, total] = await Promise.all([
        ctx.db.report.findMany({
          where,
          orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
          skip,
          take,
          include: {
            Agency: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Provider: true,
            Property: true,
            Tenant: true,
            Agent: true,
            Reservation: true,
            generatedBy: true,
          },
        }),
        ctx.db.report.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const result: ReportListResponse = {
        data: reports.map(sanitizeReport),
        page,
        pageSize: limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };

      globalCache.set(cacheKey, result, 60_000);
      return result;
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const report = await ctx.db.report.findFirst({
        where: {
          id: input.id,
          deletedAt: null, // Exclude soft-deleted reports
        },
        include: {
          Agency: true,
          Facility: true,
          IncludedService: true,
          ExtraCharge: true,
          Provider: true,
          Property: true,
          Tenant: true,
          Agent: true,
          Reservation: true,
          generatedBy: true,
        },
      });

      if (!report) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Report with ID ${input.id} not found`,
        });
      }

      return sanitizeReport(report);
    }),

  create: protectedProcedure
    .input(CreateReportSchema)
    .mutation(async ({ ctx: _ctx, input }) => {
      try {
        // Validate date range
        if (input.startDate >= input.endDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "End date must be after start date",
          });
        }

        const reportData: Prisma.ReportCreateInput = {
          id: randomUUID(),
          title: input.title,
          reportType: input.reportType as ReportType,
          generatedBy: { connect: { id: input.generatedById } },
          startDate: input.startDate,
          endDate: input.endDate,
          entityId: input.entityId ?? null,
          entityType: input.entityType ?? null,
          description: input.description ?? null,
          Agency: input.agencyId
            ? { connect: { id: input.agencyId } }
            : undefined,
          Facility: input.facilityId
            ? { connect: { id: input.facilityId } }
            : undefined,
          IncludedService: input.includedServiceId
            ? { connect: { id: input.includedServiceId } }
            : undefined,
          ExtraCharge: input.extraChargeId
            ? { connect: { id: input.extraChargeId } }
            : undefined,
          Provider: input.providerId
            ? { connect: { id: input.providerId } }
            : undefined,
          Property: input.propertyId
            ? { connect: { id: input.propertyId } }
            : undefined,
          Tenant: input.tenantId
            ? { connect: { id: input.tenantId } }
            : undefined,
          Agent: input.agentId ? { connect: { id: input.agentId } } : undefined,
          totalReservations: input.reservationIds.length,
          reservationIds: input.reservationIds,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const report = await _ctx.db.report.create({
          data: reportData,
          include: {
            Agency: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Provider: true,
            Property: true,
            Tenant: true,
            Agent: true,
            Reservation: true,
            generatedBy: true,
          },
        });

        return sanitizeReport(report);
      } catch (err: unknown) {
        console.error("Error creating report:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error ? err.message : "Failed to create report",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateReportSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      try {
        // Check if report exists and is not deleted
        const existingReport = await ctx.db.report.findFirst({
          where: { id, deletedAt: null },
        });

        if (!existingReport) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Report not found or has been deleted",
          });
        }

        // Validate date range if both dates are provided
        if (data.startDate && data.endDate && data.startDate >= data.endDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "End date must be after start date",
          });
        }

        const updateData: Prisma.ReportUpdateInput = {
          title: data.title,
          reportType: data.reportType ?? undefined,
          generatedBy: data.generatedById
            ? { connect: { id: data.generatedById } }
            : undefined,
          startDate: data.startDate,
          endDate: data.endDate,
          entityId: data.entityId ?? null,
          entityType: data.entityType ?? null,
          description: data.description ?? null,
          Agency: data.agencyId
            ? { connect: { id: data.agencyId } }
            : undefined,
          Facility: data.facilityId
            ? { connect: { id: data.facilityId } }
            : undefined,
          IncludedService: data.includedServiceId
            ? { connect: { id: data.includedServiceId } }
            : undefined,
          ExtraCharge: data.extraChargeId
            ? { connect: { id: data.extraChargeId } }
            : undefined,
          Provider: data.providerId
            ? { connect: { id: data.providerId } }
            : undefined,
          Property: data.propertyId
            ? { connect: { id: data.propertyId } }
            : undefined,
          Tenant: data.tenantId
            ? { connect: { id: data.tenantId } }
            : undefined,
          Agent: data.agentId ? { connect: { id: data.agentId } } : undefined,
          totalReservations: data.reservationIds
            ? data.reservationIds.length
            : undefined,
          reservationIds: data.reservationIds,
          status: data.status,
          updatedAt: new Date(),
        };

        const report = await ctx.db.report.update({
          where: { id },
          data: updateData,
          include: {
            Agency: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Provider: true,
            Property: true,
            Tenant: true,
            Agent: true,
            Reservation: true,
            generatedBy: true,
          },
        });

        return sanitizeReport(report);
      } catch (err: unknown) {
        console.error("Error updating report:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error ? err.message : "Failed to update report",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if report exists and is not already deleted
        const existingReport = await ctx.db.report.findFirst({
          where: { id: input, deletedAt: null },
        });

        if (!existingReport) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Report not found or has already been deleted",
          });
        }

        const report = await ctx.db.report.update({
          where: { id: input },
          data: { deletedAt: new Date(), updatedAt: new Date() },
          include: {
            Agency: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Provider: true,
            Property: true,
            Tenant: true,
            Agent: true,
            Reservation: true,
            generatedBy: true,
          },
        });

        return sanitizeReport(report);
      } catch (err: unknown) {
        console.error("Error deleting report:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error ? err.message : "Failed to delete report",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),

  bulkOperation: protectedProcedure
    .input(BulkReportOperationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { reportIds, operation } = input;

        // Check if all reports exist and are not deleted
        const existingReports = await ctx.db.report.findMany({
          where: {
            id: { in: reportIds },
            deletedAt: null,
          },
        });

        if (existingReports.length !== reportIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Some reports not found or have been deleted",
          });
        }

        switch (operation) {
          case "delete":
            await ctx.db.report.updateMany({
              where: { id: { in: reportIds } },
              data: { deletedAt: new Date(), updatedAt: new Date() },
            });
            return {
              success: true,
              message: `${reportIds.length} reports deleted successfully`,
            };

          case "download":
            // TODO: Implement bulk download logic
            return {
              success: true,
              message: `Preparing ${reportIds.length} reports for download`,
            };

          case "regenerate":
            // TODO: Implement bulk regeneration logic
            return {
              success: true,
              message: `Regenerating ${reportIds.length} reports`,
            };

          default:
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid operation",
            });
        }
      } catch (err: unknown) {
        console.error("Error in bulk operation:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error
              ? err.message
              : "Failed to perform bulk operation",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),

  generate: protectedProcedure
    .input(GenerateReportSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement actual report generation logic
        // This would typically involve:
        // 1. Collecting data based on filters
        // 2. Processing the data
        // 3. Generating the report in the specified format
        // 4. Storing the file and updating the report record

        const reportData: Prisma.ReportCreateInput = {
          id: randomUUID(),
          title: input.title,
          reportType: input.reportType as ReportType,
          generatedBy: { connect: { id: ctx.session.user.id } },
          startDate: input.startDate,
          endDate: input.endDate,
          status: ReportStatus.GENERATED,
          Agency: input.filters?.agencyId
            ? { connect: { id: input.filters.agencyId } }
            : undefined,
          Facility: input.filters?.facilityId
            ? { connect: { id: input.filters.facilityId } }
            : undefined,
          Property: input.filters?.propertyId
            ? { connect: { id: input.filters.propertyId } }
            : undefined,
          Tenant: input.filters?.tenantId
            ? { connect: { id: input.filters.tenantId } }
            : undefined,
          Agent: input.filters?.agentId
            ? { connect: { id: input.filters.agentId } }
            : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const report = await ctx.db.report.create({
          data: reportData,
          include: {
            Agency: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Provider: true,
            Property: true,
            Tenant: true,
            Agent: true,
            Reservation: true,
            generatedBy: true,
          },
        });

        return sanitizeReport(report);
      } catch (err: unknown) {
        console.error("Error generating report:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error ? err.message : "Failed to generate report",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),

  summary: protectedProcedure.query(async ({ ctx }): Promise<ReportSummary> => {
    try {
      const [
        totalReports,
        reportsByStatus,
        reportsByType,
        revenueStats,
        occupancyStats,
      ] = await Promise.all([
        ctx.db.report.count({ where: { deletedAt: null } }),
        ctx.db.report.groupBy({
          by: ["status"],
          where: { deletedAt: null },
          _count: { status: true },
        }),
        ctx.db.report.groupBy({
          by: ["reportType"],
          where: { deletedAt: null },
          _count: { reportType: true },
        }),
        ctx.db.report.aggregate({
          where: { deletedAt: null },
          _sum: { totalRevenue: true },
        }),
        ctx.db.report.aggregate({
          where: { deletedAt: null },
          _avg: { occupancyRate: true },
        }),
      ]);

      const reportsByStatusMap = reportsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        },
        {} as Record<ReportStatus, number>,
      );

      const reportsByTypeMap = reportsByType.reduce(
        (acc, item) => {
          acc[item.reportType] = item._count.reportType;
          return acc;
        },
        {} as Record<ReportType, number>,
      );

      return {
        totalReports,
        reportsByStatus: reportsByStatusMap,
        reportsByType: reportsByTypeMap,
        totalRevenue: revenueStats._sum.totalRevenue ?? 0,
        averageOccupancyRate: occupancyStats._avg.occupancyRate ?? 0,
      };
    } catch (err: unknown) {
      console.error("Error fetching report summary:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch report summary",
        cause: err instanceof Error ? err : undefined,
      });
    }
  }),

  // Scheduled Report Management
  scheduledReports: protectedProcedure.query(async ({ ctx: _ctx }) => {
    try {
      const schedules = await scheduledReportService.getScheduledReports();
      return schedules;
    } catch (error) {
      console.error(
        "[report.scheduledReports] Error fetching scheduled reports:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch scheduled reports",
      });
    }
  }),

  createScheduledReport: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        reportType: z.nativeEnum(ReportType),
        frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
        cronExpression: z.string().optional(),
        isActive: z.boolean().default(true),
        agencyId: z.string().optional(),
        propertyId: z.string().optional(),
        agentId: z.string().optional(),
        tenantId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Generate cron expression if not provided
        let cronExpression = input.cronExpression;
        cronExpression ??= generateCronExpression(input.frequency);

        const schedule: Omit<ReportSchedule, "id" | "createdAt" | "updatedAt"> =
          {
            title: input.title,
            reportType: input.reportType,
            frequency: input.frequency,
            cronExpression,
            isActive: input.isActive,
            agencyId: input.agencyId,
            propertyId: input.propertyId,
            agentId: input.agentId,
            tenantId: input.tenantId,
            generatedById: ctx.session.user.id,
          };

        const newSchedule =
          await scheduledReportService.createScheduledReport(schedule);
        return newSchedule;
      } catch (error) {
        console.error(
          "[report.createScheduledReport] Error creating scheduled report:",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create scheduled report",
        });
      }
    }),

  updateScheduledReport: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        reportType: z.nativeEnum(ReportType).optional(),
        frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
        cronExpression: z.string().optional(),
        isActive: z.boolean().optional(),
        agencyId: z.string().optional(),
        propertyId: z.string().optional(),
        agentId: z.string().optional(),
        tenantId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: _ctx, input }) => {
      try {
        const { id, ...updates } = input;
        const updatedSchedule =
          await scheduledReportService.updateScheduledReport(id, updates);
        return updatedSchedule;
      } catch (error) {
        console.error(
          "[report.updateScheduledReport] Error updating scheduled report:",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update scheduled report",
        });
      }
    }),

  deleteScheduledReport: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: _ctx, input }) => {
      try {
        await scheduledReportService.deleteScheduledReport(input);
        return { success: true };
      } catch (error) {
        console.error(
          "[report.deleteScheduledReport] Error deleting scheduled report:",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete scheduled report",
        });
      }
    }),

  // Manual trigger for scheduled report generation
  triggerScheduledReport: protectedProcedure
    .input(
      z.object({
        scheduleId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const schedules = await scheduledReportService.getScheduledReports();
        const schedule = schedules.find((s) => s.id === input.scheduleId);

        if (!schedule) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Scheduled report not found",
          });
        }

        // Generate report manually
        const now = new Date();
        const startDate =
          input.startDate ??
          scheduledReportService.calculateStartDate(schedule.frequency, now);
        const endDate = input.endDate ?? now;

        const reportData: Prisma.ReportCreateInput = {
          id: randomUUID(),
          title: `${schedule.title} - Manual Trigger - ${formatDateRange(startDate, endDate)}`,
          reportType: schedule.reportType,
          status: "GENERATED" as ReportStatus,
          startDate,
          endDate,
          description: `Manually triggered ${schedule.frequency} report`,
          generatedBy: { connect: { id: ctx.session.user.id } },
          Agency: schedule.agencyId
            ? { connect: { id: schedule.agencyId } }
            : undefined,
          Property: schedule.propertyId
            ? { connect: { id: schedule.propertyId } }
            : undefined,
          Agent: schedule.agentId
            ? { connect: { id: schedule.agentId } }
            : undefined,
          createdAt: now,
          updatedAt: now,
        };

        const report = await ctx.db.report.create({
          data: reportData,
          include: {
            Agency: true,
            Property: true,
            Agent: true,
            generatedBy: true,
          },
        });

        return report;
      } catch (error) {
        console.error(
          "[report.triggerScheduledReport] Error triggering scheduled report:",
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to trigger scheduled report",
        });
      }
    }),
} satisfies TRPCRouterRecord;

export type ReportRouter = typeof reportRouter;

// Helper function to generate cron expressions
function generateCronExpression(frequency: string): string {
  switch (frequency) {
    case "daily":
      return "0 9 * * *"; // Every day at 9 AM
    case "weekly":
      return "0 10 * * 1"; // Every Monday at 10 AM
    case "monthly":
      return "0 11 1 * *"; // First day of month at 11 AM
    case "yearly":
      return "0 14 1 1 *"; // January 1st at 2 PM
    default:
      return "0 9 * * *"; // Default to daily at 9 AM
  }
}

// Helper function to format date range
function formatDateRange(startDate: Date, endDate: Date): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
