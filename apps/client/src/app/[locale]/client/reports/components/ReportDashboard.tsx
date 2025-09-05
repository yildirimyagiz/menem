"use client";

import type { FC } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Home,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card } from "@reservatior/ui/card";

interface ReportStats {
  totalReports: number;
  activeSchedules: number;
  reportsThisMonth: number;
  totalRevenue: number;
  pendingReports: number;
  completedReports: number;
}

interface ReportDashboardProps {
  stats: ReportStats;
  onViewReports: () => void;
  onCreateSchedule: () => void;
  onGenerateReport: () => void;
}

const ReportDashboard: FC<ReportDashboardProps> = ({
  stats,
  onViewReports,
  onCreateSchedule,
  onGenerateReport,
}) => {
  const statCards = [
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Schedules",
      value: stats.activeSchedules,
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "This Month",
      value: stats.reportsThisMonth,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Generate Report",
      description: "Create a new report instantly",
      icon: Plus,
      color: "from-blue-600 to-purple-600",
      onClick: onGenerateReport,
    },
    {
      title: "Schedule Report",
      description: "Set up automated reporting",
      icon: Calendar,
      color: "from-green-600 to-emerald-600",
      onClick: onCreateSchedule,
    },
    {
      title: "View All Reports",
      description: "Browse your report library",
      icon: Eye,
      color: "from-purple-600 to-pink-600",
      onClick: onViewReports,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Reports Dashboard</h1>
              <p className="mt-2 text-lg text-indigo-100">
                Monitor and manage your automated reporting system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="border-white/30 bg-white/20 text-white"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                System Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm" />
        <div className="absolute bottom-4 left-4 h-20 w-20 rounded-full bg-white/5 backdrop-blur-sm" />
        <div className="absolute right-1/4 top-1/2 h-16 w-16 rounded-full bg-white/5 backdrop-blur-sm" />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-0 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${stat.color} text-white`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="group cursor-pointer overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              onClick={action.onClick}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${action.color} text-white transition-transform duration-300 group-hover:scale-110`}
                  >
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="overflow-hidden border-0 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Latest report generation and schedule updates
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                type: "Generated",
                title: "Monthly Revenue Report",
                time: "2 hours ago",
                status: "success",
                icon: CheckCircle,
              },
              {
                type: "Scheduled",
                title: "Weekly Performance Report",
                time: "1 day ago",
                status: "pending",
                icon: Clock,
              },
              {
                type: "Updated",
                title: "Daily Financial Summary",
                time: "3 days ago",
                status: "info",
                icon: AlertCircle,
              },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-gray-50"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    activity.status === "success"
                      ? "bg-green-100 text-green-600"
                      : activity.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">
                    {activity.type} • {activity.time}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    activity.status === "success"
                      ? "border-green-200 text-green-700"
                      : activity.status === "pending"
                        ? "border-yellow-200 text-yellow-700"
                        : "border-blue-200 text-blue-700"
                  }
                >
                  {activity.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
            <h3 className="text-xl font-semibold">System Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Scheduler Service
                </span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Database Connection
                </span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Report Generation
                </span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Operational
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-0 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <h3 className="text-xl font-semibold">Performance Metrics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Success Rate
                </span>
                <span className="text-lg font-semibold text-green-600">
                  98.5%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Avg Generation Time
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  2.3s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Uptime
                </span>
                <span className="text-lg font-semibold text-purple-600">
                  99.9%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportDashboard;
