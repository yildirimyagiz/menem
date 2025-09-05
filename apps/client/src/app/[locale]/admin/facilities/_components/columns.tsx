import type { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

import type { FacilityWithRelations } from "~/app/[locale]/client/facility/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export interface FacilityTableCallbacks {
  onViewIncludedServices?: (facility: FacilityWithRelations) => void;
  onViewExtraCharges?: (facility: FacilityWithRelations) => void;
  onViewExpenses?: (facility: FacilityWithRelations) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEditIncludedService?: (
    serviceId: string,
    facility: FacilityWithRelations,
  ) => void;
  onDeleteIncludedService?: (
    serviceId: string,
    facility: FacilityWithRelations,
  ) => void;
  onEditExtraCharge?: (
    chargeId: string,
    facility: FacilityWithRelations,
  ) => void;
  onDeleteExtraCharge?: (
    chargeId: string,
    facility: FacilityWithRelations,
  ) => void;
  onEditExpense?: (expenseId: string, facility: FacilityWithRelations) => void;
  onDeleteExpense?: (
    expenseId: string,
    facility: FacilityWithRelations,
  ) => void;
}

export function getFacilityColumns(
  callbacks: FacilityTableCallbacks,
): ColumnDef<FacilityWithRelations>[] {
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
        }, [
          table.getIsSomePageRowsSelected(),
          table.getIsAllPageRowsSelected(),
        ]);
        return (
          <input
            ref={inputRef}
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            aria-label="Select all"
          />
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
          <input
            ref={inputRef}
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => row.original.type,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "ACTIVE" ? "secondary" : "default"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => row.original.Location?.city ?? "",
    },
    {
      id: "includedServices",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Included Services" />
      ),
      cell: ({ row }) => {
        const facility = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {facility.includedServices?.length ?? 0}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => callbacks.onViewIncludedServices?.(facility)}
              >
                View
              </Button>
            </div>
            {facility.includedServices &&
              facility.includedServices.length > 0 &&
              (callbacks.onEditIncludedService ??
                callbacks.onDeleteIncludedService) && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {facility.includedServices.slice(0, 2).map((service) => (
                    <span
                      key={service.id}
                      className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      {service.name}
                      {callbacks.onEditIncludedService && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            callbacks.onEditIncludedService?.(
                              service.id,
                              facility,
                            )
                          }
                        >
                          Edit
                        </Button>
                      )}
                      {callbacks.onDeleteIncludedService && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            callbacks.onDeleteIncludedService?.(
                              service.id,
                              facility,
                            )
                          }
                        >
                          Delete
                        </Button>
                      )}
                    </span>
                  ))}
                  {facility.includedServices.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{facility.includedServices.length - 2} more
                    </span>
                  )}
                </div>
              )}
          </div>
        );
      },
    },
    {
      id: "extraCharges",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Extra Charges" />
      ),
      cell: ({ row }) => {
        const facility = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {facility.extraCharges?.length ?? 0}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => callbacks.onViewExtraCharges?.(facility)}
              >
                View
              </Button>
            </div>
            {facility.extraCharges &&
              facility.extraCharges.length > 0 &&
              (callbacks.onEditExtraCharge ??
                callbacks.onDeleteExtraCharge) && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {facility.extraCharges.slice(0, 2).map((charge) => (
                    <span
                      key={charge.id}
                      className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      {charge.name}
                      {callbacks.onEditExtraCharge && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            callbacks.onEditExtraCharge?.(charge.id, facility)
                          }
                        >
                          Edit
                        </Button>
                      )}
                      {callbacks.onDeleteExtraCharge && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            callbacks.onDeleteExtraCharge?.(charge.id, facility)
                          }
                        >
                          Delete
                        </Button>
                      )}
                    </span>
                  ))}
                  {facility.extraCharges.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{facility.extraCharges.length - 2} more
                    </span>
                  )}
                </div>
              )}
          </div>
        );
      },
    },
    {
      id: "expenses",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expenses" />
      ),
      cell: ({ row }) => {
        const facility = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{facility.expenses?.length ?? 0}</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => callbacks.onViewExpenses?.(facility)}
              >
                View
              </Button>
            </div>
            {facility.expenses &&
              facility.expenses.length > 0 &&
              (callbacks.onEditExpense ?? callbacks.onDeleteExpense) && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {facility.expenses.slice(0, 2).map((expense) => (
                    <span
                      key={expense.id}
                      className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      {expense.type}
                      {callbacks.onEditExpense && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            callbacks.onEditExpense?.(expense.id, facility)
                          }
                        >
                          Edit
                        </Button>
                      )}
                      {callbacks.onDeleteExpense && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            callbacks.onDeleteExpense?.(expense.id, facility)
                          }
                        >
                          Delete
                        </Button>
                      )}
                    </span>
                  ))}
                  {facility.expenses.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{facility.expenses.length - 2} more
                    </span>
                  )}
                </div>
              )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row, table }) => {
        const facility = row.original;
        const { onEdit, onDelete } = table.options.meta as {
          onEdit: (id: string) => void;
          onDelete: (id: string) => void;
        };

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
              <DropdownMenuItem onClick={() => onEdit(facility.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(facility.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
