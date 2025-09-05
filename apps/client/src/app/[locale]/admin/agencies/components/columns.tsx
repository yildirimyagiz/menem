import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Badge } from "@reservatior/ui/badge";
import { useTranslations } from "next-intl";

import React from "react";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

// Header and Cell components for relationship columns
const AgentsHeader = React.memo(({ column }: { column: any }) => {
  const t = useTranslations();
  return (
    <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.agents", { defaultValue: "Agents" })} />
  );
});

const AgentsCell = React.memo(({ row }: { row: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center"
  >
    <Badge variant="outline" className="text-xs">
      {row.original?._count?.Agent ?? 0}
    </Badge>
  </motion.div>
));

const PropertiesHeader = React.memo(({ column }: { column: any }) => {
  const t = useTranslations();
  return (
    <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.properties", { defaultValue: "Properties" })} />
  );
});

const PropertiesCell = React.memo(({ row }: { row: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center"
  >
    <Badge variant="outline" className="text-xs">
      {row.original?._count?.Property ?? 0}
    </Badge>
  </motion.div>
));

const UsersHeader = React.memo(({ column }: { column: any }) => {
  const t = useTranslations();
  return (
    <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.users", { defaultValue: "Users" })} />
  );
});

const UsersCell = React.memo(({ row }: { row: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center"
  >
    <Badge variant="outline" className="text-xs">
      {row.original?._count?.User ?? 0}
    </Badge>
  </motion.div>
));

const SubscriptionsHeader = React.memo(({ column }: { column: any }) => {
  const t = useTranslations();
  return (
    <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.subscriptions", { defaultValue: "Subscriptions" })} />
  );
});

const SubscriptionsCell = React.memo(({ row }: { row: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center"
  >
    <Badge variant="outline" className="text-xs">
      {row.original?._count?.Subscription ?? 0}
    </Badge>
  </motion.div>
));

export interface AgencyRow {
  id: string;
  name: string;
  description?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  isActive: boolean;
  createdAt: string | Date;
  _count?: {
    Agent?: number;
    Property?: number;
    User?: number;
    Subscription?: number;
  };
}

export interface AgencyTableCallbacks {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function getAgencyColumns(
  callbacks: AgencyTableCallbacks,
  t: ReturnType<typeof useTranslations>,
): ColumnDef<AgencyRow | null>[] {
  
  return [
    {
      id: "select",
      header: ({ table }) => {
        const inputRef = useRef<HTMLInputElement>(null);
        useEffect(() => {
          if (inputRef.current) {
            inputRef.current.indeterminate =
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected();
          }
        }, [table]);
        return (
          <div className="flex items-center justify-center">
            <input
              ref={inputRef}
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
              aria-label={t("Admin.agencies.table.columns.selectAll", { defaultValue: "Select all rows" })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const inputRef = useRef<HTMLInputElement>(null);
        useEffect(() => {
          if (inputRef.current) {
            inputRef.current.indeterminate =
              row.getIsSomeSelected() && !row.getIsSelected();
          }
        }, [row.getIsSomeSelected(), row.getIsSelected()]);
        return (
          <div className="flex items-center justify-center">
            <input
              ref={inputRef}
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={(e) => row.toggleSelected(e.target.checked)}
              aria-label="Select row"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.name", { defaultValue: "Name" })} />
      ),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          {row.original?.logoUrl ? (
            <div className="relative">
              <Image
                src={row.original.logoUrl}
                alt={row.original.name || "Agency Logo"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                style={{ minWidth: 40, minHeight: 40 }}
              />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
              {row.original?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {row.original?.name}
            </span>
            {row.original?.description && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                {row.original.description}
              </span>
            )}
          </div>
        </motion.div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.description", { defaultValue: "Description" })} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.original?.description ? (
              row.original.description.length > 50
                ? `${row.original.description.substring(0, 50)}...`
                : row.original.description
            ) : (
              <span className="text-gray-400 dark:text-gray-500 italic">
                {t("Admin.agencies.table.columns.noDescription", { defaultValue: "No description" })}
              </span>
            )}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.email", { defaultValue: "Email" })} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original?.email ? (
            <a
              href={`mailto:${row.original.email}`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {row.original.email}
            </a>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500 italic">
              {t("Admin.agencies.table.columns.noEmail", { defaultValue: "No email" })}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.phone", { defaultValue: "Phone" })} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original?.phoneNumber ? (
            <a
              href={`tel:${row.original.phoneNumber}`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {row.original.phoneNumber}
            </a>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500 italic">
              {t("Admin.agencies.table.columns.noPhone", { defaultValue: "No phone" })}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.status", { defaultValue: "Status" })} />
      ),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Badge
            variant={
              row.original?.status === "ACTIVE"
                ? "default"
                : row.original?.status === "PENDING"
                  ? "secondary"
                  : "destructive"
            }
            className={
              row.original?.status === "ACTIVE"
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : row.original?.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
            }
          >
            {t(`Admin.agencies.table.columns.statusOptions.${row.original?.status}`, { defaultValue: row.original?.status })}
          </Badge>
        </motion.div>
      ),
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.active", { defaultValue: "Active" })} />
      ),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Badge 
            variant={row.original?.isActive ? "default" : "secondary"}
            className={row.original?.isActive 
              ? "bg-green-100 text-green-800 hover:bg-green-200" 
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          >
            {row.original?.isActive 
              ? t("Admin.agencies.table.columns.active", { defaultValue: "Active" })
              : t("Admin.agencies.table.columns.inactive", { defaultValue: "Inactive" })
            }
          </Badge>
        </motion.div>
      ),
    },
    {
      id: "agents",
      header: AgentsHeader,
      cell: AgentsCell,
    },
    {
      id: "properties",
      header: PropertiesHeader,
      cell: PropertiesCell,
    },
    {
      id: "users",
      header: UsersHeader,
      cell: UsersCell,
    },
    {
      id: "subscriptions",
      header: SubscriptionsHeader,
      cell: SubscriptionsCell,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Admin.agencies.table.columns.createdAt", { defaultValue: "Created At" })} />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.original?.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : t("Admin.agencies.table.columns.unknownDate", { defaultValue: "Unknown" })}
        </div>
      ),
    },
    {
      id: "actions",
      header: t("Admin.agencies.table.columns.actions", { defaultValue: "Actions" }),
      cell: ({ row }) => {
        if (!row.original) return null;
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <DataTableRowActions
              row={row as any}
              onEdit={callbacks.onEdit}
              onDelete={callbacks.onDelete}
            />
          </motion.div>
        );
      },
    },
  ];
}
