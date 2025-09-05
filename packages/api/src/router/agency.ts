import type { Agency, Prisma } from "@prisma/client";
import {
    AgencyFilterSchema,
    CreateAgencySchema,
    UpdateAgencySchema,
} from "@reservatior/validators";
import { z } from "zod";

import { memoize } from "../helpers/memoize";
import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// Define types for JSON fields
type AgencySettings = Partial<{
  theme: string;
  logo: string;
  customDomain: string;
  defaultLanguage: string;
  defaultLocation: string;
  defaultCurrency: string;
  defaultTimezone: string;
  defaultDateFormat: string;
  defaultTimeFormat: string;
  defaultNumberFormat: string;
  defaultCountry: string;
  defaultState: string;
  defaultCity: string;
  defaultZipCode: string;
  defaultAddress: string;
  defaultPhone: string;
  defaultEmail: string;
  defaultWebsite: string;
  defaultFacebook: string;
  defaultTwitter: string;
  defaultInstagram: string;
  defaultLinkedin: string;
  defaultYoutube: string;
  defaultPinterest: string;
  defaultTiktok: string;
  defaultSnapchat: string;
  defaultWhatsapp: string;
  defaultTelegram: string;
  defaultSkype: string;
  defaultViber: string;
  defaultLine: string;
  defaultWechat: string;
  defaultKakao: string;
  defaultVk: string;
  defaultOk: string;
  defaultQq: string;
  defaultWeibo: string;
}>;

type AgencyIntegration = Partial<{
  provider: string;
  config: Record<string, string | number | boolean | null>;
  enabled: boolean;
}>;

// Memoized utility to sanitize agency data
const sanitizeAgency = memoize((agency: Agency | null): Agency | null => {
  if (!agency) return null;

  let settings: AgencySettings | null = null;
  let integration: AgencyIntegration | null = null;

  if (typeof agency.settings === "object" && agency.settings !== null) {
    settings = agency.settings as AgencySettings;
  }

  if (typeof agency.integration === "object" && agency.integration !== null) {
    integration = agency.integration as AgencyIntegration;
  }

  return {
    ...agency,
    settings,
    integration,
  };
});

// Memoized cache key generation
import type { AgencyFilterInput } from "@reservatior/validators";
const generateCacheKey = memoize((input: AgencyFilterInput = {}): string => {
  const params = new URLSearchParams();
  if (input.search) params.set("search", input.search);
  if (input.email) params.set("email", input.email);
  if (input.isActive !== undefined)
    params.set("isActive", String(input.isActive));
  if (input.ownerId) params.set("ownerId", input.ownerId);
  if (input.status) params.set("status", input.status);
  if (input.hasDeleted) params.set("hasDeleted", String(input.hasDeleted));
  if (input.page) params.set("page", String(input.page));
  if (input.pageSize) params.set("pageSize", String(input.pageSize));
  if (input.sortBy) params.set("sortBy", input.sortBy);
  if (input.sortOrder) params.set("sortOrder", input.sortOrder);
  if (input.createdFrom)
    params.set("createdFrom", input.createdFrom.toISOString());
  if (input.createdTo) params.set("createdTo", input.createdTo.toISOString());
  if (input.updatedFrom)
    params.set("updatedFrom", input.updatedFrom.toISOString());
  if (input.updatedTo) params.set("updatedTo", input.updatedTo.toISOString());

  return `agencies:${params.toString()}`;
});

