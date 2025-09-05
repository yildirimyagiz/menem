import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateMortgageSchema,
  MortgageFilterSchema,
  UpdateMortgageSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Utility to sanitize mortgage data
const sanitizeMortgage = (
  mortgage: Prisma.MortgageGetPayload<{ include: { Property: true } }> | null,
) => {
  if (!mortgage) return null;
  return {
    id: mortgage.id,
    propertyId: mortgage.propertyId,
    lender: mortgage.lender,
    principal: mortgage.principal,
    interestRate: mortgage.interestRate,
    startDate: mortgage.startDate,
    endDate: mortgage.endDate,
    status: mortgage.status,
    notes: mortgage.notes,
    createdAt: mortgage.createdAt,
    updatedAt: mortgage.updatedAt,
    Property: mortgage.Property,
  };
};

export const mortgageRouter = {
  all: protectedProcedure
    .input(MortgageFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        const { skip, take, page, limit } = getPaginationParams(input ?? {});

        const { propertyId, lender, status, sortBy, sortOrder } = input ?? {};

        const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
        if (propertyId !== undefined)
          cacheKeyParts.push(`propertyId=${propertyId}`);
        if (lender !== undefined) cacheKeyParts.push(`lender=${lender}`);
        if (status !== undefined) cacheKeyParts.push(`status=${status}`);
        if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
        if (sortOrder !== undefined)
          cacheKeyParts.push(`sortOrder=${sortOrder}`);

        const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
        const cacheKey = `mortgages:${dynamicCacheKeyPart}`;

        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.MortgageWhereInput = {
            propertyId: propertyId ?? undefined,
            lender: lender
              ? { contains: lender, mode: "insensitive" }
              : undefined,
            status: status ?? undefined,
            // deletedAt: null, // Assuming no soft delete for mortgages based on schema
          };
          const [mortgages, total] = await Promise.all([
            ctx.db.mortgage.findMany({
              where,
              orderBy: sortBy
                ? { [sortBy]: sortOrder ?? "asc" }
                : { createdAt: "desc" },
              skip,
              take,
              include: { Property: true },
            }),
            ctx.db.mortgage.count({ where }),
          ]);
          return {
            data: mortgages.map(sanitizeMortgage),
            page,
            limit,
            total,
          };
        });
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch mortgages: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const mortgage = await ctx.db.mortgage.findFirst({
          where: { id: input.id /*, deletedAt: null */ }, // Assuming no soft delete
          include: { Property: true },
        });
        if (!mortgage) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mortgage not found.",
          });
        }
        return sanitizeMortgage(mortgage);
      } catch (error: unknown) {
        if (error instanceof TRPCError) throw error;
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch mortgage by ID: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  create: protectedProcedure
    .input(CreateMortgageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const mortgage = await ctx.db.mortgage.create({
          data: {
            id: randomUUID(),
            ...input,
          },
          include: { Property: true },
        });
        return sanitizeMortgage(mortgage);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create mortgage: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateMortgageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        const mortgage = await ctx.db.mortgage.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          include: { Property: true },
        });
        return sanitizeMortgage(mortgage);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mortgage not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update mortgage: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming hard delete for mortgages
        await ctx.db.mortgage.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mortgage not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete mortgage: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
