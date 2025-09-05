import type { ColumnDef } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

interface Reservation {
  id: string;
  guestName: string;
  propertyName: string;
  status: string;
  checkIn: string;
  checkOut: string;
}

interface DataTableProps {
  columns: ColumnDef<Reservation, any>[];
  data: Reservation[];
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={`header-group-${headerGroup.id}`}>
              {headerGroup.headers.map((header) => (
                <th
                  key={`header-${header.id}`}
                  className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={`row-${row.id}`}>
              {row.getVisibleCells().map((cell) => (
                <td key={`cell-${cell.id}`} className="whitespace-nowrap px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
