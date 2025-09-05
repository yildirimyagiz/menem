"use client";

import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
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

import { cn } from "~/lib/utils";

interface GuestFilterFormProps {
  onFilter: (filter: any) => void;
  currentFilter: any;
}

const GuestFilterForm: React.FC<GuestFilterFormProps> = ({
  onFilter,
  currentFilter,
}) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilter, setLocalFilter] = useState(currentFilter);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setLocalFilter(currentFilter);
  }, [currentFilter]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilter = { ...localFilter, [key]: value, page: 1 }; // Reset to first page
    setLocalFilter(newFilter);
    onFilter(newFilter);
  };

  const handleClearFilters = () => {
    setIsAnimating(true);
    const clearedFilter = {
      page: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setLocalFilter(clearedFilter);
    onFilter(clearedFilter);

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const hasActiveFilters = Object.keys(currentFilter).some(
    (key) =>
      key !== "page" &&
      key !== "pageSize" &&
      key !== "sortBy" &&
      key !== "sortOrder" &&
      currentFilter[key],
  );

  const activeFilterCount = Object.keys(currentFilter).filter(
    (key) =>
      key !== "page" &&
      key !== "pageSize" &&
      key !== "sortBy" &&
      key !== "sortOrder" &&
      currentFilter[key],
  ).length;

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "transition-all duration-300",
          isAnimating && "animate-pulse",
          "bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
          "border-0 shadow-sm hover:shadow-md",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <FunnelIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{t("advancedFilters")}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("advancedFiltersDescription")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <XMarkIcon className="mr-1 h-4 w-4" />
                      {t("clearAll")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("clearAllFiltersTooltip")}</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                      "h-8 transition-all duration-200",
                      isExpanded
                        ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        : "hover:bg-gray-50",
                    )}
                  >
                    <AdjustmentsHorizontalIcon className="mr-1 h-4 w-4" />
                    {isExpanded ? t("hide") : t("show")} {t("filters")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isExpanded ? t("hideFilterOptions") : t("showFilterOptions")}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} {t("activeFilter")}
                  {activeFilterCount !== 1 ? "s" : ""}
                </Badge>
                <SparklesIcon className="h-3 w-3 text-blue-500" />
              </div>
              <div className="flex flex-wrap gap-2">
                {currentFilter.search && (
                  <Badge
                    variant="secondary"
                    className="border-blue-200 bg-blue-100 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  >
                    <MagnifyingGlassIcon className="mr-1 h-3 w-3" />
                    {t("search")}: {currentFilter.search}
                  </Badge>
                )}
                {currentFilter.name && (
                  <Badge
                    variant="secondary"
                    className="border-green-200 bg-green-100 text-xs text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    {t("name")}: {currentFilter.name}
                  </Badge>
                )}
                {currentFilter.email && (
                  <Badge
                    variant="secondary"
                    className="border-purple-200 bg-purple-100 text-xs text-purple-800 dark:border-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  >
                    {t("email")}: {currentFilter.email}
                  </Badge>
                )}
                {currentFilter.phone && (
                  <Badge
                    variant="secondary"
                    className="border-orange-200 bg-orange-100 text-xs text-orange-800 dark:border-orange-800 dark:bg-orange-900 dark:text-orange-300"
                  >
                    {t("phone")}: {currentFilter.phone}
                  </Badge>
                )}
                {currentFilter.nationality && (
                  <Badge
                    variant="secondary"
                    className="border-indigo-200 bg-indigo-100 text-xs text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                  >
                    {t("nationality")}: {currentFilter.nationality}
                  </Badge>
                )}
                {currentFilter.gender && (
                  <Badge
                    variant="secondary"
                    className="border-pink-200 bg-pink-100 text-xs text-pink-800 dark:border-pink-800 dark:bg-pink-900 dark:text-pink-300"
                  >
                    {t("gender")}: {currentFilter.gender}
                  </Badge>
                )}
                {currentFilter.createdAtFrom && (
                  <Badge
                    variant="secondary"
                    className="border-teal-200 bg-teal-100 text-xs text-teal-800 dark:border-teal-800 dark:bg-teal-900 dark:text-teal-300"
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {t("from")}:{" "}
                    {format(
                      new Date(currentFilter.createdAtFrom),
                      "MMM dd, yyyy",
                    )}
                  </Badge>
                )}
                {currentFilter.createdAtTo && (
                  <Badge
                    variant="secondary"
                    className="border-teal-200 bg-teal-100 text-xs text-teal-800 dark:border-teal-800 dark:bg-teal-900 dark:text-teal-300"
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {t("to")}:{" "}
                    {format(
                      new Date(currentFilter.createdAtTo),
                      "MMM dd, yyyy",
                    )}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-6 pt-0">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  <MagnifyingGlassIcon className="mr-1 inline h-4 w-4" />
                  {t("search")}
                </Label>
                <Input
                  id="search"
                  placeholder={t("searchGuestsPlaceholder")}
                  value={localFilter.search ?? ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t("name")}
                </Label>
                <Input
                  id="name"
                  placeholder={t("filterByNamePlaceholder")}
                  value={localFilter.name ?? ""}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("filterByEmailPlaceholder")}
                  value={localFilter.email ?? ""}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("phone")}
                </Label>
                <Input
                  id="phone"
                  placeholder={t("filterByPhonePlaceholder")}
                  value={localFilter.phone ?? ""}
                  onChange={(e) => handleFilterChange("phone", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-sm font-medium">
                  {t("nationality")}
                </Label>
                <Input
                  id="nationality"
                  placeholder={t("filterByNationalityPlaceholder")}
                  value={localFilter.nationality ?? ""}
                  onChange={(e) =>
                    handleFilterChange("nationality", e.target.value)
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  {t("gender")}
                </Label>
                <Select
                  value={localFilter.gender ?? "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "gender",
                      value === "all" ? undefined : value,
                    )
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-pink-500">
                    <SelectValue placeholder={t("allGenders")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allGenders")}</SelectItem>
                    <SelectItem value="MALE">{t("male")}</SelectItem>
                    <SelectItem value="FEMALE">{t("female")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Created Date From */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <CalendarIcon className="mr-1 inline h-4 w-4" />
                  {t("createdFrom")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-teal-500",
                        !localFilter.createdAtFrom && "text-muted-foreground",
                      )}
                    >
                      {localFilter.createdAtFrom ? (
                        format(new Date(localFilter.createdAtFrom), "PPP")
                      ) : (
                        <span>{t("pickADate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        localFilter.createdAtFrom
                          ? new Date(localFilter.createdAtFrom)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange("createdAtFrom", date)
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Created Date To */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <CalendarIcon className="mr-1 inline h-4 w-4" />
                  {t("createdTo")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-teal-500",
                        !localFilter.createdAtTo && "text-muted-foreground",
                      )}
                    >
                      {localFilter.createdAtTo ? (
                        format(new Date(localFilter.createdAtTo), "PPP")
                      ) : (
                        <span>{t("pickADate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        localFilter.createdAtTo
                          ? new Date(localFilter.createdAtTo)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange("createdAtTo", date)
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label htmlFor="sortBy" className="text-sm font-medium">
                  {t("sortBy")}
                </Label>
                <Select
                  value={localFilter.sortBy ?? "createdAt"}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">{t("createdDate")}</SelectItem>
                    <SelectItem value="updatedAt">{t("updatedDate")}</SelectItem>
                    <SelectItem value="name">{t("name")}</SelectItem>
                    <SelectItem value="email">{t("email")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-sm font-medium">
                  {t("sortOrder")}
                </Label>
                <Select
                  value={localFilter.sortOrder ?? "desc"}
                  onValueChange={(value) =>
                    handleFilterChange("sortOrder", value)
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">{t("descending")}</SelectItem>
                    <SelectItem value="asc">{t("ascending")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <Label htmlFor="pageSize" className="text-sm font-medium">
                  {t("itemsPerPage")}
                </Label>
                <Select
                  value={localFilter.pageSize?.toString() ?? "10"}
                  onValueChange={(value) =>
                    handleFilterChange("pageSize", parseInt(value))
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">{t("fiveItems")}</SelectItem>
                    <SelectItem value="10">{t("tenItems")}</SelectItem>
                    <SelectItem value="20">{t("twentyItems")}</SelectItem>
                    <SelectItem value="50">{t("fiftyItems")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {hasActiveFilters && (
                  <span>
                    {activeFilterCount} {t("filter")}
                    {activeFilterCount !== 1 ? "s" : ""} {t("applied")}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                  >
                    <XMarkIcon className="mr-1 h-4 w-4" />
                    {t("clearAll")}
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {t("applyFilters")}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default GuestFilterForm;
