"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@reservatior/ui/alert";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Input } from "@reservatior/ui/input";
import { Skeleton } from "@reservatior/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import type { Expense } from "../types";
import { useDebounce } from "~/hooks/use-debounce";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface ExpenseListProps {
  expenses: Expense[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
  facilityId?: string;
}

const ITEMS_PER_PAGE = 10;

// Enhanced skeleton with AceternityUI style
const ExpenseSkeleton = () => (
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

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses: initialExpenses,
  loading: externalLoading,
  onEdit,
  onDelete,
  onAdd,
  onRefresh,
  facilityId,
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Debounce search input
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Delete mutation
  const deleteMutation = api.expense.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  // Fetch expenses with filters (only if no initial expenses provided)
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = api.expense.byFacilityId.useQuery(
    {
      facilityId: facilityId!,
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
      enabled: !!facilityId && initialExpenses.length === 0,
    },
  );

  // Extract expenses and pagination data from response
  const expenses =
    initialExpenses.length > 0
      ? initialExpenses
      : (response?.data?.items ?? []);
  const totalItems =
    initialExpenses.length > 0
      ? initialExpenses.length
      : (response?.data?.total ?? 0);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Filter expenses based on search query
  const filteredExpenses = useMemo(() => {
    if (!debouncedSearchQuery) return expenses;
    return expenses.filter(
      (expense: any) =>
        expense.type
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        expense.status
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        expense.amount?.toString().includes(debouncedSearchQuery),
    );
  }, [expenses, debouncedSearchQuery]);

  // Handle search input changes
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    onEdit?.(expense.id);
  };

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedExpense) return;

    try {
      await deleteMutation.mutateAsync(selectedExpense.id);
      setIsDeleteModalOpen(false);
      setSelectedExpense(null);
    } catch (error: any) {
      console.error("Delete error:", error);
    }
  };

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        variant: "secondary" as const,
        label: "Pending",
        className:
          "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:text-yellow-300 dark:border-yellow-700",
      },
      PAID: {
        variant: "default" as const,
        label: "Paid",
        className:
          "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300 dark:border-green-700",
      },
      OVERDUE: {
        variant: "destructive" as const,
        label: "Overdue",
        className:
          "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 dark:from-red-900/20 dark:to-red-800/20 dark:text-red-300 dark:border-red-700",
      },
      CANCELLED: {
        variant: "outline" as const,
        label: "Cancelled",
        className:
          "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 border-neutral-300 dark:from-neutral-900/20 dark:to-neutral-800/20 dark:text-neutral-300 dark:border-neutral-700",
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Calculate statistics
  const totalAmount = filteredExpenses.reduce(
    (sum: number, expense: any) => sum + (expense.amount || 0),
    0,
  );
  const paidAmount = filteredExpenses
    .filter((expense: any) => expense.status === "PAID")
    .reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
  const pendingAmount = filteredExpenses
    .filter((expense: any) => expense.status === "PENDING")
    .reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);

  // Loading state
  if (isLoading && !isRefetching && initialExpenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 bg-gradient-to-r from-white to-neutral-50 shadow-lg dark:from-neutral-800 dark:to-neutral-700">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Error state
  if (isError && initialExpenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert
          variant="destructive"
          className="border-0 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || "Failed to load expenses. Please try again."}
          </AlertDescription>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefetching}
              className="border-red-200 bg-white hover:bg-red-50 dark:border-red-700 dark:bg-neutral-800 dark:hover:bg-red-900/20"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              {isRefetching ? "Retrying..." : "Retry"}
            </Button>
          </div>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-gradient-to-r from-white to-neutral-50 shadow-lg dark:from-neutral-800 dark:to-neutral-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Expenses
              </CardTitle>
              <p className="text-neutral-600 dark:text-neutral-400">
                Manage facility expenses and track payments
              </p>
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onAdd}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Total Amount
                    </p>
                    <p className="text-xl font-bold text-neutral-900 dark:text-white">
                      ${totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-green-950/20 dark:to-emerald-950/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Paid Amount
                    </p>
                    <p className="text-xl font-bold text-neutral-900 dark:text-white">
                      ${paidAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-transparent to-orange-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-yellow-950/20 dark:to-orange-950/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      Pending Amount
                    </p>
                    <p className="text-xl font-bold text-neutral-900 dark:text-white">
                      ${pendingAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search expenses..."
                className="rounded-xl border-neutral-200 bg-white pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                value={searchQuery}
                onChange={handleSearchInput}
              />
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Expenses Table */}
          {filteredExpenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-700"
            >
              <DollarSign className="mb-4 h-12 w-12 text-neutral-400" />
              <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                No expenses found
              </h3>
              <p className="mb-4 text-center text-neutral-600 dark:text-neutral-400">
                {searchQuery
                  ? "No expenses match your search criteria."
                  : "Get started by adding your first expense."}
              </p>
              {searchQuery && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  >
                    Clear search
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="bg-neutral-50 dark:bg-neutral-800">
                      <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Type
                      </TableHead>
                      <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Amount
                      </TableHead>
                      <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Due Date
                      </TableHead>
                      <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Notes
                      </TableHead>
                      <TableHead className="w-[100px] font-semibold text-neutral-900 dark:text-neutral-100">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredExpenses.map((expense: any, index: number) => (
                        <motion.tr
                          key={`expense-${expense.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        >
                          <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                            {getTypeLabel(expense.type)}
                          </TableCell>
                          <TableCell className="font-semibold text-neutral-900 dark:text-neutral-100">
                            ${expense.amount?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(expense.status)}
                          </TableCell>
                          <TableCell className="text-neutral-600 dark:text-neutral-400">
                            {expense.dueDate
                              ? new Date(expense.dueDate).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-neutral-600 dark:text-neutral-400">
                            {expense.notes ?? "No notes"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(expense)}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(expense)}
                                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </motion.div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
                    {totalItems} expenses
                  </p>
                  <div className="flex gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        Previous
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        Next
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="w-full max-w-md border-0 bg-gradient-to-br from-white to-neutral-50 shadow-2xl dark:from-neutral-900 dark:to-neutral-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                    <Trash2 className="mr-2 h-5 w-5" />
                    Delete Expense
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                    Are you sure you want to delete this expense? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDeleteModalOpen(false);
                          setSelectedExpense(null);
                        }}
                        className="border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="destructive"
                        onClick={confirmDelete}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        Delete
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpenseList;
