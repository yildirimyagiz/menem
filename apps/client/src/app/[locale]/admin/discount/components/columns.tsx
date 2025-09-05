import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import type { Discount } from "@reservatior/validators";

import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<Discount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/admin/discount/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.getValue("name")}
        </Link>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code");
      return typeof code === "string" && code ? <code>{code}</code> : "-";
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <Badge variant="outline" className="capitalize">
          {typeof type === "string" ? type.toLowerCase().replace(/_/g, " ") : "-"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id);
      return Array.isArray(value) && typeof cellValue === "string" && value.includes(cellValue);
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const valueRaw = row.getValue("value");
      const value = typeof valueRaw === "number" ? valueRaw : parseFloat(String(valueRaw));
      const type = row.getValue("type");
      let formattedValue = "-";
      if (typeof type === "string" && !isNaN(value)) {
        formattedValue = type === "PERCENTAGE" ? `${value}%` : `$${value.toFixed(2)}`;
      }
      return <div className="font-medium">{formattedValue}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      const isActiveBool = typeof isActive === "boolean" ? isActive : Boolean(isActive);
      return (
        <Badge variant={isActiveBool ? "default" : "secondary"}>
          {isActiveBool ? "Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id);
      return Array.isArray(value) && typeof cellValue === "boolean" && value.includes(cellValue);
    },
  },
  {
    accessorKey: "currentUsage",
    header: "Usage",
    cell: ({ row }) => {
      const current = row.getValue("currentUsage");
      const max = row.original.maxUsage;
      return (
        <div className="text-sm">
          {typeof current === "number" ? current : "-"}
          {typeof max === "number" ? ` / ${max}` : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const dateVal = row.getValue("startDate");
      let date: Date | null = null;
      if (typeof dateVal === "string" || typeof dateVal === "number" || dateVal instanceof Date) {
        date = new Date(dateVal);
      }
      return date && !isNaN(date.getTime()) ? date.toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const dateVal = row.getValue("endDate");
      let date: Date | null = null;
      if (typeof dateVal === "string" || typeof dateVal === "number" || dateVal instanceof Date) {
        date = new Date(dateVal);
      }
      return date && !isNaN(date.getTime()) ? date.toLocaleDateString() : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const discount = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/discount/${discount.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/discount/${discount.id}/edit`}>
                Edit discount
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
