import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import type { Account } from "@reservatior/validators";

import { DataTableFacetedFilter } from "~/app/[locale]/admin/accounts/components/data-table-faceted-filter";
import { DataTableViewOptions } from "~/app/[locale]/admin/discount/components/data-table-view-options";

interface AccountTableToolbarProps {
  table: Table<Account>;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
}

import { useTranslations } from "next-intl";

export function DataTableToolbar({
  table,
  onSearch,
  searchPlaceholder,
}: AccountTableToolbarProps) {
  const t = useTranslations();
  const resolvedPlaceholder = searchPlaceholder ?? t('admin.accounts.table.filterAccounts');
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur rounded-xl shadow-sm px-4 py-3 mb-4 border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-2">
        {onSearch && (
          <div className="relative flex items-center w-full max-w-xs">
            <Search className="absolute left-3 h-5 w-5 text-blue-500 pointer-events-none" />
            <Input
              placeholder={resolvedPlaceholder}
              value={
                (table.getColumn('provider')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('provider')?.setFilterValue(event.target.value)
              }
              className="h-10 pl-10 pr-4 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-inner focus:ring-2 focus:ring-blue-300 transition w-full"
              aria-label={t('admin.accounts.table.filterAccounts')}
            />
          </div>
        )}
        {table.getColumn('type') && (
          <div className="w-full sm:w-auto">
            <DataTableFacetedFilter
              column={table.getColumn('type')}
              title={t('admin.accounts.table.type')}
              options={[
                { label: t('admin.accounts.types.oauth'), value: 'OAUTH' },
                { label: t('admin.accounts.types.email'), value: 'EMAIL' },
                { label: t('admin.accounts.types.oidc'), value: 'OIDC' },
                { label: t('admin.accounts.types.credentials'), value: 'CREDENTIALS' },
                { label: t('admin.accounts.types.google'), value: 'GOOGLE' },
                { label: t('admin.accounts.types.facebook'), value: 'FACEBOOK' },
              ]}

            />
          </div>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 rounded-full px-4 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {t('common.reset')}
            <span className="sr-only">{t('common.resetFilters')}</span>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end mt-2 sm:mt-0">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
