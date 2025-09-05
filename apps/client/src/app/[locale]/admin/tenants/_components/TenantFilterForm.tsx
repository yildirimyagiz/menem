"use client";

import React, { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

// import type { TenantFilterInput } from "@reservatior/validators";
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

type PaymentStatus =
  | "PAID"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "REFUNDED"
  | "CANCELLED";

interface TenantFilter {
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  paymentStatus?: PaymentStatus | "";
  leaseStartDateFrom?: Date | string | null;
  leaseStartDateTo?: Date | string | null;
  sortBy?: "leaseStartDate" | "leaseEndDate" | "paymentStatus" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

interface TenantFilterFormProps {
  onFilter: (filter: TenantFilter) => void;
  currentFilter: TenantFilter;
}

const TenantFilterForm: React.FC<TenantFilterFormProps> = ({
  onFilter,
  currentFilter,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilter, setLocalFilter] = useState<TenantFilter>(currentFilter);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setLocalFilter(currentFilter);
  }, [currentFilter]);

  const handleFilterChange = <K extends keyof TenantFilter>(
    key: K,
    value: TenantFilter[K],
  ) => {
    const newFilter: TenantFilter = { ...localFilter, [key]: value, page: 1 };
    setLocalFilter(newFilter);
    onFilter(newFilter);
  };

  const handleClearFilters = () => {
    setIsAnimating(true);
    const clearedFilter: TenantFilter = {
      page: 1,
      pageSize: 10,
      sortBy: "leaseStartDate",
      sortOrder: "desc",
    };
    setLocalFilter(clearedFilter);
    onFilter(clearedFilter);

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const activeKeys: (keyof TenantFilter)[] = [
    "search",
    "firstName",
    "lastName",
    "email",
    "paymentStatus",
    "leaseStartDateFrom",
    "leaseStartDateTo",
  ];
  const hasActiveFilters = activeKeys.some((k) => Boolean(currentFilter[k]));
  const activeFilterCount = activeKeys.filter((k) => Boolean(currentFilter[k])).length;

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
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Refine your tenant search with multiple criteria
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
                      Clear All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear all active filters</TooltipContent>
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
                    {isExpanded ? "Hide" : "Show"} Filters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isExpanded ? "Hide filter options" : "Show filter options"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} active filter
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
                    Search: {currentFilter.search}
                  </Badge>
                )}
                {currentFilter.firstName && (
                  <Badge
                    variant="secondary"
                    className="border-green-200 bg-green-100 text-xs text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    First Name: {currentFilter.firstName}
                  </Badge>
                )}
                {currentFilter.lastName && (
                  <Badge
                    variant="secondary"
                    className="border-purple-200 bg-purple-100 text-xs text-purple-800 dark:border-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  >
                    Last Name: {currentFilter.lastName}
                  </Badge>
                )}
                {currentFilter.email && (
                  <Badge
                    variant="secondary"
                    className="border-orange-200 bg-orange-100 text-xs text-orange-800 dark:border-orange-800 dark:bg-orange-900 dark:text-orange-300"
                  >
                    Email: {currentFilter.email}
                  </Badge>
                )}
                {currentFilter.paymentStatus && (
                  <Badge
                    variant="secondary"
                    className="border-indigo-200 bg-indigo-100 text-xs text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                  >
                    Payment Status: {currentFilter.paymentStatus}
                  </Badge>
                )}
                {currentFilter.leaseStartDateFrom && (
                  <Badge
                    variant="secondary"
                    className="border-teal-200 bg-teal-100 text-xs text-teal-800 dark:border-teal-800 dark:bg-teal-900 dark:text-teal-300"
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    Lease Start From:{" "}
                    {format(
                      new Date(currentFilter.leaseStartDateFrom),
                      "MMM dd, yyyy",
                    )}
                  </Badge>
                )}
                {currentFilter.leaseStartDateTo && (
                  <Badge
                    variant="secondary"
                    className="border-teal-200 bg-teal-100 text-xs text-teal-800 dark:border-teal-800 dark:bg-teal-900 dark:text-teal-300"
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    Lease Start To:{" "}
                    {format(
                      new Date(currentFilter.leaseStartDateTo),
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
                  Search
                </Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, or phone..."
                  value={localFilter.search ?? ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Filter by first name..."
                  value={localFilter.firstName ?? ""}
                  onChange={(e) =>
                    handleFilterChange("firstName", e.target.value)
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Filter by last name..."
                  value={localFilter.lastName ?? ""}
                  onChange={(e) =>
                    handleFilterChange("lastName", e.target.value)
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Filter by email..."
                  value={localFilter.email ?? ""}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Payment Status */}
              <div className="space-y-2">
                <Label htmlFor="paymentStatus" className="text-sm font-medium">
                  Payment Status
                </Label>
                <Select
                  value={localFilter.paymentStatus ?? "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      handleFilterChange("paymentStatus", undefined);
                    } else {
                      handleFilterChange("paymentStatus", value as PaymentStatus);
                    }
                  }}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500">
                    <SelectValue placeholder="All payment statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All payment statuses</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                    <SelectItem value="PARTIALLY_PAID">
                      Partially Paid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lease Start Date From */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <CalendarIcon className="mr-1 inline h-4 w-4" />
                  Lease Start From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-teal-500",
                        !localFilter.leaseStartDateFrom &&
                          "text-muted-foreground",
                      )}
                    >
                      {localFilter.leaseStartDateFrom ? (
                        format(new Date(localFilter.leaseStartDateFrom), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        localFilter.leaseStartDateFrom
                          ? new Date(localFilter.leaseStartDateFrom)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange("leaseStartDateFrom", date)
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Lease Start Date To */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <CalendarIcon className="mr-1 inline h-4 w-4" />
                  Lease Start To
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-teal-500",
                        !localFilter.leaseStartDateTo &&
                          "text-muted-foreground",
                      )}
                    >
                      {localFilter.leaseStartDateTo ? (
                        format(new Date(localFilter.leaseStartDateTo), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        localFilter.leaseStartDateTo
                          ? new Date(localFilter.leaseStartDateTo)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange("leaseStartDateTo", date)
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
                  Sort By
                </Label>
                <Select
                  value={localFilter.sortBy ?? "leaseStartDate"}
                  onValueChange={(value) =>
                    handleFilterChange("sortBy", value as NonNullable<TenantFilter["sortBy"]>)
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leaseStartDate">
                      Lease Start Date
                    </SelectItem>
                    <SelectItem value="leaseEndDate">Lease End Date</SelectItem>
                    <SelectItem value="paymentStatus">
                      Payment Status
                    </SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-sm font-medium">
                  Sort Order
                </Label>
                <Select
                  value={localFilter.sortOrder ?? "desc"}
                  onValueChange={(value) =>
                    handleFilterChange("sortOrder", value as NonNullable<TenantFilter["sortOrder"]>)
                  }
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <Label htmlFor="pageSize" className="text-sm font-medium">
                  Items per page
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
                    <SelectItem value="5">5 items</SelectItem>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {hasActiveFilters && (
                  <span>
                    {activeFilterCount} filter
                    {activeFilterCount !== 1 ? "s" : ""} applied
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
                    Clear All
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default TenantFilterForm;
