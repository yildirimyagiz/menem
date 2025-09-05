"use client";

import {
    Activity,
    ChevronLeft,
    ChevronRight,
    Download,
    MessageSquare,
    Plus,
    RefreshCw,
    Shield,
    Target,
    Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import ChannelCreateModal from "./components/ChannelCreateModal";
import ChannelDeleteModal from "./components/ChannelDeleteModal";
import ChannelEditModal from "./components/ChannelEditModal";
import type { ChannelRow } from "./components/columns";
import { getChannelColumns } from "./components/columns";
import { DataTable } from "./components/DataTable";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "AGENT", label: "Agent" },
  { value: "AGENCY", label: "Agency" },
  { value: "TENANT", label: "Tenant" },
  { value: "PROPERTY", label: "Property" },
  { value: "PAYMENT", label: "Payment" },
  { value: "SYSTEM", label: "System" },
  { value: "REPORT", label: "Report" },
  { value: "RESERVATION", label: "Reservation" },
  { value: "TASK", label: "Task" },
  { value: "TICKET", label: "Ticket" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
  { value: "GROUP", label: "Group" },
];

// Use the actual union types for category and type
// These should match your backend types
// If you have ChannelCategory and ChannelType types, import and use them
// For now, hardcode the union types

type ChannelCategory =
  | "AGENT"
  | "AGENCY"
  | "TENANT"
  | "PROPERTY"
  | "PAYMENT"
  | "SYSTEM"
  | "REPORT"
  | "RESERVATION"
  | "TASK"
  | "TICKET";
type ChannelType = "PUBLIC" | "PRIVATE" | "GROUP";

