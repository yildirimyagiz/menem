"use client";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import React, { useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@reservatior/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { cn } from "~/lib/utils";

interface TenantListProps {
  tenants: any[]; // Will be inferred from API response
  isLoading: boolean;
  onEdit: (tenant: any) => void;
  onDelete: (tenantId: string) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filter: any) => void;
  onView: (tenant: any) => void;
}

const TenantList: React.FC<TenantListProps> = ({
  tenants,
  isLoading,
  onEdit,
  onDelete,
  onSearch,
  onFilterChange,
  onView,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onFilterChange({ page });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800";
      case "UNPAID":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800";
      case "OVERDUE":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800";
      case "PARTIALLY_PAID":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Paid";
      case "UNPAID":
        return "Unpaid";
      case "OVERDUE":
        return "Overdue";
      case "PARTIALLY_PAID":
        return "Partial";
      default:
        return status;
    }
  };

  const totalPages = Math.ceil(tenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenants = tenants.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <Card className="border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserGroupIcon className="h-5 w-5" />
            <span>Loading Tenants...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="border-0 bg-gradient-to-r from-white to-gray-50 shadow-sm dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <UserGroupIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Tenant List</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tenants.length} tenant{tenants.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm space-x-2"
            >
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Search
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search tenants</TooltipContent>
              </Tooltip>
            </form>
          </div>
        </CardHeader>

        <CardContent>
          {tenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <UserGroupIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No tenants found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first tenant"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Enhanced Data Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                        Tenant
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                        Lease Period
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                        Payment Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                        Created
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTenants.map((tenant) => (
                      <TableRow
                        key={tenant.id}
                        className="group transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                              <span className="text-sm font-medium text-white">
                                {tenant.firstName.charAt(0)}
                                {tenant.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {tenant.firstName} {tenant.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {tenant.id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {tenant.email}
                            </div>
                            {tenant.phoneNumber && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {tenant.phoneNumber}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {format(
                                new Date(tenant.leaseStartDate),
                                "MMM dd, yyyy",
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              to{" "}
                              {format(
                                new Date(tenant.leaseEndDate),
                                "MMM dd, yyyy",
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-2 font-medium",
                              getPaymentStatusColor(tenant.paymentStatus),
                            )}
                          >
                            {getPaymentStatusText(tenant.paymentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(tenant.createdAt), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onView(tenant)}
                                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <span className="sr-only">View</span>
                                  <UserGroupIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(tenant)}
                                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <span className="sr-only">Edit</span>
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit tenant</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete(tenant.id)}
                                  className="h-8 w-8 p-0 text-red-600 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-700 group-hover:opacity-100"
                                >
                                  <span className="sr-only">Delete</span>
                                  <EllipsisHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete tenant</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing{" "}
                        <span className="font-medium">{startIndex + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(endIndex, tenants.length)}
                        </span>{" "}
                        of <span className="font-medium">{tenants.length}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </Button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <Button
                            key={`page-${page}`}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0",
                              page === currentPage
                                ? "bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                : "text-gray-900 hover:bg-gray-50",
                            )}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TenantList;
