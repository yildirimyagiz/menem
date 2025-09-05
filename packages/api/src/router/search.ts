import type { Prisma, PropertyStatus, PropertyType } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../trpc";

export interface SearchResult {
  id: string;
  type: "property" | "user" | "task" | "agent" | "agency" | "tenant";
  title: string;
  description?: string;
  score: number;
  metadata: Record<string, unknown>;
}

export const searchRouter = {
  // Global search across all entities
  global: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        types: z.array(z.enum(["property", "user", "task", "agent", "agency", "tenant"])).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        filters: z
          .object({
            property: z.custom<Prisma.PropertyWhereInput>().optional(),
            user: z.custom<Prisma.UserWhereInput>().optional(),
            task: z.custom<Prisma.TaskWhereInput>().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, types = ["property", "user", "task"], limit, offset, filters } = input;
      const searchTerm = query.toLowerCase();
      
      const results: SearchResult[] = [];

      // Search properties
      if (types.includes("property")) {
        const properties = await ctx.db.property.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
              { Location: { address: { contains: searchTerm, mode: "insensitive" } } },
            ],
            isActive: true,
            ...(filters?.property ?? {}),
          },
          take: limit,
          skip: offset,
          include: {
            Location: true,
            Agency: true,
          },
        });

        results.push(
          ...properties.map((property) => ({
            id: property.id,
            type: "property" as const,
            title: property.title,
            description: property.description,
            score: calculateSearchScore(query, property.title),
            metadata: {
              address: property.Location?.address ?? "",
              agency: property.Agency?.name ?? "",
            },
          }))
        );
      }

      // Search users
      if (types.includes("user")) {
        const users = await ctx.db.user.findMany({
          where: {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { email: { contains: searchTerm, mode: "insensitive" } },
            ],
            isActive: true,
            ...(filters?.user ?? {}),
          },
          take: limit,
          skip: offset,
        });

        results.push(
          ...users.map((user) => ({
            id: user.id,
            type: "user" as const,
            title: (user.name ?? user.email) || "Unknown User",
            description: user.email,
            score: calculateSearchScore(query, (user.name ?? user.email) || ""),
            metadata: {
              email: user.email,
              role: user.role,
              isActive: user.isActive,
            },
          }))
        );
      }

      // Search tasks
      if (types.includes("task")) {
        const tasks = await ctx.db.task.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
            ],
            deletedAt: null,
            ...(filters?.task ?? {}),
          },
          take: limit,
          skip: offset,
          
        });

        results.push(
          ...tasks.map((task) => ({
            id: task.id,
            type: "task" as const,
            title: task.title,
            description: task.description ?? "",
            score: calculateSearchScore(query, task.title),
            metadata: {
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate,
              property: task.propertyId,
              assignee: task.assignedToId,
            },
          }))
        );
      }

      // Sort by relevance score
      results.sort((a, b) => b.score - a.score);

      return {
        results: results.slice(0, limit),
        total: results.length,
        query,
        types,
      };
    }),

  // Advanced search with filters
  advanced: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        filters: z.object({
          property: z.object({
            status: z.array(z.string()).optional(),
            type: z.array(z.string()).optional(),
            priceRange: z.object({
              min: z.number().optional(),
              max: z.number().optional(),
            }).optional(),
            location: z.string().optional(),
          }).optional(),
          task: z.object({
            status: z.array(z.string()).optional(),
            priority: z.array(z.string()).optional(),
            assignee: z.string().optional(),
          }).optional(),
          user: z.object({
            role: z.array(z.string()).optional(),
            isActive: z.boolean().optional(),
          }).optional(),
        }).optional(),
        sortBy: z.enum(["relevance", "date", "name", "price"]).default("relevance"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, filters, sortBy, sortOrder, limit, offset } = input;
      
      // Build complex search query based on filters
      const whereClause: Prisma.PropertyWhereInput = {
        isActive: true,
      };

      if (query) {
        whereClause.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { Location: { address: { contains: query, mode: "insensitive" } } },
        ];
      }

      if (filters?.property) {
        if (filters.property.status?.length) {
          whereClause.propertyStatus = { in: filters.property.status as PropertyStatus[] };
        }
        if (filters.property.type?.length) {
          whereClause.propertyType = { in: filters.property.type as PropertyType[] };
        }
        if (filters.property.priceRange) {
          whereClause.marketValue = {};
          if (filters.property.priceRange.min !== undefined) {
            whereClause.marketValue.gte = filters.property.priceRange.min;
          }
          if (filters.property.priceRange.max !== undefined) {
            whereClause.marketValue.lte = filters.property.priceRange.max;
          }
        }
        if (filters.property.location) {
          whereClause.Location = {
            OR: [
              { city: { contains: filters.property.location, mode: "insensitive" } },
              { country: { contains: filters.property.location, mode: "insensitive" } },
            ],
          };
        }
      }

      // Build order by clause
      const orderBy: Prisma.PropertyOrderByWithRelationInput = {};
      switch (sortBy) {
        case "date":
          orderBy.createdAt = sortOrder;
          break;
        case "name":
          orderBy.title = sortOrder;
          break;
        case "price":
          orderBy.marketValue = sortOrder;
          break;
        default:
          orderBy.createdAt = "desc";
      }

      const [properties, total] = await Promise.all([
        ctx.db.property.findMany({
          where: whereClause,
          orderBy,
          take: limit,
          skip: offset,
          include: {
            Location: true,
            Agency: true,
            Photo: { take: 1 },
          },
        }),
        ctx.db.property.count({ where: whereClause }),
      ]);

      return {
        results: properties.map((property) => ({
          id: property.id,
          type: "property" as const,
          title: property.title,
          description: property.description,
          score: query ? calculateSearchScore(query, property.title) : 1,
          metadata: {
            address: property.Location?.address ?? "",
            price: property.marketValue,
            status: property.propertyStatus,
            type: property.propertyType,
            agency: property.Agency?.name,
            photo: property.Photo[0]?.url,
            createdAt: property.createdAt,
          },
        })),
        total,
        filters,
        sortBy,
        sortOrder,
      };
    }),

  // Search suggestions/autocomplete
  suggestions: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(50),
        type: z.enum(["property", "user", "task", "location"]).optional(),
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, type, limit } = input;
      const searchTerm = query.toLowerCase();

      const suggestions: { text: string; type: string; id?: string }[] = [];

      if (!type || type === "property") {
        const properties = await ctx.db.property.findMany({
          where: {
            title: { contains: searchTerm, mode: "insensitive" },
            isActive: true,
          },
          select: { id: true, title: true },
          take: limit,
        });

        suggestions.push(
          ...properties.map((p) => ({
            text: p.title,
            type: "property",
            id: p.id,
          }))
        );
      }

      if (!type || type === "location") {
        const locations = await ctx.db.location.findMany({
          where: {
            OR: [
              { city: { contains: searchTerm, mode: "insensitive" } },
              { country: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
          select: { id: true, city: true, country: true },
          take: limit,
        });

        suggestions.push(
          ...locations.map((l) => ({
            text: `${l.city}, ${l.country}`,
            type: "location",
            id: l.id,
          }))
        );
      }

      return suggestions.slice(0, limit);
    }),
} satisfies TRPCRouterRecord;

// Helper function to calculate search relevance score
function calculateSearchScore(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();
  
  let score = 0;
  
  // Exact match gets highest score
  if (textLower.includes(query.toLowerCase())) {
    score += 100;
  }
  
  // Word matches
  queryWords.forEach((word) => {
    if (textLower.includes(word)) {
      score += 10;
    }
  });
  
  // Position bonus (words at the beginning get higher score)
  queryWords.forEach((word) => {
    const index = textLower.indexOf(word);
    if (index >= 0) {
      score += Math.max(0, 5 - Math.floor(index / 10));
    }
  });
  
  return score;
} 