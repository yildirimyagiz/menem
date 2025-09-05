import {
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Edit,
  Plus,
  Settings,
  Trash2,
  Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

import { api } from "~/trpc/react";

interface SubscriptionPackage {
  tier: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  description?: string;
}

interface Subscription {
  id: string;
  tier: string;
  status: string;
  startDate: string;
  endDate: string;
  isAutoRenew: boolean;
  entityId: string;
  entityType: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface AgencySubscriptionManagerProps {
  agencyId: string;
  agencyName: string;
}

const AgencySubscriptionManager: React.FC<AgencySubscriptionManagerProps> = ({
  agencyId,
  agencyName,
}) => {
  const t = useTranslations();
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Fetch agency's subscriptions
  const {
    data: subscriptionsResponse,
    isLoading: subscriptionsLoading,
    refetch: refetchSubscriptions,
  } = api.subscription.all.useQuery({
    entityId: agencyId,
    entityType: "AGENCY",
    page: 1,
    pageSize: 50,
  });

  // Fetch available subscription packages
  const { data: subscriptionPackages, isLoading: packagesLoading } =
    api.subscription.listPackages.useQuery();

  // Create subscription mutation
  const createSubscriptionMutation = api.subscription.create.useMutation({
    onSuccess: () => {
      toast.success(t("subscription.toast.success"));
      void refetchSubscriptions();
      setShowUpgradeModal(false);
    },
    onError: (_error) => {
      toast.error(t("subscription.toast.error"));
    },
  });

  // Delete subscription mutation
  const deleteSubscriptionMutation = api.subscription.delete.useMutation({
    onSuccess: () => {
      toast.success(t("subscriptionCancelled"));
      void refetchSubscriptions();
    },
    onError: (_error) => {
      toast.error(t("subscription.toast.error"));
    },
  });

  const subscriptions = subscriptionsResponse?.data && Array.isArray(subscriptionsResponse.data)
    ? subscriptionsResponse.data
    : [];
  const packages = subscriptionPackages ?? [];

  // Get current active subscription
  const currentSubscription = subscriptions?.find(
    (sub: Subscription) => sub.status === "ACTIVE" || sub.status === "TRIAL",
  );

  // Subscription status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">{t("common.active")}</Badge>;
      case "TRIAL":
        return <Badge className="bg-blue-100 text-blue-800">{t("common.trial")}</Badge>;
      case "EXPIRED":
        return <Badge className="bg-red-100 text-red-800">{t("common.expired")}</Badge>;
      case "SUSPENDED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">{t("common.suspended")}</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Subscription tier badge
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "BASIC":
        return <Badge className="bg-gray-100 text-gray-800">{t("subscription.plans.basic.name")}</Badge>;
      case "PRO":
        return <Badge className="bg-blue-100 text-blue-800">{t("subscription.plans.plus.name")}</Badge>;
      case "ENTERPRISE":
        return (
          <Badge className="bg-purple-100 text-purple-800">{t("pricing.planTypes.enterprise")}</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{tier}</Badge>;
    }
  };

  // Get subscription package info
  const getSubscriptionPackage = (tier: string) => {
    return packages.find((pkg: SubscriptionPackage) => pkg.tier === tier);
  };

  // Get feature limits based on tier
  const getFeatureLimits = (tier: string) => {
    switch (tier) {
      case "BASIC":
        return {
          properties: 10,
          agents: 3,
          analytics: "Basic",
          support: "Email",
        };
      case "PRO":
        return {
          properties: 50,
          agents: 10,
          analytics: "Advanced",
          support: "Priority",
        };
      case "ENTERPRISE":
        return {
          properties: "Unlimited",
          agents: "Unlimited",
          analytics: "Premium",
          support: "Dedicated",
        };
      default:
        return {
          properties: 5,
          agents: 1,
          analytics: "Basic",
          support: "Email",
        };
    }
  };

  const handleUpgrade = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setShowUpgradeModal(true);
  };

  const handleCreateSubscription = () => {
    if (!selectedPackage) return;

    createSubscriptionMutation.mutate({
      entityId: agencyId,
      entityType: "AGENCY" as const,
      tier: selectedPackage.tier as "BASIC" | "PRO" | "ENTERPRISE",
      status: "ACTIVE" as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      features: selectedPackage.features,
      isAutoRenew: true,
    });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    if (confirm(t("subscription.confirmCancel"))) {
      deleteSubscriptionMutation.mutate(subscriptionId);
    }
  };

  if (subscriptionsLoading || packagesLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="ml-3">{t("common.loading")}</p>
      </div>
    );
  }

  const currentPackage = currentSubscription
    ? getSubscriptionPackage(currentSubscription.tier)
    : null;
  const featureLimits = currentSubscription
    ? getFeatureLimits(currentSubscription.tier)
    : getFeatureLimits("BASIC");

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && currentPackage && (
        <Card className="mb-6 rounded-2xl border-none bg-white p-6 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              {t("subscription.currentSubscription")} - {currentPackage.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("common.status")}:</span>
                {getStatusBadge(currentSubscription.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("subscription.tier")}:</span>
                {getTierBadge(currentSubscription.tier)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("subscription.autoRenew")}:</span>
                <Badge
                  className={
                    currentSubscription.isAutoRenew
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {currentSubscription.isAutoRenew ? t("common.yes") : t("common.no")}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("subscription.price")}:</span>
                <span className="font-medium">
                  ${currentPackage.price}/{t("subscription.perMonth")}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {t("subscription.started")}:{" "}
                  {new Date(currentSubscription.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {t("subscription.expires")}:{" "}
                  {new Date(currentSubscription.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelSubscription(currentSubscription.id)}
                disabled={deleteSubscriptionMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Limits */}
      <Card className="mb-6 rounded-2xl border-none bg-white p-6 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            {t("subscription.currentPlanFeatures")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{t("subscription.features.properties")}</p>
                <p className="text-xs text-gray-600">
                  {featureLimits.properties}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">{t("subscription.features.agents")}</p>
                <p className="text-xs text-gray-600">{featureLimits.agents}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{t("subscription.features.analytics")}</p>
                <p className="text-xs text-gray-600">
                  {featureLimits.analytics}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">{t("subscription.features.support")}</p>
                <p className="text-xs text-gray-600">{featureLimits.support}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="mb-6 rounded-2xl border-none bg-white p-6 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            {t("subscription.availablePlans")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {packages.map((pkg: SubscriptionPackage) => {
              const isCurrentPlan = currentSubscription?.tier === pkg.tier;
              const isUpgrade =
                (currentSubscription &&
                  pkg.tier === "PRO" &&
                  currentSubscription.tier === "BASIC") ??
                (currentSubscription &&
                  pkg.tier === "ENTERPRISE" &&
                  ["BASIC", "PRO"].includes(currentSubscription.tier));

              return (
                <Card
                  key={pkg.tier}
                  className={`relative rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
                      <Badge className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground shadow-sm">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      {pkg.name}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      ${pkg.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{t("subscription.perMonth")}
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
                      {pkg.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full rounded-lg px-5 py-2.5 font-bold shadow"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={
                        isCurrentPlan || createSubscriptionMutation.isPending
                      }
                      onClick={() => handleUpgrade(pkg)}
                    >
                      {isCurrentPlan
                        ? t("subscription.currentPlan")
                        : isUpgrade
                          ? t("subscription.upgrade")
                          : t("subscription.subscribe")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold">{t("subscription.confirmTitle")}</h3>
            <p className="mb-4 text-sm text-gray-600">
              {t("subscription.confirmMessage", { 
                agencyName, 
                planName: selectedPackage.name, 
                price: selectedPackage.price 
              })}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
                disabled={createSubscriptionMutation.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleCreateSubscription}
                disabled={createSubscriptionMutation.isPending}
              >
                {createSubscriptionMutation.isPending
                  ? t("common.processing")
                  : t("common.confirm")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencySubscriptionManager;
