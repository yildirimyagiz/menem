import { randomUUID } from "crypto";
import type {
  CommissionRule,
  Prisma,
  Provider as PrismaProvider,
  Report,
  Reservation,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateProviderSchema,
  ProviderFilterSchema,
  UpdateProviderSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// Import Prisma

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type ProviderWithRelations = PrismaProvider & {
  report?: Report[];
  reservations?: Reservation[];
  commissionRule?: CommissionRule[];
};

const sanitizeProvider = (provider: ProviderWithRelations | null) => {
  if (!provider) return null;
  const { report, reservations, commissionRule, ...rest } = provider;
  return {
    ...rest,
    report: report ?? [],
    reservations: reservations ?? [],
    commissionRule: commissionRule ?? [],
  };
};

export const providerRouter = {
  all: protectedProcedure
    .input(ProviderFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `providers:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.ProviderWhereInput = {};
        if (input?.name) {
          where.name = { contains: input.name, mode: "insensitive" }; // Added mode for better search
        }
        if (typeof input?.isActive === "boolean") {
          where.isActive = input.isActive;
        }
        if (input?.source) {
          where.source = input.source;
        }

        const commissionFilter: Record<string, number> = {};
        if (typeof input?.commissionMin === "number") {
          commissionFilter.gte = input.commissionMin;
        }
        if (typeof input?.commissionMax === "number") {
          commissionFilter.lte = input.commissionMax;
        }
        if (Object.keys(commissionFilter).length > 0) {
          where.commission = commissionFilter;
        }

        const [providers, total] = await Promise.all([
          ctx.db.provider.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              report: true,
              reservations: true,
              commissionRule: true,
            },
          }),
          ctx.db.provider.count({ where }),
        ]);
        return {
          data: providers.map((provider) => sanitizeProvider(provider)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const provider = await ctx.db.provider.findFirst({
        where: { id: input.id },
        include: {
          report: true,
          reservations: true,
          commissionRule: true,
        },
      });
      return sanitizeProvider(provider);
    }),

  create: protectedProcedure
    .input(CreateProviderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure createdAt is not part of input if Prisma handles it by default
        const provider = await ctx.db.provider.create({
          data: {
            id: randomUUID(),
            ...input,
            updatedAt: new Date(),
            // createdAt: new Date(), // Only if not defaulted by Prisma
          },
          include: {
            // Ensure these relations are part of what sanitizeProvider expects
            report: true,
            reservations: true,
            commissionRule: true,
          },
        });
        return sanitizeProvider(provider);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // Log original error for server-side diagnostics
          console.error("Create provider failed:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create provider: ${err.message}`,
            cause: err,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while creating the provider.",
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateProviderSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      try {
        const provider = await ctx.db.provider.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          include: {
            report: true,
            reservations: true,
            commissionRule: true,
          },
        });
        return sanitizeProvider(provider);
      } catch (error) {
        if (
          error instanceof Error &&
          (error as Prisma.PrismaClientKnownRequestError).code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Provider not found for update.",
          });
        }
        console.error("Update provider failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during update.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const provider = await ctx.db.provider.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            report: true,
            reservations: true,
            commissionRule: true,
          },
        });
        return sanitizeProvider(provider);
      } catch (error) {
        if (
          error instanceof Error &&
          (error as unknown as Record<string, unknown>).code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Provider not found or already deleted.",
          });
        }
        console.error("Delete provider failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during soft delete.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),
} satisfies TRPCRouterRecord;
