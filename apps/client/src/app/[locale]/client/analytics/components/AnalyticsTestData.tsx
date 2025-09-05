import { useTranslations } from 'next-intl';
import type { FC } from "react";
import { useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

import { api } from "~/trpc/react";

export const AnalyticsTestData: FC = () => {
  const t = useTranslations('Analytics');
  const [isCreating, setIsCreating] = useState(false);
  // Safely access tRPC utils with a narrow unknown-cast wrapper
  const rawUtils = (api as unknown as { useUtils: () => unknown }).useUtils();
  const utils = rawUtils as {
    analytics: {
      all: { invalidate: (...args: unknown[]) => unknown };
      getMetrics: { invalidate: (...args: unknown[]) => unknown };
    };
  };

  // Safely access mutation via narrow unknown-cast wrapper
  const createAnalyticsMutation = (api as unknown as {
    analytics: {
      create: {
        useMutation: (opts?: unknown) => {
          mutateAsync: (...args: unknown[]) => Promise<unknown>;
        };
      };
    };
  }).analytics.create.useMutation({
    onSuccess: () => {
      utils.analytics.all.invalidate();
      utils.analytics.getMetrics.invalidate();
      setIsCreating(false);
    },
    onError: (error: unknown) => {
      console.error("Error creating analytics:", error);
      setIsCreating(false);
    },
  });

  const createSampleData = async () => {
    setIsCreating(true);

    const sampleData = [
      {
        entityId: "sample-property-1",
        entityType: "Property",
        type: "LISTING_VIEW" as const,
        data: {
          propertyType: "APARTMENT",
          status: "AVAILABLE",
          price: 250000,
          views: 1250,
          inquiries: 89,
          page: "/properties/sample-property-1",
        },
        propertyId: "sample-property-1",
      },
      {
        entityId: "sample-user-1",
        entityType: "User",
        type: "USER_ENGAGEMENT" as const,
        data: {
          totalUsers: 15420,
          activeUsers: 8920,
          newUsers: 234,
          sessionDuration: 8.5,
          pageViews: 45600,
          path: "/properties",
          views: 12500,
        },
        userId: "sample-user-1",
      },
      {
        entityId: "sample-property-2",
        entityType: "Property",
        type: "BOOKING_CONVERSION" as const,
        data: {
          propertyType: "HOUSE",
          status: "AVAILABLE",
          price: 450000,
          views: 890,
          inquiries: 67,
          conversions: 12,
        },
        propertyId: "sample-property-2",
      },
      {
        entityId: "sample-agent-1",
        entityType: "Agent",
        type: "AGENT_PERFORMANCE" as const,
        data: {
          agentName: "John Doe",
          propertiesListed: 15,
          propertiesSold: 8,
          totalRevenue: 2500000,
          responseTime: 2.5,
        },
        agentId: "sample-agent-1",
      },
    ];

    try {
      // Create analytics records one by one
      for (const data of sampleData) {
        await createAnalyticsMutation.mutateAsync(data);
      }
    } catch (error: unknown) {
      console.error("Error creating sample data:", error);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('testData.title', { defaultValue: 'Test Data Generator' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">
          {t('testData.status', { defaultValue: 'Create sample analytics data for testing the dashboard components.' })}
        </p>
        <Button
          onClick={createSampleData}
          disabled={isCreating}
          variant="outline"
        >
          {isCreating ? t('testData.generating', { defaultValue: 'Creating...' }) : t('testData.generate', { defaultValue: 'Generate Test Data' })}
        </Button>
      </CardContent>
    </Card>
  );
};
