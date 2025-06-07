import type {
  Availability,
  PricingRule,
  Property,
  Reservation,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  AvailabilityFilterSchema,
  CreateAvailabilitySchema,
  UpdateAvailabilitySchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type AvailabilityWithRelations = Availability & {
  property: Property | null;
  reservation: Reservation | null;
  pricingRule: PricingRule | null;
};

// Utility to sanitize availability data
function sanitizeAvailability(availability: AvailabilityWithRelations | null) {
  if (!availability) return null;
  const { property, reservation, pricingRule, ...rest } = availability;
  return {
    ...rest,
    property: property
      ? {
          id: property.id,
          title: property.title,
        }
      : null,
    reservation: reservation
      ? {
          id: reservation.id,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
        }
      : null,
    pricingRule: pricingRule
      ? {
          id: pricingRule.id,
          name: pricingRule.name,
        }
      : null,
  };
}

export const availabilityRouter = {
  all: protectedProcedure
    .input(AvailabilityFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `availabilities:${page}:${limit}:${input?.propertyId ?? "all"}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          propertyId: input?.propertyId,
          date: input?.date,
          isBlocked: input?.isBlocked,
          availableUnits: {
            gte: input?.minAvailableUnits,
            lte: input?.maxAvailableUnits,
          },
          deletedAt: null,
        };

        const [availabilities, total] = await Promise.all([
          ctx.db.availability.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { date: "asc" },
            skip,
            take,
            include: {
              property: true,
              reservation: true,
              pricingRule: true,
            },
          }),
          ctx.db.availability.count({ where }),
        ]);
        return {
          data: availabilities.map((availability) =>
            sanitizeAvailability(availability),
          ),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const availability = await ctx.db.availability.findFirst({
        where: { id: input.id, deletedAt: null },
        include: {
          property: true,
          reservation: true,
          pricingRule: true,
        },
      });
      return sanitizeAvailability(availability);
    }),

  create: protectedProcedure
    .input(CreateAvailabilitySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const availability = await ctx.db.availability.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
          include: {
            property: true,
            reservation: true,
            pricingRule: true,
          },
        });
        return sanitizeAvailability(availability);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create availability: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateAvailabilitySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const availability = await ctx.db.availability.update({
        where: { id },
        data,
        include: {
          property: true,
          reservation: true,
          pricingRule: true,
        },
      });
      return sanitizeAvailability(availability);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const availability = await ctx.db.availability.update({
          where: { id: input },
          data: { deletedAt: new Date() },
          include: {
            property: true,
            reservation: true,
            pricingRule: true,
          },
        });
        return sanitizeAvailability(availability);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new Error("Availability not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;
