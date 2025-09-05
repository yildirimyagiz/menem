import type { PaymentStatus, Prisma } from "@prisma/client";
import {
  CreatePaymentSchema,
  PaymentFilterSchema,
  UpdatePaymentSchema,
} from "@reservatior/validators";
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";

import {
  getPaginationParams,
  paginationInputSchema,
} from "../helpers/pagination";
import { protectedProcedure } from "../trpc";

const paymentInclude = {
  Currency: true,
  Tenant: true,
  Property: true,
  Expense: true,
  Reservation: true,
  Subscription: true,
  CommissionRule: true,
  IncludedService: true,
  ExtraCharge: true,
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
  property: { id: string; title?: string } | null;
  expense: { id: string; type?: string } | null;
  reservation: { id: string; startDate?: Date } | null;
  subscription: { id: string; tier?: string } | null;
  commissionRule: { id: string; ruleType?: string } | null;
  includedService: { id: string; name?: string } | null;
  extraCharge: { id: string; name?: string } | null;
}

function sanitizePayment(payment: PaymentWithIncludes): SanitizedPayment {
  const {
    Currency,
    Tenant,
    Property,
    Expense,
    Reservation,
    Subscription,
    CommissionRule,
    IncludedService,
    ExtraCharge,
    ...rest
  } = payment;
  return {
    ...rest,
    // Currency and Tenant are guaranteed by schema here; avoid unnecessary conditionals
    currency: {
      id: Currency.id,
      code: Currency.code || "",
      symbol: Currency.symbol || "",
    },
    tenant: {
      id: Tenant.id,
      name: `${Tenant.firstName || ""} ${Tenant.lastName || ""}`.trim(),
    },
    property: Property ? { id: Property.id, title: Property.title } : null,
    expense: Expense ? { id: Expense.id, type: Expense.type } : null,
    reservation: Reservation
      ? { id: Reservation.id, startDate: Reservation.startDate }
      : null,
    subscription: Subscription
      ? { id: Subscription.id, tier: Subscription.tier }
      : null,
    commissionRule: CommissionRule
      ? { id: CommissionRule.id, ruleType: CommissionRule.ruleType }
      : null,
    includedService: IncludedService
      ? { id: IncludedService.id, name: IncludedService.name }
      : null,
    extraCharge: ExtraCharge
      ? { id: ExtraCharge.id, name: ExtraCharge.name }
      : null,
  };
}

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-06-30.basil",
});

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
          // Always filter by current user's ID for security, unless explicitly overridden
          tenantId: input?.tenantId ?? ctx.session.user.id,
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
        return sanitizePayment({
          ...payment,
          Property: null,
          Expense: null,
          Reservation: null,
          Subscription: null,
          CommissionRule: null,
          IncludedService: null,
          ExtraCharge: null,
        });
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
            // Ensure tenantId is set from session if not provided
            tenantId: input.tenantId ?? ctx.session.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            // Ensure status is set if not part of CreatePaymentSchema, e.g., default to UNPAID
            status: input.status,
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
      // 1. Find the payment
      const payment = await ctx.db.payment.findUnique({
        where: { id: input.id },
      });
      if (!payment?.stripePaymentIntentId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found or not a Stripe payment",
        });
      }

      // 2. Create Stripe refund
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: payment.stripePaymentIntentId,
      };
      // Only set reason if it matches Stripe's allowed values
      if (
        input.reason === "duplicate" ||
        input.reason === "fraudulent" ||
        input.reason === "requested_by_customer"
      ) {
        refundParams.reason = input.reason as Stripe.RefundCreateParams.Reason;
      }
      await stripe.refunds.create(refundParams);

      // 3. Update DB
      const updated = await ctx.db.payment.update({
        where: { id: input.id },
        data: {
          status: "REFUNDED",
          notes: input.reason,
          updatedAt: new Date(),
        },
        include: paymentInclude,
      });
      return sanitizePayment(updated);
    }),

  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        currency: z.string(),
        paymentMethod: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<{
        paymentIntent: Stripe.PaymentIntent;
        payment: SanitizedPayment;
      }> => {
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(input.amount * 100), // Convert to cents
            currency: input.currency.toLowerCase(),
            payment_method_types: [input.paymentMethod],
            description: input.description,
          });

          // Create a payment record in the database
          const payment = await ctx.db.payment.create({
            data: {
              id: crypto.randomUUID(),
              tenantId: ctx.session.user.id,
              amount: input.amount,
              currencyId: input.currency,
              paymentDate: new Date(),
              dueDate: new Date(),
              status: "PENDING" as PaymentStatus,
              paymentMethod: input.paymentMethod,
              reference: paymentIntent.id,
              stripePaymentIntentId: paymentIntent.id,
              stripeClientSecret: paymentIntent.client_secret,
              stripeStatus: paymentIntent.status,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            include: paymentInclude,
          });

          return {
            paymentIntent,
            payment: sanitizePayment(payment),
          };
        } catch (error) {
          console.error("Error creating payment intent:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create payment intent",
            cause: error,
          });
        }
      },
    ),

  confirmPayment: protectedProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<{
        paymentIntent: Stripe.PaymentIntent;
        payment: SanitizedPayment;
      }> => {
        try {
          const paymentIntent = await stripe.paymentIntents.confirm(
            input.paymentIntentId,
          );

          // Update the payment record in the database
          const payment = await ctx.db.payment.update({
            where: {
              stripePaymentIntentId: input.paymentIntentId,
            },
            data: {
              status: (paymentIntent.status === "succeeded"
                ? "PAID"
                : "PENDING") as PaymentStatus,
              stripeStatus: paymentIntent.status,
              updatedAt: new Date(),
            },
            include: paymentInclude,
          });

          return {
            paymentIntent,
            payment: sanitizePayment(payment),
          };
        } catch (error) {
          console.error("Error confirming payment:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to confirm payment",
            cause: error,
          });
        }
      },
    ),
} as const satisfies TRPCRouterRecord;

export type PaymentRouter = typeof paymentRouter;
