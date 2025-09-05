"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Filter, Search, X } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Input } from "@reservatior/ui/input";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilters: {
    status: string[];
    priority: string[];
    category: string[];
  };
  onFilterChange: (filterType: string, values: string[]) => void;
}

const filterOptions = {
  status: [
    { value: "TODO", label: "To Do", color: "bg-gray-100 text-gray-800" },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "COMPLETED",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ],
  priority: [
    { value: "LOW", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "MEDIUM",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "HIGH", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-800" },
  ],
  category: [
    {
      value: "CLEANING",
      label: "Cleaning",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "REPAIR",
      label: "Repair",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "DECORATION",
      label: "Decoration",
      color: "bg-pink-100 text-pink-800",
    },
    {
      value: "SERVICE",
      label: "Service",
      color: "bg-indigo-100 text-indigo-800",
    },
    { value: "MOVING", label: "Moving", color: "bg-teal-100 text-teal-800" },
  ],
};

export function TaskFilters({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFilterChange,
}: TaskFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const totalActiveFilters =
    selectedFilters.status.length +
    selectedFilters.priority.length +
    selectedFilters.category.length;

  const clearAllFilters = () => {
    onFilterChange("status", []);
    onFilterChange("priority", []);
    onFilterChange("category", []);
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`relative ${
              totalActiveFilters > 0
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : ""
            }`}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {totalActiveFilters > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {totalActiveFilters}
              </Badge>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Status Filter */}
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">Status</h4>
            {filterOptions.status.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedFilters.status.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedFilters.status, option.value]
                    : selectedFilters.status.filter((v) => v !== option.value);
                  onFilterChange("status", newValues);
                }}
                className="flex items-center gap-2"
              >
                <div
                  className={`h-2 w-2 rounded-full ${option.color.split(" ")[0]}`}
                />
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>

          <DropdownMenuSeparator />

          {/* Priority Filter */}
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">Priority</h4>
            {filterOptions.priority.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedFilters.priority.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedFilters.priority, option.value]
                    : selectedFilters.priority.filter(
                        (v) => v !== option.value,
                      );
                  onFilterChange("priority", newValues);
                }}
                className="flex items-center gap-2"
              >
                <div
                  className={`h-2 w-2 rounded-full ${option.color.split(" ")[0]}`}
                />
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>

          <DropdownMenuSeparator />

          {/* Category Filter */}
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">Category</h4>
            {filterOptions.category.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedFilters.category.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedFilters.category, option.value]
                    : selectedFilters.category.filter(
                        (v) => v !== option.value,
                      );
                  onFilterChange("category", newValues);
                }}
                className="flex items-center gap-2"
              >
                <div
                  className={`h-2 w-2 rounded-full ${option.color.split(" ")[0]}`}
                />
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>

          {totalActiveFilters > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear all filters
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filter Tags */}
      <AnimatePresence>
        {totalActiveFilters > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {Object.entries(selectedFilters).map(([filterType, values]) =>
              values.map((value) => {
                const option = filterOptions[
                  filterType as keyof typeof filterOptions
                ]?.find((opt) => opt.value === value);
                if (!option) return null;

                return (
                  <motion.div
                    key={`${filterType}-${value}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="secondary"
                      className={`${option.color} hover:opacity-80`}
                    >
                      {option.label}
                      <button
                        onClick={() => {
                          const newValues = selectedFilters[
                            filterType as keyof typeof selectedFilters
                          ].filter((v) => v !== value);
                          onFilterChange(filterType, newValues);
                        }}
                        className="ml-1 hover:text-red-600"
                        aria-label={`Remove ${option.label} filter`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                );
              }),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
