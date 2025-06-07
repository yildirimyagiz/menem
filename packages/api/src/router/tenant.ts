import { randomUUID } from "crypto";
import type {
  Expense,
  Increase,
  Notification,
  Payment,
  PaymentStatus,
  Prisma,
  Tenant,
  User,
} from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  CreateTenantSchema,
  TenantFilterSchema,
  UpdateTenantSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

const tenantIncludes = {
  User: true,
  Property: true,
  Expense: true,
  Increase: true,
  Notification: true,
  Payment: true,
} as const;

// Utility to sanitize tenant data
const sanitizeTenant = (
  tenant:
    | (Tenant & {
        User: User | null;
        Expense: Expense[];
        Increase: Increase[];
        Notification: Notification[];
        Payment: Payment[];
      })
    | null,
) => {
  if (!tenant) return null;
  return {
    id: tenant.id,
    userId: tenant.userId,
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    email: tenant.email,
    phoneNumber: tenant.phoneNumber,

    leaseStartDate: tenant.leaseStartDate,
    leaseEndDate: tenant.leaseEndDate,
    paymentStatus: tenant.paymentStatus,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
    deletedAt: tenant.deletedAt,
    user: tenant.User
      ? {
          id: tenant.User.id,
          email: tenant.User.email,
          firstName: tenant.User.firstName,
          lastName: tenant.User.lastName,
        }
      : null,

    expenses: tenant.Expense,
    increases: tenant.Increase,
    notifications: tenant.Notification,
    payments: tenant.Payment,
  };
};

export const tenantRouter = {
  all: protectedProcedure
    .input(TenantFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});
      const cacheKey = `tenants:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.TenantWhereInput = {
          ...(input?.userId ? { userId: input.userId } : {}),
          ...(input?.email ? { email: input.email } : {}),
          ...(input?.firstName
            ? { firstName: { contains: input.firstName, mode: "insensitive" } }
            : {}),
          ...(input?.lastName
            ? { lastName: { contains: input.lastName, mode: "insensitive" } }
            : {}),
          ...(input?.propertyId ? { propertyId: input.propertyId } : {}),
          ...(input?.leaseStartDateFrom || input?.leaseStartDateTo
            ? {
                leaseStartDate: {
                  ...(input?.leaseStartDateFrom
                    ? { gte: input.leaseStartDateFrom }
                    : {}),
                  ...(input?.leaseStartDateTo
                    ? { lte: input.leaseStartDateTo }
                    : {}),
                },
              }
            : {}),
          ...(input?.leaseEndDateFrom || input?.leaseEndDateTo
            ? {
                leaseEndDate: {
                  ...(input?.leaseEndDateFrom
                    ? { gte: input.leaseEndDateFrom }
                    : {}),
                  ...(input?.leaseEndDateTo
                    ? { lte: input.leaseEndDateTo }
                    : {}),
                },
              }
            : {}),
          ...(input?.paymentStatus
            ? {
                paymentStatus: input.paymentStatus as PaymentStatus,
              }
            : {}),
          deletedAt: null,
        };

        const [tenants, total] = await Promise.all([
          ctx.db.tenant.findMany({
            where,
            include: {
              User: true,

              Expense: true,
              Increase: true,
              Notification: true,
              Payment: true,
            },
            skip,
            take,
            orderBy: { createdAt: "desc" },
          }),
          ctx.db.tenant.count({ where }),
        ]);

        return {
          items: tenants.map(sanitizeTenant),
          total,
          page,
          limit,
          hasMore: skip + take < total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `tenant:${input.id}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const tenant = await ctx.db.tenant.findUnique({
          where: { id: input.id },
          include: {
            User: true,

            Expense: true,
            Increase: true,
            Notification: true,
            Payment: true,
          },
        });
        return sanitizeTenant(tenant);
      });
    }),

  create: protectedProcedure
    .input(CreateTenantSchema)
    .mutation(async ({ ctx, input }) => {
      const tenant = await ctx.db.tenant.create({
        data: {
          id: randomUUID(),
          ...input,
          paymentStatus: input.paymentStatus as PaymentStatus,
          updatedAt: new Date(),
        },
        include: {
          User: true,

          Expense: true,
          Increase: true,
          Notification: true,
          Payment: true,
          Property: true,
        },
      });
      return sanitizeTenant(tenant);
    }),

  update: protectedProcedure
    .input(UpdateTenantSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const tenant = await ctx.db.tenant.update({
        where: { id },
        data: {
          ...updateData,
          paymentStatus: updateData.paymentStatus as PaymentStatus,
        },
        include: {
          User: true,
          Expense: true,
          Increase: true,
          Notification: true,
          Payment: true,
          Property: true,
        },
      });
      return sanitizeTenant(tenant);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = await ctx.db.tenant.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
        include: {
          User: true,

          Expense: true,
          Increase: true,
          Notification: true,
          Payment: true,
        },
      });
      return sanitizeTenant(tenant);
    }),
} satisfies TRPCRouterRecord;
