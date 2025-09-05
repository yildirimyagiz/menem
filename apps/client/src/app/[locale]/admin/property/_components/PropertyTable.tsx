"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Button } from "@reservatior/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@reservatior/ui/table";

import type { PropertyRow } from "./columns";
import { createColumns } from "./columns";

interface PropertyTableProps {
  items: PropertyRow[];
  total: number;
  isLoading: boolean;
  onEdit: (p: PropertyRow) => void;
  onDelete: (id: string) => void | Promise<void>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  items,
  total: _total,
  isLoading,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  React.useEffect(() => {
    onPageChange(page);
  }, [page, onPageChange]);

  React.useEffect(() => {
    onPageSizeChange(pageSize);
  }, [pageSize, onPageSizeChange]);

  const table = useReactTable({
    data: items,
    columns: createColumns(
      () => {/* placeholder view */},
      onEdit,
      onDelete,
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No properties found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={items.length < pageSize}>
            Next
          </Button>
        </div>
        <div className="space-x-2">
          <Button variant={pageSize === 10 ? "default" : "outline"} onClick={() => setPageSize(10)}>
            10
          </Button>
          <Button variant={pageSize === 20 ? "default" : "outline"} onClick={() => setPageSize(20)}>
            20
          </Button>
          <Button variant={pageSize === 50 ? "default" : "outline"} onClick={() => setPageSize(50)}>
            50
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyTable;
