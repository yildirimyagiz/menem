"use client";

import type { FC } from "react";
import { useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import type { Report, ReportStatus, ReportType } from "@reservatior/validators";

import type {
  ReportConfig as EnhancedReportConfig,
  ReportConfig,
} from "./components/EnhancedReportGenerator";
import type { ReportConfig as ClassicReportConfig } from "./components/ReportGenerator";
import { api } from "~/trpc/react";
import EnhancedReportGenerator from "./components/EnhancedReportGenerator";
import ReportGenerator from "./components/ReportGenerator";
import ReportList from "./components/ReportList";
import ReportViewer from "./components/ReportViewer";

// Extended report type with content for viewer
export interface ReportWithContent extends Report {
  type: string;
  format: string;
  content?: {
    summary?: string;
    data?: any;
    charts?: any[];
    tables?: any[];
  };
}

const PAGE_SIZE = 10;

// Report view types
type ReportView = "all" | "my" | "agency" | "scheduled";

// Simple toast function (replace with your toast system)
const showToast = (
  title: string,
  description: string,
  variant: "default" | "destructive" = "default",
) => {
  console.log(
    `${variant === "destructive" ? "Error" : "Success"}: ${title} - ${description}`,
  );
};

// AceternityUI-inspired components
const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-neutral-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
);