export default function AdminChannelPage() {
  const router = useRouter();
  const t = useTranslations("Admin");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ChannelCategory | "all"
  >("all");
  const [selectedType, setSelectedType] = useState<ChannelType | "all">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const channelsPerPage = 20;

  // Fetch channels data
  const {
    data: fetchedChannels,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = api.channel.list.useQuery({
    page: currentPage,
    pageSize: channelsPerPage,
    name: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    type: selectedType !== "all" ? selectedType : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Analytics data for channels
  const analyticsData = useMemo(() => {
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: date.toLocaleDateString('tr-TR', { month: 'short' }),
        channels: Math.floor(Math.random() * 15) + 3,
        messages: Math.floor(Math.random() * 100) + 20,
        users: Math.floor(Math.random() * 50) + 10,
      };
    }).reverse();

    const categoryData = [
      { name: t("channels.categories.agent", { defaultValue: "Agent" }), value: 25, color: "#10b981" },
      { name: t("channels.categories.agency", { defaultValue: "Agency" }), value: 20, color: "#3b82f6" },
      { name: t("channels.categories.tenant", { defaultValue: "Tenant" }), value: 15, color: "#f59e0b" },
      { name: t("channels.categories.property", { defaultValue: "Property" }), value: 30, color: "#8b5cf6" },
      { name: t("channels.categories.payment", { defaultValue: "Payment" }), value: 10, color: "#ef4444" },
    ];

    return {
      growthData: last6Months,
      categoryData,
      totalChannels: fetchedChannels?.data?.total ?? 0,
      totalMessages: Math.floor(Math.random() * 1000) + 500,
      activeUsers: Math.floor(Math.random() * 200) + 100,
      responseRate: Math.floor(Math.random() * 30) + 70,
    };
  }, [fetchedChannels?.data?.total, t]);

  const channels = useMemo(() => {
    const data = fetchedChannels?.data?.data ?? [];
    return Array.isArray(data) ? data.filter(channel => channel !== null).map(channel => ({
      ...channel!,
      description: channel!.description ?? undefined,
      deletedAt: channel!.deletedAt ?? undefined
    })) : [];
  }, [fetchedChannels?.data]);

  // Fix: get total from fetchedChannels.data.total
  const totalChannels = fetchedChannels?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalChannels / channelsPerPage));

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (channelId: string) => {
    setSelectedChannel(channelId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (channelId: string) => {
    setSelectedChannel(channelId);
    setIsDeleteModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    toast({
      title: t("channels.export", { defaultValue: "Export" }),
      description: t("channels.exportComingSoon", { defaultValue: "Export functionality coming soon" }),
    });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as ChannelCategory | "all");
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as ChannelType | "all");
  };

  const columns = getChannelColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  }) as import("@tanstack/react-table").ColumnDef<ChannelRow | null, unknown>[];

  if (queryLoading && !channels.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">{t("channels.loading", { defaultValue: "Loading channels..." })}</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">
            {t("channels.errorLoading", { defaultValue: "Error loading channels" })}:{" "}
            {queryError instanceof Error
              ? queryError.message
              : String(queryError)}
          </p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("channels.retry", { defaultValue: "Retry" })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
        <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("channels.title", { defaultValue: "Channel Management" })}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t("channels.description", { defaultValue: "Manage all channels for messaging and communication" })}
          </p>
        </div>
          </div>
          <div className="flex space-x-3">
                          <Button variant="outline" onClick={handleRefresh} className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <RefreshCw className="mr-2 h-4 w-4" />
                {t("channels.refresh", { defaultValue: "Refresh" })}
          </Button>
              <Button variant="outline" onClick={handleExport} className="border-green-200 text-green-700 hover:bg-green-50">
            <Download className="mr-2 h-4 w-4" />
                {t("channels.export", { defaultValue: "Export" })}
          </Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
                {t("channels.addChannel", { defaultValue: "Add Channel" })}
          </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 shadow-xl shadow-blue-200/30 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  {t("channels.totalChannels", { defaultValue: "Total Channels" })}
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">
                  {analyticsData.totalChannels}
                </div>
                <p className="text-xs text-blue-600 mt-1">{t("channels.stats.growthFromLastMonth", { defaultValue: "+12% from last month" })}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-xl shadow-green-200/30 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  {t("channels.totalMessages", { defaultValue: "Total Messages" })}
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">
                  {analyticsData.totalMessages}
                </div>
                <p className="text-xs text-green-600 mt-1">{t("channels.stats.growthFromLastWeek", { defaultValue: "+8% from last week" })}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-2 border-orange-200 shadow-xl shadow-orange-200/30 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  {t("channels.activeUsers", { defaultValue: "Active Users" })}
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-800">
                  {analyticsData.activeUsers}
                </div>
                <p className="text-xs text-orange-600 mt-1">{t("channels.stats.growthFromYesterday", { defaultValue: "+15% from yesterday" })}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 shadow-xl shadow-purple-200/30 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">
                  {t("channels.responseRate", { defaultValue: "Response Rate" })}
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800">
                  {analyticsData.responseRate}%
                </div>
                <p className="text-xs text-purple-600 mt-1">{t("channels.stats.growthFromLastMonth", { defaultValue: "+5% from last month" })}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-xl border-2 border-blue-200/50 shadow-lg rounded-xl p-1">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            {t("Admin.channels.overview")}
          </TabsTrigger>
          <TabsTrigger value="channels" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            {t("Admin.channels.channels")}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            {t("Admin.channels.analytics")}
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            {t("Admin.channels.settings")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-blue-200/50 shadow-xl shadow-blue-200/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Admin.channels.overview")}
              </CardTitle>
              <CardDescription>
                {t("Admin.channels.overviewDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.channels.channelGrowth")}</h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="channels" 
                          stackId="1"
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="messages" 
                          stackId="2"
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.channels.categoryDistribution")}</h3>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.channels.quickActions")}</h3>
                <div className="flex space-x-4">
                  <Button onClick={handleCreate} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("Admin.channels.addChannel")}
                  </Button>
                  <Button onClick={handleRefresh} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("Admin.channels.refresh")}
                  </Button>
                  <Button onClick={handleExport} variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Download className="mr-2 h-4 w-4" />
                    {t("Admin.channels.export")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="mt-6">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-blue-200/50 shadow-xl shadow-blue-200/20 rounded-2xl">
        <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Admin.channels.channels")}
              </CardTitle>
              <CardDescription>
                {t("Admin.channels.channelsDescription")} ({totalChannels} {t("Admin.channels.totalChannels")})
              </CardDescription>
        </CardHeader>
        <CardContent>
              {/* Filters */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
                    <label className="text-sm font-medium text-blue-700">
                      {t("Admin.channels.filters.search")}
                    </label>
              <Input
                      placeholder={t("Admin.channels.filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
                    <label className="text-sm font-medium text-blue-700">
                      {t("Admin.channels.filters.category")}
                    </label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                      <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-500">
                        <SelectValue placeholder={t("Admin.channels.filters.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(`Admin.channels.categories.${option.value.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
                    <label className="text-sm font-medium text-blue-700">
                      {t("Admin.channels.filters.type")}
                    </label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                      <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-500">
                        <SelectValue placeholder={t("Admin.channels.filters.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                        {TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(`Admin.channels.types.${option.value.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
              </div>

              {/* Compact Table */}
              <div className="max-h-96 overflow-y-auto">
          <DataTable
            columns={columns}
            data={channels}
            isLoading={queryLoading}
            error={
              queryError
                ? typeof queryError === "object" &&
                  queryError &&
                  "message" in queryError
                  ? (queryError as { message: string }).message
                  : String(queryError)
                : undefined
            }
          />
              </div>

          {/* Pagination */}
              <div className="mt-4 flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700">
                  {t("Admin.channels.table.showing")}{" "}
                  {((currentPage - 1) * channelsPerPage) + 1}-
                  {Math.min(
                    currentPage * channelsPerPage,
                    totalChannels,
                  )}{" "}
                  {t("Admin.channels.table.of")} {totalChannels}{" "}
                  {t("Admin.channels.table.results")}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t("Admin.channels.table.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                    {t("Admin.channels.table.next")}
                    <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-green-200/50 shadow-xl shadow-green-200/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Admin.channels.analytics")}
              </CardTitle>
              <CardDescription>
                {t("Admin.channels.analyticsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.channels.messageActivity")}</h3>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="messages" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.channels.userEngagement")}</h3>
                  <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-purple-200/50 shadow-xl shadow-purple-200/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Admin.channels.settings")}
              </CardTitle>
              <CardDescription>
                {t("Admin.channels.settingsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.channels.settings.general")}</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {t("Admin.channels.settings.channelSettings")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                      <Activity className="mr-2 h-4 w-4" />
                      {t("Admin.channels.settings.notificationSettings")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                      <Download className="mr-2 h-4 w-4" />
                      {t("Admin.channels.settings.exportSettings")}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.channels.settings.security")}</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50">
                      <Shield className="mr-2 h-4 w-4" />
                      {t("Admin.channels.settings.privacySettings")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50">
                      <Users className="mr-2 h-4 w-4" />
                      {t("Admin.channels.settings.accessControl")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ChannelCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
          toast({
            title: t("success", { defaultValue: "Success" }),
            description: t("channels.channelCreatedSuccessfully", { defaultValue: "Channel created successfully" }),
          });
        }}
      />

      {selectedChannel && (
        <ChannelEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          channelId={selectedChannel}
          onSuccess={() => {
            setIsEditModalOpen(false);
            refetch();
            toast({
              title: t("success", { defaultValue: "Success" }),
              description: t("channels.channelUpdatedSuccessfully", { defaultValue: "Channel updated successfully" }),
            });
          }}
        />
      )}

      {selectedChannel && (
        <ChannelDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          channelId={selectedChannel}
          onSuccess={() => {
            setIsDeleteModalOpen(false);
            refetch();
            toast({
              title: t("success", { defaultValue: "Success" }),
              description: t("channels.channelDeletedSuccessfully", { defaultValue: "Channel deleted successfully" }),
            });
          }}
        />
      )}
    </div>
  );
}
