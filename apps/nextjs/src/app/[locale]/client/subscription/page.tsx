"use client";

import type { SubscriptionTier as SubscriptionTierType } from "@prisma/client";
import type { FC } from "react";
import React, { memo } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Subscription } from "@acme/db";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonSecondary from "~/shared/ButtonSecondary";
import { api } from "~/trpc/react";

// Translation keys for subscription page
const SUBSCRIPTION_KEYS = {
  // Page content
  pageTitle: "subscription.pageTitle",
  pageSubtitle: "subscription.pageSubtitle",
  popularBadge: "subscription.popularBadge",
  submitButton: "subscription.submitButton",
  perMonth: "subscription.perMonth",

  // Toast messages
  toast: {
    success: "subscription.toast.success",
    error: "subscription.toast.error",
  },

  // Plan features
  features: {
    automatedReporting: "subscription.features.automatedReporting",
    fasterProcessing: "subscription.features.fasterProcessing",
    customizations: "subscription.features.customizations",
    everythingInStarter: "subscription.features.everythingInStarter",
    builds: "subscription.features.builds",
    progressReports: "subscription.features.progressReports",
    premiumSupport: "subscription.features.premiumSupport",
    unlimitedBuilds: "subscription.features.unlimitedBuilds",
    advancedAnalytics: "subscription.features.advancedAnalytics",
    companyEvaluations: "subscription.features.companyEvaluations",
  },

  // Plan names and descriptions
  plans: {
    starter: {
      name: "subscription.plans.starter.name",
      desc: "subscription.plans.starter.desc",
    },
    basic: {
      name: "subscription.plans.basic.name",
      desc: "subscription.plans.basic.desc",
    },
    plus: {
      name: "subscription.plans.plus.name",
      desc: "subscription.plans.plus.desc",
    },
  },
};

export interface PageSubcriptionProps {
  onSubscriptionCreate: (subscription: Subscription) => void; // Callback to handle subscription creation
}

export interface PricingItem {
  isPopular: boolean;
  name: string;
  pricing: string;
  desc: string;
  per: string;
  features: string[];
  isLoading: boolean;
}

const pricings: PricingItem[] = [
  {
    isPopular: false,
    name: "Starter",
    pricing: "$5",
    per: "/mo",
    features: ["Automated Reporting", "Faster Processing", "Customizations"],
    desc: "Literally you probably haven't heard of them jean shorts.",
    isLoading: false,
  },
  {
    isPopular: true,
    name: "Basic",
    pricing: "$15",
    per: "/mo",
    features: [
      "Everything in Starter",
      "100 Builds",
      "Progress Reports",
      "Premium Support",
    ],
    desc: "Literally you probably haven't heard of them jean shorts.",
    isLoading: false,
  },
  {
    isPopular: false,
    name: "Plus",
    pricing: "$25",
    per: "/mo",
    features: [
      "Everything in Basic",
      "Unlimited Builds",
      "Advanced Analytics",
      "Company Evaluations",
    ],
    desc: "Literally you probably haven't heard of them jean shorts.",
    isLoading: false,
  },
];

const PageSubcription: FC<PageSubcriptionProps> = ({
  onSubscriptionCreate,
}) => {
  const t = useTranslations("subscription");

  const createSubscriptionMutation = api.subscription.create.useMutation({
    onSuccess: (data) => {
      toast.success(t(SUBSCRIPTION_KEYS.toast.success));
      onSubscriptionCreate(data as unknown as Subscription);
    },
    onError: (error: { message: any }) => {
      toast.error(`${t(SUBSCRIPTION_KEYS.toast.error)}: ${error.message}`);
    },
  });

  const handleSubscriptionCreation = (pricing: PricingItem) => {
    const newSubscription = {
      entityId: crypto.randomUUID(), // Generate a unique ID for the entity
      entityType: "USER", // Assuming this is for user subscription
      tier: pricing.name.toUpperCase() as SubscriptionTierType,
      status: "ACTIVE" as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      features: pricing.features,
      isAutoRenew: true,
      userId: "currentUserId", // TODO: Replace with actual user ID from auth context
    };

    createSubscriptionMutation.mutate(newSubscription);
  };

  const RenderPricingItem = memo(({ pricing }: { pricing: PricingItem }) => {
    RenderPricingItem.displayName = "RenderPricingItem";
    const { isPopular, name, pricing: price, features, desc } = pricing;

    return (
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border-2 px-6 py-8 ${
          isPopular
            ? "border-primary-500"
            : "border-neutral-100 dark:border-neutral-700"
        }`}
      >
        {isPopular && (
          <span className="bg-primary-500 absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs tracking-widest text-white">
            {t(SUBSCRIPTION_KEYS.popularBadge)}
          </span>
        )}
        <div className="mb-8">
          <h3 className="text-neutral-6000 mb-2 block text-sm font-medium uppercase tracking-widest dark:text-neutral-300">
            {t(
              SUBSCRIPTION_KEYS.plans[
                name.toLowerCase() as keyof typeof SUBSCRIPTION_KEYS.plans
              ].name,
            )}
          </h3>
          <h2 className="flex items-center text-5xl leading-none text-neutral-900 dark:text-neutral-300">
            <span>{price}</span>
            <span className="ml-1 text-lg font-normal text-neutral-500">
              {t(SUBSCRIPTION_KEYS.perMonth)}
            </span>
          </h2>
        </div>
        <nav className="mb-8 space-y-4">
          {features.map((item, index) => (
            <li className="flex items-center" key={index}>
              <span className="text-primary-6000 mr-4 inline-flex flex-shrink-0">
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-neutral-700 dark:text-neutral-300">
                {item}
              </span>
            </li>
          ))}
        </nav>
        <div className="mt-auto flex flex-col">
          {isPopular ? (
            <ButtonPrimary
              type="button"
              onClick={() => handleSubscriptionCreation(pricing)}
              className="button-primary"
              loading={createSubscriptionMutation.isPending}
              aria-label={t("subscription.ariaLabel.subscribe", { plan: name })}
            >
              {t(SUBSCRIPTION_KEYS.submitButton)}
            </ButtonPrimary>
          ) : (
            <ButtonSecondary
              type="button"
              onClick={() => handleSubscriptionCreation(pricing)}
              className="button-secondary"
              loading={createSubscriptionMutation.isPending}
              aria-label={t("subscription.ariaLabel.subscribe", { plan: name })}
            >
              <span className="font-medium">
                {t(SUBSCRIPTION_KEYS.submitButton)}
              </span>
            </ButtonSecondary>
          )}
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            {desc}
          </p>
        </div>
      </div>
    );
  });

  return (
    <div className="nc-PageSubcription container pb-24 lg:pb-32">
      <header className="mx-auto my-20 max-w-2xl text-center">
        <h2 className="flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          <span className="mr-4 text-3xl leading-none md:text-4xl">💎</span>
          {t(SUBSCRIPTION_KEYS.pageTitle)}
        </h2>
        <span className="mt-2 block text-sm text-neutral-700 dark:text-neutral-200 sm:text-base">
          {t(SUBSCRIPTION_KEYS.pageSubtitle)}
        </span>
      </header>
      <section className="overflow-hidden text-sm text-neutral-600 md:text-base">
        <div className="grid gap-5 lg:grid-cols-3 xl:gap-8">
          {pricings.map((pricing, index) => (
            <RenderPricingItem key={index} pricing={pricing} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PageSubcription;
