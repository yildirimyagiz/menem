import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import type { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

import { Badge } from "@reservatior/ui/badge";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export interface AgentTableCallbacks {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface Agent {
  id: string;
  name: string;
  logoUrl?: string;
  email?: string;
  phoneNumber?: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  agency?: { name?: string };
  _count?: { Property?: number; Reservation?: number; Review?: number };
  createdAt?: string | Date;
}

function SelectAllCheckbox({ table }: { table: Table<Agent> }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate =
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
    }
  }, [table]);
  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={table.getIsAllPageRowsSelected()}
      onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
      aria-label="Select all"
    />
  );
}

function RowCheckbox({ row }: { row: Row<Agent> }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate =
        row.getIsSomeSelected() && !row.getIsSelected();
    }
  }, [row]);
  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={(e) => row.toggleSelected(e.target.checked)}
      aria-label="Select row"
    />
  );
}

export function useAgentColumns(t: ReturnType<typeof useTranslations>, callbacks: AgentTableCallbacks): ColumnDef<Agent>[] {
  return [
    {
      id: "select",

      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.name', { defaultValue: 'Name' })} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original.logoUrl ? (
            <Image
              src={row.original.logoUrl}
              alt={row.original.name ?? t('Admin.agents.table.logoAlt', { defaultValue: 'Agent Logo' })}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              style={{ minWidth: 32, minHeight: 32 }}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
              {t('Admin.agents.table.noLogo', { defaultValue: 'N/A' })}
            </div>
          )}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.email', { defaultValue: 'Email' })} />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email ?? t('Admin.agents.table.noEmail', { defaultValue: 'N/A' })}
        </span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.phone', { defaultValue: 'Phone' })} />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.phoneNumber ?? t('Admin.agents.table.noPhone', { defaultValue: 'N/A' })}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.status', { defaultValue: 'Status' })} />
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "ACTIVE"
              ? "default"
              : row.original.status === "PENDING"
                ? "secondary"
                : "destructive"
          }
        >
          {t(`Admin.agents.table.status${row.original.status.charAt(0) + row.original.status.slice(1).toLowerCase()}`, { defaultValue: row.original.status })}
        </Badge>
      ),
    },
    {
      id: "agency",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.agency', { defaultValue: 'Agency' })} />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.agency?.name ?? t('Admin.agents.table.noAgency', { defaultValue: 'N/A' })}
        </span>
      ),
    },
    {
      id: "properties",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.properties', { defaultValue: 'Properties' })} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original._count?.Property ?? 0}</Badge>
      ),
    },
    {
      id: "reservations",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.reservations', { defaultValue: 'Reservations' })} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original._count?.Reservation ?? 0}</Badge>
      ),
    },
    {
      id: "reviews",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.reviews', { defaultValue: 'Reviews' })} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original._count?.Review ?? 0}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Admin.agents.table.createdAt', { defaultValue: 'Created At' })} />
      ),
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : '',
    },
    {
      id: "actions",
      header: t('Admin.agents.table.actions', { defaultValue: 'Actions' }),
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={callbacks.onEdit}
          onDelete={callbacks.onDelete}
        />
      ),
    },
  ];
}
