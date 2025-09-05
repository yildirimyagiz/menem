import type { HashtagType, Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateHashtagSchema,
  HashtagFilterSchema,
  UpdateHashtagSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { protectedProcedure } from "../trpc";

// Includes for relations
const hashtagInclude = {
  Agency: true,
  User: true,
  Post: true,
  Property: true,
} as const satisfies Prisma.HashtagInclude;

// Sanitizer to avoid leaking enum types and Prisma objects
function sanitizeHashtag(hashtag: any) {
  if (!hashtag) return null;
  return {
    id: hashtag.id,
    name: hashtag.name,
    type: hashtag.type.toString(),
    description: hashtag.description,
    usageCount: hashtag.usageCount,
    relatedTags: hashtag.relatedTags,
    createdById: hashtag.createdById,
    agencyId: hashtag.agencyId,
    createdAt: hashtag.createdAt,
    updatedAt: hashtag.updatedAt,
    deletedAt: hashtag.deletedAt,
    Agency: hashtag.Agency
      ? { id: hashtag.Agency.id, name: hashtag.Agency.name }
      : null,
    User: hashtag.User
      ? { id: hashtag.User.id, name: hashtag.User.name }
      : null,
    Post: Array.isArray(hashtag.Post)
      ? hashtag.Post.map((p: any) => ({ id: p.id, title: p.title }))
      : [],
    Property: Array.isArray(hashtag.Property)
      ? hashtag.Property.map((p: any) => ({ id: p.id, title: p.title }))
      : [],
  };
}

export const hashtagRouter = {
  all: protectedProcedure
    .input(HashtagFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        const safePage =
          typeof input?.page === "number" ? input.page : undefined;
        const safeLimit =
          typeof input?.pageSize === "number" ? input.pageSize : undefined;
        const { skip, take, page, limit } = getPaginationParams({
          page: safePage,
          limit: safeLimit,
        });
        const where: Prisma.HashtagWhereInput = {
          ...(typeof input?.name === "string" &&
            input.name && {
              name: { contains: input.name, mode: "insensitive" },
            }),
          ...(typeof input?.type === "string" &&
            ["GENERAL", "PROPERTY", "AGENT"].includes(input.type) && {
              type: input.type as HashtagType,
            }),
          ...(typeof input?.createdById === "string" && {
            createdById: input.createdById,
          }),
          ...(typeof input?.agencyId === "string" && {
            agencyId: input.agencyId,
          }),
          ...(typeof input?.usageCountMin === "number" ||
          typeof input?.usageCountMax === "number"
            ? {
                usageCount: {
                  ...(typeof input?.usageCountMin === "number" && {
                    gte: input.usageCountMin,
                  }),
                  ...(typeof input?.usageCountMax === "number" && {
                    lte: input.usageCountMax,
                  }),
                },
              }
            : {}),
          ...(input?.createdAtFrom instanceof Date ||
          input?.createdAtTo instanceof Date
            ? {
                createdAt: {
                  ...(input?.createdAtFrom instanceof Date && {
                    gte: input.createdAtFrom,
                  }),
                  ...(input?.createdAtTo instanceof Date && {
                    lte: input.createdAtTo,
                  }),
                },
              }
            : {}),
          // Assuming soft delete, filter for non-deleted by default
          deletedAt: input?.deletedAt === undefined ? null : input.deletedAt,
        };
        const sortBy =
          typeof input?.sortBy === "string" ? input.sortBy : "createdAt";
        const sortOrder =
          typeof input?.sortOrder === "string" ? input.sortOrder : "desc";
        const [total, hashtags] = await Promise.all([
          ctx.db.hashtag.count({ where }),
          ctx.db.hashtag.findMany({
            where,
            take: limit,
            skip,
            orderBy: { [sortBy]: sortOrder },
            include: hashtagInclude,
          }),
        ]);
        return {
          data: hashtags.map(sanitizeHashtag),
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch hashtags: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  byId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const hashtag = await ctx.db.hashtag.findUnique({
          where: { id: input, deletedAt: null }, // Ensure not soft-deleted
          include: hashtagInclude,
        });
        if (!hashtag) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Hashtag not found.",
          });
        }
        return sanitizeHashtag(hashtag);
      } catch (error: unknown) {
        if (error instanceof TRPCError) throw error;
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch hashtag by ID: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  create: protectedProcedure
    .input(CreateHashtagSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const now = new Date();
        const createData: Prisma.HashtagCreateInput = {
          id: uuidv4(),
          usageCount: 1,
          createdAt: now,
          updatedAt: now,
          name: "",
        };
        if (typeof input.name === "string") createData.name = input.name;
        if (
          typeof input.type === "string" &&
          ["GENERAL", "PROPERTY", "AGENT"].includes(input.type)
        )
          createData.type = input.type as HashtagType;
        if (typeof input.description === "string")
          createData.description = input.description;
        if (
          Array.isArray(input.relatedTags) &&
          input.relatedTags.every((t) => typeof t === "string")
        )
          createData.relatedTags = input.relatedTags;
        else createData.relatedTags = [];
        if (typeof input.agencyId === "string") {
          createData.Agency = { connect: { id: input.agencyId } };
        }
        if (typeof input.createdById === "string") {
          createData.User = { connect: { id: input.createdById } };
        }
        const hashtag = await ctx.db.hashtag.create({
          data: createData,
          include: hashtagInclude,
        });
        return sanitizeHashtag(hashtag);
      } catch (error: unknown) {
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create hashtag: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateHashtagSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const update: Prisma.HashtagUpdateInput = {};
        if (typeof input.name === "string") update.name = input.name;
        if (
          typeof input.type === "string" &&
          ["GENERAL", "PROPERTY", "AGENT"].includes(input.type)
        )
          update.type = input.type as HashtagType;
        if (typeof input.description === "string")
          update.description = input.description;
        if (
          Array.isArray(input.relatedTags) &&
          input.relatedTags.every((t) => typeof t === "string")
        )
          update.relatedTags = input.relatedTags;
        if (typeof input.id !== "string") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid hashtag ID.",
          });
        }
        const hashtag = await ctx.db.hashtag.update({
          where: { id: input.id },
          data: {
            ...update,
            updatedAt: new Date(),
          },
          include: hashtagInclude,
        });
        return sanitizeHashtag(hashtag);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Hashtag not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update hashtag: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const hashtag = await ctx.db.hashtag.update({
          where: { id: input },
          data: { deletedAt: new Date(), updatedAt: new Date() },
          include: hashtagInclude,
        });
        return sanitizeHashtag(hashtag); // Return the soft-deleted hashtag
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Hashtag not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete hashtag: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
