import type { Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreateFacilitySchema,
  FacilityFilterSchema,
  UpdateFacilitySchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

export const facilityRouter: TRPCRouterRecord = {
  all: protectedProcedure
    .input(FacilityFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      const {
        name,
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
      if (deletedAt !== undefined) {
        const value = deletedAt instanceof Date ? deletedAt.toISOString() : 'null';
        cacheKeyParts.push(`deletedAt=${value}`);
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
      const cacheKey = `facilities:${dynamicCacheKeyPart}`;

      try {
        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.FacilityWhereInput = {
            name: name ? { contains: name, mode: "insensitive" } : undefined,
            // Assuming if deletedAt is undefined, we fetch non-deleted.
            // If deletedAt is null, explicitly fetch non-deleted.
            // If deletedAt is a Date, fetch specific deleted records.
            deletedAt: deletedAt ?? null,
            createdAt:
              createdAtFrom || createdAtTo
                ? {
                    gte: createdAtFrom,
                    lte: createdAtTo,
                  }
                : undefined,
            updatedAt:
              updatedAtFrom || updatedAtTo
                ? {
                    gte: updatedAtFrom,
                    lte: updatedAtTo,
                  }
                : undefined,
          };
          const orderBy: Prisma.FacilityOrderByWithRelationInput = sortBy 
            ? { [sortBy]: sortOrder ?? 'asc' } as const
            : { createdAt: 'desc' };

          const [items, total] = await Promise.all([
            ctx.db.facility.findMany({
              where,
              orderBy,
              skip,
              take,
            }),
            ctx.db.facility.count({ where }),
          ]);
          return {
            items,
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
          message: `Failed to fetch facilities: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const facility = await ctx.db.facility.findUnique({
          where: { id: input.id },
        });

        if (!facility) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Facility not found.",
          });
        }
        return facility;
      } catch (error: unknown) {
        if (error instanceof TRPCError) throw error; // Re-throw if already TRPCError
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch facility by ID: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  create: protectedProcedure
    .input(CreateFacilitySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const facility = await ctx.db.facility.create({
          data: input,
        });
        return facility;
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create facility: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateFacilitySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        const facility = await ctx.db.facility.update({
          where: { id },
          data: {
            // Ensure all fields from UpdateFacilitySchema are handled
            name: data.name,
            description: data.description,
            icon: data.icon,
            logo: data.logo,
            locationId: data.locationId,
            type: data.type,
            status: data.status,
            deletedAt: data.deletedAt, // Handles soft delete if `deletedAt` is in schema
            updatedAt: new Date(), // Explicitly set updatedAt
          },
        });
        return facility;
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Facility not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update facility: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // This is a hard delete. If soft delete is intended,
        // update logic to set `deletedAt` field.
        await ctx.db.facility.delete({
          where: { id: input.id },
        });
        return { success: true }; // Client expects void, but this is fine.
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to delete not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Facility not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete facility: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
};
