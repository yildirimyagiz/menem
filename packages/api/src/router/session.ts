import { randomUUID } from "crypto";
import type { Prisma, Session as PrismaSession, User } from "@prisma/client";
import { z } from "zod";

import { CreateSessionSchema, UpdateSessionSchema } from "@acme/validators";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Utility to sanitize session data
export interface SanitizedSession {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User | null;
}

const sanitizeSession = (
  session: (PrismaSession & { user?: User | null }) | null,
): SanitizedSession | null => {
  if (!session) return null;

  return {
    id: session.id,
    sessionToken: session.sessionToken,
    userId: session.userId,
    expires: session.expires,
    user: session.user ?? null,
  };
};

export const sessionRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid().optional(),
        page: z.number().min(1).optional(),
        pageSize: z.number().min(1).max(100).optional(),
        sortBy: z.enum(["expires", "createdAt"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const paginationInput = {
        page: input.page ?? 1,
        pageSize: input.pageSize ?? 10,
      };
      const { skip, take, page, limit } = {
        skip: (paginationInput.page - 1) * paginationInput.pageSize,
        take: paginationInput.pageSize,
        page: paginationInput.page,
        limit: paginationInput.pageSize,
      };

      const where: Prisma.SessionWhereInput = {
        userId: input.userId,
      };

      const orderBy: Prisma.SessionOrderByWithRelationInput = input.sortBy
        ? {
            [input.sortBy]: input.sortOrder ?? "desc",
          }
        : {
            expires: "desc" as const,
          };

      const [sessions, total] = await Promise.all([
        ctx.db.session.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            user: true,
          },
        }),
        ctx.db.session.count({ where }),
      ]);

      return {
        items: sessions.map(sanitizeSession),
        pagination: {
          total,
          page,
          limit,
          hasMore: skip + take < total,
        },
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: { id: input.id },
        include: {
          user: true,
        },
      });

      return sanitizeSession(session);
    }),

  create: protectedProcedure
    .input(CreateSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.create({
        data: {
          id: randomUUID(),
          ...input,
        },
        include: {
          user: true,
        },
      });

      return sanitizeSession(session);
    }),

  update: protectedProcedure
    .input(UpdateSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const session = await ctx.db.session.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
        },
      });

      return sanitizeSession(session);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.session.delete({
        where: { id: input.id },
        include: {
          user: true,
        },
      });

      return sanitizeSession(session);
    }),
});
