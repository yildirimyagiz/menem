import type { Table } from "@tanstack/react-table";
import { ArrowUpDown, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

import { cn } from "~/lib/utils";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const t = useTranslations();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {(() => {
          // Map column ids to translation keys (matching admin.accounts.table)
          const columnLabelMap: Record<string, string> = {
            provider: t("admin.accounts.table.provider"),
            type: t("admin.accounts.table.type"),
            providerAccountId: t("admin.accounts.table.accountId"),
            "user.email": t("admin.accounts.table.userEmail"),
            actions: t("admin.accounts.table.actions"),
            // Add more mappings as needed
          };
          return table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => {
              return (
                <DropdownMenuItem
                  key={column.id}
                  className="capitalize"
                  onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                >
                  <span
                    className={cn(
                      "mr-2 h-4 w-4",
                      column.getIsVisible() ? "opacity-0" : "opacity-100",
                    )}
                  >
                    <EyeOff className="h-4 w-4" />
                  </span>
                  {columnLabelMap[column.id] ?? column.id}
                </DropdownMenuItem>
              );
            });
        })()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
