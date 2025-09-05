"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

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

interface GuestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilters: {
    gender: string[];
    nationality: string[];
    country: string[];
    createdAtFrom?: string;
    createdAtTo?: string;
    agencyId?: string;
    city?: string;
  };
  onFilterChange: (filterType: string, values: string[]) => void;
}

export function GuestFilters({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFilterChange,
}: GuestFiltersProps) {
  const t = useTranslations();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Advanced filter state (date range, agency, city)
  const [createdAtFrom, setCreatedAtFrom] = useState(
    selectedFilters.createdAtFrom ?? "",
  );
  const [createdAtTo, setCreatedAtTo] = useState(
    selectedFilters.createdAtTo ?? "",
  );
  const [agencyId, setAgencyId] = useState(selectedFilters.agencyId ?? "");
  const [city, setCity] = useState(selectedFilters.city ?? "");

  // Move useMemo inside the component
  const filterOptions = useMemo(
    () => ({
      gender: [
        { value: "MALE", label: t('guestFilters.gender.male', { defaultValue: 'Male' }), color: "bg-blue-100 text-blue-800" },
        {
          value: "FEMALE",
          label: t('guestFilters.gender.female', { defaultValue: 'Female' }),
          color: "bg-pink-100 text-pink-800",
        },
      ],
      nationality: [
        {
          value: "US",
          label: t('guestFilters.country.US', { defaultValue: 'United States' }),
          color: "bg-red-100 text-red-800",
        },
        {
          value: "UK",
          label: t('guestFilters.country.UK', { defaultValue: 'United Kingdom' }),
          color: "bg-blue-100 text-blue-800",
        },
        { value: "CA", label: t('guestFilters.country.CA', { defaultValue: 'Canada' }), color: "bg-red-100 text-red-800" },
        {
          value: "AU",
          label: t('guestFilters.country.AU', { defaultValue: 'Australia' }),
          color: "bg-green-100 text-green-800",
        },
        {
          value: "DE",
          label: t('guestFilters.country.DE', { defaultValue: 'Germany' }),
          color: "bg-yellow-100 text-yellow-800",
        },
        { value: "FR", label: t('guestFilters.country.FR', { defaultValue: 'France' }), color: "bg-blue-100 text-blue-800" },
      ],
      country: [
        {
          value: "US",
          label: t('guestFilters.country.US', { defaultValue: 'United States' }),
          color: "bg-red-100 text-red-800",
        },
        {
          value: "UK",
          label: t('guestFilters.country.UK', { defaultValue: 'United Kingdom' }),
          color: "bg-blue-100 text-blue-800",
        },
        { value: "CA", label: t('guestFilters.country.CA', { defaultValue: 'Canada' }), color: "bg-red-100 text-red-800" },
        {
          value: "AU",
          label: t('guestFilters.country.AU', { defaultValue: 'Australia' }),
          color: "bg-green-100 text-green-800",
        },
        {
          value: "DE",
          label: t('guestFilters.country.DE', { defaultValue: 'Germany' }),
          color: "bg-yellow-100 text-yellow-800",
        },
        { value: "FR", label: t('guestFilters.country.FR', { defaultValue: 'France' }), color: "bg-blue-100 text-blue-800" },
      ],
    }),
    [t],
  );

  useEffect(() => {
    setCreatedAtFrom(selectedFilters.createdAtFrom ?? "");
    setCreatedAtTo(selectedFilters.createdAtTo ?? "");
    setAgencyId(selectedFilters.agencyId ?? "");
    setCity(selectedFilters.city ?? "");
  }, [selectedFilters]);

  const totalActiveFilters =
    selectedFilters.gender.length +
    selectedFilters.nationality.length +
    selectedFilters.country.length +
    (createdAtFrom ? 1 : 0) +
    (createdAtTo ? 1 : 0) +
    (agencyId ? 1 : 0) +
    (city ? 1 : 0);

  const clearAllFilters = useCallback(() => {
    onFilterChange("gender", []);
    onFilterChange("nationality", []);
    onFilterChange("country", []);
    onFilterChange("createdAtFrom", [""]);
    onFilterChange("createdAtTo", [""]);
    onFilterChange("agencyId", [""]);
    onFilterChange("city", [""]);
  }, [onFilterChange]);

  const clearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t("guestFilters.searchPlaceholder", { defaultValue: "Search by name, email, phone, or passport..." })}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
          aria-label={t("guestFilters.search", { defaultValue: "Search" })}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={t("guestFilters.clearSearch", { defaultValue: "Clear search" })}
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
            {t("guestFilters.advanced", { defaultValue: "Advanced Filters" })}
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
        <DropdownMenuContent align="end" className="w-96">
          <DropdownMenuLabel>{t("guestFilters.filterGuests", { defaultValue: "Refine your guest search with multiple criteria" })}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Gender Filter */}
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">{t("guestFilters.gender", { defaultValue: "Gender" })}</h4>
            {filterOptions.gender.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedFilters.gender.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedFilters.gender, option.value]
                    : selectedFilters.gender.filter((v) => v !== option.value);
                  onFilterChange("gender", newValues);
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

          {/* Nationality Filter */}
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">{t("guestFilters.nationality", { defaultValue: "Nationality" })}</h4>
            {filterOptions.nationality.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedFilters.nationality.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedFilters.nationality, option.value]
                    : selectedFilters.nationality.filter(
                        (v) => v !== option.value,
                      );
                  onFilterChange("nationality", newValues);
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

          {/* Country Filter */}
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">{t("guestFilters.country", { defaultValue: "Country" })}</h4>
            {filterOptions.country.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedFilters.country.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedFilters.country, option.value]
                    : selectedFilters.country.filter((v) => v !== option.value);
                  onFilterChange("country", newValues);
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

          {/* Advanced Filters */}
          <div className="grid grid-cols-2 gap-4 p-2">
            {/* Date Range */}
            <div>
              <label className="mb-1 block text-xs font-medium">
  {t("guestFilters.createdFrom", { defaultValue: "Created From" })}
