import type { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  CreateTicketSchema,
  TicketFilterSchema,
  UpdateTicketSchema,
} from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const ticketRouter = {
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
        data: input,
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
