"use client";

import React, { useEffect, useState } from "react";
import { ExclamationTriangleIcon, PlusIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";

import type { Tenant } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import TenantFilterForm from "./_components/TenantFilterForm";
import TenantList from "./_components/TenantList";
import TenantModal from "./_components/TenantModal";

// Safe wrappers to avoid TRPC error-typed collisions (avoid typing against api.* and avoid any)
function useTenantAllQuerySafe(filter: unknown, options?: unknown): unknown {
  const fn = (api as unknown as { tenant: { all: { useQuery: (f: unknown, o?: unknown) => unknown } } })
    .tenant.all.useQuery;
  return fn(filter, options);
}

function useTenantDeleteMutationSafe(config?: unknown): unknown {
  const fn = (api as unknown as { tenant: { delete: { useMutation: (c?: unknown) => unknown } } })
    .tenant.delete.useMutation;
  return fn(config);
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
}

// UI filter type aligned with `TenantFilter` shape in `TenantFilterForm.tsx`
interface TenantFilterUI {
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  paymentStatus?: "PAID" | "UNPAID" | "PARTIALLY_PAID" | "OVERDUE" | "REFUNDED" | "CANCELLED" | "";
  leaseStartDateFrom?: Date | string | null;
  leaseStartDateTo?: Date | string | null;
  sortBy?: "leaseStartDate" | "leaseEndDate" | "paymentStatus" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

const AdminTenantsPage = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<TenantFilterUI>({
    page: 1,
    pageSize: 10,
    sortBy: "leaseStartDate",
    sortOrder: "desc",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  // removed unused selectedTenant state

  // Enhanced API connection with better error handling and caching
  const query = useTenantAllQuerySafe(filter, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  }) as {
    data?: { data?: { items?: unknown[]; total?: number } };
    isPending: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void | Promise<unknown>;
  };
  const { data, isPending, isError, error, refetch } = query;

  const deleteTenantMutation = useTenantDeleteMutationSafe({
    onSuccess: () => {
      void refetch();
      toast({
        title: "Success",
        description: "Tenant has been successfully deleted.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Delete Failed",
        description: getErrorMessage(error, "Failed to delete tenant."),
        variant: "destructive",
      });
    },
  }) as { mutateAsync: (input: { id: string }) => Promise<unknown> };

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading tenants",
        description: getErrorMessage(error, "An unexpected error occurred."),
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Extract tenants array from data with proper type handling
  const isTenant = (obj: unknown): obj is Tenant =>
    !!obj && typeof obj === "object" && "id" in obj && "firstName" in obj;
  const maybeItems = (data as { data?: { items?: unknown[] } } | undefined)?.data?.items;
  const items = Array.isArray(maybeItems) ? maybeItems : [];
  const tenants: Tenant[] = items.filter(isTenant);
  const maybeTotal = (data as { data?: { total?: number } } | undefined)?.data?.total;
  const totalTenants = typeof maybeTotal === "number" ? maybeTotal : tenants.length;

  const handleFilterChange = (newFilter: TenantFilterUI) => {
    setFilter(newFilter);
  };

  const handleSearch = (query: string) => {
    setFilter((prev: TenantFilterUI) => ({
      ...prev,
      search: query,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsCreateModalOpen(true);
  };

  const handleView = (tenant: Tenant) => {
    // You can implement a view modal here if needed
    toast({
      title: "Tenant Details",
      description: `Viewing details for ${tenant.firstName} ${tenant.lastName}`,
    });
  };

  const handleDelete = async (tenantId: string) => {
    try {
      await deleteTenantMutation.mutateAsync({ id: tenantId });
    } catch (error) {
      // Error is handled in the mutation
      console.error("Delete error:", error);
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingTenant(null);
  };

  const handleModalSuccess = () => {
    void refetch();
  };

  // Calculate statistics
  const paidTenants = tenants.filter((t: { paymentStatus: string }) => t.paymentStatus === "PAID").length;
  const unpaidTenants = tenants.filter(
    (t: { paymentStatus: string }) => t.paymentStatus === "UNPAID",
  ).length;
  const overdueTenants = tenants.filter(
    (t: { paymentStatus: string }) => t.paymentStatus === "OVERDUE",
  ).length;
  const paidPercentage =
    tenants.length > 0 ? Math.round((paidTenants / tenants.length) * 100) : 0;

  return (
    <TooltipProvider>
      <div className="container mx-auto space-y-8 p-4">
        {/* Enhanced Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Tenant Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage your tenant information and lease details
                </p>
              </div>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <PlusIcon className="h-4 w-4" />
                Add Tenant
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add a new tenant to your system</TooltipContent>
          </Tooltip>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="group border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tenants
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200 dark:bg-blue-900 dark:group-hover:bg-blue-800">
                <UserGroupIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {totalTenants}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {tenants.length} currently loaded
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{
                    width: `${Math.min((tenants.length / Math.max(totalTenants, 1)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Paid Tenants
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 transition-colors group-hover:bg-green-200 dark:bg-green-900 dark:group-hover:bg-green-800">
                <UserIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {paidTenants}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {paidPercentage}% of total
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${paidPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unpaid Tenants
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 transition-colors group-hover:bg-yellow-200 dark:bg-yellow-900 dark:group-hover:bg-yellow-800">
                <UserIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {unpaidTenants}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Requires attention
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{
                    width: `${tenants.length > 0 ? Math.round((unpaidTenants / tenants.length) * 100) : 0}%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Overdue Tenants
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 transition-colors group-hover:bg-red-200 dark:bg-red-900 dark:group-hover:bg-red-800">
                <UserIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {overdueTenants}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Urgent action needed
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                  style={{
                    width: `${tenants.length > 0 ? Math.round((overdueTenants / tenants.length) * 100) : 0}%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {isError && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="flex items-center space-x-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading tenants
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {getErrorMessage(error, "An unexpected error occurred.")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <TenantFilterForm
          onFilter={handleFilterChange}
          currentFilter={filter}
        />

        {/* Tenant List */}
        <div className="mt-8">
          <TenantList
            tenants={tenants}
            isLoading={isPending}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onView={handleView}
          />
        </div>

        {/* Tenant Modal */}
        <TenantModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          tenant={editingTenant}
        />

        {/* Quick Actions Floating Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <PlusIcon className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add New Tenant</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminTenantsPage;
