import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Discount } from "@acme/db";
import {
  ApplyDiscountSchema,
  CreateDiscountSchema,
  GetDiscountSchema,
  GetDiscountsSchema,
  UpdateDiscountSchema,
  ValidateDiscountCodeSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure, publicProcedure } from "../trpc";

// Utility to sanitize discount data
function sanitizeDiscount(discount: Discount | null) {
  if (!discount) return null;
  const { ...rest } = discount;
  return {
    ...rest,
    listing: null,
  };
}

export const discountRouter = {
  all: protectedProcedure
    .input(GetDiscountsSchema)
    .query(async ({ ctx, input }) => {
      const paginationParams = getPaginationParams(input ?? {});
      const { page, limit } = paginationParams;
      const cacheKey = `discounts:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        try {
          const validatedInput = GetDiscountsSchema.safeParse(input);
          if (!validatedInput.success) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid input for discount query",
            });
          }

          const data = validatedInput.data;
          const where = {
            ...(data?.name && { name: data.name }),
            ...(data?.code && { code: data.code }),
            ...(data?.type && { type: data.type }),
            ...(data?.isActive && { isActive: data.isActive }),
            ...(data?.startDateFrom && {
              startDate: {
                gte: data.startDateFrom,
                ...(data.startDateTo && { lte: data.startDateTo }),
              },
            }),
            ...(data?.endDateFrom && {
              endDate: {
                gte: data.endDateFrom,
                ...(data.endDateTo && { lte: data.endDateTo }),
              },
            }),
            ...((data?.valueMin ?? data?.valueMax) && {
              value: {
                ...(data.valueMin && { gte: data.valueMin }),
                ...(data.valueMax && { lte: data.valueMax }),
              },
            }),
            ...(data?.createdAtFrom && {
              createdAt: {
                gte: data.createdAtFrom,
                ...(data.createdAtTo && { lte: data.createdAtTo }),
              },
            }),
            ...(data?.deletedAt && { deletedAt: data.deletedAt }),
          };

          const [discounts, total] = await Promise.all([
            ctx.db.discount.findMany({
              where,
              orderBy: data?.sortBy
                ? { [data.sortBy]: data.sortOrder ?? "asc" }
                : { id: "desc" },
              skip: paginationParams.skip,
              take: paginationParams.take,
            }),
            ctx.db.discount.count({ where }),
          ]);

          return {
            data: discounts.map(sanitizeDiscount),
            page,
            limit,
            total,
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch discounts",
            cause: error,
          });
        }
      });
    }),

  byId: protectedProcedure
    .input(GetDiscountSchema)
    .query(async ({ ctx, input }) => {
      const discount = await ctx.db.discount.findFirst({
        where: { id: input.id },
      });
      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found.",
        });
      }
      return sanitizeDiscount(discount);
    }),

  create: protectedProcedure
    .input(CreateDiscountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const discount = await ctx.db.discount.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
            pricingRuleId: undefined,
            Property: undefined,
            propertyId: "",
          },
        });
        return sanitizeDiscount(discount);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create discount: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateDiscountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        const discount = await ctx.db.discount.update({
          where: { id },
          data: {
            ...updateData,
            updatedAt: new Date(),
            pricingRuleId: undefined,
            propertyId: "",
          },
        });
        return sanitizeDiscount(discount);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Discount not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update discount: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        // This is a hard delete. If soft delete is needed, update logic.
        const discount = await ctx.db.discount.delete({
          where: { id: input },
        });
        return sanitizeDiscount(discount);
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          err.code === "P2025" // Prisma error: "Record to delete not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Discount not found or already deleted.",
          });
        }
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete discount: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  validateCode: publicProcedure
    .input(ValidateDiscountCodeSchema)
    .query(async ({ ctx, input }) => {
      const discount = await ctx.db.discount.findFirst({
        where: {
          code: input.code,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (!discount) {
        throw new TRPCError({
          code: "BAD_REQUEST", // Or NOT_FOUND, depending on desired semantics
          message: "Invalid or expired discount code.",
        });
      }

      if (discount.maxUsage && discount.currentUsage >= discount.maxUsage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Discount code has reached its maximum usage limit.",
        });
      }

      return sanitizeDiscount(discount);
    }),

  applyDiscount: protectedProcedure
    .input(ApplyDiscountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const discount = await ctx.db.discount.update({
          where: { id: input.id },
          data: {
            currentUsage: { increment: 1 },
            updatedAt: new Date(),
            propertyId: "", // Ensure this aligns with schema requirements
          },
        });
        return sanitizeDiscount(discount);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Discount not found, cannot apply.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to apply discount: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
