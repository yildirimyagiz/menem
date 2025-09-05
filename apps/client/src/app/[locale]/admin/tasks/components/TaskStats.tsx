"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

interface TaskStatsProps {
  stats?: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    byLabel: Record<string, number>;
    overdue: number;
    dueToday: number;
    dueThisWeek: number;
  };
}

const statCards = [
  {
    title: "Total Tasks",
    subtitle: "All tasks",
    value: "total",
    icon: TrendingUp,
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    shadow: "shadow-blue-200/60",
    border: "border-blue-200/40",
  },
  {
    title: "Completed",
    subtitle: "Done",
    value: "completed",
    icon: CheckCircle2,
    gradient: "from-green-400 via-green-500 to-green-600",
    shadow: "shadow-green-200/60",
    border: "border-green-200/40",
  },
  {
    title: "In Progress",
    subtitle: "Ongoing",
    value: "inProgress",
    icon: Clock,
    gradient: "from-yellow-300 via-yellow-400 to-yellow-500",
    shadow: "shadow-yellow-100/60",
    border: "border-yellow-200/40",
  },
  {
    title: "Overdue",
    subtitle: "Late",
    value: "overdue",
    icon: AlertCircle,
    gradient: "from-red-400 via-red-500 to-red-600",
    shadow: "shadow-red-200/60",
    border: "border-red-200/40",
  },
  {
    title: "Due Today",
    subtitle: "Today",
    value: "dueToday",
    icon: Calendar,
    gradient: "from-purple-400 via-purple-500 to-purple-600",
    shadow: "shadow-purple-200/60",
    border: "border-purple-200/40",
  },
  {
    title: "To Do",
    subtitle: "Pending",
    value: "todo",
    icon: Users,
    gradient: "from-indigo-400 via-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-200/60",
    border: "border-indigo-200/40",
  },
];

export function TaskStats({ stats }: TaskStatsProps) {
  const defaultStats = {
    total: 0,
    byStatus: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byLabel: {} as Record<string, number>,
    overdue: 0,
    dueToday: 0,
    dueThisWeek: 0,
  };

  const currentStats = stats ?? defaultStats;

  // Calculate derived values from the API response
  const derivedStats = {
    total: currentStats.total,
    completed: currentStats.byStatus.COMPLETED ?? 0,
    inProgress: currentStats.byStatus.IN_PROGRESS ?? 0,
    overdue: currentStats.overdue,
    dueToday: currentStats.dueToday,
    todo: currentStats.byStatus.TODO ?? 0,
  };

  const getValue = (cardValue: string) => {
    switch (cardValue) {
      case "total":
        return derivedStats.total;
      case "completed":
        return derivedStats.completed;
      case "inProgress":
        return derivedStats.inProgress;
      case "overdue":
        return derivedStats.overdue;
      case "dueToday":
        return derivedStats.dueToday;
      case "todo":
        return derivedStats.todo;
      default:
        return 0;
    }
  };

  return (
    <div className="relative z-10 mb-6 flex flex-wrap gap-6 rounded-3xl bg-white/60 p-4 shadow-2xl backdrop-blur-md dark:bg-slate-900/60 md:p-6 lg:mb-10 lg:p-8">
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        const value = getValue(card.value);
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className={`group flex min-w-[170px] flex-1 cursor-pointer flex-col items-center justify-between gap-2 rounded-2xl border ${card.border} bg-white/60 p-5 shadow-lg ${card.shadow} backdrop-blur-md transition-all duration-300 hover:scale-[1.04] hover:bg-white/80 hover:shadow-2xl dark:bg-slate-900/60 dark:hover:bg-slate-900/80`}
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}
          >
            <div className="flex w-full items-center justify-between">
              <div
                className={`rounded-xl bg-gradient-to-br ${card.gradient} p-3 shadow-md transition-all group-hover:scale-110`}
              >
                <IconComponent className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm dark:text-white">
                  {value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {card.subtitle}
                </span>
              </div>
            </div>
            <div className="mt-2 w-full text-left">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {card.title}
              </span>
            </div>
            {/* Progress bar for completion rate */}
            {card.value === "completed" && derivedStats.total > 0 && (
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Completion Rate</span>
                  <span>{Math.round((value / derivedStats.total) * 100)}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(value / derivedStats.total) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r ${card.gradient}`}
                  />
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
