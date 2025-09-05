import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
// NOTE: You may need to install 'micro' with: pnpm add micro
import { buffer } from "micro";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // Stripe needs the raw body
  },
};

const prisma = new PrismaClient();

// Initialize Stripe directly here
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let event;
  let buf: Buffer;
  try {
    buf = await buffer(req);
    event = stripe.webhooks.constructEvent(
      buf,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as any;
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: pi.id },
        data: {
          status: "PAID",
          stripeStatus: pi.status,
          updatedAt: new Date(),
        },
      });
    }
    if (event.type === "charge.refunded") {
      const charge = event.data.object as any;
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: charge.payment_intent as string },
        data: {
          status: "REFUNDED",
          stripeStatus: charge.status,
          updatedAt: new Date(),
        },
      });
    }
    // Add more event types as needed
    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook handler failed: ${(err as Error).message}`);
  }
}
