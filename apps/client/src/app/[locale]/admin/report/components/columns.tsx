import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import type { Report } from "@reservatior/validators";
import { ReportStatus, ReportType } from "@reservatior/validators";

import { DataTableRowActions } from "./data-table-row-actions";

// Example actions placeholder

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.getValue("title"),
  },
  {
    accessorKey: "reportType",
    header: "Type",
    cell: ({ row }) => row.getValue("reportType"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.getValue("status"),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) =>
      format(new Date(row.getValue("startDate")), "yyyy-MM-dd"),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => format(new Date(row.getValue("endDate")), "yyyy-MM-dd"),
  },
  {
    accessorKey: "agencyId",
    header: "Agency",
    cell: ({ row }) => row.getValue("agencyId") || "-",
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions report={row.original} />,
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
  },
];
