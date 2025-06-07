import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CreateCurrencySchema, FacilityFilterSchema } from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure, publicProcedure } from "../trpc";

// Utility to sanitize currency data
function sanitizeCurrency(currency: any) {
  if (!currency) return currency;
  const { Payment, ...rest } = currency;
  return {
    ...rest,
    payments:
      Payment?.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
      })) ?? [],
  };
}

export const currencyRouter = {
  all: publicProcedure
    .input(FacilityFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `currencies:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const [currencies, total] = await Promise.all([
          ctx.db.currency.findMany({
            orderBy: { code: "asc" },
            skip,
            take,
            include: {
              Payment: true,
            },
          }),
          ctx.db.currency.count(),
        ]);
        return {
          data: currencies.map(sanitizeCurrency),
          page,
          limit,
          total,
        };
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const currency = await ctx.db.currency.findFirst({
        where: { id: input.id },
        include: {
          Payment: true,
        },
      });
      if (!currency) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Currency not found.",
        });
      }
      return sanitizeCurrency(currency);
    }),

  create: protectedProcedure
    .input(CreateCurrencySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const currency = await ctx.db.currency.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
          },
          include: {
            Payment: true,
          },
        });
        return sanitizeCurrency(currency);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        // Consider logging the originalError here if detailed server-side logs are needed
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create currency: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        code: z.string().optional(),
        name: z.string().optional(),
        symbol: z.string().optional(),
        exchangeRate: z.number().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const currency = await ctx.db.currency.update({
          where: { id: input.id },
          data: {
            ...input,
            updatedAt: new Date(),
          },
          include: {
            Payment: true,
          },
        });
        return sanitizeCurrency(currency);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Currency not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update currency: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const currency = await ctx.db.currency.delete({
          where: { id: input },
          include: {
            Payment: true,
          },
        });
        return sanitizeCurrency(currency);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to delete not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Currency not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete currency: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  getExchangeRates: publicProcedure
    .input(z.object({ baseCurrency: z.string() }))
    .query(async ({ ctx, input }) => {
      const currencies = await ctx.db.currency.findMany({
        where: {
          NOT: {
            code: input.baseCurrency,
          },
        },
        select: {
          code: true,
          exchangeRate: true,
        },
      });

      return currencies.reduce(
        (acc, curr) => {
          acc[curr.code] = curr.exchangeRate;
          return acc;
        },
        {} as Record<string, number>,
      );
    }),
} satisfies TRPCRouterRecord;
