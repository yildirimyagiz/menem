import type { Channel } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  ChannelFilterSchema,
  CreateChannelSchema,
  UpdateChannelSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Utility to sanitize channel data
function sanitizeChannel(channel: Channel | null) {
  if (!channel) return channel;
  const { ...rest } = channel;
  return {
    ...rest,
  };
}

export const channelRouter = {
  // Get a single channel by id
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const channel = await ctx.db.channel.findUnique({
        where: { id: input.id },
      });
      if (!channel) throw new Error("Channel not found");
      return sanitizeChannel(channel);
    }),

  // List channels with filtering, sorting, and pagination
  list: protectedProcedure
    .input(ChannelFilterSchema.optional())
    .query(async ({ ctx, input = {} }) => {
      const { skip, take, page, limit } = getPaginationParams({ page: input.page, limit: input.pageSize });
      const {
        name,
        createdAtFrom,
        createdAtTo,
        updatedAtFrom,
        updatedAtTo,
        deletedAt,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = input;
      const where: any = {
        ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
        ...(createdAtFrom || createdAtTo
          ? {
              createdAt: {
                ...(createdAtFrom ? { gte: createdAtFrom } : {}),
                ...(createdAtTo ? { lte: createdAtTo } : {}),
              },
            }
          : {}),
        ...(updatedAtFrom || updatedAtTo
          ? {
              updatedAt: {
                ...(updatedAtFrom ? { gte: updatedAtFrom } : {}),
                ...(updatedAtTo ? { lte: updatedAtTo } : {}),
              },
            }
          : {}),
        ...(deletedAt ? { deletedAt } : { deletedAt: null }),
      };
      const cacheKey = `channels:${page}:${limit}:${name ?? ""}:${createdAtFrom ?? ""}:${createdAtTo ?? ""}:${updatedAtFrom ?? ""}:${updatedAtTo ?? ""}:${deletedAt ?? ""}:${sortBy}:${sortOrder}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const [total, channels] = await Promise.all([
          ctx.db.channel.count({ where }),
          ctx.db.channel.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit,
          }),
        ]);
        return {
          data: channels.map(sanitizeChannel),
          page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      });
    }),

  // Create a new channel
  create: protectedProcedure
    .input(CreateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.db.channel.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return sanitizeChannel(channel);
    }),

  // Update an existing channel
  update: protectedProcedure
    .input(UpdateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const channel = await ctx.db.channel.update({
        where: { id },
        data: rest,
      });
      return sanitizeChannel(channel);
    }),

  // Soft delete a channel
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.db.channel.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });
      return sanitizeChannel(channel);
    }),
} satisfies TRPCRouterRecord;
