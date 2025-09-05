"use client";

import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { AnalyticsType } from "@reservatior/validators";

import { useTranslations } from "next-intl";

interface AnalyticsChartProps {
  data: any[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

export default function AnalyticsChart({
  data,
  dateRange,
}: AnalyticsChartProps) {
  const t = useTranslations();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "LISTING_VIEW":
        return "rgba(59, 130, 246, 0.8)";
      case "BOOKING_CONVERSION":
        return "rgba(34, 197, 94, 0.8)";
      case "ML_PROPERTY_SCORE":
        return "rgba(147, 51, 234, 0.8)";
      case "USER_ENGAGEMENT":
        return "rgba(234, 179, 8, 0.8)";
      case "REVENUE":
        return "rgba(16, 185, 129, 0.8)";
      case "PERFORMANCE":
        return "rgba(249, 115, 22, 0.8)";
      case "AGENT_PERFORMANCE":
        return "rgba(99, 102, 241, 0.8)";
      case "AGENCY_PERFORMANCE":
        return "rgba(236, 72, 153, 0.8)";
      default:
        return "rgba(107, 114, 128, 0.8)";
    }
  };

  const chartData = useMemo(() => {
    // Group data by type and date
    const groupedData = data.reduce(
      (acc, item) => {
        const date = new Date(item.timestamp).toLocaleDateString();
        const type = item.type;

        if (!acc[date]) {
          acc[date] = {};
        }
        if (!acc[date][type]) {
          acc[date][type] = 0;
        }
        acc[date][type]++;

        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );

    // Convert to chart format
    const dates = Object.keys(groupedData).sort();
    const types = AnalyticsType.options;

    return {
      labels: dates,
      datasets: types.map((type) => ({
        label: t(`Analytics.types.${type}`),
        data: dates.map((date) => groupedData[date]?.[type] || 0),
        backgroundColor: getTypeColor(type),
        borderColor: getTypeColor(type),
        borderWidth: 1,
      })),
    };
  }, [data, t]);

  const totalAnalytics = data.length;
  const uniqueTypes = new Set(data.map((item) => item.type)).size;
  const averagePerDay =
    totalAnalytics /
    Math.max(
      1,
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

  // Simple chart implementation (you can replace with a proper charting library)
  const renderSimpleChart = () => {
    if (!chartData.labels.length) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="mx-auto mb-4 h-12 w-12" />
            <p>{t("Analytics.chart.noData")}</p>
          </div>
        </div>
      );
    }

    const maxValue = Math.max(
      ...chartData.datasets.flatMap((dataset) => dataset.data),
    );
    const chartHeight = 200;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {t("Analytics.chart.analyticsOverTime")}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>
              {t("Analytics.chart.totalRecords")}: {totalAnalytics}
            </span>
            <span>
              {t("Analytics.chart.uniqueTypes")}: {uniqueTypes}
            </span>
            <span>
              {t("Analytics.chart.avgPerDay")}: {averagePerDay.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="relative h-64 overflow-x-auto">
          <div className="flex h-full min-w-max items-end space-x-2 px-4">
            {chartData.labels.map((label, index) => (
              <div key={label} className="flex flex-col items-center space-y-2">
                <div className="flex h-48 items-end space-x-1">
                  {chartData.datasets.map((dataset, datasetIndex) => {
                    const value = dataset.data[index];
                    const height =
                      maxValue > 0 ? (value / maxValue) * chartHeight : 0;
                    return (
                      <div
                        key={datasetIndex}
                        className="w-4 rounded-t"
                        style={{
                          height: `${height}px`,
                          backgroundColor: dataset.backgroundColor,
                          minHeight: value > 0 ? "4px" : "0px",
                        }}
                        title={`${dataset.label}: ${value}`}
                      />
                    );
                  })}
                </div>
                <span className="origin-left rotate-45 text-xs text-muted-foreground">
                  {new Date(label).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {chartData.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: dataset.backgroundColor }}
              />
              <span className="text-sm">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Analytics.chart.totalAnalytics")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalytics}</div>
            <p className="text-xs text-muted-foreground">
              {t("Analytics.chart.inDateRange")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Analytics.chart.uniqueTypes")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueTypes}</div>
            <p className="text-xs text-muted-foreground">
              {t("Analytics.chart.differentAnalyticsTypes")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Analytics.chart.avgPerDay")}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePerDay.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {t("Analytics.chart.averageDailyRecords")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="pt-6">{renderSimpleChart()}</CardContent>
      </Card>
    </div>
  );
}
