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
import { mortgageRouter } from "./router/mortgage";
import { notificationRouter } from "./router/notification";
import { offerRouter } from "./router/offer";
import { paymentRouter } from "./router/payment";
import { photoRouter } from "./router/photo";
import { postRouter } from "./router/post";
import { pricingRuleRouter } from "./router/pricingRule";
import { propertyRouter } from "./router/property";
import { providerRouter } from "./router/provider";
import { reportRouter } from "./router/report";
import { reservationRouter } from "./router/reservation";
import { reviewRouter } from "./router/review";
import { sessionRouter } from "./router/session";
import { subscriptionRouter } from "./router/subscription";
import { taskRouter } from "./router/task";
import { tenantRouter } from "./router/tenant";
import { ticketRouter } from "./router/ticket";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  agency: agencyRouter,
  chat: chatRouter,
  channel: channelRouter,
  account: accountRouter,
  pricingRule: pricingRuleRouter,
  dashboard: dashboardRouter,

  task: taskRouter,
  user: userRouter,
  subscription: subscriptionRouter,
  notification: notificationRouter,
  increase: increaseRouter,
  expense: expenseRouter,
  availability: availabilityRouter,
  offer: offerRouter,
  property: propertyRouter,
  tenant: tenantRouter,
  guest: guestRouter,
  reservation: reservationRouter,
  agent: agentRouter,
  hashtag: hashtagRouter,
  communicationLog: chatRouter,
  language: languageRouter,
  photo: photoRouter,
  review: reviewRouter,
  mention: mentionRouter,
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
  provider: providerRouter,
  contract: contractRouter,
});

// export type definition of API

export type AppRouter = typeof appRouter;
