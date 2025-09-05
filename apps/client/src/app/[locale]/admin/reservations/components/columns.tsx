import type { ColumnDef } from "@tanstack/react-table";

import { DataTableRowActions } from "./data-table-row-actions";

// import type { Reservation } from "@reservatior/validators";
// Placeholder Reservation type
interface Reservation {
  id: string;
  guestName: string;
  propertyName: string;
  status: string;
  checkIn: string;
  checkOut: string;
}

export const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "guestName",
    header: "Guest",
    cell: ({ row }) => row.getValue("guestName"),
  },
  {
    accessorKey: "propertyName",
    header: "Property",
    cell: ({ row }) => row.getValue("propertyName"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.getValue("status"),
  },
  {
    accessorKey: "checkIn",
    header: "Check-In",
    cell: ({ row }) => row.getValue("checkIn"),
  },
  {
    accessorKey: "checkOut",
    header: "Check-Out",
    cell: ({ row }) => row.getValue("checkOut"),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions reservation={row.original} />,
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
  },
];
