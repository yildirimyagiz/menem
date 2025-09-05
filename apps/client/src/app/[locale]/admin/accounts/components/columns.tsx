import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import type { Account } from "@reservatior/validators";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { DataTableColumnHeader } from "./data-table-column-header";

// Minimal stubs for missing components with proper types
import type { Row, Table } from "@tanstack/react-table";

function SelectAllCheckbox({ table, callbacks }: { table: Table<Account>; callbacks: AccountTableCallbacks }) {
  const isAllSelected = table.getIsAllPageRowsSelected();
  const isSomeSelected = table.getIsSomePageRowsSelected();
  
  return (
    <input
      type="checkbox"
      aria-label="Select all"
      checked={isAllSelected}
      ref={(el) => {
        if (el) el.indeterminate = isSomeSelected;
      }}
      onChange={(e) => {
        callbacks.onSelectAll?.(e.target.checked);
      }}
    />
  );
}

function RowCheckbox({ row, callbacks }: { row: Row<Account>; callbacks: AccountTableCallbacks }) {
  const isSelected = !!callbacks.selectedAccounts?.has(row.original.id);
  
  return (
    <input
      type="checkbox"
      aria-label="Select row"
      checked={isSelected}
      onChange={(e) => {
        callbacks.onBulkSelect?.(row.original.id, e.target.checked);
      }}
    />
  );
}

export interface AccountTableCallbacks {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBulkSelect?: (accountId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectedAccounts?: Set<string>;
}

export function useAccountColumns(callbacks: AccountTableCallbacks): ColumnDef<Account>[] {
  const t = useTranslations();

  return [
    {
      id: "select",
      header: ({ table }) => <SelectAllCheckbox table={table} callbacks={callbacks} />,
      cell: ({ row }) => <RowCheckbox row={row} callbacks={callbacks} />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "provider",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.accounts.table.provider")} />
      ),
      cell: ({ row }) => {
        const provider = row.original.provider;
        return <div className="font-medium">{provider ?? t("admin.accounts.table.na")}</div>;
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.accounts.table.type")} />
      ),
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge variant="outline" className="capitalize">
            {type ? String(type).toLowerCase() : t("admin.accounts.table.na")}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        if (!Array.isArray(value)) return false;
        const cellValue = row.getValue(id);
        return value.includes(cellValue);
      },
    },
    {
      accessorKey: "providerAccountId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.accounts.table.accountId")} />
      ),
      cell: ({ row }) => {
        const providerAccountId = row.original.providerAccountId;
        return (
          <div className="max-w-[200px] truncate">
            {providerAccountId ?? t("admin.accounts.table.na")}
          </div>
        );
      },
    },
    {
      accessorKey: "user.email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("admin.accounts.table.userEmail")} />
      ),
      cell: ({ row }) => {
        const user = row.original.user;
        // Runtime guard for user property
        // Local type for user
        interface User { email?: string }
        const safeUser: User | undefined = user && typeof user === 'object' ? user as User : undefined;
        const email = safeUser?.email;
        return <div>{email ?? t("admin.accounts.table.na")}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const account = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("admin.accounts.table.openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("admin.accounts.table.actions")}</DropdownMenuLabel>
              {callbacks.onEdit && (
                <DropdownMenuItem onClick={() => callbacks.onEdit?.(account.id)}>
                  {t("common.edit")}
                </DropdownMenuItem>
              )}
              {callbacks.onDelete && (
                <DropdownMenuItem className="text-red-600" onClick={() => callbacks.onDelete?.(account.id)}>
                  {t("common.delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}