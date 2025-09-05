import type { Prisma, PrismaClient, Task as PrismaTask } from "@prisma/client";
import {
  TaskCategory,
  TaskLabel,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@prisma/client";
import type { TaskStatsSchema } from "@reservatior/validators";
import {
  BulkTaskOperationSchema,
  CreateTaskSchema,
  FollowTaskSchema,
  isValidTaskId,
  TASK_CONSTANTS,
  TaskFilterSchema,
  UpdateTaskSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { FullTaskFromPrisma } from "../types/task";
import { sanitizeTask, taskInclude } from "../types/task";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Builds the where clause for task filtering with enhanced date range support
 */
const buildTaskWhereClause = (
  input: z.infer<typeof TaskFilterSchema>,
): Prisma.TaskWhereInput => {
  const {
    title,
    status,
    type,
    priority,
    category,
    labels,
    createdById,
    assignedToId,
    propertyId,
    agentId,
    agencyId,
    facilityId,
    includedServiceId,
    extraChargeId,
    followedByUserId,
    createdAtFrom,
    createdAtTo,
    dueDateFrom,
    dueDateTo,
    completedAtFrom,
    completedAtTo,
  } = input;

  const where: Prisma.TaskWhereInput = {
    deletedAt: null,
    ...(title && { title: { contains: title, mode: "insensitive" } }),
    ...(status && { status }),
    ...(type && { type }),
    ...(priority && { priority }),
    ...(category && { category }),
    ...(labels && labels.length > 0 && { labels: { hasSome: labels } }),
    ...(createdById && { createdById }),
    ...(assignedToId && { assignedToId }),
    ...(propertyId && { propertyId }),
    ...(agentId && { agentId }),
    ...(agencyId && { agencyId }),
    ...(facilityId && { facilityId }),
    ...(includedServiceId && { includedServiceId }),
    ...(extraChargeId && { extraChargeId }),
    ...(followedByUserId && {
      followers: {
        array_contains: [followedByUserId],
      },
    }),
    // Date range filters
    ...(createdAtFrom && { createdAt: { gte: createdAtFrom } }),
    ...(createdAtTo && { createdAt: { lte: createdAtTo } }),
    ...(dueDateFrom && { dueDate: { gte: dueDateFrom } }),
    ...(dueDateTo && { dueDate: { lte: dueDateTo } }),
    ...(completedAtFrom && { completedAt: { gte: completedAtFrom } }),
    ...(completedAtTo && { completedAt: { lte: completedAtTo } }),
  };

  return where;
};

/**
 * Validates task ownership or permissions
 */
const validateTaskAccess = async (
  ctx: { db: PrismaClient; session: { user: { id: string; role?: string } } },
  taskId: string,
  userId: string,
  requireOwnership = false,
): Promise<PrismaTask> => {
  const task = await ctx.db.task.findFirst({
    where: { id: taskId, deletedAt: null },
    include: taskInclude,
  });

  if (!task) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Task not found",
    });
  }

  // Check if user has access to the task
  const followers = (task.followers as string[] | null) ?? [];
  const hasAccess =
    task.createdById === userId ||
    task.assignedToId === userId ||
    task.agentId === userId ||
    followers.includes(userId) ||
    ctx.session.user.role === "ADMIN" ||
    ctx.session.user.role === "SUPER_ADMIN";

  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't have permission to access this task",
    });
  }

  // For ownership requirements, SUPER_ADMIN can bypass
  if (
    requireOwnership &&
    task.createdById !== userId &&
    ctx.session.user.role !== "SUPER_ADMIN"
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only the task creator can perform this action",
    });
  }

  return task;
};

/**
 * Calculates task statistics
 */
