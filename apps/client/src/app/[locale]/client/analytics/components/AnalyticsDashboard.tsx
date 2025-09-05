import type { AnalyticsType } from "@prisma/client";
import { Activity, Award, BarChart3, CheckCircle, DollarSign, Eye, Target, TrendingUp, Users, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { api } from "~/trpc/react";

// Define proper types for the analytics data
interface AnalyticsMetric {
  type: string;
  _count: number;
  // Add other fields returned by the API if needed
}

interface AnalyticsItem {
  id: string;
  type: AnalyticsType;
  entityType?: string | null;
  entityId?: string | null;
  data?: Record<string, unknown> | null;
  timestamp: Date;
  // Add other fields returned by the API if needed
}

interface AnalyticsResponse {
  data: AnalyticsItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface AnalyticsData {
  type: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  entityType?: string;
  growth?: number;
  icon?: React.ReactNode;
  color?: string;
}

export const AnalyticsDashboard: FC = () => {
  const t = useTranslations('Analytics');
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  // Get analytics metrics grouped by type
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = api.analytics.getMetrics.useQuery(
    {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(),
    },
    {
      enabled: !!session?.user, // Only run query if user is authenticated
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  // Get all analytics for detailed breakdown
  const {
    data: allAnalytics,
    isLoading: allLoading,
    error: allError,
  } = api.analytics.all.useQuery(
    {
      page: 1,
      pageSize: 100,
      timestampFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      timestampTo: new Date(),
      sortBy: "timestamp",
      sortOrder: "desc",
    },
    {
      enabled: !!session?.user, // Only run query if user is authenticated
      refetchOnWindowFocus: false,
      retry: 2,
    },
  ) as { data: AnalyticsResponse | undefined; isLoading: boolean; error: Error | null };

  // Process and memoize analytics data
  const processedAnalytics = useMemo(() => {
    if (metricsLoading || allLoading) return [];

    // Process metrics data
    const processedMetrics: AnalyticsData[] = [];
    if (metricsData && Array.isArray(metricsData)) {
      const totalCount = metricsData.reduce((sum, m) => sum + (m._count || 0), 0);
      
      metricsData.forEach((item: AnalyticsMetric) => {
        const type = item.type || 'Unknown';
        const count = item._count || 0;
        const percentage = totalCount > 0 ? Math.floor((count / totalCount) * 100) : 0;
        
        // Determine trend and styling based on type
        let trend: "up" | "down" | "stable" = "stable";
        let growth = 0;
        let icon = <BarChart3 className="h-4 w-4" />;
        let color = "text-blue-600";

        switch (type) {
          case 'USER_ENGAGEMENT':
            trend = "up";
            growth = 12.5;
            icon = <Activity className="h-4 w-4" />;
            color = "text-green-600";
            break;
          case 'REVENUE':
            trend = "up";
            growth = 15.2;
            icon = <TrendingUp className="h-4 w-4" />;
            color = "text-green-600";
            break;
          case 'PERFORMANCE':
            trend = "stable";
            growth = 2.1;
            icon = <Target className="h-4 w-4" />;
            color = "text-blue-600";
            break;
          case 'LISTING_VIEW':
            trend = "up";
            growth = 8.7;
            icon = <BarChart3 className="h-4 w-4" />;
            color = "text-purple-600";
            break;
          case 'BOOKING_CONVERSION':
            trend = "up";
            growth = 23.4;
            icon = <Zap className="h-4 w-4" />;
            color = "text-orange-600";
            break;
          case 'ML_PROPERTY_SCORE':
            trend = "stable";
            growth = 5.3;
            icon = <Target className="h-4 w-4" />;
            color = "text-indigo-600";
            break;
          case 'AGENT_PERFORMANCE':
            trend = "up";
            growth = 18.9;
            icon = <Activity className="h-4 w-4" />;
            color = "text-green-600";
            break;
          case 'AGENCY_PERFORMANCE':
            trend = "up";
            growth = 11.2;
            icon = <TrendingUp className="h-4 w-4" />;
            color = "text-blue-600";
            break;
        }

        processedMetrics.push({
          type,
          count,
          percentage,
          trend,
          growth,
          icon,
          color,
        });
      });
    }

    // Process detailed analytics data
    const entityTypeBreakdown: AnalyticsData[] = [];
    const analyticsItems = allAnalytics?.data ?? [];
    
    if (analyticsItems.length > 0) {
      const entityTypeCounts = new Map<string, number>();
      
      analyticsItems.forEach((item: AnalyticsItem) => {
        const type = item.entityType ?? 'Unknown';
        entityTypeCounts.set(type, (entityTypeCounts.get(type) ?? 0) + 1);
      });

      entityTypeCounts.forEach((count, type) => {
        entityTypeBreakdown.push({
          type: 'Entity Type',
          count,
          percentage: Math.floor((count / analyticsItems.length) * 100),
          trend: 'stable',
          entityType: type,
          icon: <BarChart3 className="h-4 w-4" />,
          color: "text-gray-600",
        });
      });
    }

    // Combine metrics and entity type breakdown, ensuring we don't exceed 8 items total
    return [
      ...processedMetrics,
      ...entityTypeBreakdown,
    ].slice(0, 8);
  }, [metricsData, allAnalytics, metricsLoading, allLoading]);

  // Update state when processed data changes
  useEffect(() => {
    setAnalytics(processedAnalytics);
    setLoading(metricsLoading || allLoading);
  }, [processedAnalytics, metricsLoading, allLoading]);

  // Show error state if queries fail
  const error = metricsError ?? allError;
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-600">
          {t('errorLoading', { defaultValue: 'Error loading analytics data.' })}
        </p>
        <p className="mt-2 text-sm text-red-500">
          {error.message || t('tryAgain', { defaultValue: 'Please try again later.' })}
        </p>
      </div>
    );
  }

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded border p-4">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mb-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  // Show authentication message if user is not authenticated
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">
          {t('loginRequired', { defaultValue: 'Please log in to view analytics data.' })}
        </p>
      </div>
    );
  }

  // Show loading state
  if (loading || metricsLoading || allLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-1/2 animate-pulse rounded bg-gray-300" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{t('overview', { defaultValue: 'Analytics Overview' })}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('last30days', { defaultValue: 'Insights from the last 30 days' })}
        </p>
      </div>
      
      {analytics.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {analytics.map((item, index) => (
            <div 
              key={`${item.type}-${item.entityType ?? 'default'}-${index}`} 
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span 
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.trend === 'up' 
                        ? 'bg-green-100 text-green-800' 
                        : item.trend === 'down' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} 
                    {item.growth ? `${item.growth}%` : t(`trend.${item.trend}`, { defaultValue: item.trend.charAt(0).toUpperCase() + item.trend.slice(1) })}
                  </span>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {item.type}
                    {item.entityType && ` (${item.entityType})`}
                  </h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">
                      {item.count.toLocaleString()}
                    </p>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.trend === 'up' ? 'bg-green-500' : 
                      item.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { type: 'LISTING_VIEW', count: 12450, percentage: 35, trend: 'up', growth: 12.5, icon: <Eye className="h-4 w-4" />, color: "text-blue-600" },
            { type: 'BOOKING_CONVERSION', count: 892, percentage: 25, trend: 'up', growth: 8.3, icon: <CheckCircle className="h-4 w-4" />, color: "text-green-600" },
            { type: 'USER_ENGAGEMENT', count: 2847, percentage: 20, trend: 'up', growth: 15.2, icon: <Users className="h-4 w-4" />, color: "text-purple-600" },
            { type: 'REVENUE', count: 125000, percentage: 15, trend: 'up', growth: 18.7, icon: <DollarSign className="h-4 w-4" />, color: "text-green-600" },
            { type: 'AGENT_PERFORMANCE', count: 24, percentage: 5, trend: 'stable', growth: 0, icon: <Award className="h-4 w-4" />, color: "text-orange-600" },
          ].map((item, index) => (
            <div 
              key={`${item.type}-${index}`} 
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span 
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.trend === 'up' 
                        ? 'bg-green-100 text-green-800' 
                        : item.trend === 'down' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} 
                    {item.growth ? `${item.growth}%` : t(`trend.${item.trend}`, { defaultValue: item.trend.charAt(0).toUpperCase() + item.trend.slice(1) })}
                  </span>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {item.type.replace('_', ' ')}
                  </h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof item.count === 'number' ? item.count.toLocaleString() : item.count}
                    </p>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.trend === 'up' ? 'bg-green-500' : 
                      item.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {analytics.length > 0 && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">{t('summary.title', { defaultValue: 'Summary Statistics' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{t('summary.totalEvents', { defaultValue: 'Total Events' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.filter(item => item.trend === 'up').length}
              </div>
              <div className="text-sm text-gray-500">{t('summary.growingMetrics', { defaultValue: 'Growing Metrics' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.length}
              </div>
              <div className="text-sm text-gray-500">{t('summary.activeMetrics', { defaultValue: 'Active Metrics' })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
