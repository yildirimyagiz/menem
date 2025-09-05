"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";

import { useTranslations } from "next-intl";
import DataTableFacetedFilter from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations();
  const isFiltered = table.getState().columnFilters.length > 0;
  const [search, setSearch] = useState(
    (table.getColumn("name")?.getFilterValue() as string) ?? "",
  );

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      table.getColumn("name")?.setFilterValue(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t('Admin.agents.table.searchPlaceholder', { defaultValue: 'Filter agents...' })}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
          aria-label={t('Admin.agents.table.searchAria', { defaultValue: 'Filter agents by name' })}
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title={t('Admin.agents.table.status', { defaultValue: 'Status' })}
            options={[
              { label: t('Admin.agents.table.statusActive', { defaultValue: 'Active' }), value: "ACTIVE" },
              { label: t('Admin.agents.table.statusPending', { defaultValue: 'Pending' }), value: "PENDING" },
              { label: t('Admin.agents.table.statusSuspended', { defaultValue: 'Suspended' }), value: "SUSPENDED" },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
            aria-label={t('Admin.agents.table.resetFiltersAria', { defaultValue: 'Reset filters' })}
          >
            {t('Admin.agents.table.reset', { defaultValue: 'Reset' })}
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
