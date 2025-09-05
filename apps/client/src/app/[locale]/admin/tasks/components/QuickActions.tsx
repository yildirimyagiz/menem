"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  RefreshCw,
  Settings2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

interface QuickActionsProps {
  onRefresh: () => void;
  onCreateTask?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onBulkActions?: () => void;
}

export function QuickActions({
  onRefresh,
  onCreateTask,
  onExport,
  onImport,
  onBulkActions,
}: QuickActionsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const quickActions = [
    {
      label: "Create Task",
      icon: Plus,
      onClick: onCreateTask,
      variant: "default" as const,
      className:
        "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg",
    },
    {
      label: "Refresh",
      icon: RefreshCw,
      onClick: handleRefresh,
      variant: "outline" as const,
      className: isRefreshing ? "animate-pulse" : "",
    },
  ];

  // Only team-related actions in the More menu
  const moreActions = [
    {
      label: "View Team Activity",
      icon: Users,
      onClick: () => {},
      description: "See recent team actions and updates",
    },
    {
      label: "Assign to Team",
      icon: UserPlus,
      onClick: () => {},
      description: "Assign this task to a specific team",
    },
    {
      label: "Manage Team",
      icon: Settings2,
      onClick: () => {},
      description: "Edit team members and permissions",
    },
    {
      label: "Mark as Team Priority",
      icon: UserCheck,
      onClick: () => {},
      description: "Flag this task as a team priority",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Primary Actions */}
      {quickActions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              variant={action.variant}
              size="sm"
              onClick={action.onClick}
              className={action.className}
              disabled={action.label === "Refresh" && isRefreshing}
            >
              <IconComponent
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="ml-2 hidden sm:inline">{action.label}</span>
            </Button>
          </motion.div>
        );
      })}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">More</span>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {moreActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <DropdownMenuItem
                key={action.label}
                onClick={action.onClick}
                className="flex items-start gap-3 p-3"
              >
                <IconComponent className="mt-0.5 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Indicators */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="ml-4 hidden items-center gap-4 border-l border-gray-200 pl-4 dark:border-gray-700 lg:flex"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>System Online</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span>Auto-sync Enabled</span>
        </div>
      </motion.div>
    </div>
  );
}
