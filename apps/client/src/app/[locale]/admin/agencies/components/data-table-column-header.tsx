"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@reservatior/ui";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { useTranslations } from "next-intl";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations();
  
  if (!column.getCanSort()) {
    return (
      <div className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", className)}>
        {title}
      </div>
    );
  }

  const sortDirection = column.getIsSorted();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Sort ${title}`}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
              </span>
              <div className="ml-2 flex items-center">
                {sortDirection === "desc" ? (
                  <ArrowDown className="h-4 w-4 text-blue-600" />
                ) : sortDirection === "asc" ? (
                  <ArrowUp className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{t("Admin.agencies.table.sort.ascending", { defaultValue: "Sort Ascending" })}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{t("Admin.agencies.table.sort.descending", { defaultValue: "Sort Descending" })}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(false)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 hover:text-red-700"
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span>{t("Admin.agencies.table.hideColumn", { defaultValue: "Hide Column" })}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
