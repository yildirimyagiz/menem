import { randomUUID } from "crypto";
import type { Location as LocationModel } from "@prisma/client";
// If you see errors about 'LocationModel' being 'any', ensure you have run: pnpm exec prisma generate
// If Prisma types are not generated, fallback to a minimal type for typechecking:
// type LocationModel = any;
import type { TRPCRouterRecord } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  CreateLocationSchema,
  LocationFilterSchema,
  UpdateLocationSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Utility to sanitize location data
const sanitizeLocation = (location: LocationModel | null) => {
  // If LocationModel is 'any', this will not be type safe. Ensure Prisma Client is generated.

  if (!location) return null;
  return {
    id: location.id,
    country: location.country,
    city: location.city,
    district: location.district,
    address: location.address,
    postalCode: location.postalCode,
    coordinates: location.coordinates,
    createdAt: location.createdAt,
    updatedAt: location.updatedAt,
    deletedAt: location.deletedAt,
  };
};

export const locationRouter = {
  all: protectedProcedure
    .input(LocationFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      // Only pass pagination params to getPaginationParams
      const { skip, take, page, limit } = getPaginationParams({
        page:
          input && typeof input === "object" && "page" in input
            ? (input as any).page
            : undefined,
        limit:
          input && typeof input === "object" && "limit" in input
            ? (input as any).limit
            : undefined,
      });
      const cacheKey = `locations:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          country: input?.country
            ? { contains: input.country, mode: "insensitive" }
            : undefined,
          city: input?.city
            ? { contains: input.city, mode: "insensitive" }
            : undefined,
          district: input?.district
            ? { contains: input.district, mode: "insensitive" }
            : undefined,
          address: input?.address
            ? { contains: input.address, mode: "insensitive" }
            : undefined,
          postalCode: input?.postalCode
            ? { contains: input.postalCode, mode: "insensitive" }
            : undefined,
          deletedAt: null,
        } as Record<string, unknown>;
        const [locations, total] = await Promise.all([
          ctx.db.location.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take,
          }) as Promise<LocationModel[]>,
          ctx.db.location.count({ where }),
        ]);
        return {
          data: locations.map(sanitizeLocation),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const location = await ctx.db.location.findFirst({
        where: { id: input.id },
      });
      return sanitizeLocation(location);
    }),

  create: protectedProcedure
    .input(CreateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const location = await ctx.db.location.create({
          data: {
            id: randomUUID(),
            ...input,
          },
        });
        return sanitizeLocation(location);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create location: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const location = await ctx.db.location.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return sanitizeLocation(location);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.location.update({
          where: { id: input },
          data: { deletedAt: new Date() },
        });
        return { success: true };
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new Error("Location not found or already deleted.");
          }
          throw error;
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;
