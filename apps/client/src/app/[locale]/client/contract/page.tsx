"use client";

import React, { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  FileText,
  Filter,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import type { ContractFilter } from "./types";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import ContractCard from "./_components/ContractCard";
import ContractFilterForm from "./_components/ContractFilterForm";

const ITEMS_PER_PAGE = 12;

// Enhanced skeleton with AceternityUI style
const ContractSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20" />
    <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-6 w-20 animate-pulse rounded-full bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-6 w-32 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-8 w-20 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
      </div>
    </div>
  </motion.div>
);

const ContractGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: count }).map((_, i) => (
      <ContractSkeleton key={i} />
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

const ContractPage = () => {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const { toast } = useToast();
  const t = useTranslations("contract");
  const [filter, setFilter] = useState<ContractFilter>({
    page: 1,
    pageSize: ITEMS_PER_PAGE,
    sortBy: "name",
    sortOrder: "desc",
  });

  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced API connection with better error handling and caching
  const { data, isPending, isError, error, refetch } =
    api.contract.list.useQuery(filter, {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const handleFilter = useCallback((newFilter: ContractFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter, page: 1 }));
  }, []);

  const handleContractClick = useCallback(
    (contractId: string) => {
      router.push(`/${locale}/client/contract/${contractId}`);
    },
    [router, locale],
  );

  const handleCreateContract = useCallback(() => {
    // TODO: Open contract creation modal
    toast({
      title: "Create Contract",
      description: "Contract creation feature coming soon!",
    });
  }, [toast]);

  // Calculate statistics
  const validContracts =
    data?.filter(
      (contract): contract is NonNullable<typeof contract> => contract !== null,
    ) ?? [];

  const totalContracts = validContracts.length;
  const activeContracts = validContracts.filter(
    (c) => c.status === "ACTIVE",
  ).length;
  const expiredContracts = validContracts.filter(
    (c) => c.status === "EXPIRED",
  ).length;
  const draftContracts = validContracts.filter(
    (c) => c.status === "DRAFT",
  ).length;

  const activePercentage =
    totalContracts > 0
      ? Math.round((activeContracts / totalContracts) * 100)
      : 0;

  // Filter contracts based on selected tab
  const getFilteredContracts = () => {
    let filtered = validContracts;

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter(
        (contract) => contract.status === selectedTab.toUpperCase(),
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contract) =>
          contract.name.toLowerCase().includes(query) ||
          contract.property?.name.toLowerCase().includes(query) ||
          contract.tenant?.name.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const filteredContracts = getFilteredContracts();

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
                <FileText className="h-6 w-6" />
              </div>
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
              {t("subtitle")}
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
            title={t("stats.totalContracts")}
            value={totalContracts}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50"
          />
          <StatsCard
            title={t("stats.activeContracts")}
            value={activeContracts}
            icon={Users}
            trend={{ value: activePercentage, isPositive: true }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50"
          />
          <StatsCard
            title={t("stats.expiredContracts")}
            value={expiredContracts}
            icon={AlertTriangle}
            trend={{ value: 8, isPositive: false }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50"
          />
          <StatsCard
            title={t("stats.draftContracts")}
            value={draftContracts}
            icon={Settings}
            trend={{ value: 5, isPositive: true }}
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
              <TabsList className="grid w-full max-w-md grid-cols-4 bg-neutral-100 dark:bg-neutral-800">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t("tabs.all")}
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t("tabs.active")}
                </TabsTrigger>
                <TabsTrigger
                  value="expired"
                  className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {t("tabs.expired")}
                </TabsTrigger>
                <TabsTrigger
                  value="draft"
                  className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t("tabs.draft")}
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
                        onClick={handleCreateContract}
                        className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Contract
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create a new contract</p>
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
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View contract analytics</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <ContractFilterForm onFilter={handleFilter} />
            </div>

            {/* Contracts Grid */}
            <TabsContent value="all" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isPending ? (
                  <ContractGridSkeleton count={6} />
                ) : isError ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                    <h2 className="text-xl font-semibold">
                      Failed to Load Contracts
                    </h2>
                    <p className="text-gray-600">
                      {error?.message || "An unexpected error occurred."}
                    </p>
                    <Button onClick={() => refetch()}>Try Again</Button>
                  </div>
                ) : filteredContracts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <FileText className="h-12 w-12 text-gray-400" />
                    <h2 className="text-xl font-semibold">
                      No Contracts Found
                    </h2>
                    <p className="text-gray-600">
                      {searchQuery
                        ? "No contracts match your search criteria."
                        : "Get started by creating your first contract."}
                    </p>
                    <Button onClick={handleCreateContract}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Contract
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <AnimatePresence>
                      {filteredContracts.map((contract, index) => (
                        <motion.div
                          key={contract.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <ContractCard
                            contract={contract}
                            onClick={handleContractClick}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            {/* Other tab contents would be similar */}
            <TabsContent value="active" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isPending ? (
                  <ContractGridSkeleton count={6} />
                ) : (
                  <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {filteredContracts.map((contract, index) => (
                        <motion.div
                          key={contract.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <ContractCard
                            contract={contract}
                            onClick={handleContractClick}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="expired" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isPending ? (
                  <ContractGridSkeleton count={6} />
                ) : (
                  <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {filteredContracts.map((contract, index) => (
                        <motion.div
                          key={contract.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <ContractCard
                            contract={contract}
                            onClick={handleContractClick}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="draft" className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isPending ? (
                  <ContractGridSkeleton count={6} />
                ) : (
                  <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {filteredContracts.map((contract, index) => (
                        <motion.div
                          key={contract.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <ContractCard
                            contract={contract}
                            onClick={handleContractClick}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ContractPage;
