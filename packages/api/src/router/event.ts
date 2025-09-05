import { Prisma } from "@prisma/client";
import {
  CreateEventSchema,
  EventFilterSchema,
  UpdateEventSchema,
} from "@reservatior/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Type-safe Event with relations
export type EventWithIncludes = Prisma.EventGetPayload<{
  include: {
    Property: true;
    createdBy: true;
    attendees: true;
  };
}>;

const sanitizeEvent = (
  event: EventWithIncludes | null,
): {
  id: string;
  propertyId: string;
  title: string;
  description: string | null;
  eventType: string;
  scheduledAt: Date;
  duration: number | null;
  createdById: string | null;
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Property: EventWithIncludes["Property"] | null;
  createdBy: EventWithIncludes["createdBy"] | null;
  attendees: EventWithIncludes["attendees"];
} | null => {
  if (!event) return null;
  // Destructure defensively to avoid unsafe access
  const {
    id,
    propertyId,
    title,
    description,
    eventType,
    scheduledAt,
    duration,
    createdById,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
    Property,
    createdBy,
    attendees,
  } = event;
  return {
    id,
    propertyId,
    title,
    description: description ?? null,
    eventType,
    scheduledAt,
    duration: duration ?? null,
    createdById: createdById ?? null,
    isActive: typeof isActive === "boolean" ? isActive : null,
    createdAt,
    updatedAt,
    deletedAt,
    Property,
    createdBy: createdBy ?? null,
    attendees,
  };
};

export const eventRouter = {
  all: protectedProcedure
    .input(EventFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      // Build a robust cache key that includes all filter and sorting parameters
      const {
        propertyId,
        eventType,
        createdById,
        scheduledAtFrom,
        scheduledAtTo,
        isActive,
        deletedAt, // Assuming deletedAt can be a filter criteria (e.g., for viewing soft-deleted items)
        sortBy,
        sortOrder,
      } = input ?? {};

      const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
      if (propertyId !== undefined)
        cacheKeyParts.push(`propertyId=${propertyId}`);
      if (eventType !== undefined) cacheKeyParts.push(`eventType=${eventType}`);
      if (createdById !== undefined)
        cacheKeyParts.push(`createdById=${createdById}`);
      if (scheduledAtFrom !== undefined)
        cacheKeyParts.push(`scheduledAtFrom=${scheduledAtFrom.toISOString()}`);
      if (scheduledAtTo !== undefined)
        cacheKeyParts.push(`scheduledAtTo=${scheduledAtTo.toISOString()}`);
      if (isActive !== undefined) cacheKeyParts.push(`isActive=${isActive}`);
      if (deletedAt !== undefined) {
        cacheKeyParts.push(`deletedAt=${deletedAt.toISOString()}`);
      }
      if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
      if (sortOrder !== undefined) cacheKeyParts.push(`sortOrder=${sortOrder}`);

      const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
      const cacheKey = `events:${dynamicCacheKeyPart}`;

      return withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.EventWhereInput = {
          propertyId: input?.propertyId,
          eventType: input?.eventType,
          createdById: input?.createdById,
          scheduledAt:
            input?.scheduledAtFrom || input?.scheduledAtTo
              ? {
                  gte: input.scheduledAtFrom,
                  lte: input.scheduledAtTo,
                }
              : undefined,
          isActive: input?.isActive,
          // If input.deletedAt is undefined, we might want to filter for non-deleted items by default.
          // If input.deletedAt is null, it means explicitly filter for non-deleted.
          deletedAt: input?.deletedAt ?? null,
        };
        const [events, total] = await Promise.all([
          ctx.db.event.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { scheduledAt: "desc" },
            skip,
            take,
            include: {
              Property: true,
              createdBy: true,
              attendees: true,
            },
          }),
          ctx.db.event.count({ where }),
        ]);
        return {
          data: events.map((event) => sanitizeEvent(event)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findFirst({
        where: { id: input.id },
        include: {
          Property: true,
          createdBy: true,
          attendees: true,
        },
      });
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }
      return sanitizeEvent(event);
    }),

  byProperty: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.db.event.findMany({
        where: { propertyId: input.propertyId, deletedAt: null },
        include: {
          Property: true,
          createdBy: true,
          attendees: true,
        },
        orderBy: { scheduledAt: "asc" },
      });
      return {
        events: events.map((event) => sanitizeEvent(event)),
      };
    }),

  create: protectedProcedure
    .input(CreateEventSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const event = await ctx.db.event.create({
          data: {
            id: randomUUID(),
            ...input,
            createdById: input.createdById ?? null,
            updatedAt: new Date(),
            attendees: input.attendees
              ? { connect: input.attendees.map((id: string) => ({ id })) }
              : undefined,
          },
          include: {
            Property: true,
            createdBy: true,
            attendees: true,
          },
        });
        return sanitizeEvent(event);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create event: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateEventSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        const event = await ctx.db.event.update({
          where: { id },
          data: {
            ...data,
            createdById:
              "createdById" in data ? (data.createdById ?? null) : undefined,
            updatedAt: new Date(),
            attendees: data.attendees
              ? { set: data.attendees.map((id: string) => ({ id })) }
              : undefined,
          },
          include: {
            Property: true,
            createdBy: true,
            attendees: true,
          },
        });
        return sanitizeEvent(event);
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update event: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming soft delete by setting deletedAt
        // If hard delete is intended, use ctx.db.event.delete
        const event = await ctx.db.event.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            Property: true,
            createdBy: true,
            attendees: true,
          },
        });
        // If hard delete was used:
        // const event = await ctx.db.event.delete({
        //   where: { id: input },
        //   include: { Property: true, createdBy: true, attendees: true },
        // });
        return sanitizeEvent(event);
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete event: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
