import type { Expense as PrismaExpense } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreateExpenseSchema,
  ExpenseFilterSchema,
  UpdateExpenseSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { protectedProcedure } from "../trpc";

type ExpenseWithRelations = PrismaExpense & {
  Property?: { id: string; title: string } | null;
  Tenant?: { id: string; firstName: string; lastName: string } | null;
  Agency?: { id: string; name: string } | null;
  Currency: { id: string; code: string; symbol: string };
};

// Utility to sanitize expense data
function sanitizeExpense(expense: ExpenseWithRelations | null) {
  if (!expense) return null;
  const { Property, Tenant, Currency, ...rest } = expense;
  return {
    ...rest,
    property: Property
      ? {
          id: Property.id,
          title: Property.title,
        }
      : null,
    tenant: Tenant
      ? {
          id: Tenant.id,
          name: `${Tenant.firstName} ${Tenant.lastName}`,
        }
      : null,
    listing: Property
      ? {
          id: Property.id,
          title: Property.title,
        }
      : null,

    currency: {
      id: Currency.id,
      code: Currency.code,
      symbol: Currency.symbol,
    },
  };
}

export const expenseRouter = {
  all: protectedProcedure
    .input(ExpenseFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const { skip, take, page, limit } = getPaginationParams(input ?? {});

      const {
        propertyId,
        tenantId,
        agencyId,
        type,
        status,
        sortBy,
        sortOrder,
      } = input ?? {};

      const cacheKeyParts: string[] = [`page=${page}`, `limit=${limit}`];
      if (propertyId !== undefined)
        cacheKeyParts.push(`propertyId=${propertyId}`);
      if (tenantId !== undefined) cacheKeyParts.push(`tenantId=${tenantId}`);
      if (agencyId !== undefined) cacheKeyParts.push(`agencyId=${agencyId}`);
      if (type !== undefined) cacheKeyParts.push(`type=${type}`);
      if (status !== undefined) cacheKeyParts.push(`status=${status}`);
      if (sortBy !== undefined) cacheKeyParts.push(`sortBy=${sortBy}`);
      if (sortOrder !== undefined) cacheKeyParts.push(`sortOrder=${sortOrder}`);

      const dynamicCacheKeyPart = cacheKeyParts.sort().join(":");
      const cacheKey = `expenses:${dynamicCacheKeyPart}`;

      // Using withCacheAndFormat helper
      return withCacheAndFormat(cacheKey, async () => {
        const where = {
          propertyId: input?.propertyId,
          tenantId: input?.tenantId,

          agencyId: input?.agencyId,
          type: input?.type,
          status: input?.status,
          deletedAt: null, // Assuming soft delete, filter out deleted records
        };

        const [expenses, total] = await Promise.all([
          ctx.db.expense.findMany({
            where,
            orderBy: input?.sortBy
              ? { [input.sortBy]: input.sortOrder ?? "asc" }
              : { createdAt: "desc" },
            skip,
            take,
            include: {
              Property: true,
              Tenant: true,
              Agency: true,
              Currency: true,
            },
          }),
          ctx.db.expense.count({ where }),
        ]);
        return {
          data: expenses.map((expense) => sanitizeExpense(expense)),
          page,
          limit,
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const expense = await ctx.db.expense.findFirst({
        where: { id: input.id },
        include: {
          Property: true,
          Tenant: true,
          Agency: true,
          Currency: true,
        },
      });
      if (!expense) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Expense not found.",
        });
      }
      return sanitizeExpense(expense);
    }),

  create: protectedProcedure
    .input(CreateExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const expense = await ctx.db.expense.create({
          data: {
            id: crypto.randomUUID(),
            ...input,
            updatedAt: new Date(),
          },
          include: {
            Property: true,
            Tenant: true,
            Agency: true,
            Currency: true,
          },
        });
        return sanitizeExpense(expense);
      } catch (err: unknown) {
        const originalError =
          err instanceof Error ? err : new Error(String(err));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create expense: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  update: protectedProcedure
    .input(UpdateExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;
        const expense = await ctx.db.expense.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          include: {
            Property: true,
            Tenant: true,
            Agency: true,
            Currency: true,
          },
        });
        return sanitizeExpense(expense);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Expense not found.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update expense: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming soft delete by setting deletedAt
        const expense = await ctx.db.expense.update({
          where: { id: input },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            Property: true,
            Tenant: true,
            Agency: true,
            Currency: true,
          },
        });
        // If hard delete was intended:
        // const expense = await ctx.db.expense.delete({ where: { id: input } });
        return sanitizeExpense(expense);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025" // Prisma error: "Record to update/delete not found."
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Expense not found or already deleted.",
          });
        }
        const originalError =
          error instanceof Error ? error : new Error(String(error));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete expense: ${originalError.message}`,
          cause: originalError,
        });
      }
    }),
} satisfies TRPCRouterRecord;
