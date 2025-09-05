import type { MentionType, Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import {
  CreateMentionSchema,
  MentionFilterSchema,
  UpdateMentionSchema,
} from "@reservatior/validators";
import { z } from "zod";

import {
  getPaginationParams,
  paginationInputSchema,
} from "../helpers/pagination";
import { protectedProcedure } from "../trpc";

const mentionInclude = {
  mentionedBy: true,
  mentionedTo: true,
  user: true,
  Task: true,

  Property: true,
  Agency: true,
} as const satisfies Prisma.MentionInclude;

type MentionWithIncludes = Prisma.MentionGetPayload<{
  include: typeof mentionInclude;
}>;

interface SanitizedMention {
  id: string;
  mentionedById: string;
  mentionedToId: string;
  type: MentionType;
  taskId: string | null;

  propertyId: string | null;
  content: string | null;
  isRead: boolean;
  agencyId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: string | null;
  user: { id: string; name: string } | null;
  task: { id: string; title: string } | null;

  property: { id: string; title: string } | null;
}

interface _PaginatedMentionResponse {
  mentions: SanitizedMention[];
  totalCount: number;
}

const sanitizeMention = (mention: MentionWithIncludes): SanitizedMention => {
  return {
    id: mention.id,
    mentionedById: mention.mentionedById,
    mentionedToId: mention.mentionedToId,
    type: mention.type,
    taskId: mention.taskId,

    propertyId: mention.propertyId,
    content: mention.content,
    isRead: mention.isRead,
    agencyId: mention.agencyId,
    createdAt: mention.createdAt,
    updatedAt: mention.updatedAt,
    deletedAt: mention.deletedAt,
    userId: mention.userId,
    user: mention.user
      ? {
          id: mention.user.id,
          name: String(mention.user.name ?? ""),
        }
      : null,
    task: mention.Task
      ? {
          id: mention.Task.id,
          title: String(mention.Task.title || ""),
        }
      : null,

    property: mention.Property
      ? {
          id: mention.Property.id,
          title: String(mention.Property.title || ""),
        }
      : null,
  };
};

export const mentionRouter: TRPCRouterRecord = {
  all: protectedProcedure
    .input(paginationInputSchema.optional())
    .query(
      async ({
        ctx,
        input,
      }): Promise<{ mentions: SanitizedMention[]; totalCount: number }> => {
        const { skip, take } = getPaginationParams(input ?? {});

        const [mentions, totalCount] = await Promise.all([
          ctx.db.mention.findMany({
            skip,
            take,
            include: mentionInclude,
          }),
          ctx.db.mention.count(),
        ]);

        return {
          mentions: mentions.map((mention) =>
            sanitizeMention(mention as MentionWithIncludes),
          ),
          totalCount,
        };
      },
    ),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }): Promise<SanitizedMention> => {
      const mention = await ctx.db.mention.findUnique({
        where: { id: input.id },
        include: mentionInclude,
      });

      if (!mention) {
        throw new Error("Mention not found");
      }

      return sanitizeMention(mention);
    }),

  create: protectedProcedure
    .input(CreateMentionSchema)
    .mutation(async ({ ctx, input }): Promise<SanitizedMention> => {
      const mention = await ctx.db.mention.create({
        data: {
          id: crypto.randomUUID(),
          ...input,
          updatedAt: new Date(),
        },
        include: mentionInclude,
      });
      return sanitizeMention(mention);
    }),

  update: protectedProcedure
    .input(UpdateMentionSchema)
    .mutation(async ({ ctx, input }): Promise<SanitizedMention> => {
      const mention = await ctx.db.mention.update({
        where: { id: input.id },
        data: {
          ...input,
          updatedAt: new Date(),
        },
      });
      return sanitizeMention(mention as MentionWithIncludes);
    }),

  findMany: protectedProcedure
    .input(MentionFilterSchema)
    .query(async ({ ctx, input }): Promise<SanitizedMention[]> => {
      const mentions = await ctx.db.mention.findMany({
        where: input,
        include: mentionInclude,
      });
      return mentions.map((mention: MentionWithIncludes) =>
        sanitizeMention(mention),
      );
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }): Promise<SanitizedMention> => {
      try {
        const mention = await ctx.db.mention.delete({
          where: { id: input },
          include: mentionInclude,
        });
        return sanitizeMention(mention);
      } catch (error) {
        if (error instanceof Error) {
          if ("code" in error && error.code === "P2025") {
            throw new Error("Mention not found or already deleted.");
          }
          throw error;
        }
        throw new Error("An unknown error occurred");
      }
    }),

  filter: protectedProcedure
    .input(MentionFilterSchema)
    .query(async ({ ctx, input }) => {
      const {
        createdAtFrom,
        createdAtTo,
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        pageSize = 20,
        ...whereFilters
      } = input;

      const where: Prisma.MentionWhereInput = {
        ...whereFilters,
        createdAt:
          createdAtFrom || createdAtTo
            ? {
                ...(createdAtFrom && { gte: createdAtFrom }),
                ...(createdAtTo && { lte: createdAtTo }),
              }
            : undefined,
      };

      const skip = (page - 1) * pageSize;

      const [data, total] = await Promise.all([
        ctx.db.mention.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { [sortBy]: sortOrder },
          include: {
            user: true,
            Agency: true,
            Task: true,

            Property: true,
          },
        }),
        ctx.db.mention.count({ where }),
      ]);

      return {
        data: data.map((mention) =>
          sanitizeMention(mention as MentionWithIncludes),
        ),
        total,
        page,
        pageSize,
      };
    }),
} satisfies TRPCRouterRecord;
