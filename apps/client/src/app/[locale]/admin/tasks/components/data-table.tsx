"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import { api } from "~/trpc/react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Queries
  const { data, isLoading, error } = api.tasks.getAll.useQuery({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const getCount = api.tasks.count.useQuery();

  React.useEffect(() => {
    if (getCount.error) {
      console.error("Error fetching task count:", getCount.error);
    }
  }, [getCount.error]);

  const count = getCount.data ?? 0; // Use the count from the query
  const tasks = data?.tasks ?? []; // Extract tasks from paginated response

  // Mutations
  const addToFavorites = api.tasks.addToFavorites.useMutation();
  const makeCopy = api.tasks.makeCopy.useMutation();
  const updateTask = api.tasks.update.useMutation();
  const deleteTask = api.tasks.delete.useMutation();

  const table = useReactTable({
    data: tasks,
    columns: columns as ColumnDef<unknown, any>[],
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="relative rounded-3xl border border-gray-200/60 bg-white/60 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60">
      <DataTableToolbar table={table} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto"
      >
        <Table className="min-w-full text-sm">
          <TableHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200/60 dark:border-gray-700/60"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                      <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full border-2 border-blue-400 opacity-20"></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Loading tasks...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <span className="text-xl text-red-600">!</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-red-600">
                        Error loading tasks
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {error.message}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="border-b border-gray-100/60 bg-white/60 transition-all hover:bg-blue-50/60 dark:border-gray-800/60 dark:bg-slate-900/60 dark:hover:bg-blue-900/30 [&[data-state=selected]]:ring-2 [&[data-state=selected]]:ring-blue-400"
                  style={{ cursor: "pointer" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-xl text-gray-400">📋</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        No tasks found
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        Create your first task to get started
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
      <DataTablePagination table={table} />
    </div>
  );
}
