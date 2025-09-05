"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "../../guest/_components/data-table-column-header";
import { DataTableRowActions } from "../../guest/_components/data-table-row-actions";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "lender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lender" />
    ),
    cell: ({ row }) => <span>{row.getValue("lender")}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "principal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Principal" />
    ),
    cell: ({ row }) => (
      <span>{row.getValue("principal")?.toLocaleString()}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "interestRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Interest Rate" />
    ),
    cell: ({ row }) => <span>{row.getValue("interestRate")}%</span>,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <span>{row.getValue("status")}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("startDate")
          ? new Date(row.getValue("startDate")).toLocaleDateString()
          : "-"}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("endDate")
          ? new Date(row.getValue("endDate")).toLocaleDateString()
          : "-"}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "Property",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => <span>{row.original.Property?.name || "-"}</span>,
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        labels={[
          { value: "edit", label: "Edit" },
          { value: "delete", label: "Delete" },
        ]}
      />
    ),
  },
];
