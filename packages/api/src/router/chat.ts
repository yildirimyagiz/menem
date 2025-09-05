import type {
  Agency,
  CommunicationLog,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import {
  CreateCommunicationSchema,
  UpdateCommunicationSchema,
} from "@reservatior/validators";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import EventEmitter from "eventemitter3";
import { z } from "zod";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
  online?: boolean;
}

interface ChatAgency {
  id: string;
  name: string;
  logo: string;
}

interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

interface MessageAttachment {
  id: string;
  type: "image" | "file" | "audio" | "video";
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

interface TypingIndicator {
  userId: string;
  userName: string;
  threadId: string;
  isTyping: boolean;
  timestamp: Date;
}

interface MessageMetadata {
  isEdited?: boolean;
  editHistory?: {
    content: string;
    timestamp: Date;
  }[];
  reactions?: MessageReaction[];
}

export interface ChatMessage
  extends Omit<
    CommunicationLog,
    "User" | "Agency" | "channelId" | "reactions" | "attachments"
  > {
  user: ChatUser | null;
  agency: ChatAgency | null;
  replyTo?: ChatMessage | null;
  replies?: ChatMessage[];
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  channelId: string | null;
  isEdited: boolean;
  editHistory?: string[];
}

const agentSelect = {
  id: true,
  name: true,
  image: true,
  role: true,
  displayName: true,
  agencyId: true,
  lastSeen: true,
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

  const { User, Agency, reactions, attachments, ...rest } = communication;

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
    reactions: reactions
      ? (reactions as unknown as MessageReaction[])
      : undefined,
    attachments: attachments
      ? (attachments as unknown as MessageAttachment[])
      : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chatRouter: any = createTRPCRouter({
  // Get messages for current user
  getMessages: publicProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
        otherUserId: z.string().optional(),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
        search: z.string().optional(),
        messageType: z.enum(["all", "text", "media", "file"]).optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
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
      const cacheKey = `messages:${userId}:${input.threadId ?? ""}:${input.otherUserId ?? ""}:${page}:${limit}:${input.search ?? ""}`;

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
          ...(input.search
            ? {
                content: {
                  contains: input.search,
                  mode: "insensitive" as const,
                },
              }
            : {}),
          ...(input.dateFrom || input.dateTo
            ? {
                timestamp: {
                  ...(input.dateFrom ? { gte: input.dateFrom } : {}),
                  ...(input.dateTo ? { lte: input.dateTo } : {}),
                },
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
          data: messages.map(sanitizeCommunication).filter(Boolean),
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        };
      });
    }),

  // Search messages globally
  searchMessages: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
        filters: z
          .object({
            dateFrom: z.date().optional(),
            dateTo: z.date().optional(),
            senderId: z.string().optional(),
            messageType: z.enum(["all", "text", "media", "file"]).optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { skip, take, page, limit } = getPaginationParams(input);
      const cacheKey = `search:${userId}:${input.query}:${page}:${limit}`;

      return await withCacheAndFormat(cacheKey, async () => {
        const where = {
          OR: [{ senderId: userId }, { receiverId: userId }],
          deletedAt: null,
          content: {
            contains: input.query,
            mode: "insensitive" as const,
          },
          ...(input.filters?.dateFrom || input.filters?.dateTo
            ? {
                timestamp: {
                  ...(input.filters.dateFrom
                    ? { gte: input.filters.dateFrom }
                    : {}),
                  ...(input.filters.dateTo
                    ? { lte: input.filters.dateTo }
                    : {}),
                },
              }
            : {}),
          ...(input.filters?.senderId
            ? { senderId: input.filters.senderId }
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
          query: input.query,
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
      // BEGIN DEBUG LOGGING
      console.log("[tRPC][getSupportAgents] called with input:", input);
      try {
        // Defensive: default input to empty object if null/undefined
        const safeInput = input ?? {};
        const { skip, take, page, limit } = getPaginationParams(safeInput);
        const cacheKey = `support-agents:${safeInput.agencyId ?? "all"}:${page}:${limit}`;
        console.log("[tRPC][getSupportAgents] cacheKey:", cacheKey);

        return await withCacheAndFormat(cacheKey, async () => {
          const where = {
            role: "AGENT" as Role,
            ...(safeInput.agencyId ? { agencyId: safeInput.agencyId } : {}),
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
            online: false, // We'll implement online status later when we have lastSeen field
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
      } catch (err) {
        console.error("[tRPC][getSupportAgents] ERROR", { input, err });
        throw err;
      }
      // END DEBUG LOGGING
    }),

  // Send a message (supports both authenticated and guest users)
  sendMessage: publicProcedure
    .input(
      CreateCommunicationSchema.extend({
        name: z.string().min(1).optional(), // Guest name if not authenticated
        email: z.string().email().optional(), // Guest email if not authenticated
        replyToId: z.string().optional(), // Reply to specific message
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
              replyToId: input.replyToId ?? null,
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

  // Edit a message
  editMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.string().uuid(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        const originalMessage = await ctx.db.communicationLog.findUnique({
          where: { id: input.messageId },
          include: { User: true, Agency: true },
        });

        if (!originalMessage) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Message not found",
          });
        }

        if (originalMessage.senderId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only edit your own messages",
          });
        }

        // Check if message is too old to edit (e.g., 15 minutes)
        const editTimeLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
        const messageAge =
          new Date().getTime() - originalMessage.createdAt.getTime();

        if (messageAge > editTimeLimit) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Message is too old to edit",
          });
        }

        const currentMetadata = originalMessage.metadata as MessageMetadata | null;
        const editHistory = currentMetadata?.editHistory ?? [];

        const message = await ctx.db.communicationLog.update({
          where: { id: input.messageId },
          data: {
            content: input.content,
            metadata: {
              ...currentMetadata,
              isEdited: true,
              editHistory: [
                ...editHistory,
                {
                  content: originalMessage.content,
                  timestamp: new Date(),
                },
              ],
            } as unknown as Prisma.InputJsonValue,
            updatedAt: new Date(),
          },
          include: {
            User: true,
            Agency: true,
          },
        });

        // Emit edit event
        chatEmitter.emit("messageEdited", message);
        return sanitizeCommunication(message);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to edit message",
        });
      }
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

