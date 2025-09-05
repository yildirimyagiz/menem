import type { SubscriptionTierEnum } from "../schemas/subscription";

export interface SubscriptionPackage {
  tier: typeof SubscriptionTierEnum._type;
  name: string;
  price: number;
  currency: string;
  features: string[];
  description?: string;
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
    ],
    description: "Perfect for individuals and small teams getting started.",
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
    ],
    description:
      "Ideal for growing businesses that need more insights and support.",
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
    ],
    description:
      "Best for large organizations with custom needs and dedicated support.",
  },
];
