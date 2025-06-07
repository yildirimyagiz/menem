import { randomUUID } from "crypto";
import type {
  Agency,
  Agent,
  Currency,
  Discount,
  PricingRule,
  Prisma,
  Reservation as PrismaReservation,
  Property, // Added Property
  Report,
  User,
} from "@prisma/client";
import { z } from "zod";

import {
  CreateReservationSchema,
  ReservationFilterSchema,
  UpdateReservationSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type ReservationWithIncludes = PrismaReservation & {
  Agency: Agency | null;
  Agent: Agent | null;
  Currency: Currency;
  Discount: Discount | null;

  PricingRule: PricingRule | null;
  Report: Report | null;
  User: User;
};

// Utility to sanitize reservation data
const sanitizeReservation = (reservation: ReservationWithIncludes | null) => {
  if (!reservation) return null;

  return {
    id: reservation.id,

    userId: reservation.userId,
    agentId: reservation.agentId,
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    guests: reservation.guests,
    status: reservation.status,
    totalPrice: reservation.totalPrice,
    currencyId: reservation.currencyId,
    paymentStatus: reservation.paymentStatus,
    specialRequests: reservation.specialRequests,
    checkInTime: reservation.checkInTime,
    checkOutTime: reservation.checkOutTime,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
    deletedAt: reservation.deletedAt,
    pricingRuleId: reservation.pricingRuleId,
    discountId: reservation.discountId,
    agencyId: reservation.agencyId,
    reportId: reservation.reportId,
    Agency: reservation.Agency,
    Agent: reservation.Agent,
    Currency: reservation.Currency,
    Discount: reservation.Discount,
    PricingRule: reservation.PricingRule,
    Report: reservation.Report,
    User: reservation.User,
    Property: reservation.propertyId,
  };
};

export const reservationRouter = createTRPCRouter({
  all: protectedProcedure
    .input(ReservationFilterSchema)
    .query(async ({ ctx, input }) => {
      const paginationInput = {
        page: input.page ?? 1,
        pageSize: input.pageSize ?? 10,
      };
      const { skip, take, page, limit } = getPaginationParams(paginationInput);
      const cacheKey = `reservations:${page}:${limit}`;

      return await withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.ReservationWhereInput = {
          AND: [
            input.userId ? { userId: input.userId } : {},
            input.agentId ? { agentId: input.agentId } : {},
            input.status ? { status: input.status } : {},
            input.startDateFrom
              ? { startDate: { gte: input.startDateFrom } }
              : {},
            input.startDateTo ? { startDate: { lte: input.startDateTo } } : {},
            input.endDateFrom ? { endDate: { gte: input.endDateFrom } } : {},
            input.endDateTo ? { endDate: { lte: input.endDateTo } } : {},
            input.paymentStatus ? { paymentStatus: input.paymentStatus } : {},
            input.currencyId ? { currencyId: input.currencyId } : {},
            input.agencyId ? { agencyId: input.agencyId } : {},
            input.totalPriceFrom
              ? { totalPrice: { gte: input.totalPriceFrom } }
              : {},
            input.totalPriceTo
              ? { totalPrice: { lte: input.totalPriceTo } }
              : {},
          ],
        };

        const orderBy: Prisma.ReservationOrderByWithRelationInput = input.sortBy
          ? {
              [input.sortBy]: input.sortOrder ?? "desc",
            }
          : {
              createdAt: "desc" as const,
            };

        const [reservations, total] = await Promise.all([
          ctx.db.reservation.findMany({
            where,
            orderBy,
            skip,
            take,
            include: {
              Agency: true,
              Agent: true,
              Currency: true,
              Discount: true,

              PricingRule: true,
              Report: true,
              User: true,
            },
          }),
          ctx.db.reservation.count({ where }),
        ]);

        return {
          items: reservations.map(sanitizeReservation),
          pagination: {
            total,
            page,
            limit,
            hasMore: skip + take < total,
          },
        };
      });
    }),
  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const reservation = await ctx.db.reservation.findUnique({
        where: { id: input.id },
        include: {
          Agency: true,
          Agent: true,
          Currency: true,
          Discount: true,

          PricingRule: true,
          Report: true,
          User: true,
        },
      });
      return sanitizeReservation(reservation);
    }),

  create: protectedProcedure
    .input(CreateReservationSchema)
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.db.reservation.create({
        data: {
          id: randomUUID(),
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
          Currency: true,
          Discount: true,
          Property: true,

          PricingRule: true,
          Report: true,
          User: true,
        },
      });

      return sanitizeReservation(reservation);
    }),

  update: protectedProcedure
    .input(UpdateReservationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const reservation = await ctx.db.reservation.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
          Currency: true,
          Discount: true,
          Property: true,
          PricingRule: true,
          Report: true,
          User: true,
        },
      });

      return sanitizeReservation(reservation);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.db.reservation.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
        include: {
          Agency: true,
          Agent: true,
          Currency: true,
          Discount: true,
          Property: true,
          PricingRule: true,
          Report: true,
          User: true,
        },
      });

      return sanitizeReservation(reservation);
    }),
});
