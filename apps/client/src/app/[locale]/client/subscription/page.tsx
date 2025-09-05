"use client";

import type { FC } from "react";
import React, { memo, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Edit,
  Eye,
  Plus,
  RefreshCw,
  Settings,
  Star,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { SubscriptionPackage } from "@reservatior/validators";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonSecondary from "~/shared/ButtonSecondary";
import { api } from "~/trpc/react";

// Type definition for Subscription
interface Subscription {
  id: string;
  tier: string;
  status: string;
  startDate: Date | string;
  endDate: Date | string;
  isAutoRenew: boolean;
}

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

const PageSubscription: FC<PageSubcriptionProps> = ({
  onSubscriptionCreate,
}) => {
  const t = useTranslations("subscription");
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Fetch user's subscriptions
  const {
    data: subscriptionsResponse,
    isLoading: subscriptionsLoading,
    refetch: refetchSubscriptions,
  } = api.subscription.all.useQuery({
    page: 1,
    pageSize: 50,
  });

  // Fetch available subscription packages
  const { data: subscriptionPackages, isLoading: packagesLoading } =
    api.subscription.listPackages.useQuery();

  // Create subscription mutation
  const createSubscriptionMutation = api.subscription.create.useMutation({
    onSuccess: () => {
      toast.success("Subscription created successfully!");
      refetchSubscriptions();
      setShowUpgradeModal(false);
    },
    onError: (error) => {
      toast.error(`Failed to create subscription: ${error.message}`);
    },
  });

  // Update subscription mutation
  const updateSubscriptionMutation = api.subscription.update.useMutation({
    onSuccess: () => {
      toast.success("Subscription updated successfully!");
      refetchSubscriptions();
    },
    onError: (error) => {
      toast.error(`Failed to update subscription: ${error.message}`);
    },
  });

  // Delete subscription mutation
  const deleteSubscriptionMutation = api.subscription.delete.useMutation({
    onSuccess: () => {
      toast.success("Subscription cancelled successfully!");
      refetchSubscriptions();
    },
    onError: (error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    },
  });

  const subscriptions = Array.isArray((subscriptionsResponse as any)?.data)
    ? (subscriptionsResponse as any).data
    : [];

  const packages = subscriptionPackages || [];

  // Get current active subscription
  const currentSubscription =
    (Array.isArray(subscriptions)
      ? subscriptions.find(
          (sub: Subscription) =>
            sub?.status === "ACTIVE" || sub?.status === "INACTIVE",
        )
      : null) || null; // Ensure we always return null if no subscription found

  // Subscription status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "INACTIVE":
        return <Badge className="bg-blue-100 text-blue-800">Inactive</Badge>;
      case "EXPIRED":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "SUSPENDED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Subscription tier badge
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "BASIC":
        return <Badge className="bg-gray-100 text-gray-800">Basic</Badge>;
      case "PRO":
        return <Badge className="bg-blue-100 text-blue-800">Pro</Badge>;
      case "ENTERPRISE":
        return (
          <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{tier}</Badge>;
    }
  };

  // Get subscription package info
  const getSubscriptionPackage = (tier: string) => {
    return packages.find((pkg: SubscriptionPackage) => pkg.tier === tier);
  };

  const handleUpgrade = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setShowUpgradeModal(true);
  };

  // Convert PricingItem to SubscriptionPackage
  const convertPricingToSubscription = (
    pricing: PricingItem,
  ): SubscriptionPackage => {
    return {
      tier: pricing.name.toUpperCase() as any,
      name: pricing.name,
      price: parseFloat(pricing.pricing.replace(/[^0-9.]/g, "")),
      currency: "USD",
      features: pricing.features,
      description: pricing.desc,
    };
  };

  const handleCreateSubscription = () => {
    if (!selectedPackage) return;

    createSubscriptionMutation.mutate({
      entityId: "current-user-id", // This should come from auth context
      entityType: "USER",
      tier: selectedPackage.tier as any,
      status: "ACTIVE" as any,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      features: selectedPackage.features,
      isAutoRenew: true,
    });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    if (confirm("Are you sure you want to cancel this subscription?")) {
      deleteSubscriptionMutation.mutate(subscriptionId);
    }
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
        <div className="mb-8 space-y-4">
          <ul className="space-y-4">
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
          </ul>
        </div>
        <div className="mt-auto flex flex-col">
          {isPopular ? (
            <ButtonPrimary
              type="button"
              onClick={() =>
                handleUpgrade(convertPricingToSubscription(pricing))
              }
              className="button-primary"
              loading={createSubscriptionMutation.isPending}
              aria-label={t("subscription.ariaLabel.subscribe", { plan: name })}
            >
              {t(SUBSCRIPTION_KEYS.submitButton)}
            </ButtonPrimary>
          ) : (
            <ButtonSecondary
              type="button"
              onClick={() =>
                handleUpgrade(convertPricingToSubscription(pricing))
              }
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

  if (subscriptionsLoading || packagesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="ml-3">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950">
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subscription Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your subscription plans and billing
          </p>
        </div>

        {/* Current Subscription */}
        {currentSubscription?.tier && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(currentSubscription.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tier:</span>
                  {getTierBadge(currentSubscription.tier)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Auto-renew:</span>
                  <Badge
                    className={
                      currentSubscription.isAutoRenew
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {currentSubscription.isAutoRenew ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Started:{" "}
                    {new Date(
                      currentSubscription.startDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Expires:{" "}
                    {new Date(currentSubscription.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCancelSubscription(currentSubscription.id)
                  }
                  disabled={deleteSubscriptionMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Available Plans</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {packages.map((pkg: SubscriptionPackage) => {
              const currentTier = currentSubscription?.tier;
              const packageTier = pkg?.tier;

              const isCurrentPlan = currentTier === packageTier;
              const isUpgrade =
                currentTier && packageTier
                  ? (packageTier === "PRO" && currentTier === "BASIC") ||
                    (packageTier === "ENTERPRISE" &&
                      ["BASIC", "PRO"].includes(currentTier))
                  : false;

              return (
                <Card
                  key={pkg.tier}
                  className={`relative ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
                      <Badge className="bg-primary text-primary-foreground">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      {pkg.name}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      ${pkg.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="text-sm text-muted-foreground">
                        {pkg.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 space-y-2">
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={
                        isCurrentPlan || createSubscriptionMutation.isPending
                      }
                      onClick={() => handleUpgrade(pkg)}
                    >
                      {isCurrentPlan
                        ? "Current Plan"
                        : isUpgrade
                          ? "Upgrade"
                          : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Subscription History */}
        {subscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Subscription History
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {subscriptions.map((subscription: Subscription) => (
                        <tr key={subscription.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            {getTierBadge(subscription.tier)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {getStatusBadge(subscription.status)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {new Date(
                              subscription.startDate,
                            ).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {new Date(
                              subscription.endDate,
                            ).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Confirm Subscription
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Are you sure you want to subscribe to the {selectedPackage.name}{" "}
                plan for ${selectedPackage.price}/month?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={createSubscriptionMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSubscription}
                  disabled={createSubscriptionMutation.isPending}
                >
                  {createSubscriptionMutation.isPending
                    ? "Processing..."
                    : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSubscription;
