import type { SubscriptionTierEnum } from "@reservatior/validators";
import { z } from "zod";
import { withCacheAndFormat } from "../helpers/withCacheAndFormat";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export interface SubscriptionPackage {
  tier: typeof SubscriptionTierEnum._type;
  name: string;
  price: number;
  currency: string;
  features: string[];
  description?: string;
  maxUsers?: number;
  maxProperties?: number;
  maxStorageGB?: number;
  customBranding?: boolean;
  prioritySupport?: boolean;
}

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    tier: "BASIC",
    name: "Basic",
    price: 0,
    currency: "USD",
    features: [
      "Access to core platform features",
      "Standard analytics dashboard",
      "Email support",
      "Up to 5 properties",
      "Basic reporting",
    ],
    description: "Perfect for individuals and small teams getting started.",
    maxUsers: 1,
    maxProperties: 5,
    maxStorageGB: 1,
    customBranding: false,
    prioritySupport: false,
  },
  {
    tier: "PRO",
    name: "Pro",
    price: 29,
    currency: "USD",
    features: [
      "Everything in Basic",
      "Advanced analytics & reporting",
      "Priority email support",
      "Team collaboration tools",
      "Up to 50 properties",
      "Advanced integrations",
    ],
    description: "Ideal for growing businesses that need more insights and support.",
    maxUsers: 5,
    maxProperties: 50,
    maxStorageGB: 10,
    customBranding: false,
    prioritySupport: true,
  },
  {
    tier: "ENTERPRISE",
    name: "Enterprise",
    price: 99,
    currency: "USD",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 premium support",
      "Unlimited properties",
      "Custom branding",
      "Advanced security features",
    ],
    description: "Best for large organizations with custom needs and dedicated support.",
    maxUsers: -1, // Unlimited
    maxProperties: -1, // Unlimited
    maxStorageGB: 100,
    customBranding: true,
    prioritySupport: true,
  },
];

export const subscriptionPackagesRouter = createTRPCRouter({
  // Get all available packages
  getAll: protectedProcedure.query(() => {
    return withCacheAndFormat("subscription-packages:all", () => {
      return Promise.resolve(SUBSCRIPTION_PACKAGES);
    });
  }),

  // Get package by tier
  getByTier: protectedProcedure
    .input(z.object({ tier: z.enum(["BASIC", "PRO", "ENTERPRISE"]) }))
    .query(({ input }) => {
      return withCacheAndFormat(`subscription-packages:tier:${input.tier}`, () => {
        return Promise.resolve(SUBSCRIPTION_PACKAGES.find(pkg => pkg.tier === input.tier));
      });
    }),

  // Get current user's subscription
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    return await withCacheAndFormat(`subscription:user:${ctx.session.user.id}`, async () => {
      const subscription = await ctx.db.subscription.findFirst({
        where: {
          userId: ctx.session.user.id,
          status: "ACTIVE",
        },
        include: {
          User: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (!subscription) {
        return {
          tier: "BASIC",
          status: "ACTIVE",
          isTrial: false,
          features: SUBSCRIPTION_PACKAGES[0]?.features ?? [],
        };
      }

      const packageInfo = SUBSCRIPTION_PACKAGES.find(pkg => pkg.tier === subscription.tier);
      
      return {
        tier: subscription.tier,
        status: subscription.status,
        isTrial: false,
        features: packageInfo?.features ?? [],
        packageInfo,
      };
    });
  }),

  // Check if user can upgrade/downgrade
  checkUpgradeEligibility: protectedProcedure
    .input(z.object({ targetTier: z.enum(["BASIC", "PRO", "ENTERPRISE"]) }))
    .query(async ({ ctx, input }) => {
      const targetPackage = SUBSCRIPTION_PACKAGES.find(pkg => pkg.tier === input.targetTier);

      if (!targetPackage) {
        throw new Error("Invalid subscription tier");
      }

      // Check usage limits
      const [userCount, propertyCount] = await Promise.all([
        ctx.db.user.count({ where: { agencyId: ctx.session.user.agencyId } }),
        ctx.db.property.count({ where: { ownerId: ctx.session.user.id } }),
      ]);

      const canUpgrade = {
        allowed: true,
        reasons: [] as string[],
        currentUsage: {
          users: userCount,
          properties: propertyCount,
        },
        limits: {
          maxUsers: targetPackage.maxUsers ?? -1,
          maxProperties: targetPackage.maxProperties ?? -1,
        },
      };

      // Check user limit
      if (targetPackage.maxUsers !== -1 && userCount > (targetPackage.maxUsers ?? 0)) {
        canUpgrade.allowed = false;
        canUpgrade.reasons.push(`User limit exceeded: ${userCount}/${targetPackage.maxUsers}`);
      }

      // Check property limit
      if (targetPackage.maxProperties !== -1 && propertyCount > (targetPackage.maxProperties ?? 0)) {
        canUpgrade.allowed = false;
        canUpgrade.reasons.push(`Property limit exceeded: ${propertyCount}/${targetPackage.maxProperties}`);
      }

      return canUpgrade;
    }),

  // Get usage statistics
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    const [userCount, propertyCount, taskCount, paymentCount] = await Promise.all([
      ctx.db.user.count({ where: { agencyId: ctx.session.user.agencyId } }),
      ctx.db.property.count({ where: { ownerId: ctx.session.user.id } }),
      ctx.db.task.count({ where: { createdById: ctx.session.user.id } }),
      ctx.db.payment.count({ 
        where: { 
          Tenant: { userId: ctx.session.user.id },
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        } 
      }),
    ]);

    return {
      users: userCount,
      properties: propertyCount,
      tasks: taskCount,
      monthlyPayments: paymentCount,
      timestamp: new Date().toISOString(),
    };
  }),
});
