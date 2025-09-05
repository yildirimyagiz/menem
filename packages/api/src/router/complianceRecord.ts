import type {
  Agency,
  Agent,
  ComplianceRecord as PrismaComplianceRecord,
  Property,
  Reservation,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  ComplianceRecordFilterSchema,
  CreateComplianceRecordSchema,
  UpdateComplianceRecordSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type ComplianceRecordWithRelations = PrismaComplianceRecord & {
  Agency: Agency | null;
  Agent: Agent | null;
  Property: Property | null;
  Reservation: Reservation | null;
};

// Utility to sanitize compliance record data
function sanitizeComplianceRecord(
  record: ComplianceRecordWithRelations | null,
) {
  if (!record) return null;
  const { Agency, Agent, Property, Reservation, ...rest } = record;
  return {
    ...rest,
    agency: Agency
      ? {
          id: Agency.id,
          name: Agency.name,
        }
      : null,
    agent: Agent
      ? {
          id: Agent.id,
          name: Agent.name,
        }
      : null,
    property: Property
      ? {
          id: Property.id,
          title: Property.title,
        }
      : null,
    reservation: Reservation
      ? {
          id: Reservation.id,
        }
      : null,
  };
}

export const complianceRecordRouter = {
  all: protectedProcedure
    .input(ComplianceRecordFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      // Build a robust cache key that includes all filter and sorting parameters
      const {
        entityId,
        entityType,
        type,
        status,
        isVerified,
        propertyId,
        agentId,
        agencyId,
        reservationId,
        sortBy,
        sortOrder,
      } = input ?? {};

      const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
      if (entityId !== undefined) cacheKeyParts.push(`entityId=${entityId}`);
      if (entityType !== undefined)
        cacheKeyParts.push(`entityType=${entityType}`);
      if (type !== undefined) cacheKeyParts.push(`type=${type}`);
      if (status !== undefined) cacheKeyParts.push(`status=${status}`);
      if (isVerified !== undefined)
        cacheKeyParts.push(`isVerified=${isVerified}`);
      if (propertyId !== undefined)
        cacheKeyParts.push(`propertyId=${propertyId}`);
      if (agentId !== undefined) cacheKeyParts.push(`agentId=${agentId}`);
      if (agencyId !== undefined) cacheKeyParts.push(`agencyId=${agencyId}`);
      if (reservationId !== undefined)
        cacheKeyParts.push(`reservationId=${reservationId}`);
      if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
      if (sortOrder !== undefined) cacheKeyParts.push(`sortOrder=${sortOrder}`);

      // Sort parts to ensure key consistency regardless of parameter order
      const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
      const cacheKey = `compliance-records:${dynamicCacheKeyPart}`;

      return withCacheAndFormat(cacheKey, async () => {
        const where = {
          entityId: input?.entityId,
          entityType: input?.entityType,
          type: input?.type,
          status: input?.status,
          isVerified: input?.isVerified,
          propertyId: input?.propertyId,
          agentId: input?.agentId,
          agencyId: input?.agencyId,
          reservationId: input?.reservationId,
          deletedAt: null,
        };

        const [records, total] = await Promise.all([
          ctx.db.complianceRecord.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agency: true,
              Agent: true,
              Property: true,
              Reservation: true,
            },
          }),
          ctx.db.complianceRecord.count({ where }),
        ]);
        return {
          data: records.map((record) => sanitizeComplianceRecord(record)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const record = await ctx.db.complianceRecord.findFirst({
        where: { id: input.id },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          Reservation: true,
        },
      });
      return sanitizeComplianceRecord(record);
    }),

  create: protectedProcedure
    .input(CreateComplianceRecordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const record = await ctx.db.complianceRecord.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
            Agent: true,
            Property: true,
            Reservation: true,
          },
        });
        return sanitizeComplianceRecord(record);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        // Consider logging the originalError here if detailed server-side logs are needed
        // e.g., ctx.log.error("Failed to create compliance record", { error: originalError });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create compliance record: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateComplianceRecordSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      try {
        const record = await ctx.db.complianceRecord.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
            Agent: true,
            Property: true,
            Reservation: true,
          },
        });
        return sanitizeComplianceRecord(record);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error code for "Record to update not found"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Compliance record not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update compliance record: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const record = await ctx.db.complianceRecord.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
            Agent: true,
            Property: true,
            Reservation: true,
          },
        });
        return sanitizeComplianceRecord(record);
      } catch (error) {
        // Prisma's P2025 error: "An operation failed because it depends on one or more records that were required but not found."
        // This can happen if the record to delete is not found.
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Compliance record not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete compliance record: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
