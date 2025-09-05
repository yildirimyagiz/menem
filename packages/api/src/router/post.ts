import { Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { CreatePostSchema } from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  getPaginationParams,
  paginationInputSchema,
} from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure, publicProcedure } from "../trpc";

// Prisma include and payload type
const postInclude = {
  User: true,
  Agency: true,
  Agent: true,
  Hashtag: true,
  Photo: true,
} satisfies Prisma.PostInclude;

type FullPostFromPrisma = Prisma.PostGetPayload<{ include: typeof postInclude }>;

// Utility to sanitize post data (customize as needed)
function sanitizePost(post: FullPostFromPrisma | null) {
  if (!post) return post;
  const { User, Agency, Agent, Hashtag, Photo, ...rest } = post;
  return {
    ...rest,
    user: {
      id: User.id,
      name: User.name,
      // Add only safe fields here
    },
    Agency: Agency
      ? {
          id: Agency.id,
          name: Agency.name,
        }
      : null,
    Agent: Agent
      ? {
          id: Agent.id,
          name: Agent.name,
        }
      : null,
    Hashtag: Hashtag
      ? {
          id: Hashtag.id,
          name: Hashtag.name,
        }
      : null,
    photo: Photo,
    // Add more sanitization as needed
  };
}

export const postRouter = {
  all: publicProcedure
    .input(paginationInputSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `posts:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const [posts, total] = await Promise.all([
          ctx.db.post.findMany({
            where: { deletedAt: null },
            orderBy: { id: "desc" },
            skip,
            take,
            include: postInclude,
          }),
          ctx.db.post.count({ where: { deletedAt: null } }), // Ensure count respects soft deletion
        ]);
        return {
          data: posts.map(sanitizePost),
          page,
          limit,
          total,
        };
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.id },
        include: postInclude,
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      return sanitizePost(post);
    }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      // console.log(
      //   "[POST CREATE] input:",
      //   input,
      //   "session.user.id:",
      //   ctx.session.user.id,
      // );
      try {
        const slug = input.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");
        const post = await ctx.db.post.create({
          data: {
            id: crypto.randomUUID(),
            title: input.title,
            content: input.content,
            slug,
            userId: ctx.session.user.id,
            agencyId: input.agencyId ?? null,
            agentId: input.agentId ?? null,
            hashtagId: input.hashtagId ?? null,
            updatedAt: new Date(),
          },
        });
        // Re-fetch with includes for sanitization if create doesn't return them by default or if relations are crucial
        const createdPostWithIncludes = await ctx.db.post.findUnique({
          where: { id: post.id },
          include: postInclude,
        });
        return sanitizePost(createdPostWithIncludes);
      } catch (err: unknown) {
        // console.error("[POST CREATE ERROR]", err);
        if (err instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create post: ${err.message}`,
            cause: err,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while creating the post.",
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      });
      // Re-fetch with includes for sanitization
      const updatedPostWithIncludes = await ctx.db.post.findUnique({
        where: { id: post.id },
        include: postInclude,
      });
      if (!updatedPostWithIncludes)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found after update.",
        });
      return sanitizePost(updatedPostWithIncludes);
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.post.delete({ where: { id: input } });
        // `delete` typically doesn't return the full object with relations for sanitization.
        // Returning a success status or the ID is common.
        // If sanitizePost(post) is needed, ensure `post` includes relations or handle it differently.
        return { id: post.id, success: true };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found or already deleted.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post.",
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),
} satisfies TRPCRouterRecord;
