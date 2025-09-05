"use client";

import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, Filter, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";
import type { ContractStatusType } from "@reservatior/validators";

import { cn } from "~/lib/utils";
import type { ContractFilter } from "../types";

interface ContractFilterFormProps {
  onFilter: (filter: ContractFilter) => void;
}

const getContractStatusOptions = (t: ReturnType<typeof useTranslations>) => [
  {
    value: "ACTIVE",
    label: t("status.active"),
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    value: "INACTIVE",
    label: t("status.inactive"),
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
  {
    value: "DRAFT",
    label: t("status.draft"),
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "PUBLISHED",
    label: t("status.published"),
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    value: "EXPIRED",
    label: t("status.expired"),
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    value: "TERMINATED",
    label: t("status.terminated"),
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    value: "CANCELLED",
    label: t("status.cancelled"),
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "OVERDUE",
    label: t("status.overdue"),
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    value: "RENEWED",
    label: t("status.renewed"),
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
];

const ContractFilterForm = ({ onFilter }: ContractFilterFormProps) => {
  const t = useTranslations("contract");
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<ContractStatusType | null>(null);
  const [tenantId, setTenantId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [startDateFrom, setStartDateFrom] = useState<Date | undefined>();
  const [startDateTo, setStartDateTo] = useState<Date | undefined>();
  const [endDateFrom, setEndDateFrom] = useState<Date | undefined>();
  const [endDateTo, setEndDateTo] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState<
    "startDate" | "endDate" | "status" | "name"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setStatus(null);
    } else {
      setStatus(value as ContractStatusType);
    }
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value as "startDate" | "endDate" | "status" | "name");
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as "asc" | "desc");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      status: status ?? undefined,
      tenantId: tenantId || undefined,
      propertyId: propertyId || undefined,
      agencyId: agencyId || undefined,
      startDateFrom: startDateFrom ? startDateFrom.toISOString() : undefined,
      startDateTo: startDateTo ? startDateTo.toISOString() : undefined,
      endDateFrom: endDateFrom ? endDateFrom.toISOString() : undefined,
      endDateTo: endDateTo ? endDateTo.toISOString() : undefined,
      sortBy,
      sortOrder,
    });
  };

  const handleClearFilters = () => {
    setStatus(null);
    setTenantId("");
    setPropertyId("");
    setAgencyId("");
    setStartDateFrom(undefined);
    setStartDateTo(undefined);
    setEndDateFrom(undefined);
    setEndDateTo(undefined);
    setSortBy("name");
    setSortOrder("desc");
    onFilter({});
  };

  const hasActiveFilters =
    status ||
    tenantId ||
    propertyId ||
    agencyId ||
    startDateFrom ||
    startDateTo ||
    endDateFrom ||
    endDateTo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Filter Bar */}
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <Filter className="h-4 w-4" />
                  {t("filter.filters")}
                  {hasActiveFilters && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      !
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isExpanded ? t("filter.hide") : t("filter.show")} advanced filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Status Quick Filter */}
          <Select value={status ?? "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <SelectValue placeholder={t("filter.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.allStatuses")}</SelectItem>
              {getContractStatusOptions(t).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", option.color)} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("filter.sortBy")}
              </span>
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger className="w-32 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                  <SelectValue />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("filter.sortOptions.name")}</SelectItem>
                <SelectItem value="startDate">{t("filter.sortOptions.startDate")}</SelectItem>
                <SelectItem value="endDate">{t("filter.sortOptions.endDate")}</SelectItem>
                <SelectItem value="status">{t("filter.sortOptions.status")}</SelectItem>
              </SelectContent>
            </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("filter.sortOrder")}
              </span>
              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="w-20 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">{t("filter.orderOptions.desc")}</SelectItem>
                  <SelectItem value="asc">{t("filter.orderOptions.asc")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700"
            >
              <Search className="mr-2 h-4 w-4" />
              {t("filter.apply")}
            </Button>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <X className="mr-2 h-4 w-4" />
                {t("filter.clear")}
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Advanced Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {t("filter.advancedFilters")}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("filter.refineDescription")}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Tenant ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.tenantId")}
                    </label>
                    <Input
                      type="text"
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value)}
                      placeholder={t("filter.enterTenantId")}
                      className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                    />
                  </div>

                  {/* Property ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.propertyId")}
                    </label>
                    <Input
                      type="text"
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                      placeholder={t("filter.enterPropertyId")}
                      className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                    />
                  </div>

                  {/* Agency ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.agencyId")}
                    </label>
                    <Input
                      type="text"
                      value={agencyId}
                      onChange={(e) => setAgencyId(e.target.value)}
                      placeholder={t("filter.enterAgencyId")}
                      className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                    />
                  </div>

                  {/* Start Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.startDateFrom")}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start border-neutral-200 bg-white text-left font-normal hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                            !startDateFrom && "text-neutral-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDateFrom
                            ? format(startDateFrom, "PPP")
                            : t("filter.pickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DayPicker
                          mode="single"
                          selected={startDateFrom}
                          onSelect={setStartDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.startDateTo")}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start border-neutral-200 bg-white text-left font-normal hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                            !startDateTo && "text-neutral-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDateTo
                            ? format(startDateTo, "PPP")
                            : t("filter.pickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DayPicker
                          mode="single"
                          selected={startDateTo}
                          onSelect={setStartDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.endDateFrom")}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start border-neutral-200 bg-white text-left font-normal hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                            !endDateFrom && "text-neutral-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDateFrom
                            ? format(endDateFrom, "PPP")
                            : t("filter.pickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DayPicker
                          mode="single"
                          selected={endDateFrom}
                          onSelect={setEndDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.endDateTo")}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start border-neutral-200 bg-white text-left font-normal hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                            !endDateTo && "text-neutral-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDateTo
                            ? format(endDateTo, "PPP")
                            : t("filter.pickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DayPicker
                          mode="single"
                          selected={endDateTo}
                          onSelect={setEndDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("filter.activeFilters")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {status && (
                        <Badge variant="secondary" className="gap-1">
                          Status:{" "}
                          {
                            getContractStatusOptions(t).find(
                              (opt) => opt.value === status,
                            )?.label
                          }
                          <button
                            onClick={() => setStatus(null)}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {tenantId && (
                        <Badge variant="secondary" className="gap-1">
                          Tenant: {tenantId}
                          <button
                            onClick={() => setTenantId("")}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {propertyId && (
                        <Badge variant="secondary" className="gap-1">
                          Property: {propertyId}
                          <button
                            onClick={() => setPropertyId("")}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {agencyId && (
                        <Badge variant="secondary" className="gap-1">
                          Agency: {agencyId}
                          <button
                            onClick={() => setAgencyId("")}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {startDateFrom && (
                        <Badge variant="secondary" className="gap-1">
                          {t("filter.startDateFrom")}: {format(startDateFrom, "MMM dd")}
                          <button
                            onClick={() => setStartDateFrom(undefined)}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {startDateTo && (
                        <Badge variant="secondary" className="gap-1">
                          {t("filter.startDateTo")}: {format(startDateTo, "MMM dd")}
                          <button
                            onClick={() => setStartDateTo(undefined)}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {endDateFrom && (
                        <Badge variant="secondary" className="gap-1">
                          {t("filter.endDateFrom")}: {format(endDateFrom, "MMM dd")}
                          <button
                            onClick={() => setEndDateFrom(undefined)}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {endDateTo && (
                        <Badge variant="secondary" className="gap-1">
                          {t("filter.endDateTo")}: {format(endDateTo, "MMM dd")}
                          <button
                            onClick={() => setEndDateTo(undefined)}
                            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default ContractFilterForm;
