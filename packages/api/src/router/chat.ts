import type {
  Agency,
  CommunicationLog,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import EventEmitter from "eventemitter3";
import { z } from "zod";

import {
  CreateCommunicationSchema,
  UpdateCommunicationSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure, publicProcedure } from "../trpc";

interface Context {
  db: PrismaClient<{ log?: ("info" | "warn" | "error")[] }>;
  session: { user?: { id: string } } | null;
}

type GuestMessageInput = z.infer<typeof CreateCommunicationSchema> & {
  name?: string;
  email?: string;
};

// TypeScript globalThis augmentation for chatEmitter
declare global {
  // eslint-disable-next-line no-var
  var chatEmitter: EventEmitter | undefined;
}

// Global event emitter for demo/dev; replace with Redis pub/sub in production
globalThis.chatEmitter ??= new EventEmitter();
export const chatEmitter: EventEmitter = globalThis.chatEmitter;

// Types for sanitized data
// Shared types for chat system
interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

interface ChatAgency {
  id: string;
  name: string;
  logo: string;
}

export interface ChatMessage
  extends Omit<CommunicationLog, "User" | "Agency" | "channelId"> {
  user: ChatUser | null;
  agency: ChatAgency | null;
  replyTo?: ChatMessage | null;
  replies?: ChatMessage[];
  channelId: string | null;
}

const agentSelect = {
  id: true,
  name: true,
  image: true,
  role: true,
  displayName: true,
  agencyId: true,
  Agency: {
    select: {
      id: true,
      name: true,
      logoUrl: true,
    },
  },
} as const;

type AgentSelect = Prisma.UserGetPayload<{ select: typeof agentSelect }>;

// Utility to sanitize communication data
function sanitizeCommunication(
  communication:
    | (CommunicationLog & { User?: User | null; Agency?: Agency | null })
    | null,
): ChatMessage | null {
  if (!communication) return null;

  const { User, Agency, ...rest } = communication;

  return {
    ...rest,
    user: User
      ? {
          id: User.id,
          name: User.name ?? "",
          avatar: User.image ?? "",
        }
      : null,
    agency: Agency
      ? {
          id: Agency.id,
          name: Agency.name,
          logo: Agency.logoUrl ?? "",
        }
      : null,
  };
}

export const chatRouter = {
  // Get messages for current user
  getMessages: publicProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
        otherUserId: z.string().optional(),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // For guest users, we'll show an empty list of messages
      // They'll be able to see their messages after sending one
      const userId = ctx.session?.user.id;
      if (!userId) {
        return {
          data: [],
          page: input.page ?? 1,
          limit: input.limit ?? 50,
          total: 0,
          totalPages: 0,
        };
      }
      const { skip, take, page, limit } = getPaginationParams(input);
      const cacheKey = `messages:${userId}:${input.threadId ?? ""}:${input.otherUserId ?? ""}:${page}:${limit}`;

      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          OR: [{ senderId: userId }, { receiverId: userId }],
          deletedAt: null,
          ...(input.threadId ? { threadId: input.threadId } : {}),
          ...(input.otherUserId
            ? {
                OR: [
                  { senderId: input.otherUserId },
                  { receiverId: input.otherUserId },
                ],
              }
            : {}),
        };

        const [messages, total] = await Promise.all([
          ctx.db.communicationLog.findMany({
            skip,
            take,
            where,
            orderBy: { timestamp: "desc" },
            include: {
              User: true,
              Agency: true,
            },
          }),
          ctx.db.communicationLog.count({ where }),
        ]);

        return {
          data: messages.map(sanitizeCommunication),
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      });
    }),

  // Get support agents
  getSupportAgents: publicProcedure
    .input(
      z
        .object({
          agencyId: z.string().optional(),
          page: z.number().min(1).optional(),
          limit: z.number().min(1).max(100).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      // No authentication needed for getting support agents
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `support-agents:${input?.agencyId ?? "all"}:${page}:${limit}`;

      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          role: "AGENT" as Role,
          ...(input?.agencyId ? { agencyId: input.agencyId } : {}),
        };

        const [agents, total] = await Promise.all([
          ctx.db.user.findMany({
            where,
            skip,
            take,
            select: agentSelect,
          }),
          ctx.db.user.count({ where }),
        ]);

        const formattedAgents = agents.map((agent: AgentSelect) => ({
          id: agent.id,
          name: agent.name ?? "",
          avatar: agent.image ?? "",
          role: agent.role,
          displayName: agent.displayName ?? "Support Agent",
          agencyId: agent.agencyId ?? "",
          agency: agent.Agency
            ? {
                id: agent.Agency.id,
                name: agent.Agency.name,
                logoUrl: agent.Agency.logoUrl ?? "",
              }
            : null,
        }));

        return {
          data: formattedAgents,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      });
    }),

  // Send a message (supports both authenticated and guest users)
  sendMessage: publicProcedure
    .input(
      CreateCommunicationSchema.extend({
        name: z.string().min(1).optional(), // Guest name if not authenticated
        email: z.string().email().optional(), // Guest email if not authenticated
      }),
    )
    .mutation(
      async ({ ctx, input }: { ctx: Context; input: GuestMessageInput }) => {
        // If user is not authenticated, create a guest user
        let userId = ctx.session?.user?.id;

        if (!userId) {
          const tempEmail =
            input.email ?? `guest_${crypto.randomUUID()}@temp.com`;
          // Create or find guest user
          const guestUser = await ctx.db.user.upsert({
            where: { email: tempEmail },
            create: {
              id: crypto.randomUUID(),
              name: input.name ?? "Guest User",
              email: tempEmail,
              role: "GUEST" as const,
              updatedAt: new Date(),
              createdAt: new Date(),
              emailVerified: null,
            },
            update: {},
          });
          userId = guestUser.id;
        }
        try {
          const message = await ctx.db.communicationLog.create({
            data: {
              id: crypto.randomUUID(),
              senderId: userId,
              userId: userId,
              type: "PROBLEM",
              content: input.content,
              receiverId: input.receiverId,
              entityId: input.entityId ?? null,
              entityType: input.entityType ?? null,
              metadata: input.metadata ? Prisma.JsonNull : undefined,
              threadId: input.threadId ?? null,
              channelId: input.channelId ?? null,
              updatedAt: new Date(),
              createdAt: new Date(),
              deletedAt: null,
              isRead: false,
            },
            include: {
              User: true,
              Agency: true,
            },
          });
          // Emit to subscribers
          chatEmitter.emit("message", message);
          return sanitizeCommunication(message);
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Failed to send message: ${err.message}`,
              cause: err,
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred while sending the message",
          });
        }
      },
    ),

  // Mark messages as read
  markAllAsRead: protectedProcedure
    .input(
      z
        .object({
          senderId: z.string().optional(),
          threadId: z.string().optional(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const where = {
        receiverId: userId,
        isRead: false,
        ...(input?.senderId ? { senderId: input.senderId } : {}),
        ...(input?.threadId ? { threadId: input.threadId } : {}),
      };

      const now = new Date();
      await ctx.db.communicationLog.updateMany({
        where,
        data: {
          isRead: true,
        },
      });

      // Update readAt in a separate query since updateMany doesn't support DateTime fields directly
      const conditions: Prisma.Sql[] = [];
      if (input?.senderId) {
        conditions.push(Prisma.sql`AND "senderId" = ${input.senderId}`);
      }
      if (input?.threadId) {
        conditions.push(Prisma.sql`AND "threadId" = ${input.threadId}`);
      }

      await ctx.db.$executeRaw`
        UPDATE "CommunicationLog"
        SET "readAt" = ${now}
        WHERE "receiverId" = ${userId}
        ${Prisma.join(conditions)}
        AND "isRead" = false
      `;

      return { success: true };
    }),

  // Delete a message
  deleteMessage: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        const message = await ctx.db.communicationLog.update({
          where: {
            id: input,
            senderId: ctx.session.user.id, // Only allow deleting own messages
          },
          data: {
            deletedAt: new Date(),
          },
          include: {
            User: true,
            Agency: true,
          },
        });
        return sanitizeCommunication(message);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message:
                "Message not found or you don't have permission to delete it.",
              cause: error,
            });
          }
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Failed to delete message: ${error.message}`,
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while deleting the message",
        });
      }
    }),

  // Update a message
  updateMessage: protectedProcedure
    .input(UpdateCommunicationSchema)
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.communicationLog.update({
        where: {
          id: input.id,
          senderId: ctx.session.user.id, // Only allow updating own messages
        },
        data: {
          isRead: input.isRead,
          metadata: input.metadata ? { dbNull: true } : undefined,
        },
        include: {
          User: true,
          Agency: true,
        },
      });
      return sanitizeCommunication(message);
    }),
  // Real-time message subscription
  onMessage: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .subscription(({ input }) => {
      return observable<{
        message: CommunicationLog & {
          User?: User | null;
          Agency?: Agency | null;
        };
      }>((emit) => {
        const handler = (
          msg: CommunicationLog & {
            User?: User | null;
            Agency?: Agency | null;
          },
        ) => {
          if (msg.threadId === input.threadId) {
            emit.next({ message: msg });
          }
        };
        chatEmitter.on("message", handler);
        return () => chatEmitter.off("message", handler);
      });
    }),
} satisfies TRPCRouterRecord;
