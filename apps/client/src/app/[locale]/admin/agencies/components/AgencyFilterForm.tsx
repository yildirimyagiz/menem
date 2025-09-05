"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { AgencyStatus } from "@reservatior/validators";
import { useTranslations } from "next-intl";

interface AgencyFilter {
  search?: string;
  status?: string;
  isActive?: boolean;
}

interface AgencyFilterFormProps {
  onFilter: (filter: AgencyFilter) => void;
  initialValues?: AgencyFilter;
}

export default function AgencyFilterForm({
  onFilter,
  initialValues = {},
}: AgencyFilterFormProps) {
  const t = useTranslations();
  const [search, setSearch] = useState(initialValues.search ?? "");
  const [status, setStatus] = useState(initialValues.status ?? "all");
  const [isActive, setIsActive] = useState(
    initialValues.isActive === undefined
      ? "all"
      : initialValues.isActive
        ? "true"
        : "false",
  );

  const handleApply = () => {
    onFilter({
      search: search || undefined,
      status: status !== "all" ? status : undefined,
      isActive: isActive !== "all" ? isActive === "true" : undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setIsActive("all");
    onFilter({});
  };

  // Update form when initial values change
  useEffect(() => {
    setSearch(initialValues.search ?? "");
    setStatus(initialValues.status ?? "all");
    setIsActive(
      initialValues.isActive === undefined
        ? "all"
        : initialValues.isActive
          ? "true"
          : "false",
    );
  }, [initialValues]);

  const hasActiveFilters = search || status !== "all" || isActive !== "all";

  const getFilterBadgeText = useCallback((type: string, value: string) => {
    switch (type) {
      case "search":
        return t("Admin.agencies.filterForm.badges.search", { defaultValue: "Search" }) + `: "${value}"`;
      case "status":
        return t("Admin.agencies.filterForm.badges.status", { defaultValue: "Status" }) + `: ${value}`;
      case "isActive":
        return t("Admin.agencies.filterForm.badges.activeStatus", { defaultValue: "Active Status" }) + `: ${value === "true" ? t("Admin.agencies.filterForm.badges.active", { defaultValue: "Active" }) : t("Admin.agencies.filterForm.badges.inactive", { defaultValue: "Inactive" })}`;
      default:
        return value;
    }
  }, [t]);

  return (
    <div className="space-y-6">
      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {t("Admin.agencies.filterForm.activeFilters", { defaultValue: "Active Filters" })}:
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-6 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                <X className="h-3 w-3 mr-1" />
                {t("Admin.agencies.filterForm.clearAll", { defaultValue: "Clear All" })}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {search && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {getFilterBadgeText("search", search)}
                  </Badge>
                </motion.div>
              )}
              {status !== "all" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                    {getFilterBadgeText("status", status)}
                  </Badge>
                </motion.div>
              )}
              {isActive !== "all" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {getFilterBadgeText("isActive", isActive)}
                  </Badge>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Form */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Search Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Admin.agencies.filterForm.searchLabel", { defaultValue: "Search" })}
          </label>
          <Input
            placeholder={t("Admin.agencies.filterForm.searchPlaceholder", { defaultValue: "Search agencies..." })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Admin.agencies.filterForm.statusLabel", { defaultValue: "Status" })}
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder={t("Admin.agencies.filterForm.statusPlaceholder", { defaultValue: "Select status" })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("Admin.agencies.filterForm.allStatuses", { defaultValue: "All Statuses" })}
              </SelectItem>
              {AgencyStatus.options.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {t(`Admin.agencies.filterForm.statusOptions.${statusOption}`, { defaultValue: statusOption })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Admin.agencies.filterForm.activeStatusLabel", { defaultValue: "Active Status" })}
          </label>
          <Select value={isActive} onValueChange={setIsActive}>
            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder={t("Admin.agencies.filterForm.activeStatusPlaceholder", { defaultValue: "Select active status" })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("Admin.agencies.filterForm.allAgencies", { defaultValue: "All Agencies" })}
              </SelectItem>
              <SelectItem value="true">
                {t("Admin.agencies.filterForm.active", { defaultValue: "Active" })}
              </SelectItem>
              <SelectItem value="false">
                {t("Admin.agencies.filterForm.inactive", { defaultValue: "Inactive" })}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={handleReset}
          className="h-10 px-4"
        >
          {t("Admin.agencies.filterForm.reset", { defaultValue: "Reset" })}
        </Button>
        <Button
          onClick={handleApply}
          className="h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Filter className="mr-2 h-4 w-4" />
          {t("Admin.agencies.filterForm.apply", { defaultValue: "Apply Filters" })}
        </Button>
      </div>
    </div>
  );
}
