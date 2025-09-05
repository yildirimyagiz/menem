"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

import { useTranslations } from "next-intl";

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const t = useTranslations();
  const agent = row.original as any;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">{t('Admin.agents.table.openMenu', { defaultValue: 'Open menu' })}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onEdit?.(agent.id)}>
          {t('Admin.agents.table.edit', { defaultValue: 'Edit' })}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete?.(agent.id)}>
          {t('Admin.agents.table.delete', { defaultValue: 'Delete' })}
          <DropdownMenuShortcut>{t('Admin.agents.table.deleteShortcut', { defaultValue: '⌘⌫' })}</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
