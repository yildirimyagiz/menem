import { randomUUID } from "crypto";
import type {
  Agency,
  Agent,
  Analytics,
  ExtraCharge,
  Facility,
  IncludedService,
  Mention,
  Task as PrismaTask,
  Property,
  User,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  CreateTaskSchema,
  TaskFilterSchema,
  UpdateTaskSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type TaskWithIncludes = PrismaTask & {
  Agency?: Agency | null;
  Agent?: Agent | null;

  Property?: Property | null;
  createdBy?: User | null;
  assignedTo?: User | null;
  Facility?: Facility | null;
  IncludedService?: IncludedService | null;
  ExtraCharge?: ExtraCharge | null;
  Analytics?: Analytics[];
  Mention?: Mention[];
};

// Utility to sanitize task data
const sanitizeTask = (task: TaskWithIncludes | null) => {
  if (!task) return null;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    type: task.type,
    priority: task.priority,
    createdById: task.createdById,
    assignedToId: task.assignedToId,

    propertyId: task.propertyId,
    agentId: task.agentId,
    agencyId: task.agencyId,
    dueDate: task.dueDate,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    deletedAt: task.deletedAt,
    facilityId: task.facilityId,
    includedServiceId: task.includedServiceId,
    extraChargeId: task.extraChargeId,
    Analytics: task.Analytics,
    Mention: task.Mention,
    Agency: task.Agency,
    Agent: task.Agent,
    createdBy: task.createdBy,
    assignedTo: task.assignedTo,

    Property: task.Property,
    Facility: task.Facility,
    IncludedService: task.IncludedService,
    ExtraCharge: task.ExtraCharge,
  };
};

export const taskRouter = {
  all: protectedProcedure
    .input(TaskFilterSchema)
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input);
      const cacheKey = `tasks:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          title: input.title ? { contains: input.title } : undefined,
          status: input.status,
          type: input.type,
          priority: input.priority,
          createdById: input.createdById,
          assignedToId: input.assignedToId,
          propertyId: input.propertyId,
          agentId: input.agentId,
          agencyId: input.agencyId,
          dueDate:
            input.dueDateFrom || input.dueDateTo
              ? {
                  gte: input.dueDateFrom,
                  lte: input.dueDateTo,
                }
              : undefined,
          completedAt:
            input.completedAtFrom || input.completedAtTo
              ? {
                  gte: input.completedAtFrom,
                  lte: input.completedAtTo,
                }
              : undefined,
          createdAt:
            input.createdAtFrom || input.createdAtTo
              ? {
                  gte: input.createdAtFrom,
                  lte: input.createdAtTo,
                }
              : undefined,
          updatedAt:
            input.updatedAtFrom || input.updatedAtTo
              ? {
                  gte: input.updatedAtFrom,
                  lte: input.updatedAtTo,
                }
              : undefined,
          deletedAt: input.deletedAt,
        };

        const [tasks, total] = await Promise.all([
          ctx.db.task.findMany({
            where,
            orderBy: input.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agency: true,
              Agent: true,
              Property: true,
              createdBy: true,
              assignedTo: true,
              Facility: true,
              IncludedService: true,
              ExtraCharge: true,
              Analytics: true,
              Mention: true,
            },
          }),
          ctx.db.task.count({ where }),
        ]);
        return {
          data: tasks.map((task: TaskWithIncludes | null) =>
            sanitizeTask(task),
          ),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findFirst({
        where: { id: input.id },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          createdBy: true,
          assignedTo: true,
          Facility: true,
          IncludedService: true,
          ExtraCharge: true,
          Analytics: true,
          Mention: true,
        },
      });
      return sanitizeTask(task);
    }),

  create: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const task = await ctx.db.task.create({
          data: {
            id: randomUUID(),
            ...input,
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
            Agent: true,
            Property: true,
            createdBy: true,
            assignedTo: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Analytics: true,
            Mention: true,
          },
        });
        return sanitizeTask(task);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create task: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const task = await ctx.db.task.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
          Property: true,
          createdBy: true,
          assignedTo: true,
          Facility: true,
          IncludedService: true,
          ExtraCharge: true,
          Analytics: true,
          Mention: true,
        },
      });
      return sanitizeTask(task);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const task = await ctx.db.task.delete({
          where: { id: input },
          include: {
            Agency: true,
            Agent: true,
            Property: true,
            createdBy: true,
            assignedTo: true,
            Facility: true,
            IncludedService: true,
            ExtraCharge: true,
            Analytics: true,
            Mention: true,
          },
        });
        return sanitizeTask(task);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new Error("Task not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;
