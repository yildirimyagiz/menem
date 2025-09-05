"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

import type {
  AdminPropertyCreateInput,
  AdminPropertyFilterInput,
} from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@reservatior/ui/tooltip";

import PropertyFilterForm from "./_components/PropertyFilterForm";
import PropertyModal from "./_components/PropertyModal";
import PropertyTable from "./_components/PropertyTable";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// Safe wrappers to avoid TRPC error-typed collisions
function usePropertyAllQuerySafe(filter: unknown, options?: unknown): unknown {
  const fn = (api as unknown as { property: { all: { useQuery: (f: unknown, o?: unknown) => unknown } } })
    .property.all.useQuery;
  return fn(filter, options);
}

function usePropertyDeleteMutationSafe(config?: unknown): unknown {
  const fn = (api as unknown as { property: { delete: { useMutation: (c?: unknown) => unknown } } })
    .property.delete.useMutation;
  return fn(config);
}

const defaultFilter: AdminPropertyFilterInput = {
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function AdminPropertyPage() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<AdminPropertyCreateInput | null>(null);
  const [filter, setFilter] = useState<AdminPropertyFilterInput>(defaultFilter);

  const query = usePropertyAllQuerySafe(filter, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  }) as {
    data?: { data?: { items?: unknown[]; total?: number } };
    isPending: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void | Promise<unknown>;
  };

  const { data, isPending, isError, error, refetch } = query;

  useEffect(() => {
    if (isError && error) {
      toast({ title: "Error", description: "Failed to load properties", variant: "destructive" });
    }
  }, [isError, error, toast]);

  const deleteMutation = usePropertyDeleteMutationSafe({
    onSuccess: () => {
      void refetch();
      toast({ title: "Success", description: "Property deleted." });
    },
    onError: () => {
      toast({ title: "Delete Failed", description: "Failed to delete property.", variant: "destructive" });
    },
  }) as { mutateAsync: (input: { id: string }) => Promise<unknown> };

  type PropertyRow = {
    id: string;
    title?: string | null;
    category?: string | null;
    propertyStatus?: string | null;
    price?: number | null;
    listedAt?: string | Date | null;
  };

  const isPropertyRow = (obj: unknown): obj is PropertyRow =>
    !!obj && typeof obj === "object" && "id" in obj;

  const items = (data as { data?: { items?: unknown[] } } | undefined)?.data?.items;
  const properties: PropertyRow[] = Array.isArray(items) ? items.filter(isPropertyRow) : [];
  const total = (data as { data?: { total?: number } } | undefined)?.data?.total ?? properties.length;

  const handleFilter = (newFilter: AdminPropertyFilterInput) => setFilter(newFilter);

  const handleCreate = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: PropertyRow) => {
    const draft: AdminPropertyCreateInput = {
      title: row.title ?? "",
      category: undefined,
      propertyStatus: undefined,
      propertyType: undefined,
      price: row.price ?? undefined,
      listedAt: row.listedAt ? new Date(row.listedAt) : undefined,
    };
    setEditingProperty(draft);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
    } catch {
      // handled in onError
    }
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const onModalSuccess = () => {
    void refetch();
  };

  const stats = useMemo(() => ({ total }), [total]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Properties</h1>
            <p className="text-sm text-muted-foreground">Manage your properties</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleCreate} className="h-10">
                <PlusIcon className="mr-2 h-4 w-4" /> New Property
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create new property</TooltipContent>
          </Tooltip>
        </div>

        <Card className={cn("border-0 shadow-sm")}> 
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyFilterForm currentFilter={filter} onFilter={handleFilter} />
          </CardContent>
        </Card>

        <PropertyTable
          isLoading={isPending}
          total={total}
          items={properties}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={(page) => setFilter((f) => ({ ...f, page }))}
          onPageSizeChange={(pageSize) => setFilter((f) => ({ ...f, pageSize }))}
        />

        <PropertyModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          onSuccess={onModalSuccess}
          property={editingProperty}
        />
      </div>
    </TooltipProvider>
  );
}
