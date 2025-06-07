import type {
  Agency,
  Agent,
  Subscription as PrismaSubscription,
} from "@prisma/client";
import type Stripe from "stripe";
import { Prisma, SubscriptionStatus, SubscriptionTier } from "@prisma/client";
import { TRPCError } from "@trpc/server"; // Added TRPCError

import { z } from "zod";

import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
} from "@acme/validators";

import { getPaginationParams } from "../helpers/pagination";
import { stripe } from "../helpers/stripe";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { SUBSCRIPTION_PACKAGES } from "./subscriptionPackages";

const SubscriptionFilterInputSchema = z
  .object({
    entityId: z.string().optional(),
    entityType: z.string().optional(),
    tier: z.nativeEnum(SubscriptionTier).optional(),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    isAutoRenew: z.boolean().optional(),
    startDateFrom: z.string().datetime().optional(),
    startDateTo: z.string().datetime().optional(),
    endDateFrom: z.string().datetime().optional(),
    endDateTo: z.string().datetime().optional(),
    createdAtFrom: z.string().datetime().optional(),
    createdAtTo: z.string().datetime().optional(),
    updatedAtFrom: z.string().datetime().optional(),
    updatedAtTo: z.string().datetime().optional(),
    deletedAt: z.date().nullable().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
  })
  .strict();

type SubscriptionWithRelations = PrismaSubscription & {
  Agency: Agency | null;
  Agent: Agent | null;
};

// Utility to sanitize subscription data
function sanitizeSubscription(subscription: SubscriptionWithRelations | null) {
  if (!subscription) return null;
  const { Agency, Agent, ...rest } = subscription;
  return {
    ...rest,
    Agency: Agency
      ? {
          id: Agency.id,
          name: Agency.name,
        }
      : null,
    Agent: Agent
      ? {
          id: Agent.id,
          name: Agent.name,
        }
      : null,
  };
}

export const subscriptionRouter = createTRPCRouter({
  // List all available subscription packages
  listPackages: publicProcedure.query(() => SUBSCRIPTION_PACKAGES),
  all: protectedProcedure
    .input(SubscriptionFilterInputSchema)
    .query(async ({ ctx, input }) => {
      const paginationInput = {
        page: input.page ?? 1,
        limit: input.limit ?? 10,
      };
      const { skip, take, page, limit } = getPaginationParams(paginationInput);
      const cacheKey = `subscriptions:${page}:${limit}`;
      return await withCacheAndFormat(cacheKey, async () => {
        const where: Prisma.SubscriptionWhereInput = {
          AND: [
            input.entityId ? { entityId: input.entityId } : {},
            input.entityType ? { entityType: input.entityType } : {},
            input.tier ? { tier: input.tier } : {},
            input.status ? { status: input.status } : {},
            input.isAutoRenew !== undefined
              ? { isAutoRenew: input.isAutoRenew }
              : {},
            input.startDateFrom
              ? {
                  startDate: {
                    gte: new Date(input.startDateFrom),
                    lte: input.startDateTo
                      ? new Date(input.startDateTo)
                      : undefined,
                  },
                }
              : {},
            input.endDateFrom
              ? {
                  endDate: {
                    gte: new Date(input.endDateFrom),
                    lte: input.endDateTo
                      ? new Date(input.endDateTo)
                      : undefined,
                  },
                }
              : {},
            input.createdAtFrom
              ? {
                  createdAt: {
                    gte: new Date(input.createdAtFrom),
                    lte: input.createdAtTo
                      ? new Date(input.createdAtTo)
                      : undefined,
                  },
                }
              : {},
            input.updatedAtFrom
              ? {
                  updatedAt: {
                    gte: new Date(input.updatedAtFrom),
                    lte: input.updatedAtTo
                      ? new Date(input.updatedAtTo)
                      : undefined,
                  },
                }
              : {},
            input.deletedAt !== undefined ? { deletedAt: input.deletedAt } : {},
          ],
        };

        const orderBy: Prisma.SubscriptionOrderByWithRelationInput =
          input.sortBy
            ? {
                [input.sortBy]: input.sortOrder ?? "desc",
              }
            : {
                createdAt: "desc" as const,
              };

        const [subscriptions, total] = await Promise.all([
          ctx.db.subscription.findMany({
            where,
            orderBy,
            skip,
            take,
            include: {
              Agency: true,
              Agent: true,
            },
          }),
          ctx.db.subscription.count({ where }),
        ]);
        return {
          data: subscriptions.map(
            (subscription: SubscriptionWithRelations | null) =>
              sanitizeSubscription(subscription),
          ),
          page,
          pageSize: limit, // Changed limit to pageSize
          total,
        };
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const subscription = await ctx.db.subscription.findFirst({
        where: { id: input.id },
        include: {
          Agency: true,
          Agent: true,
        },
      });
      return sanitizeSubscription(subscription);
    }),

  create: protectedProcedure
    .input(CreateSubscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      const subscription = await ctx.db.subscription.create({
        data: {
          id: crypto.randomUUID(),
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
        },
      });
      return sanitizeSubscription(subscription as SubscriptionWithRelations);
    }),

  update: protectedProcedure
    .input(UpdateSubscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const subscription = await ctx.db.subscription.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          Agency: true,
          Agent: true,
        },
      });
      return sanitizeSubscription(subscription as SubscriptionWithRelations);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const subscription = await ctx.db.subscription.delete({
          where: { id: input },
          include: {
            Agency: true,
            Agent: true,
          },
        });
        return sanitizeSubscription(subscription);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025" // Record to delete not found
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Subscription not found or already deleted.",
          });
        }
        throw error;
      }
    }),
  filter: protectedProcedure
    .input(SubscriptionFilterInputSchema)
    .query(async ({ ctx, input }) => {
      const subscriptions = await ctx.db.subscription.findMany({
        where: input,
        include: {
          Agency: true,
          Agent: true,
        },
      });
      return subscriptions.map((s: SubscriptionWithRelations | null) =>
        sanitizeSubscription(s),
      );
    }),

  createStripeIntent: protectedProcedure
    .input(
      z.object({
        planName: z.string(),
        price: z.number(),
        currency: z.string().default("usd"),
        // You can add more fields as needed
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate user
      const user = (ctx.session as { user?: { id: string } }).user;
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      // Create a Stripe PaymentIntent
      let paymentIntent: Stripe.PaymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(input.price * 100), // Stripe expects amount in cents
          currency: input.currency,
          metadata: {
            planName: input.planName,
            userId: user.id,
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Stripe error: ${error.message}`);
        }
        throw new Error("Unknown Stripe error");
      }
      if (!paymentIntent.client_secret) {
        throw new Error("Failed to create Stripe PaymentIntent");
      }
      return { clientSecret: paymentIntent.client_secret };
    }),
});
