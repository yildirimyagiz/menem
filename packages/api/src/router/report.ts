import { randomUUID } from "crypto";
import type { Prisma, ReportStatus, ReportType } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreateReportSchema,
  ReportFilterSchema,
  UpdateReportSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Type for report with includes
export type ReportWithIncludes = Prisma.ReportGetPayload<{
  include: {
    Agency: true;
    Facility: true;
    IncludedService: true;
    ExtraCharge: true;
    Provider: true;
    Reservation: true;
  };
}>;

const sanitizeReport = (report: ReportWithIncludes | null) => {
  if (!report) return null;
  return {
    ...report,
    Agency: report.Agency ?? null,
    Facility: report.Facility ?? null,
    IncludedService: report.IncludedService ?? null,
    ExtraCharge: report.ExtraCharge ?? null,
    Provider: report.Provider ?? null,
    Reservation: report.Reservation ?? [],
  };
};

export const reportRouter = {
  all: protectedProcedure
    .input(ReportFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams({
        page: typeof input?.page === "number" ? input.page : undefined,
        limit:
          typeof input?.limit === "number"
            ? input.limit
            : typeof input?.pageSize === "number"
              ? input.pageSize
              : undefined,
      });
      const where: Prisma.ReportWhereInput = {
        title:
          typeof input?.title === "string" && input.title.trim() !== ""
            ? { contains: input.title, mode: "insensitive" }
            : undefined,
        reportType:
          input?.reportType && typeof input.reportType === "string"
            ? (input.reportType as ReportType)
            : undefined,
        status:
          input?.status && typeof input.status === "string"
            ? (input.status as ReportStatus)
            : undefined,
        agencyId:
          typeof input?.agencyId === "string" ? input.agencyId : undefined,
        facilityId:
          typeof input?.facilityId === "string" ? input.facilityId : undefined,
        includedServiceId:
          typeof input?.includedServiceId === "string"
            ? input.includedServiceId
            : undefined,
        extraChargeId:
          typeof input?.extraChargeId === "string"
            ? input.extraChargeId
            : undefined,
        providerId:
          typeof input?.providerId === "string" ? input.providerId : undefined,
        generatedById:
          typeof input?.generatedById === "string"
            ? input.generatedById
            : undefined,
        startDate:
          input?.startDateFrom instanceof Date ||
          input?.startDateTo instanceof Date
            ? {
                ...(input?.startDateFrom instanceof Date && {
                  gte: input.startDateFrom,
                }),
                ...(input?.startDateTo instanceof Date && {
                  lte: input.startDateTo,
                }),
              }
            : undefined,
        endDate:
          input?.endDateFrom instanceof Date || input?.endDateTo instanceof Date
            ? {
                ...(input?.endDateFrom instanceof Date && {
                  gte: input.endDateFrom,
                }),
                ...(input?.endDateTo instanceof Date && {
                  lte: input.endDateTo,
                }),
              }
            : undefined,
      };
      const filterKey = JSON.stringify({ ...input });
      const cacheKey = `reports:${page}:${limit}:${filterKey}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const [reports, total] = await Promise.all([
          ctx.db.report.findMany({
            where,
            orderBy:
              typeof input?.sortBy === "string"
                ? { [input.sortBy]: input.sortOrder ?? "asc" }
                : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agency: true,
              Facility: true,
              IncludedService: true,
              ExtraCharge: true,
              Provider: true,
              Reservation: true,
            },
          }),
          ctx.db.report.count({ where }),
        ]);
        return {
          data: reports.map(sanitizeReport),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const report = await ctx.db.report.findUnique({
        where: { id: input.id },
        include: {
          Agency: true,
          Facility: true,
          IncludedService: true,
          ExtraCharge: true,
          Provider: true,
          Reservation: true,
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
    .mutation(async ({ ctx, input }) => {
      try {
        const reportData: Prisma.ReportCreateInput = {
          id: randomUUID(),
          title: typeof input.title === "string" ? input.title : "",
          reportType: input.reportType as ReportType,
          generatedBy:
            typeof input.generatedById === "string"
              ? { connect: { id: input.generatedById } }
              : undefined!,
          startDate:
            input.startDate instanceof Date ? input.startDate : new Date(),
          endDate: input.endDate instanceof Date ? input.endDate : new Date(),
          entityId:
            input.entityId && typeof input.entityId === "string"
              ? input.entityId
              : null,
          entityType:
            input.entityType && typeof input.entityType === "string"
              ? input.entityType
              : null,
          description:
            input.description && typeof input.description === "string"
              ? input.description
              : null,
          Agency:
            input.agencyId && typeof input.agencyId === "string"
              ? { connect: { id: input.agencyId } }
              : undefined,
          Facility:
            input.facilityId && typeof input.facilityId === "string"
              ? { connect: { id: input.facilityId } }
              : undefined,
          IncludedService:
            input.includedServiceId &&
            typeof input.includedServiceId === "string"
              ? { connect: { id: input.includedServiceId } }
              : undefined,
          ExtraCharge:
            input.extraChargeId && typeof input.extraChargeId === "string"
              ? { connect: { id: input.extraChargeId } }
              : undefined,
          Provider:
            input.providerId && typeof input.providerId === "string"
              ? { connect: { id: input.providerId } }
              : undefined,
          totalReservations: Array.isArray(input.reservationIds)
            ? input.reservationIds.length
            : 0,
          reservationIds: Array.isArray(input.reservationIds)
            ? input.reservationIds
            : [],
          createdAt: new Date(),
          updatedAt: new Date(),
          // add other fields as needed
        };
        const report = await ctx.db.report.create({
          data: reportData,
          include: {
            Agency: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Provider: true,
            Reservation: true,
          },
        });
        return sanitizeReport(report);
      } catch (err: unknown) {
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
      if (!input || typeof input !== "object" || !('id' in input) || typeof (input as any).id !== 'string') {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Input must be an object with a string id" });
      }
      const { id, ...data } = input as { id: string; [key: string]: unknown };
      try {
        const updateData: Prisma.ReportUpdateInput = {
          title: typeof data.title === "string" ? data.title : undefined,
          reportType: data.reportType as ReportType,
          generatedBy:
            typeof data.generatedById === "string"
              ? { connect: { id: data.generatedById } }
              : undefined,
          startDate:
            data.startDate instanceof Date ? data.startDate : undefined,
          endDate: data.endDate instanceof Date ? data.endDate : undefined,
          entityId:
            data.entityId && typeof data.entityId === "string"
              ? data.entityId
              : null,
          entityType:
            data.entityType && typeof data.entityType === "string"
              ? data.entityType
              : null,
          description:
            data.description && typeof data.description === "string"
              ? data.description
              : null,
          Agency:
            data.agencyId && typeof data.agencyId === "string"
              ? { connect: { id: data.agencyId } }
              : undefined,
          Facility:
            data.facilityId && typeof data.facilityId === "string"
              ? { connect: { id: data.facilityId } }
              : undefined,
          IncludedService:
            data.includedServiceId && typeof data.includedServiceId === "string"
              ? { connect: { id: data.includedServiceId } }
              : undefined,
          ExtraCharge:
            data.extraChargeId && typeof data.extraChargeId === "string"
              ? { connect: { id: data.extraChargeId } }
              : undefined,
          Provider:
            data.providerId && typeof data.providerId === "string"
              ? { connect: { id: data.providerId } }
              : undefined,
          totalReservations: Array.isArray(data.reservationIds)
            ? data.reservationIds.length
            : 0,
          reservationIds: Array.isArray(data.reservationIds)
            ? data.reservationIds
            : [],
          updatedAt: new Date(),
          // add other fields as needed
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
            Reservation: true,
          },
        });
        return sanitizeReport(report);
      } catch (err: unknown) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error ? err.message : "Failed to update report",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        if (typeof input !== "string") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Report id must be a string",
          });
        }
        const report = await ctx.db.report.update({
          where: { id: input },
          data: { deletedAt: new Date(), updatedAt: new Date() }, // Soft delete
          include: {
            // Add includes to match sanitizeReport's expectation
            Agency: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Provider: true,
            Reservation: true,
          },
        });
        // Ensure all required relations are present for sanitizeReport
        return sanitizeReport({
          ...report,
          Agency: report.Agency ?? null,
          Facility: report.Facility ?? null,
          IncludedService: report.IncludedService ?? null,
          ExtraCharge: report.ExtraCharge ?? null,
          Provider: report.Provider ?? null,
          Reservation: Array.isArray(report.Reservation) ? report.Reservation : [],
        }); // Return the sanitized soft-deleted report
      } catch (err: unknown) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error ? err.message : "Failed to delete report",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),
} satisfies TRPCRouterRecord;

export type ReportRouter = typeof reportRouter;
