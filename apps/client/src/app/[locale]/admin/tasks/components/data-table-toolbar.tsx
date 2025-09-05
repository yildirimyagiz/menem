"use client";

import type { Table } from "@tanstack/react-table";
import type { z } from "zod";
import {
  TaskCategory,
  TaskLabel,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";
import { X } from "lucide-react";

import type { TaskFilterSchema } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";

import { api } from "~/trpc/react";
import DataTableFacetedFilter from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Update the filterTasks function to properly use the filter values
  const filterTasks = (
    filterValues: Partial<z.infer<typeof TaskFilterSchema>>,
  ) => {
    const { data, isLoading, error } = api.tasks.getAll.useQuery({
      ...filterValues, // Spread all filter values
      page: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    if (data) {
      // Update table data with filtered results
      console.log(data);
    }
  };

  // Get current filter values from all columns
  const getFilterValues = (title: string) => ({
    title,
    status: table.getColumn("status")?.getFilterValue() as TaskStatus,
    priority: table.getColumn("priority")?.getFilterValue() as TaskPriority,
    category: table.getColumn("category")?.getFilterValue() as TaskCategory,
    labels: table.getColumn("labels")?.getFilterValue() as TaskLabel[],
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const newValue = event.target.value;
            table.getColumn("title")?.setFilterValue(newValue);
            filterTasks(getFilterValues(newValue));
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={Object.values(TaskStatus).map((status) => ({
              label: status,
              value: status,
            }))}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={Object.values(TaskPriority).map((priority) => ({
              label: priority,
              value: priority,
            }))}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={Object.values(TaskCategory).map((category) => ({
              label: category,
              value: category,
            }))}
          />
        )}
        {table.getColumn("labels") && (
          <DataTableFacetedFilter
            column={table.getColumn("labels")}
            title="Labels"
            options={Object.values(TaskLabel).map((taskLabel) => ({
              label: taskLabel,
              value: taskLabel,
            }))}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
