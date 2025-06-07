import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Columns, Grid, GripVertical, List, Plus } from "lucide-react";

import type { Property } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

interface TableToolbarProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isDragEnabled: boolean;
  setIsDragEnabled: (enabled: boolean) => void;
  isColumnManagementEnabled: boolean;
  setIsColumnManagementEnabled: (enabled: boolean) => void;
  columns: ColumnDef<Property>[];
  columnVisibility: Record<string, boolean>;
  toggleColumn: (columnKey: string) => void;
  onAddProperty?: () => void;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  viewMode,
  setViewMode,
  isDragEnabled,
  setIsDragEnabled,
  isColumnManagementEnabled,
  setIsColumnManagementEnabled,
  columns,
  columnVisibility,
  toggleColumn,
  onAddProperty,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {onAddProperty && (
          <Button
            variant="default"
            onClick={onAddProperty}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        )}

        <Button
          variant={isDragEnabled ? "default" : "outline"}
          onClick={() => {
            setIsDragEnabled(!isDragEnabled);
            setIsColumnManagementEnabled(false);
          }}
          className="flex items-center gap-2"
        >
          <GripVertical className="h-4 w-4" />
          {isDragEnabled ? "Disable Row Reordering" : "Enable Row Reordering"}
        </Button>

        {viewMode === "list" && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Columns className="mr-2 h-4 w-4" />
                  Toggle Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                {columns.map((column) => {
                  if (!column.id || column.id === "actions") return null;
                  const displayName = column.id
                    .split(/(?=[A-Z])|_/)
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase(),
                    )
                    .join(" ");
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (column.id) toggleColumn(column.id);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={columnVisibility[column.id ?? ""]}
                          onChange={() => toggleColumn(column.id ?? "")}
                          className="mr-2"
                        />
                        <span>{displayName}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={isColumnManagementEnabled ? "default" : "outline"}
              onClick={() => {
                setIsColumnManagementEnabled(!isColumnManagementEnabled);
                setIsDragEnabled(false);
              }}
              className="flex items-center gap-2"
            >
              <GripVertical className="h-4 w-4" />
              {isColumnManagementEnabled
                ? "Disable Column Reorder"
                : "Enable Column Reorder"}
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
