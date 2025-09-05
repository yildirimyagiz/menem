import type { Agency, Agent as PrismaAgent, Prisma } from "@prisma/client";
import {
  AgentFilterSchema,
  CreateAgentSchema,
  UpdateAgentSchema,
} from "@reservatior/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { memoize } from "../helpers/memoize";
import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import {
  agencyProcedure,
  agentFilteredProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

// Define a more flexible type for agent with agency
type AgentWithAgency = PrismaAgent & {
  Agency: Pick<
    Agency,
    | "id"
    | "name"
    | "isActive"
    | "status"
    | "logoUrl"
    | "email"
    | "phoneNumber"
    | "website"
  > | null;
  _count?: {
    Property: number;
    Reservation: number;
    Review: number;
  };
  Property?: {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
  }[];
};

// Memoized utility to sanitize agent data
const sanitizeAgent = memoize((agent: AgentWithAgency | null) => {
  if (!agent) return null;
  const { Agency, _count, Property, ...rest } = agent;
  return {
    ...rest,
    agency: Agency
      ? {
          id: Agency.id,
          name: Agency.name,
          isActive: Agency.isActive,
          status: Agency.status,
          logoUrl: Agency.logoUrl,
          email: Agency.email,
          phoneNumber: Agency.phoneNumber,
          website: Agency.website,
        }
      : null,
    _count,
    Property,
  };
});

// Memoized cache key generation
const generateCacheKey = memoize(
  (input: z.infer<typeof AgentFilterSchema> | undefined): string => {
    const params = new URLSearchParams();
    if (typeof input?.search === "string" && input.search.trim() !== "")
      params.set("search", input.search);
    if (typeof input?.agencyId === "string") params.set("agencyId", input.agencyId);
    if (typeof input?.hasDeleted === "boolean")
      params.set("hasDeleted", String(input.hasDeleted));
    if (typeof input?.page === "number") params.set("page", String(input.page));
    if (typeof input?.pageSize === "number")
      params.set("pageSize", String(input.pageSize));
    if (typeof input?.sortBy === "string") params.set("sortBy", input.sortBy);
    if (input?.sortOrder === "asc" || input?.sortOrder === "desc")
      params.set("sortOrder", input.sortOrder);
    if (input?.createdFrom instanceof Date)
      params.set("createdFrom", input.createdFrom.toISOString());
    if (input?.createdTo instanceof Date)
      params.set("createdTo", input.createdTo.toISOString());
    // updatedFrom/updatedTo are not part of AgentFilterSchema; omit from cache key

    return `agents:${params.toString()}`;
  },
);

// Memoized where clause builder
const buildWhereClause = memoize(
  (input: z.infer<typeof AgentFilterSchema> | undefined): Prisma.AgentWhereInput => {
    const where: Prisma.AgentWhereInput = {};

    const searchTerm =
      typeof input?.search === "string" && input.search.trim() !== ""
        ? input.search.toLowerCase()
        : undefined;
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phoneNumber: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (typeof input?.agencyId === "string") {
      where.agencyId = input.agencyId;
    }

    if (!input?.hasDeleted) {
      where.deletedAt = null;
    }

    const createdFrom = input?.createdFrom;
    const createdTo = input?.createdTo;
    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt.gte = createdFrom;
      if (createdTo) where.createdAt.lte = createdTo;
    }

    // updatedFrom/updatedTo are not part of AgentFilterSchema; skip updatedAt window filter

    return where;
  },
);

