"use client";

import { useState } from "react";
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import { useAuth } from "~/hooks/use-auth";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const statusColors = {
  UNPAID: "destructive",
  PARTIALLY_PAID: "secondary",
  PAID: "default",
  REFUNDED: "secondary",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
  PENDING: "secondary",
} as const;

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "REFUNDED";

export function PaymentHistory() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");

  // Refund mutation
  const refundMutation = api.payment.refund.useMutation();

  // Fetch payments with filters and pagination
  const {
    data: paymentsData,
    isLoading,
    error,
    refetch,
  } = api.payment.list.useQuery({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    paymentMethod:
      paymentMethodFilter === "all" ? undefined : paymentMethodFilter,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const payments = paymentsData?.data ?? [];
  const total = paymentsData?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1); // Reset to first page when changing limit
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus as PaymentStatus | "all");
    setPage(1); // Reset to first page when changing filters
  };

  const handlePaymentMethodFilterChange = (newMethod: string) => {
    setPaymentMethodFilter(newMethod);
    setPage(1); // Reset to first page when changing filters
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };

  // Show loading state while authentication is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
          <span>Loading authentication...</span>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!user) {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="text-center">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Authentication Required
          </h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Please log in to view your payment history.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading payments
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error.message}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Method:</span>
            <Select
              value={paymentMethodFilter}
              onValueChange={handlePaymentMethodFilterChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Show:</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      {paymentsData?.summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Paid
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(paymentsData.summary.totalPaid, "USD")}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Unpaid
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(paymentsData.summary.totalUnpaid, "USD")}
            </div>
          </div>
          {"totalDueSoon" in paymentsData.summary && (
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Due Soon
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(
                  (paymentsData.summary as any).totalDueSoon ?? 0,
                  "USD",
                )}
              </div>
            </div>
          )}
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Overdue
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(paymentsData.summary.totalOverdue, "USD")}
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notify</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                    <span>Loading payments...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center">
                  <div className="text-muted-foreground">No payments found</div>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const dueDate = new Date(payment.dueDate);
                const now = new Date();
                const isOverdue =
                  payment.status === "OVERDUE" ||
                  (payment.status !== "PAID" && dueDate < now);
                const isDueSoon =
                  !isOverdue &&
                  payment.status !== "PAID" &&
                  dueDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;
                return (
                  <TableRow
                    key={payment.id}
                    className={
                      isOverdue ? "bg-red-50" : isDueSoon ? "bg-yellow-50" : ""
                    }
                  >
                    <TableCell>
                      {format(new Date(payment.paymentDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(dueDate, "MMM d, yyyy")}
                      {isDueSoon && (
                        <span className="ml-2 text-xs text-yellow-600">
                          (Due Soon)
                        </span>
                      )}
                      {isOverdue && (
                        <span className="ml-2 text-xs text-red-600">
                          (Overdue)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{payment.reference ?? "N/A"}</TableCell>
                    <TableCell>{payment.notes ?? "No description"}</TableCell>
                    <TableCell>
                      {formatCurrency(
                        payment.amount,
                        payment.currency?.code ?? "USD",
                      )}
                    </TableCell>
                    <TableCell>{payment.paymentMethod ?? "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusColors[payment.status] || "secondary"}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(isDueSoon || isOverdue) && (
                        <BellIcon
                          className="h-5 w-5 text-yellow-500"
                          title="You will be notified"
                        />
                      )}
                      {/* Refund button for eligible payments */}
                      {["PAID", "OVERDUE"].includes(payment.status) &&
                        payment.status !== "REFUNDED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-2"
                            disabled={refundMutation.isPending}
                            onClick={async () => {
                              try {
                                await refundMutation.mutateAsync({
                                  id: payment.id,
                                  reason: "requested_by_customer",
                                });
                                toast({
                                  title: "Refunded",
                                  description: "Payment refunded successfully.",
                                });
                                refetch();
                              } catch (err: any) {
                                toast({
                                  title: "Refund failed",
                                  description: err.message,
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            Refund
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total} payments
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
