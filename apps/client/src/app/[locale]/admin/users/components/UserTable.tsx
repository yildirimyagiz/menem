import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Shield, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import type { User } from "@reservatior/validators";

interface UserTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const ROLE_COLORS = {
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  USER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  AGENT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  EMPTY: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
} as const;

const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("Admin");
  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("name", { defaultValue: "Name" }),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="mobile-text-sm font-medium">{user.name}</span>
                <span className="mobile-text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: t("role", { defaultValue: "Role" }),
        cell: ({ row }) => {
          const role = row.original.role;
          return (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Badge
                className={
                  ROLE_COLORS[role as keyof typeof ROLE_COLORS] ||
                  ROLE_COLORS.EMPTY
                }
              >
                {role}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "actions",
        header: t("actions", { defaultValue: "Actions" }),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="mobile-button h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mobile-card ios-mobile-menu android-mobile-menu">
                <DropdownMenuLabel>{t("actions", { defaultValue: "Actions" })}</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => onViewDetails(user)}
                  className="mobile-nav-item"
                >
                  {t("viewDetails", { defaultValue: "View Details" })}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onEdit(user)}
                  className="mobile-nav-item"
                >
                  {t("editUser", { defaultValue: "Edit User" })}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(user.id)}
                  className="mobile-nav-item text-red-600"
                >
                  {t("deleteUser", { defaultValue: "Delete User" })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onViewDetails, onEdit, onDelete, t],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mobile-card rounded-xl border border-blue-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="mobile-text-sm">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className="mobile-nav-item mobile-scale-in cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => onViewDetails(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="mobile-text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center mobile-text-base"
                >
                  {t("noUsersFound", { defaultValue: "No users found. Get started by adding your first user!" })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