export const agentRouter = {
  // Public agents - accessible to all users (no authentication required)
  public: publicProcedure
    .input(AgentFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const i = input ?? ({} as z.infer<typeof AgentFilterSchema>);
      const { skip, take, page, limit } = getPaginationParams({
        page: i.page,
        limit: i.pageSize,
      });

      const cacheKey = `public-agents:${generateCacheKey(i)}`;

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const where = buildWhereClause(i);

            // Only show active agents publicly
            where.status = "ACTIVE";
            where.deletedAt = null;

            const sortBy = typeof i.sortBy === "string" ? i.sortBy : undefined;
            const sortOrder: "asc" | "desc" = i.sortOrder === "desc" ? "desc" : "asc";

            const [agents, total] = await Promise.all([
              ctx.db.agent.findMany({
                where,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
                skip,
                take,
                include: {
                  Agency: {
                    select: {
                      id: true,
                      name: true,
                      isActive: true,
                      status: true,
                      logoUrl: true,
                      email: true,
                      phoneNumber: true,
                      website: true,
                    },
                  },
                  _count: {
                    select: {
                      Property: true,
                      Reservation: true,
                      Review: true,
                    },
                  },
                },
              }),
              ctx.db.agent.count({ where }),
            ]);

            return {
              data: agents.map((agent) => sanitizeAgent(agent as AgentWithAgency)),
              page,
              pageSize: limit,
              total,
              totalPages: Math.ceil(total / limit),
              hasNextPage: page < Math.ceil(total / limit),
              hasPreviousPage: page > 1,
            };
          } catch (error) {
            console.error("Error fetching public agents:", error);
            throw new Error("Failed to fetch agents. Please try again.");
          }
        },
        5 * 60 * 1000,
      ); // 5 minutes cache
    }),

  // Public agents - accessible to all authenticated users
  all: protectedProcedure
    .input(AgentFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const i = input ?? ({} as z.infer<typeof AgentFilterSchema>);
      const { skip, take, page, limit } = getPaginationParams({
        page: i.page,
        limit: i.pageSize,
      });

      const cacheKey = generateCacheKey(i);

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const where = buildWhereClause(i);

            // Only show active agents publicly
            where.status = "ACTIVE";
            where.deletedAt = null;

            const sortBy = typeof i.sortBy === "string" ? i.sortBy : undefined;
            const sortOrder: "asc" | "desc" = i.sortOrder === "desc" ? "desc" : "asc";

            const [agents, total] = await Promise.all([
              ctx.db.agent.findMany({
                where,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
                skip,
                take,
                include: {
                  Agency: {
                    select: {
                      id: true,
                      name: true,
                      isActive: true,
                      status: true,
                      logoUrl: true,
                    },
                  },
                  _count: {
                    select: {
                      Property: true,
                      Reservation: true,
                      Review: true,
                    },
                  },
                },
              }),
              ctx.db.agent.count({ where }),
            ]);

            return {
              data: agents.map((agent) =>
                sanitizeAgent(agent as AgentWithAgency),
              ),
              page,
              pageSize: limit,
              total,
              totalPages: Math.ceil(total / limit),
              hasNextPage: page < Math.ceil(total / limit),
              hasPreviousPage: page > 1,
            };
          } catch (error) {
            console.error("Error fetching agents:", error);
            throw new Error("Failed to fetch agents. Please try again.");
          }
        },
        5 * 60 * 1000,
      ); // 5 minutes cache
    }),

  // Agency/Admin filtered agents - only shows agents the user has access to
  myAgents: agentFilteredProcedure
    .input(AgentFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const i = input ?? ({} as z.infer<typeof AgentFilterSchema>);
      const { skip, take, page, limit } = getPaginationParams({
        page: i.page,
        limit: i.pageSize,
      });

      const userRole = ctx.userRole;
      const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;
      const agentId = (ctx as unknown as { agentId?: string }).agentId;
      const canAccessAllAgents =
        (ctx as unknown as { canAccessAllAgents?: boolean }).canAccessAllAgents ??
        false;

      try {
        // Build authorization filter
        let where: Prisma.AgentWhereInput = { deletedAt: null };

        if (!canAccessAllAgents) {
          // Filter based on user relationships
          const userRelationships: Prisma.AgentWhereInput[] = [];

          // Agents in the user's agency
          if (agencyId) {
            userRelationships.push({ agencyId });
          }

          // User's own agent profile
          if (agentId) {
            userRelationships.push({ id: agentId });
          }

          // If user has no relationships, only show their own profile
          if (userRelationships.length > 0) {
            where.OR = userRelationships;
          } else if (agentId) {
            where.id = agentId; // Only show their own profile
          }
        }

        // Add search filters
        const searchWhere = buildWhereClause(i);
        where = { ...where, ...searchWhere };

        const sortBy = typeof i.sortBy === "string" ? i.sortBy : undefined;
        const sortOrder: "asc" | "desc" = i.sortOrder === "desc" ? "desc" : "asc";

        const [agents, total] = await Promise.all([
          ctx.db.agent.findMany({
            where,
            orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agency: {
                select: {
                  id: true,
                  name: true,
                  isActive: true,
                  status: true,
                  logoUrl: true,
                  email: true,
                  phoneNumber: true,
                  website: true,
                },
              },
              _count: {
                select: {
                  Property: true,
                  Reservation: true,
                  Review: true,
                },
              },
              Property: {
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                  id: true,
                  title: true,
                  createdAt: true,
                },
              },
            },
          }),
          ctx.db.agent.count({ where }),
        ]);

        return {
          data: agents.map((agent) => sanitizeAgent(agent as AgentWithAgency)),
          page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
          userRole,
          agencyId,
          agentId,
        };
      } catch (error) {
        console.error("Error fetching my agents:", error);
        throw new Error("Failed to fetch agents. Please try again.");
      }
    }),

  // Agency agents - shows all agents for an agency (admin/agency access only)
  agencyAgents: agencyProcedure
    .input(
      z
        .object({
          ...AgentFilterSchema.shape,
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const i = input ?? ({} as z.infer<typeof AgentFilterSchema>);
      const { skip, take, page, limit } = getPaginationParams({
        page: i.page,
        limit: i.pageSize,
      });

      const userRole = ctx.userRole;
      const userAgencyId = (ctx as unknown as { agencyId?: string }).agencyId;

      // Check if user can access the requested agency
      if (
        userRole !== "SUPER_ADMIN" &&
        userRole !== "ADMIN" &&
        userAgencyId !== input?.agencyId
      ) {
        throw new Error("You can only access agents from your own agency");
      }

      try {
        const where = buildWhereClause(i);
        where.agencyId = input?.agencyId;
        where.deletedAt = null;

        const sortBy = typeof i.sortBy === "string" ? i.sortBy : undefined;
        const sortOrder: "asc" | "desc" = i.sortOrder === "desc" ? "desc" : "asc";

        const [agents, total] = await Promise.all([
          ctx.db.agent.findMany({
            where,
            orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
            skip,
            take,
            include: {
              Agency: {
                select: {
                  id: true,
                  name: true,
                  isActive: true,
                  status: true,
                  logoUrl: true,
                  email: true,
                  phoneNumber: true,
                  website: true,
                },
              },
              _count: {
                select: {
                  Property: true,
                  Reservation: true,
                  Review: true,
                },
              },
              Property: {
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                  id: true,
                  title: true,
                  createdAt: true,
                },
              },
            },
          }),
          ctx.db.agent.count({ where }),
        ]);

        return {
          data: agents.map((agent) => sanitizeAgent(agent as AgentWithAgency)),
          page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
          agencyId: input?.agencyId,
        };
      } catch (error) {
        console.error("Error fetching agency agents:", error);
        throw new Error("Failed to fetch agency agents. Please try again.");
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `agent:${input.id}`;

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const agent = await ctx.db.agent.findFirst({
              where: {
                id: input.id,
                deletedAt: null,
              },
              include: {
                Agency: {
                  select: {
                    id: true,
                    name: true,
                    isActive: true,
                    status: true,
                    logoUrl: true,
                    email: true,
                    phoneNumber: true,
                    website: true,
                  },
                },
                _count: {
                  select: {
                    Property: true,
                    Reservation: true,
                    Review: true,
                  },
                },
                Property: {
                  take: 5,
                  orderBy: { createdAt: "desc" },
                  select: {
                    id: true,
                    title: true,
                    createdAt: true,
                  },
                },
              },
            });

            if (!agent) {
              throw new Error("Agent not found");
            }

            // Check if user has access to this agent
            const userRole = ctx.session.user.role ?? "USER";
            const canAccess =
              userRole === "SUPER_ADMIN" ||
              userRole === "ADMIN" ||
              agent.agencyId === ctx.session.user.agencyId ||
              agent.id === (ctx as unknown as { agentId?: string }).agentId;

            if (!canAccess && agent.status !== "ACTIVE") {
              throw new Error("You don't have access to this agent");
            }

            return sanitizeAgent(agent as AgentWithAgency);
          } catch (error) {
            if (error instanceof Error && error.message === "Agent not found") {
              throw error;
            }
            console.error("Error fetching agent:", error);
            throw new Error("Failed to fetch agent details. Please try again.");
          }
        },
        10 * 60 * 1000,
      ); // 10 minutes cache
    }),

  create: agentFilteredProcedure
    .input(CreateAgentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userRole = ctx.userRole;
        const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;

        // Check if agent with same email already exists
        if (input.email) {
          const existingAgent = await ctx.db.agent.findFirst({
            where: {
              email: input.email,
              deletedAt: null,
            },
          });

          if (existingAgent) {
            throw new Error("An agent with this email already exists");
          }
        }

        // Set agency ID based on user role
        const { agencyId: inputAgencyId, ...restInput } = input;
        let finalAgencyId = inputAgencyId;

        if (userRole === "AGENT" || userRole === "AGENT_ADMIN") {
          if (!agencyId) {
            throw new Error("Agents must be associated with an agency");
          }
          finalAgencyId = agencyId;
        }

        // Create clean data object without agencyId to avoid conflicts
        const agentData = {
          id: crypto.randomUUID(),
          name: restInput.name,
          email: restInput.email,
          phoneNumber: restInput.phoneNumber,
          address: restInput.address,
          website: restInput.website,
          logoUrl: restInput.logoUrl,
          status: restInput.status,
          settings: restInput.settings as unknown as Prisma.InputJsonValue,
          externalId: restInput.externalId,
          integration: restInput.integration as unknown as Prisma.InputJsonValue,
          ownerId: restInput.ownerId,
          lastActive: restInput.lastActive,
          agencyId: finalAgencyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as const;

        const agent = await ctx.db.agent.create({
          data: agentData,
          include: {
            Agency: {
              select: {
                id: true,
                name: true,
                isActive: true,
                status: true,
              },
            },
          },
        });

        return sanitizeAgent(agent as AgentWithAgency);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("already exists")) {
            throw error;
          }
          throw new Error(`Failed to create agent: ${error.message}`);
        }
        console.error("Error creating agent:", error);
        throw new Error("Failed to create agent. Please try again.");
      }
    }),

  update: agentFilteredProcedure
    .input(UpdateAgentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      try {
        const _userRole = ctx.userRole;
        const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;
        const canAccessAllAgents =
          (ctx as unknown as { canAccessAllAgents?: boolean }).canAccessAllAgents ??
          false;

        // Check if agent exists
        const existingAgent = await ctx.db.agent.findFirst({
          where: {
            id,
            deletedAt: null,
          },
        });

        if (!existingAgent) {
          throw new Error("Agent not found");
        }

        // Check if user can edit this agent
        const canEdit =
          canAccessAllAgents ||
          existingAgent.agencyId === agencyId ||
          existingAgent.id === (ctx as unknown as { agentId?: string }).agentId;

        if (!canEdit) {
          throw new Error("You don't have permission to edit this agent");
        }

        // Check if email is being updated and if it conflicts
        if (typeof data.email === "string" && data.email !== existingAgent.email) {
          const emailConflict = await ctx.db.agent.findFirst({
            where: {
              email: data.email,
              id: { not: id },
              deletedAt: null,
            },
          });

          if (emailConflict) {
            throw new Error("An agent with this email already exists");
          }
        }

        // Build a typed update payload to avoid passing unsupported fields
        const updateData: Prisma.AgentUpdateInput = {
          updatedAt: new Date(),
        };

        if (typeof data.name === "string") updateData.name = data.name;
        if (typeof data.email === "string") updateData.email = data.email;
        if (typeof data.phoneNumber === "string")
          updateData.phoneNumber = data.phoneNumber;
        if (typeof data.bio === "string") updateData.bio = data.bio;
        if (typeof data.address === "string") updateData.address = data.address;
        if (typeof data.website === "string") updateData.website = data.website;
        if (typeof data.logoUrl === "string") updateData.logoUrl = data.logoUrl;
        if (typeof data.status === "string") updateData.status = data.status;
        if (data.settings !== undefined)
          updateData.settings = data.settings as unknown as Prisma.InputJsonValue;
        if (typeof data.externalId === "string")
          updateData.externalId = data.externalId;
        if (data.integration !== undefined)
          updateData.integration =
            data.integration as unknown as Prisma.InputJsonValue;
        if (data.lastActive instanceof Date) updateData.lastActive = data.lastActive;

        const agent = await ctx.db.agent.update({
          where: { id },
          data: updateData,
          include: {
            Agency: {
              select: {
                id: true,
                name: true,
                isActive: true,
                status: true,
              },
            },
          },
        });

        return sanitizeAgent(agent as AgentWithAgency);
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("already exists") ||
            error.message === "Agent not found"
          ) {
            throw error;
          }
          throw new Error(`Failed to update agent: ${error.message}`);
        }
        console.error("Error updating agent:", error);
        throw new Error("Failed to update agent. Please try again.");
      }
    }),

  delete: agentFilteredProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const _userRole = ctx.userRole;
        const agencyId = (ctx as unknown as { agencyId?: string }).agencyId;
        const canAccessAllAgents =
          (ctx as unknown as { canAccessAllAgents?: boolean }).canAccessAllAgents ??
          false;

        // Check if agent exists and is not already deleted
        const existingAgent = await ctx.db.agent.findFirst({
          where: {
            id: input,
            deletedAt: null,
          },
        });

        if (!existingAgent) {
          throw new Error("Agent not found or already deleted");
        }

        // Check if user can delete this agent
        const canDelete =
          canAccessAllAgents ||
          existingAgent.agencyId === agencyId ||
          existingAgent.id === (ctx as unknown as { agentId?: string }).agentId;

        if (!canDelete) {
          throw new Error("You don't have permission to delete this agent");
        }

        const agent = await ctx.db.agent.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            Agency: {
              select: {
                id: true,
                name: true,
                isActive: true,
                status: true,
              },
            },
          },
        });

        return sanitizeAgent(agent as AgentWithAgency);
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("not found") ||
            error.message.includes("already deleted")
          ) {
            throw error;
          }
          throw new Error(`Failed to delete agent: ${error.message}`);
        }
        console.error("Error deleting agent:", error);
        throw new Error("Failed to delete agent. Please try again.");
      }
    }),

  // Get agent statistics with caching
  stats: protectedProcedure.query(async ({ ctx }) => {
    const cacheKey = "agent:stats";

    return await withCacheAndFormat(
      cacheKey,
      async () => {
        try {
          const [total, active, inactive] = await Promise.all([
            ctx.db.agent.count({ where: { deletedAt: null } }),
            ctx.db.agent.count({
              where: { status: "ACTIVE", deletedAt: null },
            }),
            ctx.db.agent.count({
              where: { status: "SUSPENDED", deletedAt: null },
            }),
          ]);

          return {
            total,
            active,
            inactive,
          };
        } catch (error) {
          console.error("Error fetching agent stats:", error);
          throw new Error("Failed to fetch agent statistics");
        }
      },
      2 * 60 * 1000,
    ); // 2 minutes cache
  }),

  // Get agent by owner ID
  byOwnerId: protectedProcedure
    .input(z.object({ ownerId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `agent:byOwnerId:${input.ownerId}`;

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const agent = await ctx.db.agent.findFirst({
              where: {
                ownerId: input.ownerId,
                deletedAt: null,
              },
              include: {
                Agency: {
                  select: {
                    id: true,
                    name: true,
                    isActive: true,
                    status: true,
                    logoUrl: true,
                    email: true,
                    phoneNumber: true,
                    website: true,
                  },
                },
                Property: {
                  where: { deletedAt: null },
                  take: 5,
                  orderBy: { createdAt: "desc" },
                  select: {
                    id: true,
                    title: true,
                    createdAt: true,
                  },
                },
                _count: {
                  select: {
                    Property: true,
                    Reservation: true,
                    Review: true,
                  },
                },
              },
            });

            if (!agent) {
              return { data: null };
            }

            return { data: sanitizeAgent(agent as AgentWithAgency) };
          } catch (error) {
            console.error("Error fetching agent by owner ID:", error);
            throw new Error("Failed to fetch agent details. Please try again.");
          }
        },
        5 * 60 * 1000,
      ); // 5 minutes cache
    }),
} satisfies TRPCRouterRecord;
