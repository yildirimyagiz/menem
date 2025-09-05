"use client";

import { motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    BarChart3,
    Building2,
    CheckCircle,
    Clock,
    Download,
    Plus,
    RefreshCw,
    Settings,
    SlidersHorizontal
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@reservatior/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@reservatior/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import { useDebounce } from "~/hooks/use-debounce";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import AgencyCreateModal from "./components/AgencyCreateModal";
import AgencyDeleteModal from "./components/AgencyDeleteModal";
import AgencyEditModal from "./components/AgencyEditModal";
import AgencyFilterForm from "./components/AgencyFilterForm";
import type { AgencyRow } from "./components/columns";
import { getAgencyColumns } from "./components/columns";
import { DataTable } from "./components/DataTable";

export default function AdminAgencyPage() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedActive, setSelectedActive] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const agenciesPerPage = 20;
  
  // Enhanced state management
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleExportAgencies = () => {
    setIsExporting(true);
    try {
      const csvData = [
        ['ID', 'Name', 'Email', 'Phone', 'Status', 'Active', 'Created At'],
        ...agencies.filter(agency => agency !== null).map(agency => [
          agency.id,
          agency.name,
          agency.email,
          agency.phoneNumber,
          agency.status,
          agency.isActive ? 'Yes' : 'No',
          new Date(agency.createdAt).toLocaleDateString()
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agencies-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Agencies exported successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to export agencies",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch agencies data
  const {
    data: fetchedAgencies,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = api.agency.all.useQuery({
    page: currentPage,
    pageSize: agenciesPerPage,
    search: debouncedSearchTerm || undefined,
    status: selectedStatus !== "all" ? (selectedStatus as AgencyRow['status']) : undefined,
    isActive: selectedActive !== "all" ? selectedActive === "true" : undefined,
    sortBy,
    sortOrder,
  });

  // Fetch agency statistics
  const { data: statsData, isLoading: statsLoading } =
    api.agency.stats.useQuery();

  // Use the correct data shape for paginated agencies
  const agencies = useMemo(() => {
    const data = fetchedAgencies?.data?.data ?? [];
    function isAgencyRow(item: unknown): item is AgencyRow {
      return (
        !!item &&
        typeof item === "object" &&
        "id" in item &&
        typeof (item as { id?: unknown }).id === "string" &&
        "name" in item &&
        typeof (item as { name?: unknown }).name === "string" &&
        "status" in item &&
        typeof (item as { status?: unknown }).status === "string" &&
        "isActive" in item &&
        typeof (item as { isActive?: unknown }).isActive === "boolean" &&
        "createdAt" in item
      );
    }
    return Array.isArray(data) ? data.filter(isAgencyRow) : [];
  }, [fetchedAgencies]);

  const totalAgencies = fetchedAgencies?.data?.total ?? 0;

  // Analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: date.toLocaleDateString('tr-TR', { month: 'short' }),
        agencies: Math.floor(Math.random() * 20) + 5,
        active: Math.floor(Math.random() * 15) + 3,
        pending: Math.floor(Math.random() * 8) + 1,
      };
    }).reverse();

    const statusData = [
      { name: t("Admin.agencies.activeAgencies"), value: statsData?.data?.active ?? 0, color: "#10b981" },
      { name: t("Admin.agencies.pendingAgencies"), value: statsData?.data?.pending ?? 0, color: "#f59e0b" },
      { name: t("Admin.agencies.suspendedAgencies"), value: statsData?.data?.suspended ?? 0, color: "#ef4444" },
    ];

    const growthData = last6Months.map((item, index) => ({
      month: item.month,
      total: last6Months.slice(0, index + 1).reduce((sum, d) => sum + d.agencies, 0),
      active: last6Months.slice(0, index + 1).reduce((sum, d) => sum + d.active, 0),
    }));

    return { growthData, statusData };
  }, [statsData, t]);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (agencyId: string) => {
    setSelectedAgency(agencyId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (agencyId: string) => {
    setSelectedAgency(agencyId);
    setIsDeleteModalOpen(true);
  };

  const handleRefresh = async () => {
    await refetch();
  };


  const handleFilters = (filters: {
    search?: string;
    status?: string;
    isActive?: boolean;
  }) => {
    setSearchTerm(filters.search ?? "");
    setSelectedStatus(filters.status ?? "all");
    setSelectedActive(
      filters.isActive === undefined
        ? "all"
        : filters.isActive
          ? "true"
          : "false",
    );
    setCurrentPage(1); // Reset to first page when filtering
    setIsFiltersModalOpen(false);
  };

  const _handleSortChange = (newSortBy: "createdAt" | "updatedAt" | "name") => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field with default desc order
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const columns = getAgencyColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  }, t);

  if (queryLoading && !agencies.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">{t("Admin.agencies.loading")}</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    const errorMessage =
      typeof queryError === "object" && queryError && "message" in queryError && typeof (queryError as { message?: unknown }).message === "string"
        ? (queryError as { message: string }).message
        : String(queryError);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">
            {t("Admin.agencies.errorLoading")}: {errorMessage}
          </p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("Admin.agencies.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
        <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("Admin.agencies.title")}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("Admin.agencies.description")}
              </p>
            </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
              {t("Admin.agencies.refresh")}
          </Button>
          <Button variant="outline" onClick={() => setIsFiltersModalOpen(true)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
              {t("Admin.agencies.filters")}
          </Button>
            <Button variant="outline" onClick={handleExportAgencies} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
              {isExporting ? t("Admin.agencies.exporting") : t("Admin.agencies.export")}
          </Button>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
              {t("Admin.agencies.addAgency")}
          </Button>
        </div>
      </div>

              {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group"
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Admin.agencies.totalAgencies")}
            </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? "..." : (statsData?.data?.total ?? 0)}
            </div>
          </CardContent>
        </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Admin.agencies.activeAgencies")}
            </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : (statsData?.data?.active ?? 0)}
            </div>
          </CardContent>
        </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group"
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Admin.agencies.pendingAgencies")}
            </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsLoading ? "..." : (statsData?.data?.pending ?? 0)}
            </div>
          </CardContent>
        </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group"
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("Admin.agencies.suspendedAgencies")}
            </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-500 shadow-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsLoading ? "..." : (statsData?.data?.suspended ?? 0)}
            </div>
          </CardContent>
        </Card>
          </motion.div>
        </div>
      </div>
              {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsList className="flex w-full bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-2 shadow-lg shadow-gray-200/20">
            <TabsTrigger value="overview" className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:scale-[1.02] text-gray-600">
              <BarChart3 className="mr-2 h-4 w-4" />
              {t("Admin.agencies.overview")}
            </TabsTrigger>
            <TabsTrigger value="agencies" className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:scale-[1.02] text-gray-600">
              <Building2 className="mr-2 h-4 w-4" />
              {t("Admin.agencies.agencies")}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:scale-[1.02] text-gray-600">
              <Activity className="mr-2 h-4 w-4" />
              {t("Admin.agencies.analytics")}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:scale-[1.02] text-gray-600">
              <Settings className="mr-2 h-4 w-4" />
              {t("Admin.agencies.settings")}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
        <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("Admin.agencies.overview")}
                </CardTitle>
          <CardDescription>
                  {t("Admin.agencies.recentActivityDescription")}
          </CardDescription>
        </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.recentActivity")}</h3>
                    <div className="space-y-3">
                      {agencies.slice(0, 5).map((agency, index) => (
                        <div key={agency?.id || index} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {agency?.name || t("Admin.agencies.unknownAgency")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {agency?.status} • {new Date(agency?.createdAt || '').toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={agency?.isActive ? "default" : "secondary"}>
                            {agency?.isActive ? t("Admin.agencies.activeAgencies") : t("Admin.agencies.inactive")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.quickActions")}</h3>
                    <div className="grid gap-3">
                      <Button onClick={() => setIsCreateModalOpen(true)} className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("Admin.agencies.createNewAgency")}
                      </Button>
                      <Button variant="outline" onClick={handleExportAgencies} className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        {t("Admin.agencies.exportData")}
                      </Button>
                      <Button variant="outline" onClick={handleRefresh} className="w-full justify-start">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t("Admin.agencies.refreshData")}
            </Button>
                    </div>
                  </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="mt-6">
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
        <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("Admin.agencies.agencyManagement")}
                </CardTitle>
          <CardDescription>
                  {t("Admin.agencies.agencyManagementDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={agencies}
            isLoading={queryLoading}
            error={(() => {
              if (!queryError) return undefined;
                    if (typeof queryError === "object" && queryError !== null && "message" in queryError && typeof (queryError as { message?: unknown }).message === "string") {
                      return (queryError as { message: string }).message;
                    }
                    return typeof queryError === "string" ? queryError : JSON.stringify(queryError);
            })()}
                  onExport={handleExportAgencies}
                  onFilter={() => setIsFiltersModalOpen(true)}
                  searchPlaceholder={t("Admin.agencies.table.search.placeholder")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("Admin.agencies.analyticsDashboard")}
                </CardTitle>
                <CardDescription>
                  {t("Admin.agencies.analyticsDashboardDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.agencyGrowth")}</h3>
                    <div className="h-64 bg-white/50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.growthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="total"
                            stackId="1"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                            name={t("Admin.agencies.totalAgencies")}
                          />
                          <Area
                            type="monotone"
                            dataKey="active"
                            stackId="1"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.6}
                            name={t("Admin.agencies.activeAgencies")}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
            </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.statusDistribution")}</h3>
                    <div className="h-64 bg-white/50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analyticsData.statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Additional Analytics Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.monthlyGrowth")}</h3>
                    <div className="h-64 bg-white/50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.growthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="agencies" 
                            fill="#3b82f6" 
                            radius={[4, 4, 0, 0]}
                            name={t("Admin.agencies.newAgencies")}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.trendAnalysis")}</h3>
                    <div className="h-64 bg-white/50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.growthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="active"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            name={t("Admin.agencies.activeAgencies")}
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
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-200/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("Admin.agencies.agencySettings")}
                </CardTitle>
                <CardDescription>
                  {t("Admin.agencies.agencySettingsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.generalSettings")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <span className="text-sm font-medium">{t("Admin.agencies.autoApproval")}</span>
                        <Button variant="outline" size="sm">{t("Admin.agencies.disabled")}</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <span className="text-sm font-medium">{t("Admin.agencies.emailNotifications")}</span>
                        <Button variant="outline" size="sm">{t("Admin.agencies.enabled")}</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <span className="text-sm font-medium">{t("Admin.agencies.dataRetentionPeriod")}</span>
                        <Button variant="outline" size="sm">90 {t("Admin.agencies.days")}</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("Admin.agencies.securitySettings")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <span className="text-sm font-medium">{t("Admin.agencies.twoFactorAuthentication")}</span>
                        <Button variant="outline" size="sm">{t("Admin.agencies.required")}</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <span className="text-sm font-medium">{t("Admin.agencies.sessionTimeout")}</span>
                        <Button variant="outline" size="sm">30 {t("Admin.agencies.minutes")}</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <span className="text-sm font-medium">{t("Admin.agencies.apiRateLimiting")}</span>
                        <Button variant="outline" size="sm">{t("Admin.agencies.enabled")}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      {/* Modals */}
      <AgencyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
          toast({
            title: t("Admin.agencies.success"),
            description: t("Admin.agencies.agencyCreated"),
          });
        }}
      />

      {selectedAgency && (
        <AgencyEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          agencyId={selectedAgency}
          onSuccess={() => {
            setIsEditModalOpen(false);
            refetch();
            toast({
              title: t("Admin.agencies.success"),
              description: t("Admin.agencies.agencyUpdated"),
            });
          }}
        />
      )}

      {selectedAgency && (
        <AgencyDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          agencyId={selectedAgency}
          onSuccess={() => {
            setIsDeleteModalOpen(false);
            refetch();
            toast({
              title: t("Admin.agencies.success"),
              description: t("Admin.agencies.agencyDeleted"),
            });
          }}
        />
      )}

      {/* Filters Modal */}
      <Dialog open={isFiltersModalOpen} onOpenChange={setIsFiltersModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("Admin.agencies.filterAgencies")}</DialogTitle>
            <DialogDescription>
              {t("Admin.agencies.filterDescription")}
            </DialogDescription>
          </DialogHeader>
          <AgencyFilterForm
            onFilter={handleFilters}
            initialValues={{
              search: searchTerm,
              status: selectedStatus,
              isActive:
                selectedActive === "all"
                  ? undefined
                  : selectedActive === "true",
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
