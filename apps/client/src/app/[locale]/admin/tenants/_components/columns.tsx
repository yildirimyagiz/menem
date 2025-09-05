import { Button } from "@reservatior/ui/button";
import type { ColumnDef } from "@tanstack/react-table";

export type TenantPaymentStatus =
  | "PAID"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "REFUNDED"
  | "CANCELLED";

export interface TenantRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  paymentStatus: TenantPaymentStatus;
}

export function createColumns(
  onViewDetails: (tenant: TenantRow) => void,
  onEdit: (tenant: TenantRow) => void,
  onDelete: (id: string) => void | Promise<void>,
): ColumnDef<TenantRow>[] {
  return [
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ row }) => row.original.firstName,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ row }) => row.original.lastName,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => row.original.paymentStatus,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const tenant = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onViewDetails(tenant)}>
              View
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(tenant)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(tenant.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
}

// TODO: Implement tenant columns here when API shape is available.
// Avoid defining unused placeholder types to keep lints clean.
