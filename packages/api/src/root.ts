import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { accountRouter } from "./router/account";
import { agencyRouter } from "./router/agency";
import { agentRouter } from "./router/agent";
import { analyticsRouter } from "./router/analytics";
import { authRouter } from "./router/auth";
import { availabilityRouter } from "./router/availability";

import { channelRouter } from "./router/channel";
import { chatRouter } from "./router/chat";
import { commissionRuleRouter } from "./router/commissionRule";
import { complianceRecordRouter } from "./router/complianceRecord";
import { contractRouter } from "./router/contract";
import { currencyRouter } from "./router/currency";
import { dashboardRouter } from "./router/dashboard";
import { discountRouter } from "./router/discount";
import { eventRouter } from "./router/event";
import { expenseRouter } from "./router/expense";
import { extraChargeRouter } from "./router/extraCharge";
import { facilityRouter } from "./router/facility";
import { favoriteRouter } from "./router/favorite";
import { guestRouter } from "./router/guest";
import { hashtagRouter } from "./router/hashtag";
import { includedServiceRouter } from "./router/includedService";
import { increaseRouter } from "./router/increase";
import { languageRouter } from "./router/language";
import { locationRouter } from "./router/location";
import { mentionRouter } from "./router/mention";
import { mlConfigRouter } from "./router/mlConfig";
import { mortgageRouter } from "./router/mortgage";
import { notificationRouter } from "./router/notification";
import { offerRouter } from "./router/offer";
import { paymentRouter } from "./router/payment";
import { photoRouter } from "./router/photo";
import { postRouter } from "./router/post";
import { pricingRuleRouter } from "./router/pricingRule";
import { propertyRouter, publicPropertyRouter } from "./router/property";
import { providerRouter } from "./router/provider";
import { reportRouter } from "./router/report";
import { reservationRouter } from "./router/reservation";
import { reviewRouter } from "./router/review";
import { searchRouter } from "./router/search";
import { sessionRouter } from "./router/session";
import { subscriptionRouter } from "./router/subscription";
import { subscriptionPackagesRouter } from "./router/subscriptionPackages";
import { taskRouter } from "./router/task";
import { taxAnalyticsRouter } from "./router/taxAnalytics";
import { taxRecordRouter } from "./router/taxRecord";
import { tenantRouter } from "./router/tenant";
import { ticketRouter } from "./router/ticket";
import { userRouter } from "./router/user";
import { createTRPCRouter, publicProcedure } from "./trpc";

/**
 * Database status check router
 */
const dbStatusRouter = createTRPCRouter({
  dbStatus: publicProcedure.query(async () => {
    try {
      const { db } = await import("@reservatior/db");
      await db.$connect();
      return { status: "Connected to the database" };
    } catch (error) {
      throw new Error(
        `Failed to connect to the database: ${(error as Error).message}`,
      );
    } finally {
      const { db } = await import("@reservatior/db");
      await db.$disconnect();
    }
  }),
  
  health: publicProcedure.query(async () => {
    const startTime = Date.now();
    const checks = {
      database: false,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    try {
      const { db } = await import("@reservatior/db");
      await db.$connect();
      checks.database = true;
      await db.$disconnect();
    } catch {
      checks.database = false;
    }

    const responseTime = Date.now() - startTime;
    
    return {
      status: checks.database ? "healthy" : "unhealthy",
      checks,
      responseTime: `${responseTime}ms`,
      version: "1.0.0",
    };
  }),

  metrics: publicProcedure.query(async () => {
    const { db } = await import("@reservatior/db");
    
    try {
      // Get basic metrics
      const [userCount, propertyCount, taskCount] = await Promise.all([
        db.user.count(),
        db.property.count(),
        db.task.count(),
      ]);

      return {
        users: userCount,
        properties: propertyCount,
        tasks: taskCount,
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      };
    } catch (error) {
      throw new Error(`Failed to get metrics: ${(error as Error).message}`);
    }
  }),
});

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
// (not exported)
const router = {
  auth: authRouter,
  post: postRouter,
  agency: agencyRouter,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  chat: chatRouter,
  channel: channelRouter,
  account: accountRouter,
  pricingRule: pricingRuleRouter,
  dashboard: dashboardRouter,

  user: userRouter,
  subscription: subscriptionRouter,
  subscriptionPackages: subscriptionPackagesRouter,
  search: searchRouter,
  notification: notificationRouter,
  increase: increaseRouter,
  expense: expenseRouter,
  availability: availabilityRouter,
  offer: offerRouter,
  property: propertyRouter,
  publicProperty: publicPropertyRouter,
  tenant: tenantRouter,
  guest: guestRouter,
  reservation: reservationRouter,
  agent: agentRouter,
  hashtag: hashtagRouter,
  task: taskRouter,

  language: languageRouter,
  photo: photoRouter,
  review: reviewRouter,
  mention: mentionRouter,
  mlConfig: mlConfigRouter,
  currency: currencyRouter,
  discount: discountRouter,
  complianceRecord: complianceRecordRouter,
  report: reportRouter,
  includedService: includedServiceRouter,
  session: sessionRouter,
  payment: paymentRouter,
  facility: facilityRouter,
  extraCharge: extraChargeRouter,
  ticket: ticketRouter,
  event: eventRouter,
  mortgage: mortgageRouter,
  location: locationRouter,
  favorite: favoriteRouter,
  analytics: analyticsRouter,
  commissionRule: commissionRuleRouter,
  providerService: providerRouter,
  contract: contractRouter,
  taxRecord: taxRecordRouter,
  taxAnalytics: taxAnalyticsRouter,
  dbStatus: dbStatusRouter,
} as const;

// FINAL ESCAPE HATCH: Type as 'any' to bypass TS2742/TS4023 errors. This is safe for app-only usage; type inference is still available via AppRouter type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appRouter = createTRPCRouter(router as any);

// export type definition of API
// IMPORTANT: Use the compile-time router shape for the AppRouter type so that
// all router keys (e.g., publicProperty) are preserved even if appRouter is
// constructed with a looser type (e.g., via `as any`). This avoids client-side
// type issues where certain subrouters appear missing on the `api` object.
export type AppRouter = typeof router;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
