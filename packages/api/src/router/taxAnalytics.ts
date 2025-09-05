import { AnalyticsType } from "@prisma/client";
import type {
  Agency,
  Agent,
  Analytics,
  Property,
  Reservation,
  Task,
  TaxRecord,
  User,
} from "@reservatior/db";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const taxAnalyticsTypeSchema = z.enum([
  "TAX_PAYMENT",
  "TAX_OVERDUE", 
  "TAX_COMPLIANCE",
  "TAX_REVENUE",
  "TAX_PERFORMANCE",
  "TAX_REMINDER",
  "TAX_AUDIT",
  "TAX_REPORT"
]);

type TaxAnalyticsWithRelations = Analytics & {
  Agency?: Agency | null;
  Agent?: Agent | null;
  Property?: Property | null;
  Reservation?: Reservation | null;
  Task?: Task | null;
  User?: User | null;
  TaxRecord?: TaxRecord | null;
};

// Utility to sanitize tax analytics data
function sanitizeTaxAnalytics(analytics: TaxAnalyticsWithRelations | null) {
  if (!analytics) return null;

  return {
    ...analytics,
    agency: analytics.Agency
      ? {
          id: analytics.Agency.id,
          name: analytics.Agency.name,
        }
      : null,
    agent: analytics.Agent
      ? {
          id: analytics.Agent.id,
          name: analytics.Agent.name,
        }
      : null,
    property: analytics.Property
      ? {
          id: analytics.Property.id,
          title: analytics.Property.title,
        }
      : null,
    taxRecord: analytics.TaxRecord
      ? {
          id: analytics.TaxRecord.id,
          amount: analytics.TaxRecord.amount,
          taxType: analytics.TaxRecord.taxType,
          status: analytics.TaxRecord.status,
        }
      : null,
    user: analytics.User
      ? {
          id: analytics.User.id,
          name: analytics.User.name,
        }
      : null,
  };
}