        // Emit delete event
        chatEmitter.emit("messageDeleted", message);
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

      // Emit read receipt
      chatEmitter.emit("messagesRead", {
        userId,
        senderId: input?.senderId,
        threadId: input?.threadId,
      });

      return { success: true };
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

  // Add reaction to message
  addReaction: protectedProcedure
    .input(
      z.object({
        messageId: z.string().uuid(),
        emoji: z.string().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        // For simplicity, we'll store reactions in the message metadata
        // In a production system, you'd have a separate reactions table
        const message = await ctx.db.communicationLog.findUnique({
          where: { id: input.messageId },
          include: { User: true, Agency: true },
        });

        if (!message) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Message not found",
          });
        }

        const currentMetadata = message.metadata as MessageMetadata | null;
        const currentReactions = currentMetadata?.reactions ?? [];
        const existingReactionIndex = currentReactions.findIndex(
          (r: MessageReaction) => r.userId === userId && r.emoji === input.emoji,
        );

        let newReactions: MessageReaction[];
        if (existingReactionIndex >= 0) {
          // Remove existing reaction
          newReactions = currentReactions.filter(
            (_: MessageReaction, i: number) => i !== existingReactionIndex,
          );
        } else {
          // Add new reaction
          const user = await ctx.db.user.findUnique({
            where: { id: userId },
            select: { name: true },
          });

          newReactions = [
            ...currentReactions,
            {
              id: crypto.randomUUID(),
              emoji: input.emoji,
              userId,
              userName: user?.name ?? "Unknown",
              timestamp: new Date(),
            },
          ];
        }

        const updatedMessage = await ctx.db.communicationLog.update({
          where: { id: input.messageId },
          data: {
            metadata: {
              ...currentMetadata,
              reactions: newReactions,
            } as unknown as Prisma.InputJsonValue,
          },
          include: { User: true, Agency: true },
        });

        // Emit reaction event
        const lastReaction = newReactions[newReactions.length - 1];
        chatEmitter.emit("messageReaction", {
          messageId: input.messageId,
          reaction: lastReaction,
          removed: existingReactionIndex >= 0,
        });

        return sanitizeCommunication(updatedMessage);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add reaction",
        });
      }
    }),

  // Update typing status
  updateTypingStatus: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        isTyping: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Emit typing event
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      const typingIndicator: TypingIndicator = {
        userId,
        userName: user?.name ?? "Unknown",
        threadId: input.threadId,
        isTyping: input.isTyping,
        timestamp: new Date(),
      };

      chatEmitter.emit("typing", typingIndicator);
      return { success: true };
    }),

  // Get conversation statistics
  getConversationStats: protectedProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
        otherUserId: z.string().optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

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
        ...(input.dateFrom || input.dateTo
          ? {
              timestamp: {
                ...(input.dateFrom ? { gte: input.dateFrom } : {}),
                ...(input.dateTo ? { lte: input.dateTo } : {}),
              },
            }
          : {}),
      };

      const [totalMessages, sentMessages, receivedMessages, unreadCount] =
        await Promise.all([
          ctx.db.communicationLog.count({ where }),
          ctx.db.communicationLog.count({
            where: { ...where, senderId: userId },
          }),
          ctx.db.communicationLog.count({
            where: { ...where, receiverId: userId },
          }),
          ctx.db.communicationLog.count({
            where: { ...where, receiverId: userId, isRead: false },
          }),
        ]);

      return {
        totalMessages,
        sentMessages,
        receivedMessages,
        unreadCount,
        averageResponseTime: null, // Would need to calculate this based on message timestamps
      };
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

  // Real-time typing indicator subscription
  onTyping: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .subscription(({ input }) => {
      return observable<TypingIndicator>((emit) => {
        const handler = (typing: TypingIndicator) => {
          if (typing.threadId === input.threadId) {
            emit.next(typing);
          }
        };
        chatEmitter.on("typing", handler);
        return () => chatEmitter.off("typing", handler);
      });
    }),

  // Real-time read receipt subscription
  onReadReceipt: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .subscription(() => {
      return observable<{ userId: string; messageIds: string[] }>((emit) => {
        const handler = (data: { userId: string; messageIds: string[] }) => {
          emit.next(data);
        };
        chatEmitter.on("messagesRead", handler);
        return () => chatEmitter.off("messagesRead", handler);
      });
    }),

  // Real-time reaction subscription
  onReaction: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .subscription(() => {
      return observable<{
        messageId: string;
        reaction: MessageReaction;
        removed: boolean;
      }>((emit) => {
        const handler = (data: {
          messageId: string;
          reaction: MessageReaction;
          removed: boolean;
        }) => {
          emit.next(data);
        };
        chatEmitter.on("messageReaction", handler);
        return () => chatEmitter.off("messageReaction", handler);
      });
    }),
});
