import { randomUUID } from "node:crypto";
import type { Prisma } from "@reservatior/db";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateFavoriteSchema,
  FavoriteFilterSchema,
  ToggleFavoriteSchema,
  UpdateFavoriteSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type FavoriteWithIncludes = Prisma.FavoriteGetPayload<{
  include: {
    user: true;
    property: true;
  };
}>;

const sanitizeFavorite = (
  favorite: FavoriteWithIncludes | null,
): FavoriteWithIncludes | null => {
  if (!favorite) return null;

  const { user, property, ...rest } = favorite;
  return {
    ...rest,
    user: user ?? null,
    property: property ?? null,
  };
};

export const favoriteRouter = {
  all: protectedProcedure
    .input(FavoriteFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      const {
        userId,
        propertyId,
        createdAtFrom,
        createdAtTo,
        updatedAtFrom,
        updatedAtTo,
        deletedAtFrom,
        deletedAtTo,
        sortBy,
        sortOrder,
      } = input ?? {};

      const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
      if (userId !== undefined) cacheKeyParts.push(`userId=${userId}`);
      if (propertyId !== undefined)
        cacheKeyParts.push(`propertyId=${propertyId}`);
      if (createdAtFrom !== undefined)
        cacheKeyParts.push(`createdAtFrom=${createdAtFrom.toISOString()}`);
      if (createdAtTo !== undefined)
        cacheKeyParts.push(`createdAtTo=${createdAtTo.toISOString()}`);
      if (updatedAtFrom !== undefined)
        cacheKeyParts.push(`updatedAtFrom=${updatedAtFrom.toISOString()}`);
      if (updatedAtTo !== undefined)
        cacheKeyParts.push(`updatedAtTo=${updatedAtTo.toISOString()}`);
      if (deletedAtFrom !== undefined)
        cacheKeyParts.push(`deletedAtFrom=${deletedAtFrom.toISOString()}`);
      if (deletedAtTo !== undefined)
        cacheKeyParts.push(`deletedAtTo=${deletedAtTo.toISOString()}`);
      if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
      if (sortOrder !== undefined) cacheKeyParts.push(`sortOrder=${sortOrder}`);

      const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
      const cacheKey = `favorites:${dynamicCacheKeyPart}`;

      try {
        return await withCacheAndFormat(cacheKey, async () => {
          const where: Prisma.FavoriteWhereInput = {
            userId: userId,
            propertyId: propertyId,
            createdAt:
              createdAtFrom || createdAtTo
                ? { gte: createdAtFrom, lte: createdAtTo }
                : undefined,
            updatedAt:
              updatedAtFrom || updatedAtTo
                ? { gte: updatedAtFrom, lte: updatedAtTo }
                : undefined,
            // Assuming soft delete, filter for non-deleted by default if not specified
            deletedAt:
              deletedAtFrom || deletedAtTo
                ? { gte: deletedAtFrom, lte: deletedAtTo }
                : deletedAtFrom === undefined && deletedAtTo === undefined
                  ? null
                  : undefined,
          };

          const [favorites, total] = await Promise.all([
            ctx.db.favorite.findMany({
              where,
              orderBy: sortBy
                ? { [sortBy]: sortOrder ?? "asc" }
                : { createdAt: "desc" },
              skip,
              take,
              include: {
                user: true,
                property: true,
              },
            }),
            ctx.db.favorite.count({ where }),
          ]);

          return {
            data: favorites.map((favorite) => sanitizeFavorite(favorite)),
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
          message: `Failed to fetch favorites: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const favorite = await ctx.db.favorite.findFirst({
        where: { id: input.id },
        include: {
          user: true,
          property: true,
        },
      });
      if (!favorite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Favorite not found.",
        });
      }
      return sanitizeFavorite(favorite);
    }),

  byUserAndProperty: protectedProcedure
    .input(z.object({ userId: z.string(), propertyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const favorite = await ctx.db.favorite.findFirst({
        where: {
          userId: input.userId,
          propertyId: input.propertyId,
        },
        include: {
          user: true,
          property: true,
        },
      });
      if (!favorite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Favorite not found for this user and property.",
        });
      }
      return sanitizeFavorite(favorite);
    }),

  create: protectedProcedure
    .input(CreateFavoriteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const favorite = await ctx.db.favorite.create({
          data: {
            id: randomUUID(),
            userId: input.userId,
            propertyId: input.propertyId,
            updatedAt: new Date(),
          },
          include: {
            user: true,
            property: true,
          },
        });
        return sanitizeFavorite(favorite);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create favorite: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateFavoriteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        const favorite = await ctx.db.favorite.update({
          where: { id },
          data: {
            ...data, // Note: UpdateFavoriteSchema only has 'id'. If other fields are updatable, they should be in the schema.
            updatedAt: new Date(),
          },
          include: {
            user: true,
            property: true,
          },
        });
        return sanitizeFavorite(favorite);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Favorite not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update favorite: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
  clearAll: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const deletedCount = await ctx.db.favorite.deleteMany({
        where: {
          userId: ctx.session.user.id,
          // deletedAt: null, // Assuming hard delete, so no deletedAt check needed here.
          // If it's soft delete, this router needs a deletedAt field on Favorite model.
        },
      });
      return { success: true, deletedCount: deletedCount.count };
    } catch (error: unknown) {
      const originalError =
        error instanceof Error ? error : new Error(String(error));
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to clear favorites: ${originalError.message}`,
        cause: originalError,
      });
    }
  }),

  toggle: protectedProcedure
    .input(ToggleFavoriteSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, propertyId } = input;

      try {
        // Check if the favorite already exists
        const existingFavorite = await ctx.db.favorite.findFirst({
          where: { userId, propertyId },
        });

        if (existingFavorite) {
          // If it exists, remove it
          await ctx.db.favorite.delete({
            where: { id: existingFavorite.id },
          });
          return { action: "removed" as const };
        }

        // If it doesn't exist, create it
        await ctx.db.favorite.create({
          data: {
            id: randomUUID(),
            userId,
            propertyId,
            updatedAt: new Date(),
          },
        });
        return { action: "added" as const };
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // For the delete operation if record not found
        ) {
          // This case might be rare if existingFavorite check is robust,
          // but good for handling concurrent deletions.
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Favorite to remove was not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to toggle favorite: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const favorite = await ctx.db.favorite.delete({
          where: { id: input },
          include: {
            user: true,
            property: true,
          },
        });
        return sanitizeFavorite(favorite);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Favorite not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete favorite: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
