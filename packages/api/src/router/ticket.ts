import type { CommunicationType, Prisma } from "@prisma/client";
import {
  CreateCommunicationSchema,

  CreateTicketSchema,

  TicketFilterSchema,
  UpdateTicketSchema,
} from "@reservatior/validators";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const ticketRouter = {
  // Get tickets for the current user
  myTickets: protectedProcedure
    .input(TicketFilterSchema.optional())
    .query(async (opts) => {
      const { ctx, input } = opts;
      const safeInput = input ?? {};
      const page = typeof safeInput.page === "number" ? safeInput.page : 1;
      const pageSize =
        typeof safeInput.pageSize === "number" ? safeInput.pageSize : 10;
      const sortBy =
        typeof safeInput.sortBy === "string" ? safeInput.sortBy : "createdAt";
      const sortOrder =
        typeof safeInput.sortOrder === "string" ? safeInput.sortOrder : "desc";
      const filters = { ...safeInput };
      delete filters.page;
      delete filters.pageSize;
      delete filters.sortBy;
      delete filters.sortOrder;
      const skip = (page - 1) * pageSize;
      const where = {
        ...filters,
        // Only the current user's tickets
        userId: ctx.session.user.id,
      };
      const [total, tickets] = await Promise.all([
        ctx.db.ticket.count({ where }),
        ctx.db.ticket.findMany({
          where,
          take: pageSize,
          skip,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true,
            cuid: true,
            subject: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            closedAt: true,
            deletedAt: true,
            userId: true,
            agentId: true,
            User: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            Agent: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
      ]);
      return {
        data: tickets,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  // Get ticket by id, including communication logs
  byIdWithLogs: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { ctx, input } = opts;
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          userId: true,
          agentId: true,
          subject: true,
          CommunicationLogs: true,
        },
      });
      if (!ticket) throw new Error("Ticket not found");
      const { id, role } = ctx.session.user as { id: string; role: string };
      // Allow if admin, assigned agent, or owner
      if (
        !isAdmin({ role }) &&
        !isAgent({ role }) &&
        ticket.userId !== id &&
        ticket.agentId !== id
      ) {
        throw new Error("Unauthorized");
      }
      return ticket;
    }),

  // Add a communication log (message/reply) to a ticket
  addCommunicationLog: protectedProcedure
    .input(CreateCommunicationSchema)
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      // Select all fields required by the CommunicationLogSchema and permission checks
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.ticketId },
        select: {
          id: true,
          userId: true,
          agentId: true,
          subject: true,
        },
      });
      if (!ticket) throw new Error("Ticket not found");
      const { id: userId, role } = ctx.session.user as {
        id: string;
        role: string;
      };
      // Allow if admin, assigned agent, or owner
      if (
        role !== "ADMIN" &&
        role !== "AGENT" &&
        ticket.userId !== userId &&
        ticket.agentId !== userId
      ) {
        throw new Error("Unauthorized");
      }
      // Explicitly construct the Prisma input object with only allowed fields
      const prismaLogData: Prisma.CommunicationLogCreateInput = {
        senderId: userId,
        receiverId: input.receiverId,
        type: input.type as CommunicationType,
        content: input.content,
        Ticket: {
          connect: {
            id: input.ticketId,
          },
        },
        replyTo: {
          connect: {
            id: input.replyToId,
          },
        },
        Channel: {
          connect: {
            id: input.channelId,
          },
        },
        metadata:
          input.metadata !== undefined
            ? (input.metadata as unknown as Prisma.InputJsonValue)
            : undefined,
        deliveredAt: input.deliveredAt,
        readAt: input.readAt,
        isRead: input.isRead,
        deletedAt: input.deletedAt,
        timestamp: input.timestamp,
        updatedAt: new Date(),
      };
      const log = await ctx.db.communicationLog.create({
        data: prismaLogData,
      });
      // Create notification for ticket owner and agent (if not the sender)
      if (ticket.userId && ticket.userId !== ctx.session.user.id) {
        await ctx.db.notification.create({
          data: {
            userId: ticket.userId,
            type: "COMMUNICATION_RECEIVED",
            content: `You have a new message on your ticket: ${ticket.subject}`,
            entityId: ticket.id,
            entityType: "Ticket",
          },
        });
      }
      // Optionally notify admins (example: notify all admins except sender)
      // const admins = await ctx.db.user.findMany({ where: { isAdmin: true, id: { not: ctx.session.user.id } } });
      // await Promise.all(admins.map(admin => ctx.db.notification.create({
      //   data: {
      //     userId: admin.id,
      //     type: "COMMUNICATION_RECEIVED",
      //     content: `A new message was posted to ticket: ${ticket.subject}`,
      //     entityId: ticket.id,
      //     entityType: "Ticket",
      //   },
      // })))
      return log;
    }),

  // List notifications for the current user
  myNotifications: protectedProcedure.query(async (opts) => {
    const { ctx } = opts;
    const notifications = await ctx.db.notification.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return notifications;
  }),

  // Mark a notification as read
  markNotificationRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const notification = await ctx.db.notification.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { isRead: true },
      });
      return notification;
    }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { ctx, input } = opts;
      const ticket = await ctx.db.ticket.findUnique({
        where: { id: input.id },
      });
      if (!ticket) throw new Error("Ticket not found");
      return ticket;
    }),

  all: protectedProcedure
    .input(TicketFilterSchema.optional())
    .query(async (opts) => {
      const { ctx, input } = opts;
      const safeInput = input ?? {};
      const page = typeof safeInput.page === "number" ? safeInput.page : 1;
      const pageSize =
        typeof safeInput.pageSize === "number" ? safeInput.pageSize : 10;
      const sortBy =
        typeof safeInput.sortBy === "string" ? safeInput.sortBy : "createdAt";
      const sortOrder =
        typeof safeInput.sortOrder === "string" ? safeInput.sortOrder : "desc";
      const filters = { ...safeInput };
      delete filters.page;
      delete filters.pageSize;
      delete filters.sortBy;
      delete filters.sortOrder;
      const skip = (page - 1) * pageSize;
      const where: Prisma.TicketWhereInput = {
        ...filters,
      };
      const [total, tickets] = await Promise.all([
        ctx.db.ticket.count({ where }),
        ctx.db.ticket.findMany({
          where,
          take: pageSize,
          skip,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true,
            cuid: true,
            subject: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            closedAt: true,
            deletedAt: true,
            userId: true,
            agentId: true,
            User: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            Agent: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
      ]);
      return {
        data: tickets,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  create: protectedProcedure
    .input(CreateTicketSchema)
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const ticket = await ctx.db.ticket.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return ticket;
    }),

  update: protectedProcedure
    .input(UpdateTicketSchema)
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { id, ...rest } = input;
      const ticket = await ctx.db.ticket.update({
        where: { id },
        data: rest,
      });
      return ticket;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.ticket.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
};
function isAdmin(user: { role: string }) {
  return user.role === "ADMIN";
}

function isAgent(user: { role: string }) {
  return user.role === "AGENT";
}
