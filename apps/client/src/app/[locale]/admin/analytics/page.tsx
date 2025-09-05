"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Download, RefreshCw, Target, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@reservatior/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import { AnalyticsType } from "@reservatior/validators";

import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";
import AnalyticsChart from "./components/AnalyticsChart";
import AnalyticsMetrics from "./components/AnalyticsMetrics";
import AnalyticsTable from "./components/AnalyticsTable";

export type AnalyticsType = (typeof AnalyticsType._def.values)[number];

export default function AdminAnalyticsPage() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<AnalyticsType | "">("");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  });
  const analyticsPerPage = 20;

  const {
    data: fetchedAnalytics,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = api.analytics.all.useQuery({
    page: currentPage,
    pageSize: analyticsPerPage,
    type: selectedType && Object.values(AnalyticsType).includes(selectedType as any)
      ? selectedType as any
      : undefined,
    entityType: selectedEntityType,
    timestampFrom: dateRange.startDate,
    timestampTo: dateRange.endDate,
    sortBy: "timestamp",
    sortOrder: "desc",
  });

  // Get metrics for the selected date range
  const { data: metricsData, isLoading: metricsLoading } =
    api.analytics.getMetrics.useQuery({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

  const analytics = useMemo(() => {
    // Handle the nested data structure from the API
    const data = fetchedAnalytics?.data?.data || fetchedAnalytics?.data || [];
    return Array.isArray(data)
      ? data.filter((item): item is NonNullable<typeof item> => item !== null)
      : [];
  }, [fetchedAnalytics?.data]);

  const totalAnalytics = (fetchedAnalytics?.data as any)?.total || 0;

  const filteredAnalytics = useMemo(() => {
    if (!analytics.length) return [];
    return analytics.filter((item) => {
      const searchableFields = [
        item.entityId,
        item.entityType,
        item.type,
        item.property?.title,
        item.user?.name,
        item.agent?.name,
        item.agency?.name,
      ].filter((field): field is string => Boolean(field));
      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });
  }, [analytics, searchTerm]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log("Export analytics data");
  }, []);

  const handleTypeChange = (value: string) => {
    if (value === "all") {
      setSelectedType("");
      return;
    }

    // Verify the value is a valid enum option
    const validType = AnalyticsType.options.find(
      (type: string) => type === value,
    );

    if (validType) {
      setSelectedType(validType);
    }
  };

  const handleEntityTypeChange = (value: string) => {
    if (value === "all") {
      setSelectedEntityType("");
    } else {
      setSelectedEntityType(value);
    }
  };

  if (!mounted) {
    return null;
  }

  if (queryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t("Analytics.loading")}</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-600 mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg text-red-600 dark:text-red-400 mb-4">
            {t("Analytics.error.loading")}: {queryError.message}
          </p>
          <Button onClick={handleRefresh} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("Analytics.retry")}
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnalytics.length / analyticsPerPage),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
        <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("Analytics.title")}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("Analytics.description")}
              </p>
            </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("Analytics.refresh")}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t("Analytics.export")}
          </Button>
        </div>
      </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Analytics.metrics.totalRecords")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metricsLoading ? "..." : (metricsData?.length ? metricsData.reduce((sum: number, item: any) => sum + (item._count || 0), 0) : 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Analytics.metrics.averagePerDay")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metricsLoading ? "..." : (metricsData?.length ? (metricsData.reduce((sum: number, item: any) => sum + (item._count || 0), 0) / Math.max(1, (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))).toFixed(1) : 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Analytics.metrics.uniqueTypes")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {metricsLoading ? "..." : (metricsData?.length ? new Set(metricsData.map((item: any) => item.type)).size : 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Analytics.metrics.growthRate")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {metricsLoading ? "..." : "0%"}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg rounded-xl p-1">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            {t("Analytics.overview")}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            {t("Analytics.title")}
          </TabsTrigger>
          <TabsTrigger value="charts" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            {t("Analytics.chart.title")}
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            {t("Analytics.settings")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Analytics.overview")}
              </CardTitle>
              <CardDescription>
                {t("Analytics.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Analytics.metrics.totalRecords")}</h3>
                  <div className="h-64 bg-white/50 rounded-lg p-4">
      <AnalyticsMetrics
        data={metricsData}
        isLoading={metricsLoading}
        dateRange={dateRange}
      />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Analytics.chart.title")}</h3>
                  <div className="h-64 bg-white/50 rounded-lg p-4">
          <AnalyticsChart data={analytics} dateRange={dateRange} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Analytics.quickActions")}</h3>
                <div className="flex space-x-4">
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("Analytics.refresh")}
                  </Button>
                  <Button onClick={handleExport} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    {t("Analytics.export")}
                  </Button>
                </div>
              </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
        <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Analytics.table.title")}
          </CardTitle>
              <CardDescription>
                {t("Analytics.table.description")} ({totalAnalytics} {t("Analytics.table.totalRecords")})
              </CardDescription>
        </CardHeader>
        <CardContent>
              {/* Filters */}
              <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium">
                {t("Analytics.filters.search")}
              </label>
              <Input
                placeholder={t("Analytics.filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("Analytics.filters.type")}
              </label>
              <Select
                value={selectedType || "all"}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t("Analytics.filters.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("Analytics.filters.allTypes")}
                  </SelectItem>
                        {Object.values(AnalyticsType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`Analytics.types.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("Analytics.filters.entityType")}
              </label>
              <Select
                value={selectedEntityType || "all"}
                onValueChange={handleEntityTypeChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t("Analytics.filters.allEntities")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("Analytics.filters.allEntities")}
                  </SelectItem>
                        <SelectItem value="property">{t("Analytics.entityTypes.property")}</SelectItem>
                        <SelectItem value="user">{t("Analytics.entityTypes.user")}</SelectItem>
                        <SelectItem value="agent">{t("Analytics.entityTypes.agent")}</SelectItem>
                        <SelectItem value="agency">{t("Analytics.entityTypes.agency")}</SelectItem>
                        <SelectItem value="reservation">{t("Analytics.entityTypes.reservation")}</SelectItem>
                        <SelectItem value="task">{t("Analytics.entityTypes.task")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("Analytics.filters.dateRange")}
              </label>
              <div className="mt-1 flex space-x-2">
                <Input
                  type="date"
                  value={dateRange.startDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: new Date(e.target.value),
                    }))
                  }
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={dateRange.endDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: new Date(e.target.value),
                    }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
              </div>

          <AnalyticsTable
            analytics={filteredAnalytics.slice(
              (currentPage - 1) * analyticsPerPage,
              currentPage * analyticsPerPage,
            )}
            isLoading={queryLoading}
          />

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {t("Analytics.table.showing")}{" "}
              {(currentPage - 1) * analyticsPerPage + 1}-
              {Math.min(
                currentPage * analyticsPerPage,
                filteredAnalytics.length,
              )}{" "}
              {t("Analytics.table.of")} {filteredAnalytics.length}{" "}
              {t("Analytics.table.results")}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t("Analytics.table.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                {t("Analytics.table.next")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Analytics.chart.title")}
              </CardTitle>
              <CardDescription>
                {t("Analytics.chart.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart data={analytics} dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Analytics.settings")}
              </CardTitle>
              <CardDescription>
                {t("Analytics.settingsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Analytics.settings.general")}</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="mr-2 h-4 w-4" />
                      {t("Analytics.settings.trackingSettings")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      {t("Analytics.settings.chartSettings")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      {t("Analytics.settings.exportSettings")}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Analytics.settings.security")}</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="mr-2 h-4 w-4" />
                      {t("Analytics.settings.dataRetention")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      {t("Analytics.settings.accessControl")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
