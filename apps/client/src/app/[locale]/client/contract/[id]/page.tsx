"use client";

import React, { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileSignature,
  FileText,
  MoreHorizontal,
  PenTool,
  Printer,
  Share2,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Progress } from "@reservatior/ui/progress";
import { Separator } from "@reservatior/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { ContractStatusBadge } from "../_components/ContractStatusBadge";

// Enhanced skeleton for contract details
const ContractDetailSkeleton = () => (
  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
      </div>
    </motion.div>
  </div>
);

// Stats card component
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
      "group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900",
      className,
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-xl font-bold text-neutral-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp
                className={cn(
                  "h-3 w-3",
                  trend.isPositive ? "text-green-500" : "text-red-500",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
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

const ContractDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const contractId = params.id as string;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSignDialog, setShowSignDialog] = useState(false);

  // Fetch contract details
  const {
    data: contract,
    isLoading,
    isError,
    error,
  } = api.contract.byId.useQuery(
    { id: contractId },
    {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  // Mock data for related items since they don't have contract relationships in the schema
  const expenses: any[] = [];
  const extraCharges: any[] = [];
  const includedServices: any[] = [];

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEdit = useCallback(() => {
    // TODO: Navigate to edit page or open edit modal
    toast({
      title: "Edit Contract",
      description: "Edit functionality coming soon!",
    });
  }, [toast]);

  const handleDelete = useCallback(() => {
    // TODO: Implement delete functionality
    toast({
      title: "Delete Contract",
      description: "Delete functionality coming soon!",
    });
    setShowDeleteDialog(false);
  }, [toast]);

  const handleSign = useCallback(() => {
    // TODO: Implement signing functionality
    toast({
      title: "Sign Contract",
      description: "Contract signing functionality coming soon!",
    });
    setShowSignDialog(false);
  }, [toast]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(() => {
    // TODO: Implement share functionality
    toast({
      title: "Share Contract",
      description: "Share functionality coming soon!",
    });
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    if (!contract) return 0;
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isExpired = daysRemaining < 0;
  const isExpiringSoon = daysRemaining <= 30 && daysRemaining >= 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ContractDetailSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold">Contract Not Found</h2>
            <p className="text-gray-600">
              {error?.message || "The requested contract could not be found."}
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {contract.name}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Contract Details
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Print contract details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share contract</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  >
                    <MoreHorizontal className="mr-2 h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSignDialog(true)}>
                    <FileSignature className="mr-2 h-4 w-4" />
                    Sign Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Contract
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Contract Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-neutral-900 dark:text-white">
                      {contract.name}
                    </CardTitle>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {contract.description || "No description available"}
                    </p>
                  </div>
                </div>
                <ContractStatusBadge status={contract.status} size="lg" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Property"
                  value={contract.property?.name ?? "Unknown"}
                  icon={Building2}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50"
                />
                <StatsCard
                  title="Tenant"
                  value={contract.tenant?.name ?? "Unknown"}
                  icon={Users}
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50"
                />
                <StatsCard
                  title="Agency"
                  value={contract.agency?.name ?? "Unknown"}
                  icon={Shield}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50"
                />
                <StatsCard
                  title="Days Remaining"
                  value={
                    isExpired
                      ? `${Math.abs(daysRemaining)} days ago`
                      : `${daysRemaining} days`
                  }
                  icon={Clock}
                  className={cn(
                    "bg-gradient-to-br",
                    isExpired
                      ? "from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50"
                      : isExpiringSoon
                        ? "from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50"
                        : "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50",
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contract Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-neutral-100 dark:bg-neutral-800">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Financial
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Services
              </TabsTrigger>
              <TabsTrigger
                value="charges"
                className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Charges
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger
                value="increases"
                className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Increases
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Contract Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        Start Date:
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formatDate(contract.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        End Date:
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formatDate(contract.endDate)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        Duration:
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {Math.ceil(
                          (new Date(contract.endDate).getTime() -
                            new Date(contract.startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Contract Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        Status:
                      </span>
                      <ContractStatusBadge status={contract.status} />
                    </div>
                    {!isExpired && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Days Remaining:
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              isExpiringSoon
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-neutral-900 dark:text-white",
                            )}
                          >
                            {daysRemaining} days
                          </span>
                        </div>
                        <Progress
                          value={
                            ((new Date(contract.endDate).getTime() -
                              new Date().getTime()) /
                              (new Date(contract.endDate).getTime() -
                                new Date(contract.startDate).getTime())) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    )}
                    {isExpired && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Expired:
                        </span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          {Math.abs(daysRemaining)} days ago
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {expenses && expenses.length > 0 ? (
                      <div className="space-y-3">
                        {expenses.slice(0, 5).map((expense: any) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                          >
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-white">
                                {expense.name}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {expense.description}
                              </p>
                            </div>
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              ${expense.amount}
                            </span>
                          </div>
                        ))}
                        {expenses.length > 5 && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            +{expenses.length - 5} more expenses
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-neutral-600 dark:text-neutral-400">
                        No expenses recorded for this contract.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Extra Charges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {extraCharges && extraCharges.length > 0 ? (
                      <div className="space-y-3">
                        {extraCharges.slice(0, 5).map((charge: any) => (
                          <div
                            key={charge.id}
                            className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                          >
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-white">
                                {charge.name}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {charge.description}
                              </p>
                            </div>
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              ${charge.amount}
                            </span>
                          </div>
                        ))}
                        {extraCharges.length > 5 && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            +{extraCharges.length - 5} more charges
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-neutral-600 dark:text-neutral-400">
                        No extra charges for this contract.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="mt-6">
              <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Included Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {includedServices && includedServices.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {includedServices.map((service: any) => (
                        <div
                          key={service.id}
                          className="flex items-center space-x-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {service.name}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-600 dark:text-neutral-400">
                      No included services for this contract.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Charges Tab */}
            <TabsContent value="charges" className="mt-6">
              <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Extra Charges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {extraCharges && extraCharges.length > 0 ? (
                    <div className="space-y-4">
                      {extraCharges.map((charge: any) => (
                        <div
                          key={charge.id}
                          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-neutral-900 dark:text-white">
                                {charge.name}
                              </h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {charge.description}
                              </p>
                            </div>
                            <Badge variant="secondary">${charge.amount}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-600 dark:text-neutral-400">
                      No extra charges for this contract.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-6">
              <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Contract Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          Contract Created
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(contract.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          Contract Started
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(contract.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          Contract Ends
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(contract.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          Last Updated
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(contract.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Increases Tab */}
            <TabsContent value="increases" className="mt-6">
              <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Rent Increases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No rent increases recorded for this contract.
                      </p>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Propose Increase
                      </Button>
                    </div>

                    {/* Mock increase data for demonstration */}
                    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-neutral-900 dark:text-white">
                            Rent Increase Proposal
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Proposed by: Property Manager
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Effective Date:{" "}
                            {formatDate(new Date().toISOString())}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              Old Rent: $1,500
                            </span>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              New Rent: $1,650
                            </span>
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            PENDING
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contract? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign Contract Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Contract</DialogTitle>
            <DialogDescription>
              Are you ready to sign this contract? This will make it legally
              binding.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSign}>
              <FileSignature className="mr-2 h-4 w-4" />
              Sign Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractDetailPage;
