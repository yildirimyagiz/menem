"use client";

import type {
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyType,
} from "@prisma/client";
import { PropertyStatus } from "@prisma/client";
import { ArrowUpDown, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@reservatior/ui/tooltip";

import { useLanguage } from "~/context/LanguageContext";
import { useAuth } from "~/hooks/use-auth";
import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/trpc/react";
import type { Property } from "~/utils/interfaces";

import AddProperty from "./components/AddProperty";
import PropertyFilterForm from "./components/PropertyFilterForm";
import PropertyEditSidebar from "./components/PropertySidebar";
import { PropertyTable } from "./components/PropertyTable";
import { usePropertyManagement } from "./hooks/usePropertyManagement";

interface PropertyAllInput {
  page: number;
  pageSize: number;
  title?: string;
  propertyType?: PropertyType;
  propertyStatus?: PropertyStatus;
  category?: PropertyCategory;
  condition?: PropertyCondition;
  features?: PropertyFeatures[];
  amenities?: PropertyAmenities[];
  minPrice?: number;
  maxPrice?: number;
  size?: { gte?: number | undefined; lte?: number | undefined };
  bedrooms?: { gte?: number | undefined; lte?: number | undefined };
  bathrooms?: { gte?: number | undefined; lte?: number | undefined };
  yearBuilt?: { gte?: number | undefined; lte?: number | undefined };
  createdAtFrom?: Date;
  createdAtTo?: Date;
  sortBy: "createdAt" | "updatedAt" | "price";
  sortOrder: "asc" | "desc";
}

interface PropertyAllQuery {
  data: { data?: unknown; total?: number } | undefined;
  isLoading: boolean;
  error?: unknown;
}

// Centralized wrapper to avoid scattered any-typed calls
function usePropertyAllQuery(input: PropertyAllInput): PropertyAllQuery {
  type UseQueryFn = (i: PropertyAllInput) => PropertyAllQuery;
  const useQueryTyped = (api as unknown as { property: { all: { useQuery: UseQueryFn } } }).property.all.useQuery;
  return useQueryTyped(input);
}

export default function PropertiesPage() {
  const _auth = useAuth();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | "all">("all");
  const [selectedCondition, setSelectedCondition] = useState<PropertyCondition | "all">("all");
  const [selectedFeatures, setSelectedFeatures] = useState<PropertyFeatures[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<PropertyAmenities[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minSize, setMinSize] = useState<number | undefined>(undefined);
  const [maxSize, setMaxSize] = useState<number | undefined>(undefined);
  const [minBedrooms, setMinBedrooms] = useState<number | undefined>(undefined);
  const [maxBedrooms, setMaxBedrooms] = useState<number | undefined>(undefined);
  const [minBathrooms, setMinBathrooms] = useState<number | undefined>(undefined);
  const [maxBathrooms, setMaxBathrooms] = useState<number | undefined>(undefined);
  const [minYearBuilt, setMinYearBuilt] = useState<number | undefined>(undefined);
  const [maxYearBuilt, setMaxYearBuilt] = useState<number | undefined>(undefined);
  const [createdAfter, setCreatedAfter] = useState<string | undefined>(undefined);
  const [createdBefore, setCreatedBefore] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "price">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const propertiesPerPage = 10;

  // Debounce search term (must be called unconditionally before any early returns)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Property management hook (must be called unconditionally)
  const {
    selectedProperty,
    editMode,
    editedProperty,
    error: managementError,
    handleViewDetails,
    handleEdit,
    handleCloseSidebar,
    handleCancel,
    handlePropertyAdded,
    handleInputChange,
    handleUpdateProperty,
  } = usePropertyManagement();

  // No client-side role gating here; follow Users page behavior

  const { data: fetchedProperties, isLoading: queryLoading, error: queryError } = usePropertyAllQuery({
    page: currentPage,
    pageSize: propertiesPerPage,
    title: debouncedSearchTerm || undefined,
    propertyType: selectedPropertyType !== "all" ? selectedPropertyType : undefined,
    propertyStatus: selectedStatus !== "all" ? selectedStatus : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    condition: selectedCondition !== "all" ? selectedCondition : undefined,
    features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    minPrice,
    maxPrice,
    size: minSize || maxSize ? { gte: minSize, lte: maxSize } : undefined,
    bedrooms: minBedrooms || maxBedrooms ? { gte: minBedrooms, lte: maxBedrooms } : undefined,
    bathrooms: minBathrooms || maxBathrooms ? { gte: minBathrooms, lte: maxBathrooms } : undefined,
    yearBuilt: minYearBuilt || maxYearBuilt ? { gte: minYearBuilt, lte: maxYearBuilt } : undefined,
    createdAtFrom: createdAfter ? new Date(createdAfter) : undefined,
    createdAtTo: createdBefore ? new Date(createdBefore) : undefined,
    sortBy,
    sortOrder,
  });

  // Do not redirect here; rely on higher-level route protection if any

  // Match property router return shape: { data, total } with type guards
  const isPropertyArray = (val: unknown): val is Property[] => Array.isArray(val);
  const toDate = (v: unknown): Date | null => {
    if (v instanceof Date) return v;
    if (typeof v === "string" || typeof v === "number") {
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    return null;
  };
  const properties: Property[] = useMemo(() => {
    const res = fetchedProperties as unknown as { data?: unknown; total?: number } | null | undefined;
    return isPropertyArray(res?.data) ? res.data.filter(Boolean) : [];
  }, [fetchedProperties]);
  const totalProperties: number = useMemo(() => {
    const res = fetchedProperties as unknown as { data?: unknown; total?: number } | null | undefined;
    return typeof res?.total === "number" ? res.total : properties.length;
  }, [fetchedProperties, properties.length]);

  const handleFilters = (filters: {
    search?: string;
    propertyType?: PropertyType;
    status?: PropertyStatus;
    category?: PropertyCategory;
    condition?: PropertyCondition;
    features?: PropertyFeatures[];
    amenities?: PropertyAmenities[];
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minYearBuilt?: number;
    maxYearBuilt?: number;
    createdAfter?: string;
    createdBefore?: string;
  }) => {
    setSearchTerm(filters.search ?? "");
    setSelectedPropertyType(filters.propertyType ?? "all");
    setSelectedStatus(filters.status ?? "all");
    setSelectedCategory(filters.category ?? "all");
    setSelectedCondition(filters.condition ?? "all");
    setSelectedFeatures(filters.features ?? []);
    setSelectedAmenities(filters.amenities ?? []);
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setMinSize(filters.minSize);
    setMaxSize(filters.maxSize);
    setMinBedrooms(filters.minBedrooms);
    setMaxBedrooms(filters.maxBedrooms);
    setMinBathrooms(filters.minBathrooms);
    setMaxBathrooms(filters.maxBathrooms);
    setMinYearBuilt(filters.minYearBuilt);
    setMaxYearBuilt(filters.maxYearBuilt);
    setCreatedAfter(filters.createdAfter);
    setCreatedBefore(filters.createdBefore);
    setCurrentPage(1); // Reset to first page when filtering
    setIsFiltersModalOpen(false);
  };

  const handleSortChange = (newSortBy: "createdAt" | "updatedAt" | "price") => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field with default desc order
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  if (!mounted) {
    return null; // no translation needed
  }

  if (queryLoading && !properties.length) {
    return (
      <TooltipProvider>
        <div className="container mx-auto space-y-8 p-4">
          <Card className="border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">{t("Property.loadingTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  if (queryError) {
    const errorMessage = queryError instanceof Error ? queryError.message : t("Common.unknownError");
    return (
      <TooltipProvider>
        <div className="container mx-auto space-y-8 p-4">
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="flex items-center space-x-3 p-6">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t("Property.loadErrorTitle")}</h3>
                <p className="text-sm text-red-600 dark:text-red-300">{errorMessage}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                {t("Common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  if (!properties.length) {
    return (
      <TooltipProvider>
        <div className="container mx-auto space-y-8 p-4">
          <Card className="border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm dark:from-gray-900 dark:to-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">{t("Property.noDataTitle")}</CardTitle>
              <CardDescription>{t("Property.noDataDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowAddPropertyForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> {t("Property.addFirst")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  // total pages computed inline in pagination component

  return (
    <TooltipProvider>
      <div className="container mx-auto space-y-8 p-4">
        {/* Header metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm transition-colors hover:shadow-md dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("Property.metrics.total")}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalProperties}</div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("Property.metrics.totalHint")}</p>
            </CardContent>
          </Card>
          <Card className="group border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm transition-colors hover:shadow-md dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("Property.metrics.available")}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{properties.filter((p) => p.propertyStatus === PropertyStatus.AVAILABLE).length}</div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("Property.metrics.availableHint")}</p>
            </CardContent>
          </Card>
          <Card className="group border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm transition-colors hover:shadow-md dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("Property.metrics.recent")}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{properties.filter((p) => {
                const updated = toDate(p.updatedAt);
                if (!updated) return false;
                const diff = Date.now() - updated.getTime();
                return diff <= 1000 * 60 * 60 * 24 * 30;
              }).length}</div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("Property.metrics.recentHint")}</p>
            </CardContent>
          </Card>
          <Card className="group border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm transition-colors hover:shadow-md dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("Property.metrics.pending")}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{properties.filter((p) => p.propertyStatus === PropertyStatus.PENDING_APPROVAL).length}</div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("Property.metrics.pendingHint")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("Property.searchPlaceholder")}
              className="w-[300px]"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" disabled={queryLoading}>
              <Search className="mr-2 h-4 w-4" /> {t("Property.search")}
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setIsFiltersModalOpen(true)} aria-label={t("Property.filters.open")}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {t("Property.filters.label")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("Property.filters.tooltip")}</TooltipContent>
            </Tooltip>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{t("Property.sortBy")}</span>
            <Select
              value={sortBy}
              onValueChange={(value: "createdAt" | "updatedAt" | "price") =>
                handleSortChange(value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{t("Property.sort.createdAt")}</SelectItem>
                <SelectItem value="updatedAt">{t("Property.sort.updatedAt")}</SelectItem>
                <SelectItem value="price">{t("Property.sort.price")}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-2"
              aria-label={t("Property.sort.toggle")}
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        {managementError && <p className="text-red-600">{managementError}</p>}
        <Card>
          <CardHeader>
            <CardTitle>{t("Property.all")}</CardTitle>
            <CardDescription>
              {t("Property.manageDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyTable
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
              properties={properties.slice(
                (currentPage - 1) * propertiesPerPage,
                currentPage * propertiesPerPage,
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              {t("Common.showing")} {(currentPage - 1) * propertiesPerPage + 1}-{Math.min(currentPage * propertiesPerPage, totalProperties)} {t("Common.of")} {totalProperties} {t("Common.results")}
            </div>
            <div className="w-full sm:w-auto">
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">{t("Common.previous")}</span>
                </Button>
                {Array.from({ length: Math.max(1, Math.ceil(totalProperties / propertiesPerPage)) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={`page-${page}`}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300"
                        : "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    }
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.max(1, Math.ceil(totalProperties / propertiesPerPage))))}
                  disabled={currentPage === Math.max(1, Math.ceil(totalProperties / propertiesPerPage))}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">{t("Common.next")}</span>
                </Button>
              </nav>
            </div>
          </CardFooter>
        </Card>

        {/* Filters Modal */}
        <PropertyFilterForm
          onFilter={handleFilters}
          isOpen={isFiltersModalOpen}
          onOpenChange={setIsFiltersModalOpen}
          initialValues={{
            search: searchTerm,
            propertyType: selectedPropertyType === "all" ? undefined : selectedPropertyType,
            status: selectedStatus === "all" ? undefined : selectedStatus,
            minPrice,
            maxPrice,
          }}
        />

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setShowAddPropertyForm(true)} className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl" aria-label={t("Property.addNew")}>
                <Plus className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("Property.addNew")}</TooltipContent>
          </Tooltip>
        </div>

        {showAddPropertyForm && (
          <AddProperty onClose={() => setShowAddPropertyForm(false)} onPropertyAdded={handlePropertyAdded} />
        )}

        {selectedProperty && (
          <PropertyEditSidebar
            selectedProperty={selectedProperty}
            editMode={editMode}
            editedProperty={editedProperty}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleInputChange={handleInputChange}
            closeSidebar={handleCloseSidebar}
            handleCloseSidebar={handleCloseSidebar}
            handleUpdateProperty={handleUpdateProperty}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