const calculateTaskStats = async (
  ctx: { db: PrismaClient },
  userId?: string,
): Promise<z.infer<typeof TaskStatsSchema>> => {
  const baseWhere: Prisma.TaskWhereInput = { deletedAt: null };
  if (userId) {
    baseWhere.OR = [
      { createdById: userId },
      { assignedToId: userId },
      { agentId: userId },
      { followers: { array_contains: [userId] } },
    ];
  }

  const [
    total,
    byStatus,
    byPriority,
    byType,
    byCategory,
    overdue,
    dueToday,
    dueThisWeek,
  ] = await Promise.all([
    // Total tasks
    ctx.db.task.count({ where: baseWhere }),

    // Tasks by status
    ctx.db.task.groupBy({
      by: ["status"],
      where: baseWhere,
      _count: { status: true },
    }),

    // Tasks by priority
    ctx.db.task.groupBy({
      by: ["priority"],
      where: baseWhere,
      _count: { priority: true },
    }),

    // Tasks by type
    ctx.db.task.groupBy({
      by: ["type"],
      where: baseWhere,
      _count: { type: true },
    }),

    // Tasks by category
    ctx.db.task.groupBy({
      by: ["category"],
      where: baseWhere,
      _count: { category: true },
    }),

    // Overdue tasks
    ctx.db.task.count({
      where: {
        ...baseWhere,
        dueDate: { lt: new Date() },
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
    }),

    // Tasks due today
    ctx.db.task.count({
      where: {
        ...baseWhere,
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
    }),

    // Tasks due this week
    ctx.db.task.count({
      where: {
        ...baseWhere,
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
    }),
  ]);

  // For labels, we need to aggregate from the array field
  const allTasks = await ctx.db.task.findMany({
    where: baseWhere,
    select: { labels: true },
  });

  const labelCounts: Partial<Record<TaskLabel, number>> = {};
  allTasks.forEach((task) => {
    const labels = task.labels;
    labels.forEach((label) => {
      labelCounts[label] = (labelCounts[label] ?? 0) + 1;
    });
  });

  return {
    total,
    byStatus: Object.fromEntries(
      byStatus.map((item) => [item.status, item._count.status]),
    ),
    byPriority: Object.fromEntries(
      byPriority.map((item) => [item.priority, item._count.priority]),
    ),
    byType: Object.fromEntries(
      byType.map((item) => [item.type, item._count.type]),
    ),
    byCategory: Object.fromEntries(
      byCategory.flatMap((item) =>
        item.category ? [[item.category, item._count.category] as const] : [],
      ),
    ),
    byLabel: labelCounts,
    overdue,
    dueToday,
    dueThisWeek,
  };
};

// ============================================================================
// MAIN ROUTER
// ============================================================================

export const taskRouter = createTRPCRouter({
  // ============================================================================
  // QUERY PROCEDURES
  // ============================================================================

  getAll: protectedProcedure
    .input(TaskFilterSchema)
    .query(async ({ ctx, input }) => {
      const {
        sortBy = "createdAt",
        sortOrder = "desc",
        page = TASK_CONSTANTS.PAGINATION.MIN_PAGE,
        pageSize = TASK_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
      } = input;

      // Validate pagination parameters
      if (page < TASK_CONSTANTS.PAGINATION.MIN_PAGE) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Page must be at least ${TASK_CONSTANTS.PAGINATION.MIN_PAGE}`,
        });
      }

      if (
        pageSize < TASK_CONSTANTS.PAGINATION.MIN_PAGE_SIZE ||
        pageSize > TASK_CONSTANTS.PAGINATION.MAX_PAGE_SIZE
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Page size must be between ${TASK_CONSTANTS.PAGINATION.MIN_PAGE_SIZE} and ${TASK_CONSTANTS.PAGINATION.MAX_PAGE_SIZE}`,
        });
      }

      const where = buildTaskWhereClause(input);

      // Use Promise.all for better performance
      const [tasks, total] = await Promise.all([
        ctx.db.task.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: taskInclude,
        }),
        ctx.db.task.count({ where }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        tasks: tasks.map((task) => sanitizeTask(task as FullTaskFromPrisma)),
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().refine(isValidTaskId, "Invalid task ID format"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findFirst({
        where: { id: input.id, deletedAt: null },
        include: taskInclude,
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      // Check access permissions
      await validateTaskAccess(ctx, input.id, ctx.session.user.id);

      return sanitizeTask(task as FullTaskFromPrisma);
    }),

  getStats: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = input?.userId ?? ctx.session.user.id;

      return await calculateTaskStats(ctx, userId);
    }),

  getMyTasks: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        type: z.nativeEnum(TaskType).optional(),
        category: z.nativeEnum(TaskCategory).optional(),
        labels: z.array(z.nativeEnum(TaskLabel)).optional(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { status, priority, type, category, labels, page, pageSize } =
        input;
      const userId = ctx.session.user.id;

      const where: Prisma.TaskWhereInput = {
        deletedAt: null,
        OR: [
          { createdById: userId },
          { assignedToId: userId },
          { agentId: userId },
          { followers: { array_contains: [userId] } },
        ],
        ...(status && { status }),
        ...(priority && { priority }),
        ...(type && { type }),
        ...(category && { category }),
        ...(labels && labels.length > 0 && { labels: { hasSome: labels } }),
      };

      const [tasks, total] = await Promise.all([
        ctx.db.task.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: taskInclude,
        }),
        ctx.db.task.count({ where }),
      ]);

      return {
        tasks: tasks.map((task) => sanitizeTask(task as FullTaskFromPrisma)),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  getOverdueTasks: protectedProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const userId = ctx.session.user.id;

      const where: Prisma.TaskWhereInput = {
        deletedAt: null,
        dueDate: { lt: new Date() },
        status: { notIn: ["COMPLETED", "CANCELLED"] },
        OR: [
          { createdById: userId },
          { assignedToId: userId },
          { agentId: userId },
          { followers: { array_contains: [userId] } },
        ],
      };

      const [tasks, total] = await Promise.all([
        ctx.db.task.findMany({
          where,
          orderBy: { dueDate: "asc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: taskInclude,
        }),
        ctx.db.task.count({ where }),
      ]);

      return {
        tasks: tasks.map((task) => sanitizeTask(task as FullTaskFromPrisma)),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  count: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = input?.userId ?? ctx.session.user.id;

      const where: Prisma.TaskWhereInput = {
        deletedAt: null,
        OR: [
          { createdById: userId },
          { assignedToId: userId },
          { agentId: userId },
          { followers: { array_contains: [userId] } },
        ],
      };

      return await ctx.db.task.count({ where });
    }),

  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        limit: z.number().int().min(1).max(20).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;
      const userId = ctx.session.user.id;

      const tasks = await ctx.db.task.findMany({
        where: {
          deletedAt: null,
          AND: [
            {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            {
              OR: [
                { createdById: userId },
                { assignedToId: userId },
                { agentId: userId },
                { followers: { array_contains: [userId] } },
              ],
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: taskInclude,
      });

      return tasks.map((task) => sanitizeTask(task as FullTaskFromPrisma));
    }),

  // ============================================================================
  // MUTATION PROCEDURES
  // ============================================================================

  create: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Validate business rules
      if (input.priority === "HIGH" || input.priority === "URGENT") {
        if (!input.assignedToId && !input.agentId && !input.agencyId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "High/Urgent priority tasks must have an assignee",
          });
        }
      }

      // Validate due date
      if (input.dueDate && input.dueDate < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Due date cannot be in the past",
        });
      }

      const task = await ctx.db.task.create({
        data: {
          ...input,
          createdById: userId,
          followers: input.followers,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      return sanitizeTask(task as FullTaskFromPrisma);
    }),

  update: protectedProcedure
    .input(UpdateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const userId = ctx.session.user.id;

      // Validate task access
      await validateTaskAccess(ctx, id, userId, true);

      // Validate business rules for updates
      if (data.priority === "HIGH" || data.priority === "URGENT") {
        if (!data.assignedToId && !data.agentId && !data.agencyId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "High/Urgent priority tasks must have an assignee",
          });
        }
      }

      // Validate due date
      if (data.dueDate && data.dueDate < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Due date cannot be in the past",
        });
      }

      // If marking as completed, set completedAt
      if (data.status === "COMPLETED" && !data.completedAt) {
        data.completedAt = new Date();
      }

      const task = await ctx.db.task.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      return sanitizeTask(task as FullTaskFromPrisma);
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().refine(isValidTaskId, "Invalid task ID format"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Validate task access and ownership
      await validateTaskAccess(ctx, input.id, userId, true);

      const task = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      return sanitizeTask(task as FullTaskFromPrisma);
    }),

  bulkDelete: protectedProcedure
    .input(
      z.object({
        ids: z
          .array(z.string().refine(isValidTaskId, "Invalid task ID format"))
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Validate access to all tasks
      for (const id of input.ids) {
        await validateTaskAccess(ctx, id, userId, true);
      }

      const result = await ctx.db.task.updateMany({
        where: {
          id: { in: input.ids },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        deletedCount: result.count,
        message: `Successfully deleted ${result.count} tasks`,
      };
    }),

  bulkUpdate: protectedProcedure
    .input(BulkTaskOperationSchema)
    .mutation(async ({ ctx, input }) => {
      const { taskIds, operation, data: opData } = input;
      const userId = ctx.session.user.id;

      // Validate access to all tasks
      for (const id of taskIds) {
        await validateTaskAccess(ctx, id, userId, true);
      }

      let updateData: Prisma.TaskUpdateManyMutationInput = {
        updatedAt: new Date(),
      };

      const data: { assignedToId?: string; agentId?: string; agencyId?: string; status?: TaskStatus; priority?: TaskPriority } =
        (opData ?? {}) as {
          assignedToId?: string;
          agentId?: string;
          agencyId?: string;
          status?: TaskStatus;
          priority?: TaskPriority;
        };

      switch (operation) {
        case "update_status":
          if (!data.status) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Status is required for update_status operation",
            });
          }
          updateData.status = data.status;
          if (data.status === "COMPLETED") {
            updateData.completedAt = new Date();
          }
          break;

        case "assign":
          if (!data.assignedToId && !data.agentId && !data.agencyId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "At least one assignee is required for assign operation",
            });
          }
          updateData = {
            ...updateData,
            ...(data.assignedToId && { assignedToId: data.assignedToId }),
            ...(data.agentId && { agentId: data.agentId }),
            ...(data.agencyId && { agencyId: data.agencyId }),
          };
          break;

        case "change_priority":
          if (!data.priority) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Priority is required for change_priority operation",
            });
          }
          updateData.priority = data.priority;
          break;

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid operation",
          });
      }

      const result = await ctx.db.task.updateMany({
        where: {
          id: { in: taskIds },
          deletedAt: null,
        },
        data: updateData,
      });

      return {
        updatedCount: result.count,
        message: `Successfully updated ${result.count} tasks`,
      };
    }),

  follow: protectedProcedure
    .input(FollowTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { taskId, userId } = input;

      // Validate task exists and user has access
      await validateTaskAccess(ctx, taskId, userId);

      const task = await ctx.db.task.findFirst({
        where: { id: taskId, deletedAt: null },
        include: taskInclude,
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      const followers = (task.followers as string[] | null) ?? [];
      if (followers.includes(userId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already following this task",
        });
      }

      const updatedTask = await ctx.db.task.update({
        where: { id: taskId },
        data: {
          followers: [...followers, userId],
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      return sanitizeTask(updatedTask as FullTaskFromPrisma);
    }),

  unfollow: protectedProcedure
    .input(FollowTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { taskId, userId } = input;

      // Validate task exists and user has access
      await validateTaskAccess(ctx, taskId, userId);

      const task = await ctx.db.task.findFirst({
        where: { id: taskId, deletedAt: null },
        include: taskInclude,
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      const followers = (task.followers as string[] | null) ?? [];
      if (!followers.includes(userId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not following this task",
        });
      }

      const updatedTask = await ctx.db.task.update({
        where: { id: taskId },
        data: {
          followers: followers.filter((id) => id !== userId),
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      return sanitizeTask(updatedTask as FullTaskFromPrisma);
    }),

  addToFavorites: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid("Invalid task ID format"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { taskId } = input;
      const userId = ctx.session.user.id;

      // Validate task exists and user has access
      await validateTaskAccess(ctx, taskId, userId);

      const task = await ctx.db.task.findFirst({
        where: { id: taskId, deletedAt: null },
        include: taskInclude,
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      // For now, we'll use the followers field as favorites
      // In a real implementation, you might want a separate favorites table
      const followers = (task.followers as string[] | null) ?? [];
      if (followers.includes(userId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Task is already in your favorites",
        });
      }

      const updatedTask = await ctx.db.task.update({
        where: { id: taskId },
        data: {
          followers: [...followers, userId],
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      return sanitizeTask(updatedTask as FullTaskFromPrisma);
    }),

  makeCopy: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid("Invalid task ID format"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { taskId } = input;
      const userId = ctx.session.user.id;

      // Validate task exists and user has access
      await validateTaskAccess(ctx, taskId, userId);

      const originalTask = await ctx.db.task.findFirst({
        where: { id: taskId, deletedAt: null },
        include: taskInclude,
      });

      if (!originalTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      // Create a copy of the task
      const copiedTask = await ctx.db.task.create({
        data: {
          title: `${originalTask.title} (Copy)`,
          description: originalTask.description,
          status: "TODO", // Reset status for the copy
          type: originalTask.type,
          priority: originalTask.priority,
          category: originalTask.category,
          labels: originalTask.labels,
          createdById: userId,
          assignedToId: originalTask.assignedToId,
          propertyId: originalTask.propertyId,
          agentId: originalTask.agentId,
          agencyId: originalTask.agencyId,
          facilityId: originalTask.facilityId,
          includedServiceId: originalTask.includedServiceId,
          extraChargeId: originalTask.extraChargeId,
          dueDate: originalTask.dueDate,
          completedAt: null, // Reset completion date
          followers: [], // Reset followers
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      return sanitizeTask(copiedTask as FullTaskFromPrisma);
    }),

  // ============================================================================
  // UTILITY PROCEDURES
  // ============================================================================

  getTaskAnalytics: protectedProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { period, userId } = input;
      const currentUserId = userId ?? ctx.session.user.id;

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "day":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }

      const [created, completed, overdue] = await Promise.all([
        // Tasks created in period
        ctx.db.task.count({
          where: {
            createdById: currentUserId,
            createdAt: { gte: startDate },
            deletedAt: null,
          },
        }),
        // Tasks completed in period
        ctx.db.task.count({
          where: {
            OR: [
              { createdById: currentUserId },
              { assignedToId: currentUserId },
              { agentId: currentUserId },
            ],
            completedAt: { gte: startDate },
            status: "COMPLETED",
            deletedAt: null,
          },
        }),
        // Overdue tasks
        ctx.db.task.count({
          where: {
            OR: [
              { createdById: currentUserId },
              { assignedToId: currentUserId },
              { agentId: currentUserId },
            ],
            dueDate: { lt: now },
            status: { notIn: ["COMPLETED", "CANCELLED"] },
            deletedAt: null,
          },
        }),
      ]);

      return {
        period,
        created,
        completed,
        overdue,
        completionRate: created > 0 ? (completed / created) * 100 : 0,
      };
    }),
});
