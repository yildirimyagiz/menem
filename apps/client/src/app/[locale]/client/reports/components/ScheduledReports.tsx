"use client";

import type { FC } from "react";
import { useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Pause,
  Play,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { ReportType } from "@reservatior/validators";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Switch } from "@reservatior/ui/switch";

import { api } from "~/trpc/react";

interface ScheduledReport {
  id: string;
  title: string;
  reportType: ReportType;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  cronExpression: string;
  isActive: boolean;
  agencyId?: string;
  propertyId?: string;
  agentId?: string;
  tenantId?: string;
  generatedById: string;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// AceternityUI-style gradient backgrounds
const gradients = {
  primary: "from-blue-600 via-purple-600 to-indigo-600",
  success: "from-green-500 via-emerald-500 to-teal-500",
  warning: "from-yellow-500 via-orange-500 to-red-500",
  info: "from-cyan-500 via-blue-500 to-indigo-500",
};

const ScheduledReports: FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<ScheduledReport | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    reportType: "FINANCIAL" as ReportType,
    frequency: "daily" as "daily" | "weekly" | "monthly" | "yearly",
    cronExpression: "",
    isActive: true,
    agencyId: "",
    propertyId: "",
    agentId: "",
    tenantId: "",
  });

  // API queries and mutations
  const {
    data: scheduledReports,
    isLoading,
    refetch,
  } = api.report.scheduledReports.useQuery();

  const createScheduledReportMutation =
    api.report.createScheduledReport.useMutation({
      onSuccess: () => {
        showToast("Success", "Scheduled report created successfully");
        refetch();
        setShowCreateForm(false);
        resetForm();
      },
      onError: (error: any) => {
        showToast(
          "Error",
          error.message || "Failed to create scheduled report",
          "destructive",
        );
      },
    });

  const updateScheduledReportMutation =
    api.report.updateScheduledReport.useMutation({
      onSuccess: () => {
        showToast("Success", "Scheduled report updated successfully");
        refetch();
        setEditingSchedule(null);
        resetForm();
      },
      onError: (error: any) => {
        showToast(
          "Error",
          error.message || "Failed to update scheduled report",
          "destructive",
        );
      },
    });

  const deleteScheduledReportMutation =
    api.report.deleteScheduledReport.useMutation({
      onSuccess: () => {
        showToast("Success", "Scheduled report deleted successfully");
        refetch();
      },
      onError: (error: any) => {
        showToast(
          "Error",
          error.message || "Failed to delete scheduled report",
          "destructive",
        );
      },
    });

  const triggerScheduledReportMutation =
    api.report.triggerScheduledReport.useMutation({
      onSuccess: () => {
        showToast("Success", "Report generation triggered successfully");
      },
      onError: (error: any) => {
        showToast(
          "Error",
          error.message || "Failed to trigger report generation",
          "destructive",
        );
      },
    });

  // Simple toast function
  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" = "default",
  ) => {
    console.log(
      `${variant === "destructive" ? "Error" : "Success"}: ${title} - ${description}`,
    );
  };

  const resetForm = () => {
    setFormData({
      title: "",
      reportType: "FINANCIAL",
      frequency: "daily",
      cronExpression: "",
      isActive: true,
      agencyId: "",
      propertyId: "",
      agentId: "",
      tenantId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSchedule) {
      await updateScheduledReportMutation.mutateAsync({
        id: editingSchedule.id,
        ...formData,
      });
    } else {
      await createScheduledReportMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (schedule: ScheduledReport) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      reportType: schedule.reportType,
      frequency: schedule.frequency,
      cronExpression: schedule.cronExpression,
      isActive: schedule.isActive,
      agencyId: schedule.agencyId || "",
      propertyId: schedule.propertyId || "",
      agentId: schedule.agentId || "",
      tenantId: schedule.tenantId || "",
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this scheduled report?")) {
      await deleteScheduledReportMutation.mutateAsync(id);
    }
  };

  const handleTrigger = async (id: string) => {
    await triggerScheduledReportMutation.mutateAsync({ scheduleId: id });
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return frequency;
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return <Calendar className="h-4 w-4" />;
      case "weekly":
        return <BarChart3 className="h-4 w-4" />;
      case "monthly":
        return <TrendingUp className="h-4 w-4" />;
      case "yearly":
        return <Settings className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getReportTypeColor = (type: ReportType) => {
    switch (type) {
      case "FINANCIAL":
        return "bg-green-100 text-green-800 border-green-200";
      case "PERFORMANCE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "REVENUE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "OCCUPANCY":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MARKET_ANALYSIS":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "COMPLIANCE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with gradient background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Scheduled Reports</h2>
              <p className="mt-2 text-blue-100">
                Automate your report generation with intelligent scheduling
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingSchedule(null);
                  resetForm();
                }}
                disabled={showCreateForm}
                className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Schedule
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm" />
        <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full bg-white/5 backdrop-blur-sm" />
      </motion.div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-semibold">
                  {editingSchedule ? (
                    <>
                      <Edit3 className="mr-2 inline h-5 w-5" />
                      Edit Scheduled Report
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 inline h-5 w-5" />
                      Create Scheduled Report
                    </>
                  )}
                </h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Report Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Daily Financial Summary"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="reportType"
                        className="text-sm font-medium"
                      >
                        Report Type
                      </Label>
                      <Select
                        value={formData.reportType}
                        onValueChange={(value: ReportType) =>
                          setFormData({ ...formData, reportType: value })
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FINANCIAL">Financial</SelectItem>
                          <SelectItem value="PERFORMANCE">
                            Performance
                          </SelectItem>
                          <SelectItem value="REVENUE">Revenue</SelectItem>
                          <SelectItem value="OCCUPANCY">Occupancy</SelectItem>
                          <SelectItem value="MARKET_ANALYSIS">
                            Market Analysis
                          </SelectItem>
                          <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="frequency"
                        className="text-sm font-medium"
                      >
                        Frequency
                      </Label>
                      <Select
                        value={formData.frequency}
                        onValueChange={(
                          value: "daily" | "weekly" | "monthly" | "yearly",
                        ) => setFormData({ ...formData, frequency: value })}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="cronExpression"
                        className="text-sm font-medium"
                      >
                        Cron Expression (Optional)
                      </Label>
                      <Input
                        id="cronExpression"
                        value={formData.cronExpression}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cronExpression: e.target.value,
                          })
                        }
                        placeholder="0 9 * * * (Daily at 9 AM)"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Active Schedule
                    </Label>
                    {formData.isActive ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600"
                      >
                        <Pause className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingSchedule(null);
                        resetForm();
                      }}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        createScheduledReportMutation.isPending ||
                        updateScheduledReportMutation.isPending
                      }
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {editingSchedule ? "Update Schedule" : "Create Schedule"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scheduled Reports List */}
      <Card className="overflow-hidden border-0 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Active Schedules
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage your automated report generation schedules
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <p className="text-sm text-gray-600">
                  Loading scheduled reports...
                </p>
              </div>
            </div>
          ) : scheduledReports && scheduledReports.length > 0 ? (
            <div className="space-y-4">
              {scheduledReports.map(
                (schedule: ScheduledReport, index: number) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
                  >
                    {/* Gradient accent */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600" />

                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            {getFrequencyIcon(schedule.frequency)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                              {schedule.title}
                            </h4>
                            <div className="mt-1 flex items-center space-x-2">
                              {getStatusIcon(schedule.isActive)}
                              <span
                                className={`text-sm font-medium ${getStatusColor(schedule.isActive)}`}
                              >
                                {schedule.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`border ${getReportTypeColor(schedule.reportType)}`}
                          >
                            {schedule.reportType}
                          </Badge>
                          <Badge variant="outline" className="border-gray-200">
                            {getFrequencyIcon(schedule.frequency)}
                            <span className="ml-1">
                              {getFrequencyLabel(schedule.frequency)}
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gray-200 font-mono text-xs"
                          >
                            {schedule.cronExpression}
                          </Badge>
                        </div>

                        {schedule.lastRun && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>
                              Last run:{" "}
                              {format(
                                new Date(schedule.lastRun),
                                "MMM dd, yyyy HH:mm",
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTrigger(schedule.id)}
                            disabled={triggerScheduledReportMutation.isPending}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Zap className="mr-1 h-3 w-3" />
                            Trigger
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(schedule)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit3 className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(schedule.id)}
                            disabled={deleteScheduledReportMutation.isPending}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                <BarChart3 className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No scheduled reports found
              </h3>
              <p className="mx-auto mb-6 max-w-md text-gray-600">
                Create your first scheduled report to automate your reporting
                workflow and save time.
              </p>
              <Button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingSchedule(null);
                  resetForm();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Schedule
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ScheduledReports;
