"use client";

import {
    Activity,
    BarChart3,
    Building2,
    Calendar,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import React from "react";

import { Badge } from "@reservatior/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";


interface AnalyticsMetricsProps {
  data: any;
  isLoading: boolean;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

interface MetricsItem {
  type: string;
  count: number;
}

export default function AnalyticsMetrics({
  data,
  isLoading,
  dateRange,
}: AnalyticsMetricsProps) {
  const t = useTranslations();

  const metrics = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return {
        totalRecords: 0,
        byType: {},
        topTypes: [],
        growthRate: 0,
        averagePerDay: 0,
        dateRange: {
          start: dateRange.startDate,
          end: dateRange.endDate,
          days: Math.ceil(
            (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        },
      };
    }

    // Calculate metrics from the grouped data
    const totalRecords = data.reduce(
      (sum: number, item: any) => sum + (item._count || 0),
      0,
    );
    const byType = data.reduce(
      (acc: Record<string, number>, item: any) => {
        if (item.type && typeof item._count === "number") {
          acc[item.type] = item._count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get top 3 types by count
    const topTypes: MetricsItem[] = Object.entries(byType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({ type, count: count }));

    const daysInRange = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const averagePerDay = totalRecords / Math.max(1, daysInRange);

    // Calculate growth rate (simplified - you might want to compare with previous period)
    const growthRate = 0; // TODO: Implement actual growth calculation

    return {
      totalRecords,
      byType,
      topTypes,
      growthRate,
      averagePerDay,
      dateRange: {
        start: dateRange.startDate,
        end: dateRange.endDate,
        days: daysInRange,
      },
    };
  }, [data, dateRange]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "property_view":
        return <Building2 className="h-4 w-4" />;
      case "user_activity":
        return <Users className="h-4 w-4" />;
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "search":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "property_view":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "user_activity":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "booking":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "search":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ios-layout android-layout">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mobile-card mobile-skeleton h-32 rounded-xl ios-mobile-menu android-mobile-menu" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 ios-layout android-layout">
      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="mobile-card mobile-fade-in ios-mobile-menu android-mobile-menu">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="mobile-text-sm font-medium">Total Records</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mobile-text-2xl font-bold">{metrics.totalRecords}</div>
            <p className="mobile-text-xs text-muted-foreground">
              {metrics.dateRange.days} days
            </p>
          </CardContent>
        </Card>

        <Card className="mobile-card mobile-fade-in ios-mobile-menu android-mobile-menu">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="mobile-text-sm font-medium">Average Per Day</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mobile-text-2xl font-bold">
              {metrics.averagePerDay.toFixed(1)}
            </div>
            <p className="mobile-text-xs text-muted-foreground">
              records per day
            </p>
          </CardContent>
        </Card>

        <Card className="mobile-card mobile-fade-in ios-mobile-menu android-mobile-menu">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="mobile-text-sm font-medium">Growth Rate</CardTitle>
            {metrics.growthRate >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="mobile-text-2xl font-bold">
              {metrics.growthRate >= 0 ? "+" : ""}
              {metrics.growthRate.toFixed(1)}%
            </div>
            <p className="mobile-text-xs text-muted-foreground">
              from last period
            </p>
          </CardContent>
        </Card>

        <Card className="mobile-card mobile-fade-in ios-mobile-menu android-mobile-menu">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="mobile-text-sm font-medium">Active Types</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mobile-text-2xl font-bold">
              {Object.keys(metrics.byType).length}
            </div>
            <p className="mobile-text-xs text-muted-foreground">
              different types
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Types Breakdown */}
      {metrics.topTypes.length > 0 && (
        <Card className="mobile-card mobile-fade-in ios-mobile-menu android-mobile-menu">
          <CardHeader>
            <CardTitle className="mobile-text-lg">Top Analytics Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topTypes.map((item, index) => (
                <div
                  key={item.type}
                  className="mobile-scale-in flex items-center justify-between rounded-lg border border-blue-200/50 bg-white/50 p-3 backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="mobile-text-sm font-medium capitalize">
                        {item.type.replace(/_/g, " ")}
                      </p>
                      <p className="mobile-text-xs text-muted-foreground">
                        {item.count} records
                      </p>
                    </div>
                  </div>
                  <Badge className={getTypeColor(item.type)}>
                    {((item.count / metrics.totalRecords) * 100).toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Range Summary */}
      <Card className="mobile-card mobile-fade-in ios-mobile-menu android-mobile-menu">
        <CardHeader>
          <CardTitle className="mobile-text-lg">Date Range Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="mobile-text-sm font-medium">Start Date</p>
              <p className="mobile-text-xs text-muted-foreground">
                {metrics.dateRange.start.toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <p className="mobile-text-sm font-medium">End Date</p>
              <p className="mobile-text-xs text-muted-foreground">
                {metrics.dateRange.end.toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <p className="mobile-text-sm font-medium">Duration</p>
              <p className="mobile-text-xs text-muted-foreground">
                {metrics.dateRange.days} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