// Memoized where clause builder
const buildWhereClause = memoize((safeInput: AgencyFilterInput) => {
  const where: Prisma.AgencyWhereInput = {};

  if (typeof safeInput.search === "string" && safeInput.search.length > 0) {
    const searchTerm = safeInput.search.toLowerCase();
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (typeof safeInput.email === "string" && safeInput.email.length > 0) {
    where.email = { equals: safeInput.email, mode: "insensitive" };
  }

  if (typeof safeInput.isActive === "boolean") {
    where.isActive = safeInput.isActive;
  }

  if (typeof safeInput.ownerId === "string" && safeInput.ownerId.length > 0) {
    where.ownerId = safeInput.ownerId;
  }

  if (typeof safeInput.status === "string") {
    where.status = safeInput.status;
  }

  if (typeof safeInput.hasDeleted === "boolean" && !safeInput.hasDeleted) {
    where.deletedAt = null;
  }

  if (safeInput.createdFrom || safeInput.createdTo) {
    where.createdAt = {};
    if (safeInput.createdFrom) (where.createdAt as { gte?: Date }).gte = safeInput.createdFrom;
    if (safeInput.createdTo) (where.createdAt as { lte?: Date }).lte = safeInput.createdTo;
  }

  if (safeInput.updatedFrom || safeInput.updatedTo) {
    where.updatedAt = {};
    if (safeInput.updatedFrom) (where.updatedAt as { gte?: Date }).gte = safeInput.updatedFrom;
    if (safeInput.updatedTo) (where.updatedAt as { lte?: Date }).lte = safeInput.updatedTo;
  }

  return where;
});

export const agencyRouter = createTRPCRouter({
  all: publicProcedure
    .input(AgencyFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const safeInput = input ?? {};
      const { skip, take, page, limit } = getPaginationParams({
        page: safeInput.page,
        limit: safeInput.pageSize,
      });

      const cacheKey = generateCacheKey(safeInput);

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const where = buildWhereClause({
              ...safeInput,
              hasDeleted: false, // Don't show deleted agencies
            });

            const [agencies, total] = await Promise.all([
              ctx.db.agency.findMany({
                where,
                orderBy: safeInput.sortBy
                  ? { [safeInput.sortBy]: safeInput.sortOrder ?? "asc" }
                  : { createdAt: "desc" },
                skip,
                take,
                include: {
                  _count: {
                    select: {
                      Agent: true,
                      Property: true,
                      User: true,
                      Subscription: true,
                    },
                  },
                },
              }),
              ctx.db.agency.count({ where }),
            ]);

            return {
              data: agencies.map(sanitizeAgency),
              page,
              pageSize: limit,
              total,
              totalPages: Math.ceil(total / limit),
              hasNextPage: page < Math.ceil(total / limit),
              hasPreviousPage: page > 1,
            };
          } catch (error) {
            console.error("Error fetching agencies:", error);
            throw new Error("Failed to fetch agencies. Please try again.");
          }
        },
        5 * 60 * 1000,
      ); // 5 minutes cache
    }),

  // Public endpoint for viewing agencies (no authentication required)
  public: publicProcedure
    .input(AgencyFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const safeInput = input ?? {};
      const { skip, take, page, limit } = getPaginationParams({
        page: safeInput.page,
        limit: safeInput.pageSize,
      });

      const cacheKey = `public-agencies:${generateCacheKey(safeInput)}`;

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const where = buildWhereClause({
              ...safeInput,
              isActive: true, // Only show active agencies
              hasDeleted: false, // Don't show deleted agencies
            } as AgencyFilterInput);

            const [agencies, total] = await Promise.all([
              ctx.db.agency.findMany({
                where,
                orderBy: safeInput.sortBy
                  ? { [safeInput.sortBy]: safeInput.sortOrder ?? "asc" }
                  : { createdAt: "desc" },
                skip,
                take,
                include: {
                  _count: {
                    select: {
                      Agent: true,
                      Property: true,
                      User: true,
                      Subscription: true,
                    },
                  },
                },
              }),
              ctx.db.agency.count({ where }),
            ]);

            return {
              data: agencies.map(sanitizeAgency),
              page,
              pageSize: limit,
              total,
              totalPages: Math.ceil(total / limit),
              hasNextPage: page < Math.ceil(total / limit),
              hasPreviousPage: page > 1,
            };
          } catch (error) {
            console.error("Error fetching public agencies:", error);
            throw new Error("Failed to fetch agencies. Please try again.");
          }
        },
        5 * 60 * 1000,
      ); // 5 minutes cache
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `agency:${input.id}`;

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const agency = await ctx.db.agency.findFirst({
              where: {
                id: input.id,
                deletedAt: null,
              },
              include: {
                _count: {
                  select: {
                    Agent: true,
                    Property: true,
                    User: true,
                    Subscription: true,
                  },
                },
                Subscription: {
                  where: {
                    status: { in: ["ACTIVE"] },
                  },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            });

            if (!agency) {
              throw new Error("Agency not found");
            }

            return sanitizeAgency(agency);
          } catch (error) {
            if (
              error instanceof Error &&
              error.message === "Agency not found"
            ) {
              throw error;
            }
            console.error("Error fetching agency:", error);
            throw new Error(
              "Failed to fetch agency details. Please try again.",
            );
          }
        },
        10 * 60 * 1000,
      ); // 10 minutes cache
    }),

  create: protectedProcedure
    .input(CreateAgencySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if agency with same email already exists
        if (input.email) {
          const existingAgency = await ctx.db.agency.findFirst({
            where: {
              email: input.email,
              deletedAt: null,
            },
          });

          if (existingAgency) {
            throw new Error("An agency with this email already exists");
          }
        }

        const agency = await ctx.db.agency.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            status: input.status,
            isActive: input.isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return sanitizeAgency(agency);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("already exists")) {
            throw error;
          }
          throw new Error(`Failed to create agency: ${error.message}`);
        }
        console.error("Error creating agency:", error);
        throw new Error("Failed to create agency. Please try again.");
      }
    }),

  update: protectedProcedure
    .input(UpdateAgencySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input as { id: string; [key: string]: unknown };

      try {
        // Check if agency exists
        const existingAgency = await ctx.db.agency.findFirst({
          where: {
            id,
            deletedAt: null,
          },
        });

        if (!existingAgency) {
          throw new Error("Agency not found");
        }

        // Check if email is being updated and if it conflicts
        if (data.email && data.email !== existingAgency.email) {
          const emailConflict = await ctx.db.agency.findFirst({
            where: {
              email: data.email as string,
              id: { not: id },
              deletedAt: null,
            },
          });

          if (emailConflict) {
            throw new Error("An agency with this email already exists");
          }
        }

        const agency = await ctx.db.agency.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        });

        return sanitizeAgency(agency);
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("already exists") ||
            error.message === "Agency not found"
          ) {
            throw error;
          }
          throw new Error(`Failed to update agency: ${error.message}`);
        }
        console.error("Error updating agency:", error);
        throw new Error("Failed to update agency. Please try again.");
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if agency exists and is not already deleted
        const existingAgency = await ctx.db.agency.findFirst({
          where: {
            id: input,
            deletedAt: null,
          },
        });

        if (!existingAgency) {
          throw new Error("Agency not found or already deleted");
        }

        const agency = await ctx.db.agency.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
            isActive: false,
          },
        });

        return sanitizeAgency(agency);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            throw error;
          }
          throw new Error(`Failed to delete agency: ${error.message}`);
        }
        console.error("Error deleting agency:", error);
        throw new Error("Failed to delete agency. Please try again.");
      }
    }),

  // Get agency statistics with caching
  stats: protectedProcedure.query(async ({ ctx }) => {
    const cacheKey = "agency:stats";

    return await withCacheAndFormat(
      cacheKey,
      async () => {
        try {
          const [total, active, pending, suspended] = await Promise.all([
            ctx.db.agency.count({ where: { deletedAt: null } }),
            ctx.db.agency.count({ where: { isActive: true, deletedAt: null } }),
            ctx.db.agency.count({
              where: { status: "PENDING", deletedAt: null },
            }),
            ctx.db.agency.count({
              where: { status: "SUSPENDED", deletedAt: null },
            }),
          ]);

          return {
            total,
            active,
            pending,
            suspended,
            inactive: total - active,
          };
        } catch (error) {
          console.error("Error fetching agency stats:", error);
          throw new Error("Failed to fetch agency statistics");
        }
      },
      2 * 60 * 1000,
    ); // 2 minutes cache
  }),

  // Get agency by owner ID
  byOwnerId: protectedProcedure
    .input(z.object({ ownerId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `agency:byOwnerId:${input.ownerId}`;

      return await withCacheAndFormat(
        cacheKey,
        async () => {
          try {
            const agency = await ctx.db.agency.findFirst({
              where: {
                ownerId: input.ownerId,
                deletedAt: null,
              },
              include: {
                Agent: {
                  where: { deletedAt: null },
                  include: {
                    _count: {
                      select: {
                        Property: true,
                        Review: true,
                      },
                    },
                  },
                },
                Property: {
                  where: { deletedAt: null },
                  take: 5,
                  orderBy: { createdAt: "desc" },
                },
                _count: {
                  select: {
                    Agent: true,
                    Property: true,
                    User: true,
                    Subscription: true,
                  },
                },
              },
            });

            if (!agency) {
              return { data: null };
            }

            return { data: sanitizeAgency(agency) };
          } catch (error) {
            console.error("Error fetching agency by owner ID:", error);
            throw new Error(
              "Failed to fetch agency details. Please try again.",
            );
          }
        },
        5 * 60 * 1000,
      ); // 5 minutes cache
    }),
});
