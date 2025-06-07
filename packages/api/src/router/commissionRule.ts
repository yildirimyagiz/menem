// packages/api/src/router/commissionRule.ts

import type {
  CommissionRule as PrismaCommissionRule,
  Provider,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  CommissionRuleFilterSchema,
  CreateCommissionRuleSchema,
  UpdateCommissionRuleSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Type for including relations
type CommissionRuleWithRelations = PrismaCommissionRule & {
  provider: Provider | null;
};

// Utility to sanitize commission rule data
function sanitizeCommissionRule(rule: CommissionRuleWithRelations | null) {
  if (!rule) return null;
  const { provider, ...rest } = rule;
  return {
    ...rest,
    provider: provider
      ? {
          id: provider.id,
          name: provider.name,
        }
      : null,
  };
}

export const commissionRuleRouter = {
  all: protectedProcedure
    .input(CommissionRuleFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `commission-rules:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        // Build Prisma where clause from filter input
        const where: Record<string, unknown> = {
          providerId: input?.providerId,
          ruleType: input?.ruleType,
          commission: {
            gte: input?.commissionMin,
            lte: input?.commissionMax,
          },
          minVolume: input?.minVolume,
          maxVolume: input?.maxVolume,
          startDate:
            input?.startDateFrom || input?.startDateTo
              ? {
                  gte: input?.startDateFrom,
                  lte: input?.startDateTo,
                }
              : undefined,
          endDate:
            input?.endDateFrom || input?.endDateTo
              ? {
                  gte: input?.endDateFrom,
                  lte: input?.endDateTo,
                }
              : undefined,
        };

        // Remove undefined filters
        Object.keys(where).forEach((key) => {
          if (where[key] === undefined) {
            delete where[key];
          }
        });

        const [rules, total] = await Promise.all([
          ctx.db.commissionRule.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy as string]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              provider: true,
            },
          }),
          ctx.db.commissionRule.count({ where }),
        ]);
        return {
          data: rules.map((rule) => sanitizeCommissionRule(rule)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const rule = await ctx.db.commissionRule.findFirst({
        where: { id: input.id },
        include: {
          provider: true,
        },
      });
      return sanitizeCommissionRule(rule);
    }),

  create: protectedProcedure
    .input(CreateCommissionRuleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const rule = await ctx.db.commissionRule.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
          },
          include: {
            provider: true,
          },
        });
        return sanitizeCommissionRule(rule);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create commission rule: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateCommissionRuleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const rule = await ctx.db.commissionRule.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          provider: true,
        },
      });
      return sanitizeCommissionRule(rule);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const rule = await ctx.db.commissionRule.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            provider: true,
          },
        });
        return sanitizeCommissionRule(rule);
      } catch (error) {
        if (
          error instanceof Error &&
          // Prisma error codes are not typed, but we check for code property
          (error as { code?: string }).code === "P2025"
        ) {
          throw new Error("Commission rule not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;
