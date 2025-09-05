import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import {
  CreateGuestSchema,
  GuestFilterSchema,
  UpdateGuestSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type GuestWithIncludes = Prisma.GuestGetPayload<{
  include: {
    Agency: true;
    Property: true;
    Reservation: true;
  };
}>;

// Add type for the all query response
export interface GuestListResponse {
  data: {
    items: GuestWithIncludes[];
    page: number;
    limit: number;
    total: number;
  };
  meta?: Record<string, unknown>;
}

const sanitizeGuest = (guest: GuestWithIncludes): GuestWithIncludes => {
  return {
    ...guest,
    Agency: guest.Agency ?? null,
    Property: guest.Property ?? [],
    Reservation: guest.Reservation ?? [],
  };
};

export const guestRouter = createTRPCRouter({
  all: protectedProcedure
    .input(GuestFilterSchema.optional())
    .query(async ({ ctx, input }): Promise<GuestListResponse> => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      const {
        search,
        name,
        email,
        phone,
        passportNumber,
        nationality,
        gender,
        agencyId,
        createdAtFrom,
        createdAtTo,
        sortBy,
        sortOrder,
      } = input ?? {};

      const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
      if (search !== undefined) cacheKeyParts.push(`search=${search}`);
      if (name !== undefined) cacheKeyParts.push(`name=${name}`);
      if (email !== undefined) cacheKeyParts.push(`email=${email}`);
      if (phone !== undefined) cacheKeyParts.push(`phone=${phone}`);
      if (passportNumber !== undefined)
        cacheKeyParts.push(`passportNumber=${passportNumber}`);
      if (nationality !== undefined)
        cacheKeyParts.push(`nationality=${nationality}`);
      if (gender !== undefined) cacheKeyParts.push(`gender=${gender}`);
      if (agencyId !== undefined) cacheKeyParts.push(`agencyId=${agencyId}`);
      if (createdAtFrom !== undefined)
        cacheKeyParts.push(`createdAtFrom=${createdAtFrom.toISOString()}`);
      if (createdAtTo !== undefined)
        cacheKeyParts.push(`createdAtTo=${createdAtTo.toISOString()}`);
      if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
      if (sortOrder !== undefined) cacheKeyParts.push(`sortOrder=${sortOrder}`);

      const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
      const cacheKey = `guests:${dynamicCacheKeyPart}`;

      try {
        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.GuestWhereInput = {
            OR: search
              ? [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                  { phone: { contains: search } },
                  { passportNumber: { contains: search } },
                ]
              : undefined,
            name: name ? { contains: name, mode: "insensitive" } : undefined,
            email: email ? { contains: email, mode: "insensitive" } : undefined,
            phone: phone ? { contains: phone } : undefined,
            passportNumber: passportNumber
              ? { contains: passportNumber }
              : undefined,
            nationality: nationality
              ? { contains: nationality, mode: "insensitive" }
              : undefined,
            gender,
            agencyId,
            createdAt:
              createdAtFrom || createdAtTo
                ? {
                    gte: createdAtFrom,
                    lte: createdAtTo,
                  }
                : undefined,
            deletedAt: null, // Assuming soft delete, filter out deleted records by default
          };

          const orderBy: Prisma.GuestOrderByWithRelationInput = sortBy
            ? ({ [sortBy]: sortOrder ?? "desc" } as const)
            : { createdAt: "desc" };

          const [items, total] = await Promise.all([
            ctx.db.guest.findMany({
              where,
              orderBy,
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

          return {
            items: items.map((guest) => sanitizeGuest(guest)),
            page,
            limit,
            total,
            meta: {},
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
    .query(async ({ ctx, input }): Promise<GuestWithIncludes | null> => {
      try {
        const guest = await ctx.db.guest.findUnique({
          where: { id: input.id, deletedAt: null },
          include: {
            Agency: true,
            Property: true,
            Reservation: true,
          },
        });
        if (!guest) return null;
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
    .mutation(async ({ ctx, input }): Promise<GuestWithIncludes> => {
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
    .mutation(async ({ ctx, input }): Promise<GuestWithIncludes | null> => {
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
        if (!guest) return null;
        return sanitizeGuest(guest);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          return null;
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
    .mutation(async ({ ctx, input }): Promise<GuestWithIncludes | null> => {
      try {
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
        if (!guest) return null;
        return sanitizeGuest(guest);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          return null;
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
    .query(async ({ ctx, input }): Promise<GuestWithIncludes[]> => {
      try {
        const guests = await ctx.db.guest.findMany({
          where: {
            OR: [
              { name: { contains: input.query, mode: "insensitive" } },
              { email: { contains: input.query, mode: "insensitive" } },
              { phone: { contains: input.query } },
              { passportNumber: { contains: input.query } },
            ],
            deletedAt: null,
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

  // Alias for 'all' to match client expectations
  list: protectedProcedure
    .input(GuestFilterSchema.optional())
    .query(async ({ ctx, input }): Promise<GuestListResponse> => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      const {
        search,
        name,
        email,
        phone,
        passportNumber,
        nationality,
        gender,
        agencyId,
        createdAtFrom,
        createdAtTo,
        sortBy,
        sortOrder,
      } = input ?? {};

      const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
      if (search !== undefined) cacheKeyParts.push(`search=${search}`);
      if (name !== undefined) cacheKeyParts.push(`name=${name}`);
      if (email !== undefined) cacheKeyParts.push(`email=${email}`);
      if (phone !== undefined) cacheKeyParts.push(`phone=${phone}`);
      if (passportNumber !== undefined)
        cacheKeyParts.push(`passportNumber=${passportNumber}`);
      if (nationality !== undefined)
        cacheKeyParts.push(`nationality=${nationality}`);
      if (gender !== undefined) cacheKeyParts.push(`gender=${gender}`);
      if (agencyId !== undefined) cacheKeyParts.push(`agencyId=${agencyId}`);
      if (createdAtFrom !== undefined)
        cacheKeyParts.push(`createdAtFrom=${createdAtFrom.toISOString()}`);
      if (createdAtTo !== undefined)
        cacheKeyParts.push(`createdAtTo=${createdAtTo.toISOString()}`);
      if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
      if (sortOrder !== undefined) cacheKeyParts.push(`sortOrder=${sortOrder}`);

      const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
      const cacheKey = `guests:list:${dynamicCacheKeyPart}`;

      try {
        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.GuestWhereInput = {
            OR: search
              ? [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                  { phone: { contains: search } },
                  { passportNumber: { contains: search } },
                ]
              : undefined,
            name: name ? { contains: name, mode: "insensitive" } : undefined,
            email: email ? { contains: email, mode: "insensitive" } : undefined,
            phone: phone ? { contains: phone } : undefined,
            passportNumber: passportNumber
              ? { contains: passportNumber }
              : undefined,
            nationality: nationality
              ? { contains: nationality, mode: "insensitive" }
              : undefined,
            gender,
            agencyId,
            createdAt:
              createdAtFrom || createdAtTo
                ? {
                    gte: createdAtFrom,
                    lte: createdAtTo,
                  }
                : undefined,
            deletedAt: null, // Assuming soft delete, filter out deleted records by default
          };

          const orderBy: Prisma.GuestOrderByWithRelationInput = sortBy
            ? ({ [sortBy]: sortOrder ?? "desc" } as const)
            : { createdAt: "desc" };

          const [items, total] = await Promise.all([
            ctx.db.guest.findMany({
              where,
              orderBy,
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

          return {
            items: items.map((guest) => sanitizeGuest(guest)),
            page,
            limit,
            total,
            meta: {},
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
});
