import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreateGuestSchema,
  GuestFilterSchema,
  UpdateGuestSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type GuestWithIncludes = Prisma.GuestGetPayload<{
  include: {
    Agency: true;
    Property: true;
    Reservation: true;
  };
}>;

const sanitizeGuest = (guest: GuestWithIncludes | null) => {
  if (!guest) return null;

  return {
    ...guest,
    // Ensure all relations have proper fallbacks
    Agency: guest.Agency ?? null,
    Property: guest.Property ?? [],
    Reservation: guest.Reservation ?? [],
  };
};

export const guestRouter = {
  all: protectedProcedure
    .input(GuestFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      // The cache key is already quite comprehensive by stringifying the input.
      const cacheKey = `guests:${page}:${limit}:${JSON.stringify(input ?? {})}`;

      try {
        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.GuestWhereInput = {
            OR: input?.search
              ? [
                  { name: { contains: input.search, mode: "insensitive" } },
                  { email: { contains: input.search, mode: "insensitive" } },
                  { phone: { contains: input.search } },
                  { passportNumber: { contains: input.search } },
                ]
              : undefined,
            name: input?.name
              ? { contains: input.name, mode: "insensitive" }
              : undefined,
            email: input?.email
              ? { contains: input.email, mode: "insensitive" }
              : undefined,
            phone: input?.phone ? { contains: input.phone } : undefined,
            passportNumber: input?.passportNumber
              ? { contains: input.passportNumber }
              : undefined,
            nationality: input?.nationality
              ? { contains: input.nationality, mode: "insensitive" }
              : undefined,
            gender: input?.gender,
            agencyId: input?.agencyId,
            createdAt:
              input?.createdAtFrom || input?.createdAtTo
                ? {
                    gte: input.createdAtFrom,
                    lte: input.createdAtTo,
                  }
                : undefined,
            deletedAt: null, // Assuming soft delete, filter out deleted records by default
          };

          const [guests, total] = await Promise.all([
            ctx.db.guest.findMany({
              where,
              orderBy: {
                [input?.sortBy || "createdAt"]: input?.sortOrder || "desc",
              },
              skip,
              take,
              include: {
                Agency: true,
                Property: true,
                Reservation: true,
              },
            }),
            ctx.db.guest.count({ where }),
          ]);

          const totalPages = Math.ceil(total / limit);

          return {
            data: guests.map((guest) => sanitizeGuest(guest)),
            page,
            limit,
            total,
            totalPages,
          };
        });
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch guests: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const guest = await ctx.db.guest.findUnique({
          where: { id: input.id, deletedAt: null }, // Ensure not soft-deleted
          include: {
            Agency: true,
            Property: true,
            Reservation: true,
          },
        });
        if (!guest) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Guest not found.",
          });
        }
        return sanitizeGuest(guest);
      } catch (error: unknown) {
        if (error instanceof TRPCError) throw error;
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch guest by ID: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  create: protectedProcedure
    .input(CreateGuestSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { agencyId, ...guestData } = input;

        const createData: Prisma.GuestCreateInput = {
          ...guestData,
          id: randomUUID(),
          updatedAt: new Date(),
          Agency: agencyId ? { connect: { id: agencyId } } : undefined,
        };

        const guest = await ctx.db.guest.create({
          data: createData,
          include: {
            Agency: true,
            Property: true,
            Reservation: true,
          },
        });

        return sanitizeGuest(guest);
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create guest: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateGuestSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, agencyId, ...data } = input;

        const updateData: Prisma.GuestUpdateInput = {
          ...data,
          updatedAt: new Date(),
        };

        if (agencyId !== undefined) {
          updateData.Agency = agencyId
            ? { connect: { id: agencyId } }
            : { disconnect: true };
        }

        const guest = await ctx.db.guest.update({
          where: { id },
          data: updateData,
          include: {
            Agency: true,
            Property: true,
            Reservation: true,
          },
        });

        return sanitizeGuest(guest);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Guest not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update guest: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming soft delete by setting deletedAt
        const guest = await ctx.db.guest.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
            Property: true,
            Reservation: true,
          },
        });
        // If hard delete was intended:
        // const guest = await ctx.db.guest.delete({ where: { id: input } });
        return sanitizeGuest(guest);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Guest not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete guest: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  // Additional useful endpoints
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query is required"),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const guests = await ctx.db.guest.findMany({
          where: {
            OR: [
              { name: { contains: input.query, mode: "insensitive" } },
              { email: { contains: input.query, mode: "insensitive" } },
              { phone: { contains: input.query } },
              { passportNumber: { contains: input.query } },
            ],
            deletedAt: null, // Ensure only non-deleted guests are searched
          },
          take: input.limit,
          orderBy: { name: "asc" },
          include: {
            Agency: true,
            Property: true,
            Reservation: true,
          },
        });

        return guests.map((guest) => sanitizeGuest(guest));
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to search guests: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
