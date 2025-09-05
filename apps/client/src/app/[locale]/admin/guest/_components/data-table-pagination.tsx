"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@reservatior/ui";
import { Button } from "@reservatior/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  className?: string;
}

const DEFAULT_PAGE_SIZES = [10, 20, 30, 40, 50];

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  className,
}: DataTablePaginationProps<TData>) {
  const [pageSize, setPageSize] = React.useState(
    table.getState().pagination.pageSize,
  );
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;

  const handlePageSizeChange = React.useCallback(
    (value: string) => {
      const newSize = Number(value);
      setPageSize(newSize);
      table.setPageSize(newSize);
    },
    [table],
  );

  const navigationButtons = [
    {
      tooltip: "Go to first page",
      icon: ChevronsLeft,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      className: "hidden lg:flex",
    },
    {
      tooltip: "Go to previous page",
      icon: ChevronLeft,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
    },
    {
      tooltip: "Go to next page",
      icon: ChevronRight,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
    },
    {
      tooltip: "Go to last page",
      icon: ChevronsRight,
      onClick: () => table.setPageIndex(pageCount - 1),
      disabled: !table.getCanNextPage(),
      className: "hidden lg:flex",
    },
  ];

  return (
    <TooltipProvider>
      <div className={cn("flex items-center justify-between px-2", className)}>
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRows > 0 && (
            <p>
              {selectedRows} of {totalRows} row{totalRows === 1 ? "" : "s"}{" "}
              selected
            </p>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
              <SelectTrigger
                className="h-8 w-[70px]"
                aria-label="Select rows per page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top" align="end">
                {pageSizeOptions.map((size) => (
                  <SelectItem
                    key={size}
                    value={`${size}`}
                    className="text-right"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Information */}
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            <span className="hidden sm:inline">Page </span>
            {currentPage} of {pageCount}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {navigationButtons.map(
              ({
                tooltip,
                icon: Icon,
                onClick,
                disabled,
                className: btnClassName,
              }) => (
                <Tooltip key={tooltip}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("h-8 w-8 p-0", btnClassName)}
                      onClick={onClick}
                      disabled={disabled}
                      aria-label={tooltip}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              ),
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
