import type { Prisma } from "@prisma/client";
import type {
  CreateIncludedServiceInput,
  UpdateIncludedServiceInput,
} from "@reservatior/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateIncludedServiceSchema,
  IncludedServiceFilterSchema,
  UpdateIncludedServiceSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const includedServiceRouter = createTRPCRouter({
  all: protectedProcedure
    .input(IncludedServiceFilterSchema.optional())
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

      const cacheKeyParts: string[] = [
        `page=${page ?? 1}`,
        `limit=${limit ?? 10}`,
      ];
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
      const cacheKey = `includedServices:${dynamicCacheKeyPart}`;

      try {
        return await withCacheAndFormat(cacheKey, async () => {
          const filters: Prisma.IncludedServiceWhereInput = {
            name: name ? { contains: name, mode: "insensitive" } : undefined,
            facilityId: facilityId,
            deletedAt: deletedAt === undefined ? null : deletedAt,
            createdAt:
              createdAtFrom || createdAtTo
                ? { gte: createdAtFrom, lte: createdAtTo }
                : undefined,
            updatedAt:
              updatedAtFrom || updatedAtTo
                ? { gte: updatedAtFrom, lte: updatedAtTo }
                : undefined,
          };

          const orderBy: Prisma.IncludedServiceOrderByWithRelationInput = sortBy
            ? { [sortBy]: sortOrder ?? "asc" }
            : { createdAt: "desc" };

          const [items, total] = await Promise.all([
            ctx.db.includedService.findMany({
              where: filters,
              orderBy,
              skip,
              take,
            }),
            ctx.db.includedService.count({ where: filters }),
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
          message: `Failed to fetch included services: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const includedService = await ctx.db.includedService.findUnique({
        where: { id: input.id },
      });
      if (!includedService) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "IncludedService not found.",
        });
      }
      return includedService;
    }),

  byContract: protectedProcedure
    .input(z.object({ contractId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Since IncludedService model doesn't have contractId, we'll return empty array
        // In a real implementation, you might want to add contractId to the IncludedService model
        // or create a separate ContractIncludedService model
        return [];
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch included services by contract: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  create: protectedProcedure
    .input(CreateIncludedServiceSchema)
    .mutation(
      async ({
        ctx,
        input,
      }: {
        ctx: any;
        input: CreateIncludedServiceInput;
      }) => {
        try {
          const { facilityId, ...rest } = input ?? {};
          const data: Prisma.IncludedServiceCreateInput = facilityId
            ? { ...rest, Facility: { connect: { id: facilityId } } }
            : { ...rest };
          const includedService = await ctx.db.includedService.create({
            data,
          });
          return includedService;
        } catch (error: unknown) {
          const originalError =
            error instanceof Error ? error : new Error(String(error));
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create included service: ${originalError.message}`,
            cause: originalError,
          });
        }
      },
    ),

  update: protectedProcedure
    .input(UpdateIncludedServiceSchema)
    .mutation(
      async ({
        ctx,
        input,
      }: {
        ctx: any;
        input: UpdateIncludedServiceInput;
      }) => {
        try {
          const { id, facilityId, ...rest } = input;
          const data: Prisma.IncludedServiceUpdateInput = { ...rest };
          if (facilityId !== undefined) {
            data.Facility = facilityId
              ? { connect: { id: facilityId } }
              : { disconnect: true };
          }
          const includedService = await ctx.db.includedService.update({
            where: { id },
            data,
          });
          return includedService;
        } catch (error: unknown) {
          if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2025"
          ) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "IncludedService not found.",
            });
          }
          const originalError =
            error instanceof Error ? error : new Error(String(error));
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to update included service: ${originalError.message}`,
            cause: originalError,
          });
        }
      },
    ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.includedService.delete({
          where: { id: input.id },
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
            message: "IncludedService not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete included service: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byFacility: protectedProcedure
    .input(z.object({ facilityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const services = await ctx.db.includedService.findMany({
        where: { facilityId: input.facilityId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
      return services;
    }),

  byFacilityId: protectedProcedure
    .input(z.object({ facilityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams({
        page: 1,
        limit: 10,
      });

      const [services, total] = await Promise.all([
        ctx.db.includedService.findMany({
          where: { facilityId: input.facilityId, deletedAt: null },
          orderBy: { createdAt: "desc" },
          skip,
          take,
        }),
        ctx.db.includedService.count({
          where: { facilityId: input.facilityId, deletedAt: null },
        }),
      ]);

      return {
        data: {
          items: services,
          total,
          page,
          limit,
        },
      };
    }),
});