</label>
              <Input
                type="date"
                value={createdAtFrom}
                onChange={(e) => {
                  setCreatedAtFrom(e.target.value);
                  onFilterChange("createdAtFrom", [e.target.value]);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
  {t("guestFilters.createdTo", { defaultValue: "Created To" })}
</label>
              <Input
                type="date"
                value={createdAtTo}
                onChange={(e) => {
                  setCreatedAtTo(e.target.value);
                  onFilterChange("createdAtTo", [e.target.value]);
                }}
                className="w-full"
              />
            </div>
            {/* Agency */}
            <div className="col-span-2">
              <label
  htmlFor="agency-select"
  className="mb-1 block text-xs font-medium"
>
  {t("guestFilters.agency", { defaultValue: "Agency" })}
</label>
              <select
                id="agency-select"
                className="w-full rounded border px-2 py-1 text-sm"
                value={agencyId}
                onChange={(e) => {
                  setAgencyId(e.target.value);
                  onFilterChange("agencyId", [e.target.value]);
                }}
              >
                <option value="">{t("guestFilters.allAgencies", { defaultValue: "All Agencies" })}</option>
              </select>
            </div>
            {/* City */}
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium">{t("guestFilters.city", { defaultValue: "City" })}</label>
              <Input
  type="text"
  placeholder={t("guestFilters.cityPlaceholder", { defaultValue: "Enter city..." })}
  value={city}
  onChange={(e) => {
    setCity(e.target.value);
    onFilterChange("city", [e.target.value]);
  }}
  className="w-full"
/>
            </div>
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
  {t("guestFilters.clearAll", { defaultValue: "Clear all filters" })}
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
            {Object.entries(selectedFilters).map(([filterType, values]) => {
              if (
                ["createdAtFrom", "createdAtTo", "agencyId", "city"].includes(
                  filterType,
                )
              ) {
                if (!values) return null;
                let label = filterType;
if (filterType === "createdAtFrom") label = `${t('guestFilters.createdFrom', { defaultValue: 'From' })}: ${String(values)}`;
if (filterType === "createdAtTo") label = `${t('guestFilters.createdTo', { defaultValue: 'To' })}: ${String(values)}`;
if (filterType === "agencyId") label = `${t('guestFilters.agency', { defaultValue: 'Agency' })}: ${String(agencyId)}`;
if (filterType === "city") label = `${t('guestFilters.city', { defaultValue: 'City' })}: ${String(values)}`;
                return (
                  <Badge
                    key={filterType}
                    variant="secondary"
                    className="bg-gray-200 text-gray-700 hover:opacity-80"
                  >
                    {label}
                    <button
                      onClick={() => onFilterChange(filterType, [""])}
                      className="ml-1 hover:text-red-600"
                      aria-label={`Remove ${label} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              }
              // Array filters
              return (Array.isArray(values) ? values : []).map((value) => {
                const option = filterOptions[filterType as keyof typeof filterOptions].find((opt) => opt.value === value);
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
                          const filterVals = Array.isArray(selectedFilters[filterType as keyof typeof selectedFilters])
  ? selectedFilters[filterType as keyof typeof selectedFilters] as string[]
  : [];
const newValues = filterVals.filter((v: string) => v !== value);
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
              });
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
