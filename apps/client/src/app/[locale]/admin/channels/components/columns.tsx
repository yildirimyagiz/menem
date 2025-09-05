import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export type ChannelCategory =
  | "AGENT"
  | "AGENCY"
  | "TENANT"
  | "PROPERTY"
  | "PAYMENT"
  | "SYSTEM"
  | "REPORT"
  | "RESERVATION"
  | "TASK"
  | "TICKET";

export type ChannelType = "PUBLIC" | "PRIVATE" | "GROUP";

export interface ChannelRow {
  id: string;
  cuid: string;
  name: string;
  description?: string;
  category: ChannelCategory;
  type: ChannelType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  CommunicationLogs?: unknown[];
}

export function getChannelColumns(callbacks: {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}): ColumnDef<ChannelRow>[] {
  const t = useTranslations("Admin");
  return [
    {
      accessorKey: "name",
      header: t("channels.table.name", { defaultValue: "Channel Name" }),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-medium text-gray-900"
        >
          {row.original.name}
        </motion.div>
      ),
    },
    {
      accessorKey: "description",
      header: t("channels.table.description", { defaultValue: "Description" }),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-gray-600 max-w-xs truncate"
        >
          {row.original.description ?? "-"}
        </motion.div>
      ),
    },
    {
      accessorKey: "category",
      header: t("channels.table.category", { defaultValue: "Category" }),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Badge 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            {t(`channels.categories.${row.original.category.toLowerCase()}`, { defaultValue: row.original.category })}
          </Badge>
        </motion.div>
      ),
    },
    {
      accessorKey: "type",
      header: t("channels.table.type", { defaultValue: "Type" }),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Badge 
            variant="outline" 
            className={
              row.original.type === "PUBLIC" 
                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                : row.original.type === "PRIVATE"
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
            }
          >
            {t(`channels.types.${row.original.type.toLowerCase()}`, { defaultValue: row.original.type })}
          </Badge>
        </motion.div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("channels.table.createdAt", { defaultValue: "Created At" }),
      cell: ({ row }) => {
        const val = row.original.createdAt;
        if (!val) return "-";
        const date = typeof val === "string" ? new Date(val) : val instanceof Date ? val : null;
        return date ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-gray-600 text-sm"
          >
            {date.toLocaleDateString('tr-TR')}
          </motion.div>
        ) : "-";
      },
    },
    {
      accessorKey: "updatedAt",
      header: t("channels.table.updatedAt", { defaultValue: "Updated At" }),
      cell: ({ row }) => {
        const val = row.original.updatedAt;
        if (!val) return "-";
        return typeof val === "string"
          ? val
          : val instanceof Date
          ? val.toLocaleString()
          : "-";
      },
    },
    {
      accessorKey: "deletedAt",
      header: t("channels.table.deletedAt", { defaultValue: "Deleted At" }),
      cell: ({ row }) => {
        const val = row.original.deletedAt;
        if (!val) return "-";
        return typeof val === "string"
          ? val
          : val instanceof Date
          ? val.toLocaleString()
          : "-";
      },
    },
    {
      id: "actions",
      header: t("channels.table.actions", { defaultValue: "Actions" }),
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => callbacks.onEdit?.(row.original.id)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">{t("channels.table.edit", { defaultValue: "Edit" })}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => callbacks.onDelete?.(row.original.id)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t("channels.table.delete", { defaultValue: "Delete" })}</span>
          </Button>
        </motion.div>
      ),
    },
  ];
}

