"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Pause,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { ContractStatusType } from "@reservatior/validators";
import { Badge } from "@reservatior/ui/badge";

import { cn } from "~/lib/utils";

interface ContractStatusBadgeProps {
  status: ContractStatusType;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    iconClassName: "text-green-600 dark:text-green-400",
  },
  INACTIVE: {
    label: "Inactive",
    icon: Pause,
    className:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800",
    iconClassName: "text-gray-600 dark:text-gray-400",
  },
  DRAFT: {
    label: "Draft",
    icon: FileText,
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    iconClassName: "text-blue-600 dark:text-blue-400",
  },
  PUBLISHED: {
    label: "Published",
    icon: CheckCircle,
    className:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    iconClassName: "text-purple-600 dark:text-purple-400",
  },
  EXPIRED: {
    label: "Expired",
    icon: XCircle,
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    iconClassName: "text-red-600 dark:text-red-400",
  },
  TERMINATED: {
    label: "Terminated",
    icon: XCircle,
    className:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    iconClassName: "text-orange-600 dark:text-orange-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    iconClassName: "text-yellow-600 dark:text-yellow-400",
  },
  OVERDUE: {
    label: "Overdue",
    icon: AlertTriangle,
    className:
      "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800",
    iconClassName: "text-pink-600 dark:text-pink-400",
  },
  RENEWED: {
    label: "Renewed",
    icon: RotateCcw,
    className:
      "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
    iconClassName: "text-indigo-600 dark:text-indigo-400",
  },
};

const sizeConfig = {
  sm: {
    badge: "px-2 py-1 text-xs",
    icon: "h-3 w-3",
  },
  md: {
    badge: "px-3 py-1.5 text-sm",
    icon: "h-4 w-4",
  },
  lg: {
    badge: "px-4 py-2 text-base",
    icon: "h-5 w-5",
  },
};

export const ContractStatusBadge = ({
  status,
  className,
  showIcon = true,
  size = "md",
}: ContractStatusBadgeProps) => {
  const t = useTranslations("contract.status");
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];

  if (!config) {
    return (
      <Badge
        variant="secondary"
        className={cn("border font-medium", sizeStyles.badge, className)}
      >
        {status}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Badge
        variant="secondary"
        className={cn(
          "flex items-center gap-1.5 border font-medium transition-all duration-200 hover:shadow-sm",
          sizeStyles.badge,
          config.className,
          className,
        )}
      >
        {showIcon && (
          <Icon className={cn(sizeStyles.icon, config.iconClassName)} />
        )}
        <span className="font-semibold">{t(status.toLowerCase())}</span>
      </Badge>
    </motion.div>
  );
};

// Enhanced status indicator with pulse animation for active contracts
export const ContractStatusIndicator = ({
  status,
  className,
}: {
  status: ContractStatusType;
  className?: string;
}) => {
  const config = statusConfig[status];
  const Icon = config?.icon || Clock;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex h-2 w-2 items-center justify-center rounded-full",
        status === "ACTIVE" && "animate-pulse bg-green-500",
        status === "EXPIRED" && "bg-red-500",
        status === "DRAFT" && "bg-blue-500",
        status === "PUBLISHED" && "bg-purple-500",
        status === "OVERDUE" && "bg-pink-500",
        status === "TERMINATED" && "bg-orange-500",
        status === "CANCELLED" && "bg-yellow-500",
        status === "RENEWED" && "bg-indigo-500",
        status === "INACTIVE" && "bg-gray-500",
        className,
      )}
    >
      {status === "ACTIVE" && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1 w-1 rounded-full bg-white"
        />
      )}
    </motion.div>
  );
};

// Status summary component for dashboard
export const ContractStatusSummary = ({
  status,
  count,
  className,
}: {
  status: ContractStatusType;
  count: number;
  className?: string;
}) => {
  const t = useTranslations("contract.status");
  const config = statusConfig[status];
  const Icon = config?.icon || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          config?.className.replace("text-", "bg-").replace("border-", ""),
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {t(status.toLowerCase())}
        </p>
        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
          {count}
        </p>
      </div>
    </motion.div>
  );
};
