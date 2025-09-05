"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import { DataTablePagination } from "../../guest/_components/data-table-pagination";

interface DataTableProps {
  columns: ColumnDef<any, any>[];
  data: any[];
}

function MortgageTableToolbar({ table }: { table: any }) {
  // Only show lender search if column exists
  const lenderColumn = table.getColumn("lender");
  const statusColumn = table.getColumn("status");
  return (
    <div className="mb-2 flex items-center gap-2">
      {lenderColumn && (
        <input
          type="text"
          placeholder="Search lender..."
          value={(lenderColumn.getFilterValue() as string) ?? ""}
          onChange={(e) => lenderColumn.setFilterValue(e.target.value)}
          className="h-8 w-[180px] rounded border px-2 text-sm"
          aria-label="Search lender"
        />
      )}
      {statusColumn && (
        <select
          value={statusColumn.getFilterValue() ?? ""}
          onChange={(e) =>
            statusColumn.setFilterValue(e.target.value || undefined)
          }
          className="h-8 rounded border px-2 text-sm"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PAID">Paid</option>
          <option value="DEFAULTED">Defaulted</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      )}
    </div>
  );
}

export function DataTable({ columns, data }: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
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
  });

  return (
    <div className="relative rounded-3xl border border-gray-200/60 bg-white/60 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60">
      <MortgageTableToolbar table={table} />
      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
