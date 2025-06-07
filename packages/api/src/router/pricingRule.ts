import { randomUUID } from "crypto";
import type { PricingRule as PrismaPricingRule } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  CreatePricingRuleSchema,
  PricingRuleFilterSchema,
  UpdatePricingRuleSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type SortOrder = "asc" | "desc";
type SortField = "createdAt" | "name" | "basePrice";

interface SortInput {
  sortBy?: SortField;
  sortOrder?: SortOrder;
  [key: string]: unknown;
}

// Helper function to safely convert to Prisma's InputJsonValue
const toPrismaJson = (value: unknown): Prisma.InputJsonValue => {
  if (value === null || value === undefined) {
    return Prisma.DbNull as unknown as Prisma.InputJsonValue;
  }
  return value as Prisma.InputJsonValue;
};

const sanitizePricingRule = (
  rule:
    | (PrismaPricingRule & {
        Property?: { id: string } | null;
        Reservation?: { id: string }[];
        Availability?: { id: string }[];
        Subscriptions?: { id: string }[];
        Discounts?: { id: string }[];
        currency?: { id: string } | null;
      })
    | null,
) => {
  if (!rule) return null;

  return {
    ...rule,
    Property: rule.Property ?? null,
    Reservation: rule.Reservation ?? [],
    Availability: rule.Availability ?? [],
    Subscriptions: rule.Subscriptions ?? [],
    Discounts: rule.Discounts ?? [],
    currency: rule.currency ?? null,
  };
};

export const pricingRuleRouter = {
  all: protectedProcedure
    .input(PricingRuleFilterSchema.optional())
    .query(async ({ ctx, input = {} }) => {
      const { skip, take, page, limit } = getPaginationParams(input);
      const cacheKey = `pricing-rules:${page}:${limit}:${JSON.stringify(input)}`;

      return withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.PricingRuleWhereInput = {
          ...(input as Prisma.PricingRuleWhereInput),
          deletedAt: null,
        };

        // Type-safe sort handling
        const sortInput = input as SortInput;
        const sortField = sortInput.sortBy ?? "createdAt";
        const sortDirection = sortInput.sortOrder ?? "desc";

        // Execute queries in parallel
        const [rules, total] = await Promise.all([
          ctx.db.pricingRule.findMany({
            where,
            orderBy: {
              [sortField]: sortDirection,
            } as Prisma.PricingRuleOrderByWithRelationInput,
            skip,
            take,
            include: {
              Property: { select: { id: true } },
              Reservation: { select: { id: true } },
              Availability: { select: { id: true } },
              Subscriptions: { select: { id: true } },
              Discounts: { select: { id: true } },
              currency: { select: { id: true } },
            },
          }),
          ctx.db.pricingRule.count({ where }),
        ] as const);

        const totalPages = Math.ceil(total / limit);

        return {
          data: rules.map(sanitizePricingRule),
          page,
          limit,
          total,
          totalPages,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const rule = await ctx.db.pricingRule.findUnique({
        where: { id: input.id },
        include: {
          Property: { select: { id: true } },
          Reservation: { select: { id: true } },
          Availability: { select: { id: true } },
          Subscriptions: { select: { id: true } },
          Discounts: { select: { id: true } },
          currency: { select: { id: true } },
        },
      });
      return sanitizePricingRule(rule);
    }),

  create: protectedProcedure
    .input(CreatePricingRuleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          propertyId,
          currencyId,
          weekdayPrices,
          taxRules,
          discountRules,
          ...data
        } = input;

        const createData: Prisma.PricingRuleCreateInput = {
          ...data,
          id: randomUUID(),
          updatedAt: new Date(),
          Property: { connect: { id: propertyId } },
          currency: { connect: { id: currencyId } },
          weekdayPrices: toPrismaJson(weekdayPrices),
          taxRules: toPrismaJson(taxRules),
          discountRules: toPrismaJson(discountRules),
        };

        const rule = await ctx.db.pricingRule.create({
          data: createData,
          include: {
            Property: { select: { id: true } },
            Reservation: { select: { id: true } },
            Availability: { select: { id: true } },
            Subscriptions: { select: { id: true } },
            Discounts: { select: { id: true } },
            currency: { select: { id: true } },
          },
        });
        return sanitizePricingRule(rule);
      } catch (err: unknown) {
        const error = err as Error;
        throw new Error(`Failed to create pricing rule: ${error.message}`);
      }
    }),

  update: protectedProcedure
    .input(UpdatePricingRuleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, propertyId, currencyId, ...data } = input;

      // Extract JSON fields and create update data
      const { weekdayPrices, taxRules, discountRules, ...restData } = data;

      // Create base update data
      const updateData: Prisma.PricingRuleUpdateInput = {
        ...restData,
        updatedAt: new Date(),
        ...(propertyId && { Property: { connect: { id: propertyId } } }),
        ...(currencyId && { currency: { connect: { id: currencyId } } }),
      };

      // Add JSON fields if they exist
      if (weekdayPrices !== undefined) {
        updateData.weekdayPrices = toPrismaJson(weekdayPrices);
      }

      if (taxRules !== undefined) {
        updateData.taxRules = toPrismaJson(taxRules);
      }

      if (discountRules !== undefined) {
        updateData.discountRules = toPrismaJson(discountRules);
      }

      try {
        const rule = await ctx.db.pricingRule.update({
          where: { id },
          data: updateData,
          include: {
            Property: { select: { id: true } },
            Reservation: { select: { id: true } },
            Availability: { select: { id: true } },
            Subscriptions: { select: { id: true } },
            Discounts: { select: { id: true } },
            currency: { select: { id: true } },
          },
        });
        return sanitizePricingRule(rule);
      } catch (err: unknown) {
        const error = err as Error;
        throw new Error(`Failed to update pricing rule: ${error.message}`);
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const rule = await ctx.db.pricingRule.delete({
          where: { id: input },
          include: {
            Property: { select: { id: true } },
            Reservation: { select: { id: true } },
            Availability: { select: { id: true } },
            Subscriptions: { select: { id: true } },
            Discounts: { select: { id: true } },
            currency: { select: { id: true } },
          },
        });
        return sanitizePricingRule(rule);
      } catch (err: unknown) {
        const error = err as Error & { code?: string };
        if (error.code === "P2025") {
          throw new Error("Pricing rule not found or already deleted.");
        }
        throw new Error(`Failed to delete pricing rule: ${error.message}`);
      }
    }),
} satisfies TRPCRouterRecord;
