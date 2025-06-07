import type { Agency, Agent as PrismaAgent } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  AgentFilterSchema,
  CreateAgentSchema,
  UpdateAgentSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type AgentWithAgency = PrismaAgent & { Agency: Agency | null };

// Utility to sanitize agent data
function sanitizeAgent(agent: AgentWithAgency | null) {
  if (!agent) return null;
  const { Agency, ...rest } = agent;
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

export const agentRouter = {
  all: protectedProcedure
    .input(AgentFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `agents:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          name: input?.search
            ? { contains: input.search, mode: "insensitive" as const }
            : undefined,
          agencyId: input?.agencyId,
          deletedAt: input?.hasDeleted ? undefined : null,
          createdAt: {
            gte: input?.createdFrom,
            lte: input?.createdTo,
          },
        };

        const [agents, total] = await Promise.all([
          ctx.db.agent.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agency: true,
            },
          }),
          ctx.db.agent.count({ where }),
        ]);
        return {
          data: agents.map((agent) => sanitizeAgent(agent)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const agent = await ctx.db.agent.findFirst({
        where: { id: input.id },
        include: {
          Agency: true,
        },
      });
      return sanitizeAgent(agent);
    }),

  create: protectedProcedure
    .input(CreateAgentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const agent = await ctx.db.agent.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
          },
        });
        return sanitizeAgent(agent);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Failed to create agent: ${err.message}`);
        }
        throw err;
      }
    }),

  update: protectedProcedure
    .input(UpdateAgentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const agent = await ctx.db.agent.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
        },
      });
      return sanitizeAgent(agent);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const agent = await ctx.db.agent.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            Agency: true,
          },
        });
        return sanitizeAgent(agent);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          throw new Error("Agent not found or already deleted.");
        }
        throw error;
      }
    }),
} satisfies TRPCRouterRecord;
