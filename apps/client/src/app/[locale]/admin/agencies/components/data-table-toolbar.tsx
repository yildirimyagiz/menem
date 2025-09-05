"use client";

import type { Table } from "@tanstack/react-table";
import { SlidersHorizontal, Search, Filter, Download } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@reservatior/ui/button";
import { useTranslations } from "next-intl";
import { Input } from "@reservatior/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onExport?: () => void;
  onFilter?: () => void;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  onExport,
  onFilter,
  searchPlaceholder,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations();
  
  const searchValue = typeof table.getColumn("name")?.getFilterValue() === "string" 
    ? (table.getColumn("name")?.getFilterValue() as string) 
    : "";

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Search Input */}
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={searchPlaceholder ?? t("Admin.agencies.table.search.placeholder", { defaultValue: "Search agencies..." })}
            value={searchValue}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-8 h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onFilter && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onFilter}
              className="h-9 px-3"
            >
              <Filter className="mr-2 h-4 w-4" />
              {t("Admin.agencies.table.toolbar.filters", { defaultValue: "Filters" })}
            </Button>
          </motion.div>
        )}
        
        {onExport && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExport}
              className="h-9 px-3"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("Admin.agencies.table.toolbar.export", { defaultValue: "Export" })}
            </Button>
          </motion.div>
        )}
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 px-3"
            onClick={() => {
              // Reset all filters
              table.resetColumnFilters();
              table.resetGlobalFilter();
            }}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t("Admin.agencies.table.toolbar.reset", { defaultValue: "Reset" })}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
