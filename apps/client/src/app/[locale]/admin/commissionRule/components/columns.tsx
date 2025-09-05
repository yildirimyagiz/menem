import type { ColumnDef } from "@tanstack/react-table";

import type { CommissionRule } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";

export function getCommissionRuleColumns({
  onEdit,
  onDelete,
}: {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}): ColumnDef<CommissionRule, any>[] {
  return [
    {
      accessorKey: "provider.name",
      header: "Provider",
      cell: ({ row }) => row.original.provider?.name || "-",
    },
    {
      accessorKey: "ruleType",
      header: "Type",
      cell: ({ row }) => row.original.ruleType,
    },
    {
      accessorKey: "commission",
      header: "Commission",
      cell: ({ row }) => row.original.commission,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) =>
        row.original.startDate
          ? new Date(row.original.startDate).toLocaleDateString()
          : "-",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) =>
        row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString()
          : "-",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(row.original.id)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(row.original.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];
}
