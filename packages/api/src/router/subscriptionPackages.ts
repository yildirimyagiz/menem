import type { SubscriptionTierEnum } from "@acme/validators";

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
    features: ["Essential features", "Email support"],
    description: "Free basic plan for individuals and small teams.",
  },
  {
    tier: "PRO",
    name: "Pro",
    price: 29,
    currency: "USD",
    features: ["All Basic features", "Advanced analytics", "Priority support"],
    description: "Professional plan for growing businesses.",
  },
  {
    tier: "ENTERPRISE",
    name: "Enterprise",
    price: 99,
    currency: "USD",
    features: ["All Pro features", "Custom integrations", "Dedicated support"],
    description: "Best for large organizations with custom needs.",
  },
];
