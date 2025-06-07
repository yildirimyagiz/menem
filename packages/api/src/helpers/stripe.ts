import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
// You should set STRIPE_SECRET_KEY in your environment variables
// and ensure this file is not exposed to the client.

// IMPORTANT: Use only STRIPE_SECRET_KEY for backend Stripe usage. Never use NEXT_PUBLIC_STRIPE_SECRET_KEY here.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});
