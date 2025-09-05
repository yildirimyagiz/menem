import type { Agency, Language as PrismaLanguage } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateLanguageSchema,
  LanguageFilterSchema,
  UpdateLanguageSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type LanguageWithAgency = PrismaLanguage & { Agency: Agency | null };

// Utility to sanitize language data
function sanitizeLanguage(language: LanguageWithAgency | null) {
  if (!language) return null;
  const { Agency, ...rest } = language;
  return {
    ...rest,
    agency: Agency
      ? {
          id: Agency.id,
          name: Agency.name,
        }
      : null,
  };
}

export const languageRouter = {
  all: protectedProcedure
    .input(LanguageFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        const { skip, take, page, limit } = getPaginationParams(input ?? {});

        const {
          code,
          name,
          nativeName,
          isRTL,
          isActive,
          agencyId,
          sortBy,
          sortOrder,
        } = input ?? {};

        const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
        if (code !== undefined) cacheKeyParts.push(`code=${code}`);
        if (name !== undefined) cacheKeyParts.push(`name=${name}`);
        if (nativeName !== undefined)
          cacheKeyParts.push(`nativeName=${nativeName}`);
        if (isRTL !== undefined) cacheKeyParts.push(`isRTL=${isRTL}`);
        if (isActive !== undefined) cacheKeyParts.push(`isActive=${isActive}`);
        if (agencyId !== undefined) cacheKeyParts.push(`agencyId=${agencyId}`);
        if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
        if (sortOrder !== undefined)
          cacheKeyParts.push(`sortOrder=${sortOrder}`);

        const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
        const cacheKey = `languages:${dynamicCacheKeyPart}`;

        return await withCacheAndFormat(cacheKey, async () => {
          const where = {
            code: code,
            name: name,
            nativeName: nativeName,
            isRTL: isRTL,
            isActive: isActive,
            agencyId: agencyId,
            // deletedAt: null, // Assuming no soft delete for languages based on schema
          };

          const [languages, total] = await Promise.all([
            ctx.db.language.findMany({
              where,
              orderBy: sortBy
                ? { [sortBy]: sortOrder ?? "asc" }
                : { id: "desc" },
              skip,
              take,
              include: {
                Agency: true,
              },
            }),
            ctx.db.language.count({ where }),
          ]);
          return {
            data: languages.map((language) => sanitizeLanguage(language)),
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
          message: `Failed to fetch languages: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const language = await ctx.db.language.findFirst({
        where: { id: input.id /*, deletedAt: null */ }, // Assuming no soft delete
        include: {
          Agency: true,
        },
      });
      if (!language) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Language not found.",
        });
      }
      return sanitizeLanguage(language);
    }),

  create: protectedProcedure
    .input(CreateLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const language = await ctx.db.language.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
          },
        });
        return sanitizeLanguage(language);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create language: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateLanguageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        const language = await ctx.db.language.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
          },
        });
        return sanitizeLanguage(language);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Language not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update language: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming hard delete for languages
        const language = await ctx.db.language.delete({
          where: { id: input },
          include: {
            Agency: true,
          },
        });
        return sanitizeLanguage(language);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Language not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete language: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