export const taxAnalyticsRouter = createTRPCRouter({
  // Get all tax analytics
  all: protectedProcedure
    .input(
      z
        .object({
          entityId: z.string().optional(),
          entityType: z.string().optional(),
          type: taxAnalyticsTypeSchema.optional(),
          propertyId: z.string().uuid().optional(),
          userId: z.string().uuid().optional(),
          agentId: z.string().uuid().optional(),
          agencyId: z.string().uuid().optional(),
          taxRecordId: z.string().uuid().optional(),
          timestampFrom: z.date().optional(),
          timestampTo: z.date().optional(),
          deletedAt: z.date().optional(),
          sortBy: z.enum(["timestamp", "type", "entityType"]).optional(),
          sortOrder: z.enum(["asc", "desc"]).optional(),
          page: z.number().min(1).optional(),
          pageSize: z.number().min(1).max(100).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `tax-analytics:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          entityId: input?.entityId,
          entityType: input?.entityType,
          type: input?.type,
          propertyId: input?.propertyId,
          userId: input?.userId,
          agentId: input?.agentId,
          agencyId: input?.agencyId,
          taxRecordId: input?.taxRecordId,
          timestamp:
            input?.timestampFrom && input.timestampTo
              ? {
                  gte: input.timestampFrom,
                  lte: input.timestampTo,
                }
              : undefined,
        };

        const [analytics, total] = await Promise.all([
          ctx.db.analytics.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { timestamp: "desc" },
            skip,
            take,
            include: {
              Agency: true,
              Agent: true,
              Property: true,
              Reservation: true,
              Task: true,
              User: true,
              TaxRecord: true,
            },
          }),
          ctx.db.analytics.count({ where }),
        ]);
        return {
          data: analytics.map((item) => sanitizeTaxAnalytics(item)),
          page,
          limit,
          total,
        };
      });
    }),

  // Get tax analytics by ID
  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const analytics = await ctx.db.analytics.findFirst({
        where: { id: input.id },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          Reservation: true,
          Task: true,
          User: true,
          TaxRecord: true,
        },
      });
      return sanitizeTaxAnalytics(analytics);
    }),

  // Create tax analytics event
  create: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.string(),
        type: taxAnalyticsTypeSchema,
        data: z.record(z.string(), z.any()),
        timestamp: z
          .date()
          .optional()
          .default(() => new Date()),
        propertyId: z.string().uuid().optional().nullable(),
        userId: z.string().uuid().optional().nullable(),
        agentId: z.string().uuid().optional().nullable(),
        agencyId: z.string().uuid().optional().nullable(),
        taxRecordId: z.string().uuid().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const analytics = await ctx.db.analytics.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
          },
          include: {
            Agency: true,
            Agent: true,
            Property: true,
            Reservation: true,
            Task: true,
            User: true,
            TaxRecord: true,
          },
        });
        return sanitizeTaxAnalytics(analytics);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create tax analytics: ${err.message}`);
        }
        throw err;
      }
    }),

  // Get tax payment analytics
  getTaxPaymentAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
        taxType: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        type: "TAX_PAYMENT" as AnalyticsType,
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      const analytics = await ctx.db.analytics.findMany({
        where,
        include: {
          TaxRecord: true,
          Property: true,
          Agency: true,
        },
        orderBy: { timestamp: "desc" },
      });

      // Calculate payment metrics
      const totalPayments = analytics.length;
      const totalAmount = analytics.reduce((sum, item) => {
        const amount = (item.data as any)?.amount || 0;
        return sum + amount;
      }, 0);

      const paymentsByType = analytics.reduce((acc, item) => {
        const taxType = (item.data as any)?.taxType || "UNKNOWN";
        acc[taxType] = (acc[taxType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalPayments,
        totalAmount,
        paymentsByType,
        analytics: analytics.map((item) => sanitizeTaxAnalytics(item)),
      };
    }),

  // Get tax overdue analytics
  getTaxOverdueAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        type: "TAX_OVERDUE" as AnalyticsType,
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      const analytics = await ctx.db.analytics.findMany({
        where,
        include: {
          TaxRecord: true,
          Property: true,
          Agency: true,
        },
        orderBy: { timestamp: "desc" },
      });

      // Calculate overdue metrics
      const totalOverdue = analytics.length;
      const totalOverdueAmount = analytics.reduce((sum, item) => {
        const amount = (item.data as any)?.amount || 0;
        return sum + amount;
      }, 0);

      const overdueByType = analytics.reduce((acc, item) => {
        const taxType = (item.data as any)?.taxType || "UNKNOWN";
        acc[taxType] = (acc[taxType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalOverdue,
        totalOverdueAmount,
        overdueByType,
        analytics: analytics.map((item) => sanitizeTaxAnalytics(item)),
      };
    }),

  // Get tax compliance analytics
  getTaxComplianceAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        type: "TAX_COMPLIANCE" as AnalyticsType,
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      const analytics = await ctx.db.analytics.findMany({
        where,
        include: {
          TaxRecord: true,
          Property: true,
          Agency: true,
        },
        orderBy: { timestamp: "desc" },
      });

      // Calculate compliance metrics
      const totalComplianceEvents = analytics.length;
      const complianceByStatus = analytics.reduce((acc, item) => {
        const status = (item.data as any)?.status || "UNKNOWN";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalComplianceEvents,
        complianceByStatus,
        analytics: analytics.map((item) => sanitizeTaxAnalytics(item)),
      };
    }),

  // Get tax revenue analytics
  getTaxRevenueAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        type: "TAX_REVENUE" as AnalyticsType,
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      const analytics = await ctx.db.analytics.findMany({
        where,
        include: {
          TaxRecord: true,
          Property: true,
          Agency: true,
        },
        orderBy: { timestamp: "desc" },
      });

      // Calculate revenue metrics
      const totalRevenue = analytics.reduce((sum, item) => {
        const amount = (item.data as any)?.amount || 0;
        return sum + amount;
      }, 0);

      const revenueByType = analytics.reduce((acc, item) => {
        const taxType = (item.data as any)?.taxType || "UNKNOWN";
        const amount = (item.data as any)?.amount || 0;
        acc[taxType] = (acc[taxType] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalRevenue,
        revenueByType,
        analytics: analytics.map((item) => sanitizeTaxAnalytics(item)),
      };
    }),

  // Get tax performance metrics
  getTaxPerformanceMetrics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        type: "TAX_PERFORMANCE" as AnalyticsType,
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      const analytics = await ctx.db.analytics.findMany({
        where,
        include: {
          TaxRecord: true,
          Property: true,
          Agency: true,
        },
        orderBy: { timestamp: "desc" },
      });

      // Calculate performance metrics
      const totalEvents = analytics.length;
      const performanceByMetric = analytics.reduce((acc, item) => {
        const metric = (item.data as any)?.metric || "UNKNOWN";
        const value = (item.data as any)?.value || 0;
        acc[metric] = (acc[metric] || 0) + value;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalEvents,
        performanceByMetric,
        analytics: analytics.map((item) => sanitizeTaxAnalytics(item)),
      };
    }),

  // Get tax reminder analytics
  getTaxReminderAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        type: "TAX_REMINDER" as AnalyticsType,
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      const analytics = await ctx.db.analytics.findMany({
        where,
        include: {
          TaxRecord: true,
          Property: true,
          Agency: true,
        },
        orderBy: { timestamp: "desc" },
      });

      // Calculate reminder metrics
      const totalReminders = analytics.length;
      const remindersByStatus = analytics.reduce((acc, item) => {
        const status = (item.data as any)?.status || "UNKNOWN";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalReminders,
        remindersByStatus,
        analytics: analytics.map((item) => sanitizeTaxAnalytics(item)),
      };
    }),

  // Get tax audit analytics
  getTaxAuditAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        type: "TAX_AUDIT" as AnalyticsType,
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      const analytics = await ctx.db.analytics.findMany({
        where,
        include: {
          TaxRecord: true,
          Property: true,
          Agency: true,
        },
        orderBy: { timestamp: "desc" },
      });

      // Calculate audit metrics
      const totalAudits = analytics.length;
      const auditsByResult = analytics.reduce((acc, item) => {
        const result = (item.data as any)?.result || "UNKNOWN";
        acc[result] = (acc[result] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalAudits,
        auditsByResult,
        analytics: analytics.map((item) => sanitizeTaxAnalytics(item)),
      };
    }),

  // Get comprehensive tax analytics summary
  getTaxAnalyticsSummary: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        propertyId: z.string().uuid().optional(),
        agencyId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        ...(input.propertyId && { propertyId: input.propertyId }),
        ...(input.agencyId && { agencyId: input.agencyId }),
      };

      // Get analytics by type
      const [payments, overdue, compliance, revenue, performance, reminders, audits] = await Promise.all([
        ctx.db.analytics.count({ where: { ...where, type: "TAX_PAYMENT" } }),
        ctx.db.analytics.count({ where: { ...where, type: "TAX_OVERDUE" } }),
        ctx.db.analytics.count({ where: { ...where, type: "TAX_COMPLIANCE" } }),
        ctx.db.analytics.count({ where: { ...where, type: "TAX_REVENUE" } }),
        ctx.db.analytics.count({ where: { ...where, type: "TAX_PERFORMANCE" } }),
        ctx.db.analytics.count({ where: { ...where, type: "TAX_REMINDER" } }),
        ctx.db.analytics.count({ where: { ...where, type: "TAX_AUDIT" } }),
      ]);

      // Get total tax records for comparison
      const totalTaxRecords = await ctx.db.taxRecord.count({
        where: {
          createdAt: {
            gte: input.startDate,
            lte: input.endDate,
          },
          ...(input.propertyId && { propertyId: input.propertyId }),
          ...(input.agencyId && { clientId: input.agencyId }),
        },
      });

      return {
        summary: {
          totalPayments: payments,
          totalOverdue: overdue,
          totalCompliance: compliance,
          totalRevenue: revenue,
          totalPerformance: performance,
          totalReminders: reminders,
          totalAudits: audits,
          totalTaxRecords,
        },
        complianceRate: totalTaxRecords > 0 ? (payments / totalTaxRecords) * 100 : 0,
        overdueRate: totalTaxRecords > 0 ? (overdue / totalTaxRecords) * 100 : 0,
      };
    }),
}); 