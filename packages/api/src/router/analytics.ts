import type { TRPCRouterRecord } from "@trpc/server";
import { AnalyticsType } from "@prisma/client";
import { z } from "zod";

import type {
  Agency,
  Agent,
  Analytics,
  Property,
  Reservation,
  Task,
  User,
} from "@acme/db";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

const analyticsTypeSchema = z.nativeEnum(AnalyticsType);

type AnalyticsWithRelations = Analytics & {
  Agency?: Agency | null;
  Agent?: Agent | null;
  Property?: Property | null;
  Reservation?: Reservation | null;
  Task?: Task | null;
  User?: User | null;
};

// Utility to sanitize analytics data
function sanitizeAnalytics(analytics: AnalyticsWithRelations | null) {
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
    reservation: analytics.Reservation
      ? {
          id: analytics.Reservation.id,
          status: analytics.Reservation.status,
        }
      : null,
    task: analytics.Task
      ? {
          id: analytics.Task.id,
          title: analytics.Task.title,
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

export const analyticsRouter = {
  all: protectedProcedure
    .input(
      z
        .object({
          entityId: z.string().optional(),
          entityType: z.string().optional(),
          type: analyticsTypeSchema.optional(),
          propertyId: z.string().uuid().optional(),
          userId: z.string().uuid().optional(),
          agentId: z.string().uuid().optional(),
          agencyId: z.string().uuid().optional(),
          taskId: z.string().uuid().optional(),
          reservationId: z.string().uuid().optional(),
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
      const cacheKey = `analytics:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          entityId: input?.entityId,
          entityType: input?.entityType,
          type: input?.type,
          propertyId: input?.propertyId,
          userId: input?.userId,
          agentId: input?.agentId,
          agencyId: input?.agencyId,
          reservationId: input?.reservationId,
          taskId: input?.taskId,
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
            },
          }),
          ctx.db.analytics.count({ where }),
        ]);
        return {
          data: analytics.map((item) => sanitizeAnalytics(item)),
          page,
          limit,
          total,
        };
      });
    }),

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
        },
      });
      return sanitizeAnalytics(analytics);
    }),

  create: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.string(),
        type: analyticsTypeSchema,
        data: z.record(z.string(), z.any()),
        timestamp: z
          .date()
          .optional()
          .default(() => new Date()),
        propertyId: z.string().uuid().optional().nullable(),
        userId: z.string().uuid().optional().nullable(),
        agentId: z.string().uuid().optional().nullable(),
        agencyId: z.string().uuid().optional().nullable(),
        taskId: z.string().uuid().optional().nullable(),
        reservationId: z.string().uuid().optional().nullable(),
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
          },
        });
        return sanitizeAnalytics(analytics);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create analytics: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        entityId: z.string().optional(),
        entityType: z.string().optional(),
        type: analyticsTypeSchema.optional(),
        data: z.record(z.string(), z.any()).optional(),
        timestamp: z.date().optional(),
        propertyId: z.string().uuid().optional().nullable(),
        userId: z.string().uuid().optional().nullable(),
        agentId: z.string().uuid().optional().nullable(),
        agencyId: z.string().uuid().optional().nullable(),
        taskId: z.string().uuid().optional().nullable(),
        reservationId: z.string().uuid().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const analytics = await ctx.db.analytics.update({
        where: { id },
        data,
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          Reservation: true,
          Task: true,
          User: true,
        },
      });
      return sanitizeAnalytics(analytics);
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const analytics = await ctx.db.analytics.delete({
          where: { id: input },
          include: {
            Agency: true,
            Agent: true,

            Property: true,
            Reservation: true,
            Task: true,
            User: true,
          },
        });
        return sanitizeAnalytics(analytics);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          const error = new Error(
            `Analytics with id ${input} not found`,
          ) as Error & { code: string };
          error.code = "NOT_FOUND";
          throw error;
        }
        throw error;
      }
    }),

  getMetrics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        type: analyticsTypeSchema.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        timestamp: {
          gte: input.startDate,
          lte: input.endDate,
        },
        ...(input.type && { type: input.type }),
      };

      const metrics = await ctx.db.analytics.groupBy({
        by: ["type"],
        where,
        _count: true,
      });

      return metrics;
    }),
} satisfies TRPCRouterRecord;
