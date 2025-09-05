import type { Prisma } from "@prisma/client";
import {
  CreateFacilitySchema,
  FacilityFilterSchema,
  UpdateFacilitySchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// Add type for the all query response
export interface FacilityListResponse {
  data: Prisma.FacilityGetPayload<{
    include: {
      Location: true;
    };
  }>[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  meta?: Record<string, unknown>;
}

// Add a sanitizeFacility function similar to sanitizeUser
function sanitizeFacility(
  facility: Prisma.FacilityGetPayload<{ include: { Location: true } }>,
) {
  return {
    ...facility,
    description: facility.description ?? null,
    icon: facility.icon ?? null,
    logo: facility.logo ?? null,
    Location: facility.Location ?? null,
    // Add more fields as needed for consistency
  };
}

export const facilityRouter = createTRPCRouter({
  all: protectedProcedure
    .input(FacilityFilterSchema.optional())
    .query(async ({ ctx, input }): Promise<FacilityListResponse> => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `facilities:${page}:${limit}`;
      const result = await withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.FacilityWhereInput = {
          name: input?.name
            ? { contains: input.name, mode: "insensitive" }
            : undefined,
          deletedAt: null,
          createdAt:
            input?.createdAtFrom || input?.createdAtTo
              ? {
                  gte: input.createdAtFrom,
                  lte: input.createdAtTo,
                }
              : undefined,
          updatedAt:
            input?.updatedAtFrom || input?.updatedAtTo
              ? {
                  gte: input.updatedAtFrom,
                  lte: input.updatedAtTo,
                }
              : undefined,
        };
        console.log("[facilityRouter] Query filter:", where);
        const [facilities, total] = await Promise.all([
          ctx.db.facility.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              Location: true,
            },
          }),
          ctx.db.facility.count({ where }),
        ]);
        const sanitizedFacilities = facilities.map((facility) =>
          sanitizeFacility(facility),
        );
        const totalPages = Math.ceil(total / limit);
        return {
          data: sanitizedFacilities,
          page,
          limit,
          total,
          totalPages,
        };
      });
      // Unwrap the response to match FacilityListResponse
      return result.data;
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(
      async ({
        ctx,
        input,
      }): Promise<Prisma.FacilityGetPayload<object> | null> => {
        try {
          const facility = await ctx.db.facility.findFirst({
            where: {
              id: input.id,
              deletedAt: null, // Only return non-deleted facilities
            },
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
      },
    ),

  create: protectedProcedure
    .input(CreateFacilitySchema)
    .mutation(
      async ({ ctx, input }): Promise<Prisma.FacilityGetPayload<object>> => {
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
      },
    ),

  update: protectedProcedure
    .input(UpdateFacilitySchema)
    .mutation(
      async ({ ctx, input }): Promise<Prisma.FacilityGetPayload<object>> => {
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
      },
    ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(
      async ({ ctx, input }): Promise<Prisma.FacilityGetPayload<object>> => {
        try {
          // Soft delete - set deletedAt to current timestamp
          const facility = await ctx.db.facility.update({
            where: { id: input.id },
            data: {
              deletedAt: new Date(),
              updatedAt: new Date(),
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
            message: `Failed to delete facility: ${originalError.message}`,
            cause: originalError,
          });
        }
      },
    ),
});
