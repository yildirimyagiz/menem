import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";

import type { Discount } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { DISCOUNT_TYPES } from "@reservatior/validators";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DiscountTableToolbarProps {
  table: Table<Discount>;
}

export function DataTableToolbar({ table }: DiscountTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const typeColumn = table.getColumn("type");
  const statusColumn = table.getColumn("isActive");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex max-w-sm items-center">
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter discounts..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] pl-8 lg:w-[250px]"
          />
        </div>

        {typeColumn && (
          <DataTableFacetedFilter
            column={typeColumn}
            title="Type"
            options={DISCOUNT_TYPES.map((type) => ({
              label: type
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              value: type,
            }))}
          />
        )}

        {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title="Status"
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <span className="sr-only">Reset filters</span>
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
