import { randomUUID } from "crypto";
import type {
  Agency,
  Agent,
  Prisma,
  Review as PrismaReview,
  Property,
  User,
} from "@prisma/client";
import type { ReviewFilterInput } from "@reservatior/validators";
import {
  CreateReviewSchema,
  ReviewFilterSchema,
  UpdateReviewSchema,
} from "@reservatior/validators";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export interface SanitizedReview {
  id: string;

  userId: string;
  agentId: string | null;
  agencyId: string | null;
  propertyId: string | null;
  title: string;
  content: string;
  rating: number;
  parentReviewId: string | null;
  isEdited: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Agency: Agency | null;
  Agent: Agent | null;
  Property: Property | null;
  User: User;
  Review: PrismaReview | null;
}

const sanitizeReview = (
  review:
    | (PrismaReview & {
        Agency?: Agency | null;
        Agent?: Agent | null;
        Property: Property | null;
        User: User;
        Review?: PrismaReview | null;
      })
    | null,
): SanitizedReview | null => {
  if (!review) return null;

  return {
    id: review.id,

    userId: review.userId,
    agentId: review.agentId,
    agencyId: review.agencyId,
    propertyId: review.propertyId,
    title: review.title,
    content: review.content,
    rating: review.rating,
    parentReviewId: review.parentReviewId,
    isEdited: review.isEdited,
    helpfulCount: review.helpfulCount,
    notHelpfulCount: review.notHelpfulCount,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    deletedAt: review.deletedAt,
    Agency: review.Agency ?? null,
    Agent: review.Agent ?? null,
    Property: review.Property, // This can now be null

    User: review.User,
    Review: review.Review ?? null,
  };
};

export const reviewRouter = createTRPCRouter({
  all: protectedProcedure
    .input(ReviewFilterSchema)
    .query(async ({ ctx, input }) => {
      const typedInput: ReviewFilterInput = ReviewFilterSchema.parse(input);
      const paginationInput = {
        page: typedInput.page ?? 1,
        pageSize: typedInput.pageSize ?? 10,
      };
      const { skip, take, page, limit } = {
        skip: (paginationInput.page - 1) * paginationInput.pageSize,
        take: paginationInput.pageSize,
        page: paginationInput.page,
        limit: paginationInput.pageSize,
      };

      const where: Prisma.ReviewWhereInput = {
        userId: typedInput.userId ?? undefined,
        agentId: typedInput.agentId ?? undefined,
        agencyId: typedInput.agencyId ?? undefined,
        propertyId: typedInput.propertyId ?? undefined,
        rating: typedInput.rating ?? undefined,
        isEdited: typedInput.isEdited ?? undefined,
        helpfulCount: typedInput.helpfulCountFrom
          ? { gte: typedInput.helpfulCountFrom }
          : undefined,
        notHelpfulCount: typedInput.notHelpfulCountFrom
          ? { gte: typedInput.notHelpfulCountFrom }
          : undefined,
        createdAt:
          typedInput.startDateFrom || typedInput.startDateTo
            ? {
                gte: typedInput.startDateFrom ?? undefined,
                lte: typedInput.startDateTo ?? undefined,
              }
            : undefined,
        deletedAt: typedInput.deletedAt ?? undefined,
      };

      const orderBy: Prisma.ReviewOrderByWithRelationInput = typedInput.sortBy
        ? {
            [typedInput.sortBy]: typedInput.sortOrder ?? "desc",
          }
        : {
            createdAt: "desc" as const,
          };

      const [reviews, total] = await Promise.all([
        ctx.db.review.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            Agency: true,
            Agent: true,
            Property: true,
            User: true,
          },
        }),
        ctx.db.review.count({ where }),
      ]);

      return {
        items: reviews.map(sanitizeReview),
        pagination: {
          total,
          page,
          limit,
          hasMore: skip + take < total,
        },
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.id },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          User: true,
        },
      });

      return sanitizeReview(review);
    }),

  create: protectedProcedure
    .input(CreateReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.create({
        data: {
          id: randomUUID(),
          ...input,
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          User: true,
        },
      });

      return sanitizeReview(review);
    }),

  update: protectedProcedure
    .input(UpdateReviewSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const review = await ctx.db.review.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          User: true,
        },
      });

      return sanitizeReview(review);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          User: true,
        },
      });

      return sanitizeReview(review);
    }),
});
