import type { NotificationType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import {
  CreateNotificationSchema,
  NotificationFilterSchema,
  UpdateNotificationSchema,
} from "@reservatior/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

// Define the include object for Prisma queries consistently
const notificationInclude = {
  User: true, // Corresponds to relation field `User` in Prisma schema
  Agency: true, // Corresponds to relation field `Agency` in Prisma schema
  Agent: true, // Corresponds to relation field `Agent` in Prisma schema
  Review: true, // Corresponds to relation field `Review` in Prisma schema
  Tenant: true, // Corresponds to relation field `Tenant` in Prisma schema
} satisfies Prisma.NotificationInclude;

// Generate a precise type for Notification with its relations based on the include
type FullNotificationFromPrisma = Prisma.NotificationGetPayload<{
  include: typeof notificationInclude;
}>;

// Utility to sanitize notification data
function sanitizeNotification(notification: FullNotificationFromPrisma | null) {
  if (!notification) return null;
  // Destructure using capitalized relation names, matching Prisma output and Zod schema
  const {
    User: userPayload,
    Agency: agencyPayload,
    Agent: agentPayload,
    Review: reviewPayload,
    Tenant: tenantPayload,
    ...rest
  } = notification;

  return {
    ...rest,
    user: {
      id: userPayload.id,
      name: `${userPayload.firstName} ${userPayload.lastName}`, // Assuming User model has firstName & lastName
    },
    agency: agencyPayload
      ? {
          id: agencyPayload.id,
          name: agencyPayload.name, // Assuming Agency model has name
        }
      : null,
    agent: agentPayload
      ? {
          id: agentPayload.id,
          name: agentPayload.name, // Assuming Agent model has name
        }
      : null,
    review: reviewPayload
      ? {
          id: reviewPayload.id,
          rating: reviewPayload.rating, // Assuming Review model has rating
        }
      : null,
    tenant: tenantPayload
      ? {
          id: tenantPayload.id,
          name: `${tenantPayload.firstName} ${tenantPayload.lastName}`, // Assuming Tenant model has firstName & lastName
        }
      : null,
  };
}
export const notificationRouter = {
  all: protectedProcedure
    .input(NotificationFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const safePage = typeof input?.page === "number" ? input.page : undefined;
      const safeLimit =
        typeof input?.pageSize === "number" ? input.pageSize : undefined;
      const { skip, take, page, limit } = getPaginationParams({
        page: safePage,
        limit: safeLimit,
      });
      // Construct a dynamic cache key based on filters to ensure cache validity
      const filterObj = input ?? {};
      const filterParams = Object.entries(filterObj as object)
        .filter(([, value]) => value !== undefined)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}=${String(value)}`)
        .join("&");
      const cacheKey = `notifications:all:page${page}:limit${limit}:${filterParams}`;

      return await withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.NotificationWhereInput = {
          deletedAt: null, // Default to not showing deleted notifications
        };

        if (input) {
          if (input.userId) where.userId = input.userId;
          if (input.type) where.type = input.type;
          if (input.entityId) where.entityId = input.entityId;
          if (input.entityType) where.entityType = input.entityType;
          if (typeof input.isRead === "boolean") where.isRead = input.isRead;
          if (input.tenantId) where.tenantId = input.tenantId;
          if (input.agencyId) where.agencyId = input.agencyId;
          if (input.reviewId) where.reviewId = input.reviewId;
          if (input.agentId) where.agentId = input.agentId;

          if (input.createdAtFrom || input.createdAtTo) {
            where.createdAt = {
              ...(input.createdAtFrom ? { gte: input.createdAtFrom } : {}),
              ...(input.createdAtTo ? { lte: input.createdAtTo } : {}),
            };
          }

          // Allow overriding deletedAt filter if explicitly provided (e.g., to see deleted items)
          if (input.deletedAt !== undefined) {
            where.deletedAt = input.deletedAt; // Can be null or a Date
          }
        }

        const sortBy = input?.sortBy;
        const sortOrder = input?.sortOrder;
        const [notifications, total] = await Promise.all([
          ctx.db.notification.findMany({
            where,
            orderBy:
              typeof sortBy === "string"
                ? { [sortBy]: typeof sortOrder === "string" ? sortOrder : "asc" }
                : { createdAt: "desc" },
            skip,
            take,
            include: notificationInclude,
          }),
          ctx.db.notification.count({ where }),
        ]);
        return {
          data: notifications.map((n) =>
            sanitizeNotification(n as FullNotificationFromPrisma),
          ),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findFirst({
        where: { id: input.id, deletedAt: null }, // Typically, byId doesn't fetch deleted items
        include: notificationInclude,
      });
      return sanitizeNotification(
        notification as FullNotificationFromPrisma | null,
      );
    }),

  create: protectedProcedure
    .input(CreateNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (
          typeof input.type !== "string" ||
          typeof input.content !== "string" ||
          typeof input.userId !== "string"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Missing required fields: type, content, or userId for NotificationCreateInput",
          });
        }
        const data: Prisma.NotificationCreateInput = {
          id: crypto.randomUUID(),
          type: input.type as NotificationType,
          content: input.content,
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          User: { connect: { id: input.userId } },
        };
        // Relations
        if (typeof input.tenantId === "string")
          data.Tenant = { connect: { id: input.tenantId } };
        if (typeof input.agencyId === "string")
          data.Agency = { connect: { id: input.agencyId } };
        if (typeof input.agentId === "string")
          data.Agent = { connect: { id: input.agentId } };
        if (typeof input.reviewId === "string")
          data.Review = { connect: { id: input.reviewId } };
        // Optional scalars
        if (typeof input.entityId === "string") data.entityId = input.entityId;
        if (typeof input.entityType === "string")
          data.entityType = input.entityType;
        const notification = await ctx.db.notification.create({
          data,
          include: notificationInclude,
        });
        return sanitizeNotification(notification as FullNotificationFromPrisma);
      } catch (err: unknown) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error
              ? `Failed to create notification: ${err.message}`
              : "Failed to create notification.",
          cause: err instanceof Error ? err : undefined,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateNotificationSchema) // Contains id and optional isRead
    .mutation(async ({ ctx, input }) => {
      const { id, ...dataToUpdate } = input;
      try {
        const notification = await ctx.db.notification.update({
          where: { id, deletedAt: null }, // Ensure we don't update a deleted notification
          data: {
            ...dataToUpdate, // e.g., isRead
            updatedAt: new Date(),
          },
          include: notificationInclude,
        });
        return sanitizeNotification(notification as FullNotificationFromPrisma);
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Notification not found or already deleted.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update notification.",
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  delete: protectedProcedure // Soft delete
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const notification = await ctx.db.notification.update({
          where: { id: input.id, deletedAt: null }, // Prevent re-deleting or acting on already deleted
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: notificationInclude,
        });
        return sanitizeNotification(notification as FullNotificationFromPrisma);
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Notification not found or already deleted.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete notification.",
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  // Bulk mark as read
  markAllAsRead: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const where: Prisma.NotificationWhereInput = {
          isRead: false,
          deletedAt: null,
        };

        if (input.userId) {
          where.userId = input.userId;
        }

        const result = await ctx.db.notification.updateMany({
          where,
          data: {
            isRead: true,
            updatedAt: new Date(),
          },
        });

        return { updatedCount: result.count };
      } catch (error: unknown) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mark all notifications as read.",
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  // Get notification statistics
  stats: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const where: Prisma.NotificationWhereInput = {
        deletedAt: null,
      };

      if (input.userId) {
        where.userId = input.userId;
      }

      const [total, unread, today] = await Promise.all([
        ctx.db.notification.count({ where }),
        ctx.db.notification.count({ where: { ...where, isRead: false } }),
        ctx.db.notification.count({
          where: {
            ...where,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
      ]);

      return {
        total,
        unread,
        today,
      };
    }),

  // Get unread count
  unreadCount: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const where: Prisma.NotificationWhereInput = {
        isRead: false,
        deletedAt: null,
      };

      if (input.userId) {
        where.userId = input.userId;
      }

      const count = await ctx.db.notification.count({ where });
      return { count };
    }),

  // Get notifications by type
  byType: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "MENTION",
          "TASK_ASSIGNED",
          "BOOKING_CONFIRMED",
          "REVIEW_RECEIVED",
          "PRICE_CHANGE",
          "SYSTEM_UPDATE",
          "COMPLIANCE_ALERT",
          "COMMUNICATION_RECEIVED",
          "RENT_DUE",
          "RENT_PAID",
          "LEASE_EXPIRING",
          "MAINTENANCE_REQUEST",
          "LEASE_RENEWAL",
          "LATE_PAYMENT_WARNING",
          "LEASE_TERMINATION",
          "RENT_INCREASE",
          "COMMUNITY_NOTICE",
          "POLICY_UPDATE",
          "LIKE",
          "COMMENT",
          "FOLLOW",
          "AVAILABILITY",
          "OTHER",
        ]),
        userId: z.string().optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams({
        page: input.page,
        limit: input.pageSize,
      });

      const where: Prisma.NotificationWhereInput = {
        type: input.type,
        deletedAt: null,
      };

      if (input.userId) {
        where.userId = input.userId;
      }

      const [notifications, total] = await Promise.all([
        ctx.db.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
          include: notificationInclude,
        }),
        ctx.db.notification.count({ where }),
      ]);

      return {
        data: notifications.map((n) =>
          sanitizeNotification(n as FullNotificationFromPrisma),
        ),
        page,
        limit,
        total,
      };
    }),

  // Get high priority notifications
  highPriority: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams({
        page: input.page,
        limit: input.pageSize,
      });

      const highPriorityTypes = [
        "TASK_ASSIGNED",
        "BOOKING_CONFIRMED",
        "COMPLIANCE_ALERT",
        "RENT_DUE",
        "LEASE_EXPIRING",
        "LEASE_RENEWAL",
        "LATE_PAYMENT_WARNING",
        "LEASE_TERMINATION",
      ];

      const where: Record<string, unknown> = {
        type: { in: highPriorityTypes },
        deletedAt: null,
      };

      if (input.userId) {
        where.userId = input.userId;
      }

      const [notifications, total] = await Promise.all([
        ctx.db.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
          include: notificationInclude,
        }),
        ctx.db.notification.count({ where }),
      ]);

      return {
        data: notifications.map((n) =>
          sanitizeNotification(n as FullNotificationFromPrisma),
        ),
        page,
        limit,
        total,
      };
    }),

  // Get today's notifications
  today: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams({
        page: input.page,
        limit: input.pageSize,
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const where: Prisma.NotificationWhereInput = {
        createdAt: { gte: today },
        deletedAt: null,
      };

      if (input.userId) {
        where.userId = input.userId;
      }

      const [notifications, total] = await Promise.all([
        ctx.db.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
          include: notificationInclude,
        }),
        ctx.db.notification.count({ where }),
      ]);

      return {
        data: notifications.map((n) =>
          sanitizeNotification(n as FullNotificationFromPrisma),
        ),
        page,
        limit,
        total,
      };
    }),

  // Get mentions
  mentions: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams({
        page: input.page,
        limit: input.pageSize,
      });

      const where: Prisma.NotificationWhereInput = {
        type: "MENTION",
        deletedAt: null,
      };

      if (input.userId) {
        where.userId = input.userId;
      }

      const [notifications, total] = await Promise.all([
        ctx.db.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
          include: notificationInclude,
        }),
        ctx.db.notification.count({ where }),
      ]);

      return {
        data: notifications.map((n) =>
          sanitizeNotification(n as FullNotificationFromPrisma),
        ),
        page,
        limit,
        total,
      };
    }),
} satisfies TRPCRouterRecord;
