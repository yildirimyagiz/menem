"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@reservatior/ui/button";
import { useTranslations } from "next-intl";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations();
  
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
        {t("Admin.agencies.table.pagination.showing", { defaultValue: "Showing" })} {startRow}-{endRow} {t("Admin.agencies.table.pagination.of", { defaultValue: "of" })} {totalRows} {t("Admin.agencies.table.pagination.results", { defaultValue: "results" })}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* First Page */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0"
            aria-label={t("Admin.agencies.table.pagination.firstPage", { defaultValue: "First page" })}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Previous Page */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0"
            aria-label={t("Admin.agencies.table.pagination.previousPage", { defaultValue: "Previous page" })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Page Info */}
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("Admin.agencies.table.pagination.page", { defaultValue: "Page" })}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currentPage}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("Admin.agencies.table.pagination.of", { defaultValue: "of" })}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {totalPages}
          </span>
        </div>

        {/* Next Page */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0"
            aria-label={t("Admin.agencies.table.pagination.nextPage", { defaultValue: "Next page" })}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Last Page */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0"
            aria-label={t("Admin.agencies.table.pagination.lastPage", { defaultValue: "Last page" })}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
