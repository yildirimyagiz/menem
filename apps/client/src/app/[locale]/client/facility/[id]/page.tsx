"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Building2,
  CheckCircle,
  CreditCard,
  DollarSign,
  Edit,
  Package,
  Plus,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import ExpenseList from "../_components/ExpenseList";
import ExpenseModal from "../_components/ExpenseModal";
import ExtraChargeList from "../_components/ExtraChargeList";
import ExtraChargeModal from "../_components/ExtraChargeModal";
import FacilityDeleteModal from "../_components/FacilityDeleteModal";
import FacilityEditModal from "../_components/FacilityEditModal";
import IncludedServiceList from "../_components/IncludedServiceList";
import IncludedServiceModal from "../_components/IncludedServiceModal";

const FacilityDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const facilityId = params.id as string;

  // State management
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isExtraChargeModalOpen, setIsExtraChargeModalOpen] = useState(false);
  const [selectedExtraCharge, setSelectedExtraCharge] = useState<any>(null);
  const [isIncludedServiceModalOpen, setIsIncludedServiceModalOpen] =
    useState(false);
  const [selectedIncludedService, setSelectedIncludedService] =
    useState<any>(null);

  // Fetch facility data
  const {
    data: facility,
    isLoading,
    isError,
    error,
    refetch,
  } = api.facility.byId.useQuery(
    { id: facilityId },
    {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 0, // Disable caching for debugging
      enabled: !!facilityId, // Only run query if facilityId exists
    },
  );

  // Debug logging
  console.log("=== FACILITY DETAIL DEBUG ===");
  console.log("Facility ID from params:", facilityId);
  console.log("Params object:", params);
  console.log("Is loading:", isLoading);
  console.log("Is error:", isError);
  console.log("Error:", error);
  console.log("Facility data:", facility);

  // Fetch related data
  const { data: expensesData } = api.expense.byFacility.useQuery(
    { facilityId },
    { enabled: !!facilityId },
  );

  const { data: extraChargesData } = api.extraCharge.byFacility.useQuery(
    { facilityId },
    { enabled: !!facilityId },
  );

  const { data: includedServicesData } =
    api.includedService.byFacility.useQuery(
      { facilityId },
      { enabled: !!facilityId },
    );

  // Delete mutation
  const deleteFacilityMutation = api.facility.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Facility has been successfully deleted.",
      });
      router.push("/client/facility");
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
        title: "Error loading facility",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !facility) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold">Facility Not Found</h2>
          <p className="text-gray-600">
            The facility you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/client/facility")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Facilities
          </Button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalExpenses = expensesData?.length ?? 0;
  const totalExtraCharges = extraChargesData?.length ?? 0;
  const totalIncludedServices = includedServicesData?.length ?? 0;
  const monthlyExpenses = totalExpenses * 0.3; // Mock calculation
  const yearlyExpenses = totalExpenses * 3.6; // Mock calculation

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RESIDENTIAL":
        return <Building2 className="h-4 w-4" />;
      case "COMMERCIAL":
        return <CreditCard className="h-4 w-4" />;
      case "INDUSTRIAL":
        return <Settings className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  // Transform data to match component expectations
  const transformedExpenses = (expensesData?.filter(Boolean) ?? []) as any[];
  const transformedExtraCharges = (extraChargesData?.filter(Boolean) ??
    []) as any[];
  const transformedIncludedServices = (includedServicesData?.filter(Boolean) ??
    []) as any[];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/client/facility")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{facility.name}</h1>
            <p className="text-gray-600">Facility Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit facility details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete facility</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Facility Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getTypeIcon(facility.type)}
                  <span>Facility Overview</span>
                </CardTitle>
                <Badge className={getStatusColor(facility.status)}>
                  {facility.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Type
                  </label>
                  <p className="text-sm">{facility.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <p className="text-sm">{facility.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(facility.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Updated
                  </label>
                  <p className="text-sm">
                    {new Date(facility.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {facility.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-sm text-gray-700">
                    {facility.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Total Expenses
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">
                  {totalExpenses.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Extra Charges
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{totalExtraCharges}</p>
                <p className="text-xs text-gray-500">Active charges</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Included Services
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">
                  {totalIncludedServices}
                </p>
                <p className="text-xs text-gray-500">Available services</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Monthly Avg
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">
                  {monthlyExpenses.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Per month</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for detailed information */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="expenses" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="extra-charges">Extra Charges</TabsTrigger>
                  <TabsTrigger value="included-services">
                    Included Services
                  </TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="expenses" className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Expenses</h3>
                    <Button
                      size="sm"
                      className="hidden md:inline-flex"
                      onClick={() => setIsExpenseModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </div>
                  <ExpenseList
                    facilityId={facilityId}
                    expenses={transformedExpenses}
                  />
                </TabsContent>

                <TabsContent value="extra-charges" className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Extra Charges</h3>
                    <Button
                      size="sm"
                      className="hidden md:inline-flex"
                      onClick={() => setIsExtraChargeModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Extra Charge
                    </Button>
                  </div>
                  <ExtraChargeList
                    facilityId={facilityId}
                    charges={transformedExtraCharges}
                  />
                </TabsContent>

                <TabsContent value="included-services" className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Included Services</h3>
                    <Button
                      size="sm"
                      className="hidden md:inline-flex"
                      onClick={() => setIsIncludedServiceModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service
                    </Button>
                  </div>
                  <IncludedServiceList
                    facilityId={facilityId}
                    services={transformedIncludedServices}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      Financial Analytics
                    </h3>

                    {/* Expense Trends */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Expense Trends
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {monthlyExpenses.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Monthly Average
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                              {yearlyExpenses.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Yearly Projection
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                              {totalExpenses > 0
                                ? Math.round(
                                    (monthlyExpenses / totalExpenses) * 100,
                                  )
                                : 0}
                              %
                            </p>
                            <p className="text-sm text-gray-600">
                              Monthly Ratio
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Performance Metrics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Cost Efficiency
                            </span>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">
                                Good
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Service Utilization
                            </span>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">
                                85%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Revenue Generation
                            </span>
                            <div className="flex items-center space-x-2">
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-semibold text-red-600">
                                -12%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start md:hidden"
                onClick={() => setIsExpenseModalOpen(true)}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start md:hidden"
                onClick={() => setIsExtraChargeModalOpen(true)}
              >
                <Package className="mr-2 h-4 w-4" />
                Add Extra Charge
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start md:hidden"
                onClick={() => setIsIncludedServiceModalOpen(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </CardContent>
          </Card>

          {/* Facility Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Facility Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="font-mono text-sm">{facility.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Type
                </label>
                <p className="text-sm">{facility.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <Badge className={getStatusColor(facility.status)}>
                  {facility.status}
                </Badge>
              </div>
              {facility.locationId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Location ID
                  </label>
                  <p className="font-mono text-sm">{facility.locationId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Expense added</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Service updated</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Facility edited</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <FacilityEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          void refetch();
        }}
        facilityId={facilityId}
      />

      <FacilityDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          router.push("/client/facility");
        }}
        facilityId={facilityId}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setSelectedExpense(null);
        }}
        onSuccess={() => {
          setIsExpenseModalOpen(false);
          setSelectedExpense(null);
        }}
        initialData={selectedExpense}
        facilityId={facilityId}
      />

      <ExtraChargeModal
        isOpen={isExtraChargeModalOpen}
        onClose={() => {
          setIsExtraChargeModalOpen(false);
          setSelectedExtraCharge(null);
        }}
        onSuccess={() => {
          setIsExtraChargeModalOpen(false);
          setSelectedExtraCharge(null);
        }}
        initialData={selectedExtraCharge}
        facilityId={facilityId}
      />

      <IncludedServiceModal
        isOpen={isIncludedServiceModalOpen}
        onClose={() => {
          setIsIncludedServiceModalOpen(false);
          setSelectedIncludedService(null);
        }}
        onSuccess={() => {
          setIsIncludedServiceModalOpen(false);
          setSelectedIncludedService(null);
        }}
        initialData={selectedIncludedService}
        facilityId={facilityId}
      />
    </div>
  );
};

export default FacilityDetailPage;
