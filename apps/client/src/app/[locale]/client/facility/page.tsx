"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Package,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Upload,
  Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";
import type { Facility } from "@reservatior/validators";

import FacilityCard from "~/components/FacilityCard";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import ExpenseList from "./_components/ExpenseList";
import ExpenseModal from "./_components/ExpenseModal";
import ExtraChargeList from "./_components/ExtraChargeList";
import ExtraChargeModal from "./_components/ExtraChargeModal";
import FacilityCreateModal from "./_components/FacilityCreateModal";
import IncludedServiceList from "./_components/IncludedServiceList";
import IncludedServiceModal from "./_components/IncludedServiceModal";
import type { FacilityFilter } from "./types";

const ITEMS_PER_PAGE = 10;

// Enhanced skeleton with AceternityUI style
const FacilitySkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20" />
    <div className="relative">
      <div className="mb-4 h-48 w-full animate-pulse rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
      <div className="space-y-3">
        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-600" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-gradient-to-r from-green-200 to-green-300 dark:from-green-700 dark:to-green-600" />
        </div>
      </div>
    </div>
  </motion.div>
);

const FacilityGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: count }).map((_, i) => (
      <FacilitySkeleton key={`skeleton-${i}`} />
    ))}
  </motion.div>
);

// Enhanced stats cards with AceternityUI style
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={cn(
      "group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900",
      className,
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20" />
    <div className="relative flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp
                className={cn(
                  "h-4 w-4",
                  trend.isPositive ? "text-green-500" : "text-red-500",
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const ClientFacilityPage = () => {
  const t = useTranslations("Client");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const { toast } = useToast();
  const [filter, setFilter] = useState<FacilityFilter>({
    page: 1,
    pageSize: ITEMS_PER_PAGE,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );
  const [selectedTab, setSelectedTab] = useState("facilities");

  // Modal states for sub-components
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isExtraChargeModalOpen, setIsExtraChargeModalOpen] = useState(false);
  const [selectedExtraCharge, setSelectedExtraCharge] = useState<any>(null);
  const [isIncludedServiceModalOpen, setIsIncludedServiceModalOpen] =
    useState(false);
  const [selectedIncludedService, setSelectedIncludedService] =
    useState<any>(null);

  // Enhanced API connection with better error handling and caching
  const { data, isPending, isError, error, refetch } =
    api.facility.all.useQuery(filter, {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  // Fetch global data for tabs
  const { data: expensesData } = api.expense.all.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  );

  const { data: extraChargesData } = api.extraCharge.all.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  );

  const { data: includedServicesData } = api.includedService.all.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  );

  const deleteFacilityMutation = api.facility.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "Facility has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete facility.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading facilities",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Extract facilities array from data with proper type handling
  const facilities: Facility[] = Array.isArray(data?.data)
    ? (data.data as any[]).filter(Boolean)
    : [];
  const totalFacilities = data?.total ?? facilities.length;

  const handleFilterChange = (newFilter: FacilityFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (query: string) => {
    setFilter((prev) => ({
      ...prev,
      name: query,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleView = (facility: Facility) => {
    console.log("=== NAVIGATING TO FACILITY DETAIL ===");
    console.log("Facility ID:", facility.id);
    console.log("Locale:", locale);
    console.log(
      "Navigation path:",
      `/${locale}/client/facility/${facility.id}`,
    );
    router.push(`/${locale}/client/facility/${facility.id}`);
  };

  const handleDelete = async (facilityId: string) => {
    try {
      await deleteFacilityMutation.mutateAsync({ id: facilityId });
    } catch (error) {
      // Error is handled in the mutation
      console.error("Delete error:", error);
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  // Calculate statistics
  const activeFacilities = facilities.filter(
    (f) => f.status === "ACTIVE",
  ).length;
  const inactiveFacilities = facilities.filter(
    (f) => f.status === "INACTIVE",
  ).length;
  const activePercentage =
    facilities.length > 0
      ? Math.round((activeFacilities / facilities.length) * 100)
      : 0;
  const inactivePercentage =
    facilities.length > 0
      ? Math.round((inactiveFacilities / facilities.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
      {/* Hero Section with AceternityUI style */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 flex items-center justify-center space-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t("facilityTitle", { defaultValue: "Facility Management" })}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
              {t("facilityDescription", { defaultValue: "Manage your properties, track expenses, and optimize your facility operations with our comprehensive dashboard." })}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatsCard
            title={t("totalFacilities", { defaultValue: "Total Facilities" })}
            value={totalFacilities}
            icon={Building2}
            trend={{ value: 12, isPositive: true }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50"
          />
          <StatsCard
            title={t("activeFacilities", { defaultValue: "Active Facilities" })}
            value={activeFacilities}
            icon={Users}
            trend={{ value: activePercentage, isPositive: true }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50"
          />
          <StatsCard
            title={t("inactiveFacilities", { defaultValue: "Inactive Facilities" })}
            value={inactiveFacilities}
            icon={AlertTriangle}
            trend={{ value: inactivePercentage, isPositive: false }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50"
          />
          <StatsCard
            title={t("totalRevenue", { defaultValue: "Total Revenue" })}
            value="$124,500"
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50"
          />
        </motion.div>

        {/* Enhanced Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-neutral-100 dark:bg-neutral-800">
                <TabsTrigger
                  value="facilities"
                  className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {t("facilities", { defaultValue: "Facilities" })}
                </TabsTrigger>
                <TabsTrigger
                  value="expenses"
                  className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t("expenses", { defaultValue: "Expenses" })}
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                >
                  <Package className="mr-2 h-4 w-4" />
                  {t("services", { defaultValue: "Services" })}
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("addFacility", { defaultValue: "Add Facility" })}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("createNewFacility", { defaultValue: "Create a new facility" })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {t("import", { defaultValue: "Import" })}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("importFacilitiesFromFile", { defaultValue: "Import facilities from file" })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {t("export", { defaultValue: "Export" })}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("exportFacilitiesData", { defaultValue: "Export facilities data" })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Enhanced Tab Content */}
            <TabsContent value="facilities" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Enhanced Search and Filter */}
                <Card className="border-0 bg-gradient-to-r from-white to-neutral-50 shadow-lg dark:from-neutral-800 dark:to-neutral-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          placeholder={t("searchFacilities", { defaultValue: "Search facilities..." })}
                          className="w-full rounded-lg border border-neutral-200 bg-white px-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Facilities Grid */}
                {isPending ? (
                  <FacilityGridSkeleton count={6} />
                ) : facilities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-700"
                  >
                    <Building2 className="mb-4 h-12 w-12 text-neutral-400" />
                    <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                      No facilities found
                    </h3>
                    <p className="mb-4 text-center text-neutral-600 dark:text-neutral-400">
                      Get started by creating your first facility
                    </p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Facility
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <AnimatePresence>
                      {facilities.map((facility, index) => {
                        return (
                          <motion.div
                            key={facility.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <FacilityCard
                              facility={facility}
                              onView={handleView}
                              onDelete={handleDelete}
                              showActions={false}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ExpenseList
                  expenses={
                    (expensesData?.data?.data?.filter(Boolean) ?? []) as any[]
                  }
                  onAdd={() => setIsExpenseModalOpen(true)}
                  onEdit={(id) => {
                    setSelectedExpense({ id });
                    setIsExpenseModalOpen(true);
                  }}
                  onDelete={(id) => {
                    // Handle delete
                  }}
                  onRefresh={refetch}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100 shadow-lg dark:from-green-950/50 dark:to-green-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                        <Package className="mr-2 h-5 w-5" />
                        Included Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <IncludedServiceList
                        services={
                          (includedServicesData?.data?.items?.filter(Boolean) ??
                            []) as any[]
                        }
                        onAdd={() => setIsIncludedServiceModalOpen(true)}
                        onEdit={(id) => {
                          setSelectedIncludedService({ id });
                          setIsIncludedServiceModalOpen(true);
                        }}
                        onDelete={(id) => {
                          // Handle delete
                        }}
                        onRefresh={refetch}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-gradient-to-r from-orange-50 to-orange-100 shadow-lg dark:from-orange-950/50 dark:to-orange-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Extra Charges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ExtraChargeList
                        charges={
                          (extraChargesData?.data?.items?.filter(Boolean) ??
                            []) as any[]
                        }
                        onAdd={() => setIsExtraChargeModalOpen(true)}
                        onEdit={(id) => {
                          setSelectedExtraCharge({ id });
                          setIsExtraChargeModalOpen(true);
                        }}
                        onDelete={(id) => {
                          // Handle delete
                        }}
                        onRefresh={refetch}
                      />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Enhanced Modals */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <FacilityCreateModal
            isOpen={isCreateModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpenseModalOpen && (
          <ExpenseModal
            isOpen={isExpenseModalOpen}
            onClose={() => setIsExpenseModalOpen(false)}
            onSuccess={() => {
              setIsExpenseModalOpen(false);
              refetch();
            }}
            initialData={selectedExpense}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExtraChargeModalOpen && (
          <ExtraChargeModal
            isOpen={isExtraChargeModalOpen}
            onClose={() => setIsExtraChargeModalOpen(false)}
            onSuccess={() => {
              setIsExtraChargeModalOpen(false);
              refetch();
            }}
            initialData={selectedExtraCharge}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isIncludedServiceModalOpen && (
          <IncludedServiceModal
            isOpen={isIncludedServiceModalOpen}
            onClose={() => setIsIncludedServiceModalOpen(false)}
            onSuccess={() => {
              setIsIncludedServiceModalOpen(false);
              refetch();
            }}
            initialData={selectedIncludedService}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientFacilityPage;
