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
import { Columns, GripVertical } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import type { Guest } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DraggableColumns } from "./DraggableColumns";
import { DraggableGuestRow } from "./DraggableGuestRow";

interface DataTableProps {
  columns: ColumnDef<Guest, any>[];
  data: Guest[];
  onQuickUpload?: (guests: any[]) => void;
}

export function DataTable({ columns, data, onQuickUpload }: DataTableProps) {
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isDragEnabled, setIsDragEnabled] = React.useState(false);
  const [isColumnManagementEnabled, setIsColumnManagementEnabled] =
    React.useState(false);
  const [mutableColumns, setMutableColumns] = React.useState(columns);
  const [mutableGuests, setMutableGuests] = React.useState(data);

  React.useEffect(() => {
    setMutableColumns(columns);
  }, [columns]);

  React.useEffect(() => {
    setMutableGuests(data);
  }, [data]);

  const table = useReactTable({
    data: isDragEnabled ? mutableGuests : data,
    columns: isColumnManagementEnabled ? mutableColumns : columns,
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

  const orderChanged =
    mutableGuests.length === data.length &&
    mutableGuests.some((g, i) => g.id !== data[i]?.id);

  const handleSaveOrder = async () => {
    toast.success("Guest order saved! (not yet persisted)");
  };

  const reorderRows = (draggedIndex: number, targetIndex: number) => {
    const updated = [...mutableGuests];
    const [removed] = updated.splice(draggedIndex, 1);
    if (removed) {
      updated.splice(targetIndex, 0, removed);
    }
    setMutableGuests(updated);
  };

  function isGuest(obj: any): obj is Guest {
    return obj && typeof obj === "object" && typeof obj.id === "string";
  }

  // Prepare draggable rows for row reordering mode
  const draggableRows = (
    <>
      {table.getRowModel().rows.reduce<JSX.Element[]>((acc, row, index) => {
        const guest = mutableGuests[index];
        if (!guest || !isGuest(guest) || !row) return acc;
        acc.push(
          <DraggableGuestRow
            key={guest.id}
            guest={guest}
            index={index}
            reorderRow={reorderRows}
            isDragEnabled={isDragEnabled}
            cells={row.getVisibleCells() as any}
          />,
        );
        return acc;
      }, [])}
    </>
  );

  function getTableRows() {
    return table.getRowModel().rows.map((row, index) => (
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
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </motion.tr>
    ));
  }

  return (
    <div className="relative rounded-3xl border border-gray-200/60 bg-white/60 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60">
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant={isDragEnabled ? "default" : "outline"}
          onClick={() => {
            setIsDragEnabled(!isDragEnabled);
            setIsColumnManagementEnabled(false);
          }}
          className="flex items-center gap-2"
          aria-label={
            isDragEnabled ? "Disable Row Reordering" : "Enable Row Reordering"
          }
        >
          <GripVertical className="h-4 w-4" />
          {isDragEnabled ? "Disable Row Reordering" : "Enable Row Reordering"}
        </Button>
        <Button
          variant={isColumnManagementEnabled ? "default" : "outline"}
          onClick={() => {
            setIsColumnManagementEnabled(!isColumnManagementEnabled);
            setIsDragEnabled(false);
          }}
          className="flex items-center gap-2"
          aria-label={
            isColumnManagementEnabled
              ? "Disable Column Reorder"
              : "Enable Column Reorder"
          }
        >
          <Columns className="h-4 w-4" />
          {isColumnManagementEnabled
            ? "Disable Column Reorder"
            : "Enable Column Reorder"}
        </Button>
        {isDragEnabled && orderChanged && (
          <Button
            onClick={handleSaveOrder}
            disabled={false}
            className="flex items-center gap-2"
            aria-label="Save guest order"
          >
            Save Order
          </Button>
        )}
      </div>
      <DataTableToolbar table={table} />
      <DndProvider backend={HTML5Backend}>
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
                  {headerGroup.headers.map((header) => {
                    const columnOrder = headerGroup.headers.map((h, idx) => ({
                      id: h.column.id ?? "",
                      index: idx,
                    }));
                    return isColumnManagementEnabled ? (
                      <DraggableColumns
                        key={header.id}
                        header={header as any}
                        col={header.column as any}
                        columnOrder={columnOrder}
                        columns={mutableColumns as any}
                        setColumns={setMutableColumns as any}
                        isManagementEnabled={isColumnManagementEnabled}
                      />
                    ) : (
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>{getTableRows()}</TableBody>
          </Table>
        </motion.div>
      </DndProvider>
      <DataTablePagination table={table} />
    </div>
  );
}
