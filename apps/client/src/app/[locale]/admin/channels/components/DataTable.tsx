import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  error?: string | null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  error,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("Admin");
  
  // Helper to get a unique key for each column
  const getColKey = (col: ColumnDef<TData, TValue>, idx: number) => {
    return typeof col.id === "string"
      ? col.id
      : ((col as any).accessorKey ?? idx.toString());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <div className="text-gray-500 text-sm">{t("channels.loading", { defaultValue: "Loading channels..." })}</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            {t("channels.errorLoading", { defaultValue: "Error loading channels" })}
          </div>
          <div className="text-gray-500 text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-500 text-lg font-medium mb-2">
            {t("channels.table.noData", { defaultValue: "No data found" })}
          </div>
          <div className="text-gray-400 text-sm">
            {t("channels.table.noDataDescription", { defaultValue: "No channels found matching your criteria" })}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-md border bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50/50">
            {columns.map((col, idx) => (
              <th key={getColKey(col, idx)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {typeof col.header === "string"
                  ? col.header
                  : (col.header?.toString() ?? "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <motion.tr 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="hover:bg-gray-50/50 transition-colors duration-200"
            >
              {columns.map((col, j) => (
                <td key={getColKey(col, j)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.cell && typeof col.cell === "function"
                    ? col.cell({ row: { original: row } } as any)
                    : (row as any)[(col as any).accessorKey as string]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
