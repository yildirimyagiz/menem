import { Button } from "@reservatior/ui/button";
import type { ColumnDef } from "@tanstack/react-table";

export interface PropertyRow {
  id: string;
  title?: string | null;
  category?: string | null;
  propertyStatus?: string | null;
  price?: number | null;
  listedAt?: string | Date | null;
}

export function createColumns(
  onViewDetails: (property: PropertyRow) => void,
  onEdit: (property: PropertyRow) => void,
  onDelete: (id: string) => void | Promise<void>,
): ColumnDef<PropertyRow>[] {
  return [
    { accessorKey: "title", header: "Title", cell: ({ row }) => row.original.title ?? "-" },
    { accessorKey: "category", header: "Category", cell: ({ row }) => row.original.category ?? "-" },
    {
      accessorKey: "propertyStatus",
      header: "Status",
      cell: ({ row }) => row.original.propertyStatus ?? "-",
    },
    { accessorKey: "price", header: "Price", cell: ({ row }) => row.original.price ?? "-" },
    {
      accessorKey: "listedAt",
      header: "Listed",
      cell: ({ row }) => {
        const v = row.original.listedAt;
        const d = typeof v === "string" ? new Date(v) : v ?? null;
        return d ? d.toLocaleDateString() : "-";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const property = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onViewDetails(property)}>
              View
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(property)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(property.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
}