const FloatingNav = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="sticky top-4 z-50 mb-8 rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/80"
  >
    {children}
  </motion.div>
);

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`group relative overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800/50 dark:bg-neutral-900/50 ${className}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp
                className={`h-4 w-4 ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const ViewSelector = ({
  currentView,
  onViewChange,
}: {
  currentView: ReportView;
  onViewChange: (view: ReportView) => void;
}) => {
  const views = [
    { key: "all" as const, label: "All Reports", icon: FileText },
    { key: "my" as const, label: "My Reports", icon: Users },
    { key: "agency" as const, label: "Agency Reports", icon: Building2 },
    { key: "scheduled" as const, label: "Scheduled", icon: Calendar },
  ];

  return (
    <div className="flex space-x-2">
      {views.map(({ key, label, icon: Icon }) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
            currentView === key
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "bg-white/50 text-neutral-700 hover:bg-white/80 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
          }`}
          onClick={() => onViewChange(key)}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </motion.button>
      ))}
    </div>
  );
};

const ReportsPage: FC = () => {
  const [selectedReport, setSelectedReport] =
    useState<ReportWithContent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportToDelete, setReportToDelete] =
    useState<ReportWithContent | null>(null);
  const [reportView, setReportView] = useState<ReportView>("all");
  const [filters, setFilters] = useState({
    title: "",
    reportType: undefined as ReportType | undefined,
    status: undefined as ReportStatus | undefined,
    startDateFrom: undefined as Date | undefined,
    startDateTo: undefined as Date | undefined,
  });
  const [useEnhanced, setUseEnhanced] = useState(true);
  const [generatorOpen, setGeneratorOpen] = useState(true);
  const [tableOpen, setTableOpen] = useState(true);
  const [selectedTypeSummary, setSelectedTypeSummary] = useState<string>("");

  // API queries and mutations
  const {
    data: reportsData,
    isLoading,
    refetch,
  } = api.report.all.useQuery({
    page: currentPage,
    pageSize: PAGE_SIZE,
    ...filters,
  });

  const createReportMutation = api.report.create.useMutation({
    onSuccess: () => {
      showToast("Success", "Report created successfully");
      refetch();
    },
    onError: (error: any) => {
      showToast(
        "Error",
        error.message || "Failed to create report",
        "destructive",
      );
    },
  });

  const deleteReportMutation = api.report.delete.useMutation({
    onSuccess: () => {
      showToast("Success", "Report deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      showToast(
        "Error",
        error.message || "Failed to delete report",
        "destructive",
      );
    },
  });

  // Handle report generation for both generators
  const handleGenerateReport = async (
    config: ClassicReportConfig | EnhancedReportConfig,
  ) => {
    try {
      await createReportMutation.mutateAsync({
        title: config.title,
        reportType: config.reportType,
        generatedById: "current-user-id",
        startDate: config.startDate,
        endDate: config.endDate,
        description: config.description,
        agencyId: config.filters.agencyId,
        facilityId: (config as any).filters?.facilityId,
        propertyId: config.filters.propertyId,
        tenantId: config.filters.tenantId,
        agentId: config.filters.agentId,
        reservationIds: [],
        format: (config as any).format || "PDF",
      } as any);
      showToast(
        "Report Generated",
        `Report "${config.title}" has been created successfully.`,
      );
    } catch (error) {
      console.error("Error generating report:", error);
      showToast(
        "Generation Failed",
        "Failed to generate report. Please try again.",
        "destructive",
      );
    }
  };

  const handleEnhancedGenerate = async (config: EnhancedReportConfig) => {
    setSelectedTypeSummary(config.title || config.reportType);
    await handleGenerateReport(config);
  };

  const handleClassicGenerate = async (config: ClassicReportConfig) => {
    setSelectedTypeSummary(config.title || config.reportType);
    await handleGenerateReport(config);
  };

  const handleViewReport = (report: ReportWithContent) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = async (report: ReportWithContent) => {
    try {
      showToast("Download Started", `Downloading ${report.title}...`);
    } catch (error) {
      showToast("Download Failed", "Failed to download report", "destructive");
    }
  };

  const handleDeleteReport = (report: ReportWithContent) => {
    setReportToDelete(report);
    setShowDeleteDialog(true);
  };

  const confirmDeleteReport = async () => {
    if (!reportToDelete?.id) return;

    try {
      await deleteReportMutation.mutateAsync(reportToDelete.id);
      setShowDeleteDialog(false);
      setReportToDelete(null);
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewChange = (view: ReportView) => {
    setReportView(view);
    setCurrentPage(1);
  };

  // Convert API data to extended format
  const reportsWithContent: ReportWithContent[] = (reportsData?.data || []).map(
    (report: any) => ({
      ...report,
      id: report.id || "",
      type: report.reportType || "FINANCIAL",
      format: "PDF",
      content: {
        summary: `This is a ${(report.reportType || "financial").toLowerCase()} report covering the period from ${format(new Date(report.startDate || new Date()), "MMM dd, yyyy")} to ${format(new Date(report.endDate || new Date()), "MMM dd, yyyy")}.`,
        data: {
          totalRevenue: report.totalRevenue || 0,
          totalBookings: report.totalBookings || 0,
          occupancyRate: report.occupancyRate || 0,
          averagePrice: report.averagePrice || 0,
        },
        charts: [{ type: "bar", data: [30, 40, 35, 50, 49, 60, 70] }],
        tables: [
          {
            headers: ["Metric", "Value"],
            rows: [
              [
                "Total Revenue",
                `$${report.totalRevenue?.toLocaleString() || 0}`,
              ],
              ["Total Bookings", report.totalBookings?.toString() || "0"],
              ["Occupancy Rate", `${report.occupancyRate?.toFixed(1) || 0}%`],
              ["Average Price", `$${report.averagePrice?.toFixed(2) || 0}`],
            ],
          },
        ],
      },
    }),
  );

  const totalPages = Math.ceil((reportsData?.total || 0) / PAGE_SIZE);

  // Render scheduled reports view
  if (reportView === "scheduled") {
    return (
      <div className="relative min-h-screen">
        <BackgroundGradient />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <FloatingNav>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Scheduled Reports
                  </h1>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Manage automated report generation
                  </p>
                </div>
              </div>
              <ViewSelector
                currentView={reportView}
                onViewChange={handleViewChange}
              />
            </div>
          </FloatingNav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Active Schedules"
                value="12"
                icon={Zap}
                trend={{ value: 8, isPositive: true }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50"
              />
              <StatsCard
                title="Reports Generated"
                value="1,247"
                icon={FileText}
                trend={{ value: 12, isPositive: true }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50"
              />
              <StatsCard
                title="Success Rate"
                value="98.5%"
                icon={Target}
                trend={{ value: 2, isPositive: true }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50"
              />
              <StatsCard
                title="Next Generation"
                value="2h 34m"
                icon={Clock}
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50"
              />
            </div>

            {/* Scheduled Reports Content */}
            <div className="rounded-2xl border border-neutral-200/50 bg-white/50 p-8 shadow-xl backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
                  Automated Report Generation
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Set up automated reports that generate automatically based on
                  your schedule
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Daily",
                    description: "Financial summaries, occupancy updates",
                    icon: Sparkles,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Weekly",
                    description: "Performance reports, booking trends",
                    icon: TrendingUp,
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Monthly",
                    description: "Revenue analysis, market insights",
                    icon: BarChart3,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    title: "Yearly",
                    description: "Compliance reports, annual summaries",
                    icon: Target,
                    color: "from-orange-500 to-red-500",
                  },
                ].map((schedule, index) => (
                  <motion.div
                    key={schedule.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group relative overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800/50 dark:bg-neutral-900/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${schedule.color} text-white shadow-lg`}
                      >
                        <schedule.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {schedule.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {schedule.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-neutral-200/50 bg-neutral-50/50 p-6 dark:border-neutral-800/50 dark:bg-neutral-800/50">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Scheduled reports are automatically generated and stored in
                  your reports library. You can also trigger reports manually at
                  any time.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundGradient />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FloatingNav>
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Reports Dashboard
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Generate and manage your reports
                </p>
              </div>
            </div>
            <ViewSelector
              currentView={reportView}
              onViewChange={handleViewChange}
            />
          </div>
        </FloatingNav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Reports"
              value={reportsData?.total || 0}
              icon={FileText}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50"
            />
            <StatsCard
              title="This Month"
              value="24"
              icon={Calendar}
              trend={{ value: 15, isPositive: true }}
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50"
            />
            <StatsCard
              title="Success Rate"
              value="99.2%"
              icon={Target}
              trend={{ value: 1, isPositive: true }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50"
            />
            <StatsCard
              title="Avg. Generation"
              value="2.3s"
              icon={Zap}
              trend={{ value: 8, isPositive: true }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50"
            />
          </div>

          {/* Generator Controls */}
          <div className="rounded-2xl border border-neutral-200/50 bg-white/50 p-6 shadow-xl backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Report Generator
                </h2>

                {/* Generator Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Mode:
                  </span>
                  <div className="flex rounded-lg border border-neutral-200/50 bg-neutral-100/50 p-1 dark:border-neutral-700/50 dark:bg-neutral-800/50">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-all duration-200 ${
                        useEnhanced
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                      }`}
                      onClick={() => setUseEnhanced(true)}
                    >
                      Enhanced
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-all duration-200 ${
                        !useEnhanced
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                      }`}
                      onClick={() => setUseEnhanced(false)}
                    >
                      Classic
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rounded-lg border border-neutral-200/50 bg-white/50 px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/80 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  onClick={() => setGeneratorOpen(!generatorOpen)}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      generatorOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                  <span>{generatorOpen ? "Hide" : "Show"} Generator</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rounded-lg border border-neutral-200/50 bg-white/50 px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/80 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  onClick={() => setTableOpen(!tableOpen)}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      tableOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                  <span>{tableOpen ? "Hide" : "Show"} Table</span>
                </motion.button>
              </div>
            </div>

            {/* Generator Summary */}
            {!generatorOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-950/50 dark:to-purple-950/50"
              >
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Generator collapsed.{" "}
                  {selectedTypeSummary
                    ? `Last: ${selectedTypeSummary}`
                    : "No type selected."}
                </p>
              </motion.div>
            )}

            {/* Animated Generator Section */}
            <AnimatePresence initial={false}>
              {generatorOpen && (
                <motion.div
                  key="generator"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  {useEnhanced ? (
                    <EnhancedReportGenerator
                      onGenerate={handleEnhancedGenerate}
                      isLoading={createReportMutation.isPending}
                    />
                  ) : (
                    <ReportGenerator
                      onGenerate={handleClassicGenerate}
                      isLoading={createReportMutation.isPending}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reports Table Section */}
          <div className="rounded-2xl border border-neutral-200/50 bg-white/50 shadow-xl backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between border-b border-neutral-200/50 p-6 dark:border-neutral-700/50">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    Generated Reports
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {reportsData?.total || 0} reports found
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                onClick={() => refetch()}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </motion.button>
            </div>

            {/* Table Summary */}
            {!tableOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-neutral-200/50 p-4 dark:border-neutral-700/50"
              >
                <div className="rounded-lg bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 dark:from-neutral-800/50 dark:to-neutral-700/50">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Table collapsed. {reportsData?.total || 0} reports in total.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Animated Table Section */}
            <AnimatePresence initial={false}>
              {tableOpen && (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <ReportList
                    reports={reportsWithContent}
                    onView={handleViewReport}
                    onDownload={handleDownloadReport}
                    onDelete={handleDeleteReport}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Report Viewer Modal */}
        {selectedReport && (
          <ReportViewer
            report={{
              id: selectedReport.id || "",
              type: selectedReport.type,
              format: selectedReport.format,
              content: selectedReport.content || {},
            }}
            onClose={() => setSelectedReport(null)}
            onDownload={() => handleDownloadReport(selectedReport)}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-neutral-200/50 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/95"
            >
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Delete Report
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="mb-6 text-neutral-700 dark:text-neutral-300">
                Are you sure you want to delete "{reportToDelete?.title}"?
              </p>

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg border border-neutral-200/50 bg-white/50 px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/80 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleteReportMutation.isPending}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                  onClick={confirmDeleteReport}
                  disabled={deleteReportMutation.isPending}
                >
                  {deleteReportMutation.isPending ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
