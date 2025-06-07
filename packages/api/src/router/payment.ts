import type { PaymentStatus, Prisma } from "@prisma/client";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreatePaymentSchema,
  PaymentFilterSchema,
  UpdatePaymentSchema,
} from "@acme/validators";

import {
  getPaginationParams,
  paginationInputSchema,
} from "../helpers/pagination";
import { protectedProcedure } from "../trpc";

const paymentInclude = {
  Currency: true,
  Tenant: true,
} as const satisfies Prisma.PaymentInclude;

type PaymentWithIncludes = Prisma.PaymentGetPayload<{
  include: typeof paymentInclude;
}>;

export interface SanitizedPayment {
  id: string;
  tenantId: string;
  amount: number;
  currencyId: string;
  paymentDate: Date;
  dueDate: Date;
  status: PaymentStatus;
  paymentMethod: string | null;
  reference: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  currency: { id: string; code: string; symbol: string } | null;
  tenant: { id: string; name: string } | null;
}

function sanitizePayment(payment: PaymentWithIncludes): SanitizedPayment {
  const { Currency, Tenant, ...rest } = payment;
  return {
    ...rest,
    currency: Currency
      ? {
          id: Currency.id,
          code: Currency.code || "",
          symbol: Currency.symbol || "",
        }
      : null,
    tenant: Tenant
      ? {
          id: Tenant.id,
          name: `${Tenant.firstName || ""} ${Tenant.lastName || ""}`.trim(),
        }
      : null,
  };
}

export const paymentRouter = {
  list: protectedProcedure
    .input(
      z
        .object({
          ...paginationInputSchema.shape,
          ...PaymentFilterSchema.omit({
            page: true,
            pageSize: true,
          }).shape,
        })
        .optional(),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{
        data: SanitizedPayment[];
        page: number;
        limit: number;
        total: number;
        summary: {
          totalPaid: number;
          totalUnpaid: number;
          totalOverdue: number;
        };
      }> => {
        const { skip, take, page, limit } = getPaginationParams(input ?? {});
        const where: Prisma.PaymentWhereInput = {
          ...(input?.tenantId && { tenantId: input.tenantId }),
          ...(input?.currencyId && { currencyId: input.currencyId }),
          ...(input?.status && { status: input.status }),
          ...(input?.paymentMethod && { paymentMethod: input.paymentMethod }),
        };

        const [payments, total] = await Promise.all([
          ctx.db.payment.findMany({
            where,
            orderBy: {
              [input?.sortBy ?? "createdAt"]: input?.sortOrder ?? "desc",
            },
            skip,
            take,
            include: paymentInclude,
          }),
          ctx.db.payment.count({ where }),
        ]);

        // Calculate summary statistics
        const [totalPaid, totalUnpaid, totalOverdue] = await Promise.all([
          ctx.db.payment.aggregate({
            where: { ...where, status: "PAID" },
            _sum: { amount: true },
          }),
          ctx.db.payment.aggregate({
            where: { ...where, status: "UNPAID" },
            _sum: { amount: true },
          }),
          ctx.db.payment.aggregate({
            where: { ...where, status: "OVERDUE" },
            _sum: { amount: true },
          }),
        ]);

        return {
          data: payments.map(sanitizePayment),
          page,
          limit,
          total,
          summary: {
            totalPaid: totalPaid._sum.amount ?? 0,
            totalUnpaid: totalUnpaid._sum.amount ?? 0,
            totalOverdue: totalOverdue._sum.amount ?? 0,
          },
        };
      },
    ),

  byId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }): Promise<SanitizedPayment> => {
      try {
        // console.log(`Fetching payment with ID: ${input}`); // Consider using a proper logger
        const payment = await ctx.db.payment.findUnique({
          where: { id: input },
          include: {
            Currency: true,
            Tenant: true,
          },
        });
        if (!payment) {
          // console.log(`Payment with ID ${input} not found`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found",
          });
        }
        return sanitizePayment(payment);
      } catch (error) {
        // console.error(`Error fetching payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch payment.",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(CreatePaymentSchema)
    .mutation(async ({ ctx, input }): Promise<SanitizedPayment> => {
      try {
        // console.log(`Creating payment with input:`, input);
        const payment = await ctx.db.payment.create({
          data: {
            ...input,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            // Ensure status is set if not part of CreatePaymentSchema, e.g., default to UNPAID
            status: input.status ?? "UNPAID",
          },
          include: paymentInclude,
        });
        return sanitizePayment(payment);
      } catch (error) {
        // console.error(`Error creating payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create payment: ${error.message}`,
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while creating the payment",
        });
      }
    }),

  update: protectedProcedure
    .input(UpdatePaymentSchema)
    .mutation(async ({ ctx, input }): Promise<SanitizedPayment> => {
      const { id, ...data } = input;
      try {
        // console.log(`Updating payment with ID: ${id}`);
        const payment = await ctx.db.payment.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
          include: paymentInclude,
        });
        return sanitizePayment(payment);
      } catch (error) {
        // console.error(`Error updating payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          // console.log(`Payment with ID ${id} not found for update.`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found for update.",
          });
        }
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update payment.",
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }): Promise<SanitizedPayment> => {
      try {
        // console.log(`Deleting payment with ID: ${input}`);
        const payment = await ctx.db.payment.delete({
          where: { id: input },
          include: paymentInclude,
        });
        return sanitizePayment(payment);
      } catch (error) {
        // console.error(`Error deleting payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          // console.log(`Payment with ID ${input} not found or already deleted.`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found or already deleted.",
          });
        }
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete payment.",
          cause: error,
        });
      }
    }),

  markAsPaid: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }): Promise<SanitizedPayment> => {
      try {
        // console.log(`Marking payment as PAID with ID: ${input}`);
        const payment = await ctx.db.payment.update({
          where: { id: input },
          data: {
            status: "PAID",
            updatedAt: new Date(),
          },
          include: paymentInclude,
        });
        return sanitizePayment(payment);
      } catch (error) {
        // console.error(`Error marking payment as PAID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          // console.log(`Payment with ID ${input} not found for markAsPaid.`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found for markAsPaid.",
          });
        }
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mark payment as paid.",
          cause: error,
        });
      }
    }),

  refund: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<SanitizedPayment> => {
      try {
        // console.log(`Refunding payment with ID: ${input.id}`);
        const payment = await ctx.db.payment.update({
          where: { id: input.id },
          data: {
            status: "REFUNDED",
            notes: input.reason,
            updatedAt: new Date(),
          },
          include: paymentInclude,
        });
        return sanitizePayment(payment);
      } catch (error) {
        // console.error(`Error refunding payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          // console.log(`Payment with ID ${input.id} not found for refund.`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found for refund.",
          });
        }
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to refund payment.",
          cause: error,
        });
      }
    }),
} satisfies TRPCRouterRecord;
