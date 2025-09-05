import { randomUUID } from "crypto"; // Prefer crypto.randomUUID
import type { IncreaseStatus, Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateIncreaseSchema,
  IncreaseFilterSchema,
  UpdateIncreaseSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Type for Prisma result with relations
export type IncreaseWithIncludes = Prisma.IncreaseGetPayload<{
  include: {
    Property: true;
    Tenant: true;
    Offer: true;
  };
}>;

// Sanitizer to avoid leaking enum types
export function sanitizeIncrease(increase: IncreaseWithIncludes | null) {
  if (!increase) return null;
  return {
    id: increase.id,
    propertyId: increase.propertyId,
    tenantId: increase.tenantId,
    proposedBy: increase.proposedBy,
    oldRent: increase.oldRent,
    newRent: increase.newRent,
    effectiveDate: increase.effectiveDate,
    status: increase.status.toString(),
    contractId: increase.contractId ?? null,
    deletedAt: increase.deletedAt ?? null,
    createdAt: increase.createdAt,
    updatedAt: increase.updatedAt,
    Property: increase.Property
      ? { id: increase.Property.id, title: increase.Property.title }
      : null,
    Tenant: increase.Tenant
      ? {
          id: increase.Tenant.id,
          firstName: increase.Tenant.firstName,
          lastName: increase.Tenant.lastName,
        }
      : null,
    Offer: increase.Offer
      ? { id: increase.Offer.id, status: increase.Offer.status }
      : null,
  };
}

export const increaseRouter = {
  all: protectedProcedure
    .input(IncreaseFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        const { skip, take, page, limit } = getPaginationParams({
          page: typeof input?.page === "number" ? input.page : undefined,
          limit:
            typeof input?.pageSize === "number" ? input.pageSize : undefined,
        });

        const {
          propertyId,
          tenantId,
          proposedBy,
          status,
          effectiveDateFrom,
          effectiveDateTo,
          oldRentMin,
          oldRentMax,
          newRentMin,
          newRentMax,
          createdAtFrom,
          createdAtTo,
          sortBy,
          sortOrder,
        } = input ?? {};

        const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
        if (propertyId !== undefined)
          cacheKeyParts.push(`propertyId=${propertyId}`);
        if (tenantId !== undefined) cacheKeyParts.push(`tenantId=${tenantId}`);
        if (proposedBy !== undefined)
          cacheKeyParts.push(`proposedBy=${proposedBy}`);
        if (status !== undefined) cacheKeyParts.push(`status=${status}`);
        if (effectiveDateFrom instanceof Date)
          cacheKeyParts.push(
            `effectiveDateFrom=${effectiveDateFrom.toISOString()}`,
          );
        if (effectiveDateTo instanceof Date)
          cacheKeyParts.push(
            `effectiveDateTo=${effectiveDateTo.toISOString()}`,
          );
        if (oldRentMin !== undefined)
          cacheKeyParts.push(`oldRentMin=${oldRentMin}`);
        if (oldRentMax !== undefined)
          cacheKeyParts.push(`oldRentMax=${oldRentMax}`);
        if (newRentMin !== undefined)
          cacheKeyParts.push(`newRentMin=${newRentMin}`);
        if (newRentMax !== undefined)
          cacheKeyParts.push(`newRentMax=${newRentMax}`);
        if (createdAtFrom instanceof Date)
          cacheKeyParts.push(`createdAtFrom=${createdAtFrom.toISOString()}`);
        if (createdAtTo instanceof Date)
          cacheKeyParts.push(`createdAtTo=${createdAtTo.toISOString()}`);
        if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
        if (sortOrder !== undefined)
          cacheKeyParts.push(`sortOrder=${sortOrder}`);

        const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
        const cacheKey = `increases:${dynamicCacheKeyPart}`;

        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.IncreaseWhereInput = {
            propertyId: input?.propertyId ?? undefined,
            tenantId: input?.tenantId ?? undefined,
            proposedBy: input?.proposedBy ?? undefined,
            status: input?.status as IncreaseStatus | undefined, // Cast if Zod enum matches Prisma enum
            effectiveDate:
              input?.effectiveDateFrom instanceof Date ||
              input?.effectiveDateTo instanceof Date
                ? {
                    gte:
                      input.effectiveDateFrom instanceof Date
                        ? input.effectiveDateFrom
                        : undefined,
                    lte:
                      input.effectiveDateTo instanceof Date
                        ? input.effectiveDateTo
                        : undefined,
                  }
                : undefined,
            oldRent:
              typeof input?.oldRentMin === "number" ||
              typeof input?.oldRentMax === "number"
                ? {
                    gte:
                      typeof input.oldRentMin === "number"
                        ? input.oldRentMin
                        : undefined,
                    lte:
                      typeof input.oldRentMax === "number"
                        ? input.oldRentMax
                        : undefined,
                  }
                : undefined,
            newRent:
              typeof input?.newRentMin === "number" ||
              typeof input?.newRentMax === "number"
                ? {
                    gte:
                      typeof input.newRentMin === "number"
                        ? input.newRentMin
                        : undefined,
                    lte:
                      typeof input.newRentMax === "number"
                        ? input.newRentMax
                        : undefined,
                  }
                : undefined,
            createdAt:
              input?.createdAtFrom instanceof Date ||
              input?.createdAtTo instanceof Date
                ? {
                    gte:
                      input.createdAtFrom instanceof Date
                        ? input.createdAtFrom
                        : undefined,
                    lte:
                      input.createdAtTo instanceof Date
                        ? input.createdAtTo
                        : undefined,
                  }
                : undefined,
            deletedAt: null, // Assuming soft delete, filter out deleted records
          };

          const [increases, total] = await Promise.all([
            ctx.db.increase.findMany({
              where,
              orderBy:
                input?.sortBy && typeof input.sortBy === "string"
                  ? { [input.sortBy]: input.sortOrder ?? "asc" }
                  : { createdAt: "desc" },
              skip,
              take,
              include: {
                Property: true,
                Tenant: true,
                Offer: true,
              },
            }),
            ctx.db.increase.count({ where }),
          ]);
          return {
            data: increases.map(sanitizeIncrease),
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
          message: `Failed to fetch increases: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const increase = await ctx.db.increase.findUnique({
          where: { id: input.id, deletedAt: null }, // Ensure not soft-deleted
          include: {
            Property: true,
            Tenant: true,
            Offer: true,
          },
        });
        if (!increase || increase.deletedAt) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Increase not found.",
          });
        }
        return sanitizeIncrease(increase);
      } catch (error: unknown) {
        if (error instanceof TRPCError) throw error;
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch increase by ID: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  create: protectedProcedure
    .input(CreateIncreaseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const now = new Date();
        const data: Prisma.IncreaseCreateInput = {
          id: randomUUID(),
          // Assuming CreateIncreaseSchema provides correctly typed fields.
          // Connect relations using the nested structure Prisma expects.
          Property: { connect: { id: input.propertyId } },
          Tenant: { connect: { id: input.tenantId } },
          proposedBy: input.proposedBy, // Validator might be z.unknown()
          oldRent: input.oldRent, // Validator might be z.unknown()
          newRent: input.newRent, // Validator might be z.unknown()
          effectiveDate: input.effectiveDate, // Validator might be z.unknown()
          status: input.status as IncreaseStatus,
          createdAt: now,
          updatedAt: now,
          Contract: input.contractId
            ? { connect: { id: input.contractId } }
            : undefined,
          // Offer relation can be connected similarly if offerId is part of CreateIncreaseSchema
          // Offer: input.offerId ? { connect: { id: input.offerId } } : undefined,
        };
        const increase = await ctx.db.increase.create({
          data,
          include: {
            Property: true,
            Tenant: true,
            Offer: true,
          },
        });
        return sanitizeIncrease(increase as IncreaseWithIncludes);
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create increase: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateIncreaseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;
        // Explicitly map fields to avoid issues with 'unknown' types from a potentially loose Zod schema
        const updateData: Prisma.IncreaseUpdateInput = {
          newRent: typeof rest.newRent === "number" ? rest.newRent : undefined,
          effectiveDate:
            rest.effectiveDate instanceof Date ? rest.effectiveDate : undefined,
          status: rest.status as IncreaseStatus | undefined, // Ensure UpdateIncreaseSchema's status matches
          updatedAt: new Date(),
          // Add other updatable fields from 'rest' explicitly here if UpdateIncreaseSchema defines them
          // Handle relational updates if IDs are provided in UpdateIncreaseSchema
          // Property: rest.propertyId ? { connect: { id: rest.propertyId } } : undefined,
          // Tenant: rest.tenantId ? { connect: { id: rest.tenantId } } : undefined,
          // Offer: rest.offerId ? { connect: { id: rest.offerId } } : undefined,
        };

        if (typeof id !== "string") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid increase ID.",
          });
        }
        const increase = await ctx.db.increase.update({
          where: { id, deletedAt: null }, // Ensure not soft-deleted before update
          data: updateData,
          include: {
            Property: true,
            Tenant: true,
            Offer: true,
          },
        });
        return sanitizeIncrease(increase as IncreaseWithIncludes);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Increase not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update increase: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming soft delete
        const increase = await ctx.db.increase.update({
          // Ensure input.id is treated as a string. Zod schema should guarantee this.
          // If input.id is inferred as 'unknown', this check provides type safety.
          // However, the root cause of 'unknown' inference should be investigated (e.g., Zod schema definition).
          where: { id: input.id },
          data: { deletedAt: new Date(), updatedAt: new Date() },
          include: {
            Property: true,
            Tenant: true,
            Offer: true,
          },
        });
        // If hard delete:
        // const increase = await ctx.db.increase.delete({
        //   where: { id: input.id },
        //   include: { Property: true, Tenant: true, Offer: true },
        // });
        return sanitizeIncrease(increase as IncreaseWithIncludes);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Increase not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete increase: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;

export type IncreaseRouter = typeof increaseRouter;
