"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
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

import type { IncludedService } from "../types";
import { useDebounce } from "~/hooks/use-debounce";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface IncludedServiceListProps {
  services: IncludedService[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
  facilityId?: string;
}

const ITEMS_PER_PAGE = 10;

const IncludedServiceList: React.FC<IncludedServiceListProps> = ({
  services: initialServices,
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
  const [selectedService, setSelectedService] =
    useState<IncludedService | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Debounce search input
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Delete mutation
  const deleteMutation = api.includedService.delete.useMutation();

  // Fetch included services with filters
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = api.includedService.all.useQuery(
    {
      facilityId,
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  // Extract services and pagination data from response
  const services = (response?.data as any)?.items ?? initialServices ?? [];
  const totalItems =
    (response?.data as any)?.total ?? initialServices?.length ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!debouncedSearchQuery) return services;
    return services.filter(
      (service: any) =>
        service.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ??
        service.description
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [services, debouncedSearchQuery]);

  // Handle search input changes
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (service: IncludedService) => {
    setSelectedService(service);
    onEdit?.(service.id);
  };

  const handleDelete = (service: IncludedService) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;

    try {
      deleteMutation.mutate({ id: selectedService.id });
      toast({
        title: "Success",
        description: "Included service deleted successfully",
      });
      refetch();
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete included service",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  // Loading state
  if (isLoading && !isRefetching) {
    return (
      <Card>
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
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message ||
            "Failed to load included services. Please try again."}
        </AlertDescription>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {isRefetching ? "Retrying..." : "Retry"}
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Included Services
            </CardTitle>
            <p className="text-muted-foreground">
              Manage services included with your facility
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Included Services Table */}
        {filteredServices.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              No included services found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "No services match your search criteria."
                : "Get started by adding your first included service."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service: any) => (
                    <TableRow key={`service-${service.id}`}>
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {service.description ?? "No description"}
                      </TableCell>
                      <TableCell>
                        {service.createdAt
                          ? new Date(service.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(service)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(service)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
                  {totalItems} services
                </p>
                <div className="flex gap-2">
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
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Included Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Are you sure you want to delete "{selectedService.name}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedService(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default IncludedServiceList;
