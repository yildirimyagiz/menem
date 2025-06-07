import { PaymentStatus, TaskStatus } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  getSummaryStatistics: protectedProcedure.query(async ({ ctx }) => {
    const [properties, tasks, tenants, payments] = await Promise.all([
      // Get total properties and occupancy rate
      ctx.db.property.findMany({
        where: {
          ownerId: ctx.session.user.id,
          isActive: true,
        },
        include: {
          Tenant: true,
        },
      }),
      // Get pending tasks
      ctx.db.task.findMany({
        where: {
          createdById: ctx.session.user.id,
          status: TaskStatus.TODO,
        },
      }),
      // Get total tenants and new tenants this month
      ctx.db.tenant.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: { createdAt: "desc" },
      }),
      // Get monthly payments
      ctx.db.payment.findMany({
        where: {
          Tenant: {
            userId: ctx.session.user.id,
          },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(
      (p) => p.Tenant.length > 0,
    ).length;
    const occupancyRate =
      totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;

    const monthlyCashflow = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    const pendingPayments = payments.filter(
      (p) => p.status === PaymentStatus.UNPAID,
    ).length;

    const totalTenants = tenants.length;
    const newTenantsThisMonth = tenants.filter(
      (t) =>
        t.createdAt >=
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ).length;

    return {
      totalProperties,
      occupancyRate,
      monthlyCashflow,
      pendingPayments,
      pendingTasks: tasks.length,
      totalTenants,
      newTenantsThisMonth,
    };
  }),

  getUpcomingEvents: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(4),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [events, reservations, tasks] = await Promise.all([
        // Get upcoming events
        ctx.db.event.findMany({
          where: {
            createdById: ctx.session.user.id,
            scheduledAt: {
              gte: new Date(),
            },
            isActive: true,
          },
          orderBy: { scheduledAt: "asc" },
          take: input.limit,
        }),
        // Get upcoming reservations
        ctx.db.reservation.findMany({
          where: {
            userId: ctx.session.user.id,
            startDate: {
              gte: new Date(),
            },
          },
          orderBy: { startDate: "asc" },
          take: input.limit,
          include: {
            Property: true,
          },
        }),
        // Get upcoming tasks
        ctx.db.task.findMany({
          where: {
            createdById: ctx.session.user.id,
            dueDate: {
              gte: new Date(),
            },
          },
          orderBy: { dueDate: "asc" },
          take: input.limit,
        }),
      ]);

      // Combine and sort all events
      const allEvents = [
        ...events.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.scheduledAt,
          type: "event" as const,
          detailsLink: `/events/${event.id}`,
        })),
        ...reservations.map((reservation) => ({
          id: reservation.id,
          title: `Reservation - ${reservation.Property?.title || "Property"}`,
          date: reservation.startDate,
          type: "reservation" as const,
          detailsLink: `/reservations/${reservation.id}`,
        })),
        ...tasks.map((task) => ({
          id: task.id,
          title: task.title,
          date: task.dueDate,
          type: "task" as const,
          detailsLink: `/tasks/${task.id}`,
        })),
      ].sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));

      return allEvents.slice(0, input.limit);
    }),
});
