import type { Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreateExtraChargeSchema,
  ExtraChargeFilterSchema,
  UpdateExtraChargeSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

export const extraChargeRouter: TRPCRouterRecord = {
  all: protectedProcedure
    .input(ExtraChargeFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      const {
        name,
        facilityId,
        deletedAt,
        createdAtFrom,
        createdAtTo,
        updatedAtFrom,
        updatedAtTo,
        sortBy,
        sortOrder,
      } = input ?? {};

      const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
      if (name !== undefined) cacheKeyParts.push(`name=${name}`);
      if (facilityId !== undefined)
        cacheKeyParts.push(`facilityId=${facilityId}`);
      if (deletedAt !== undefined && deletedAt !== null) {
        cacheKeyParts.push(`deletedAt=${deletedAt.toISOString()}`);
      } else if (deletedAt === null) {
        cacheKeyParts.push(`deletedAt=null`);
      }
      if (createdAtFrom !== undefined)
        cacheKeyParts.push(`createdAtFrom=${createdAtFrom.toISOString()}`);
      if (createdAtTo !== undefined)
        cacheKeyParts.push(`createdAtTo=${createdAtTo.toISOString()}`);
      if (updatedAtFrom !== undefined)
        cacheKeyParts.push(`updatedAtFrom=${updatedAtFrom.toISOString()}`);
      if (updatedAtTo !== undefined)
        cacheKeyParts.push(`updatedAtTo=${updatedAtTo.toISOString()}`);
      if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
      if (sortOrder !== undefined) cacheKeyParts.push(`sortOrder=${sortOrder}`);

      const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
      const cacheKey = `extraCharges:${dynamicCacheKeyPart}`;

      try {
        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.ExtraChargeWhereInput = {
            name: name ? { contains: name, mode: "insensitive" } : undefined,
            facilityId: facilityId ?? undefined,
            deletedAt: deletedAt === undefined ? null : deletedAt, // Default to not deleted if not specified
            createdAt:
              createdAtFrom || createdAtTo
                ? {
                    gte: createdAtFrom ?? undefined,
                    lte: createdAtTo ?? undefined,
                  }
                : undefined,
            updatedAt:
              updatedAtFrom || updatedAtTo
                ? {
                    gte: updatedAtFrom ?? undefined,
                    lte: updatedAtTo ?? undefined,
                  }
                : undefined,
          };
          const [extraCharges, total] = await Promise.all([
            ctx.db.extraCharge.findMany({
              where,
              orderBy: sortBy
                ? { [sortBy]: sortOrder ?? "asc" }
                : { createdAt: "desc" },
              skip,
              take,
            }),
            ctx.db.extraCharge.count({ where }),
          ]);
          return {
            items: extraCharges, // No sanitization needed as per current structure
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
          message: `Failed to fetch extra charges: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const extraCharge = await ctx.db.extraCharge.findUnique({
        where: { id: input.id },
      });
      if (!extraCharge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ExtraCharge not found.",
        });
      }
      return extraCharge; // No sanitization needed as per current structure
    }),

  create: protectedProcedure
    .input(CreateExtraChargeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { facilityId, ...dataWithoutFacility } = input;
        const data: Prisma.ExtraChargeCreateInput = facilityId
          ? {
              ...dataWithoutFacility,
              Facility: { connect: { id: facilityId } },
            }
          : { ...dataWithoutFacility };
        const extraCharge = await ctx.db.extraCharge.create({
          data,
        });
        return extraCharge; // No sanitization needed
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create extra charge: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateExtraChargeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, facilityId, ...rest } = input;
        const data: Prisma.ExtraChargeUpdateInput = { ...rest };
        if (facilityId !== undefined) {
          // If facilityId is null, it means disconnect. If a string, connect.
          data.Facility = facilityId
            ? { connect: { id: facilityId } }
            : { disconnect: true };
        }

        const extraCharge = await ctx.db.extraCharge.update({
          where: { id },
          data,
        });
        return extraCharge; // No sanitization needed
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ExtraCharge not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update extra charge: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming hard delete. If soft delete is needed, update logic.
        const extraCharge = await ctx.db.extraCharge.delete({
          where: { id: input.id },
        });
        return extraCharge; // No sanitization needed
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to delete not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ExtraCharge not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete extra charge: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
};
