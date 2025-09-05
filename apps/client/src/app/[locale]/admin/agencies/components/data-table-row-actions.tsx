"use client";

import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, Eye, Copy } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@reservatior/ui/button";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

interface DataTableRowActionsProps<TData extends { id: string }> {
  row: Row<TData>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onCopy?: (id: string) => void;
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
  onEdit,
  onDelete,
  onView,
}: DataTableRowActionsProps<TData>) {
  const t = useTranslations();
  const id = row.original.id;
  
  const handleCopyId = () => {
    void navigator.clipboard.writeText(id);
    // You could add a toast notification here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="sr-only">
              {t("Admin.agencies.table.actions.openMenu", { defaultValue: "Open menu" })}
            </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onView && (
          <DropdownMenuItem 
            onClick={() => onView(id)}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-blue-600">
              {t("Admin.agencies.table.actions.view", { defaultValue: "View" })}
            </span>
          </DropdownMenuItem>
        )}
        
        {onEdit && (
          <DropdownMenuItem 
            onClick={() => onEdit(id)}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Pencil className="mr-2 h-4 w-4 text-green-600" />
            <span className="text-green-600">
              {t("Admin.agencies.table.actions.edit", { defaultValue: "Edit" })}
            </span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={handleCopyId}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Copy className="mr-2 h-4 w-4 text-gray-600" />
          <span className="text-gray-600">
            {t("Admin.agencies.table.actions.copyId", { defaultValue: "Copy ID" })}
          </span>
        </DropdownMenuItem>
        
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("Admin.agencies.table.actions.delete", { defaultValue: "Delete" })}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
