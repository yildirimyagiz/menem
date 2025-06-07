import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Columns, Grid, GripVertical, List, Plus } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import type { Event } from "~/utils/types";

interface EventTableToolbarProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isDragEnabled: boolean;
  setIsDragEnabled: (enabled: boolean) => void;
  isColumnManagementEnabled: boolean;
  setIsColumnManagementEnabled: (enabled: boolean) => void;
  columns: ColumnDef<Event>[];
  columnVisibility: Record<string, boolean>;
  toggleColumn: (columnKey: string) => void;
  onAddEvent?: () => void;
}

export const EventTableToolbar: React.FC<EventTableToolbarProps> = ({
  viewMode,
  setViewMode,
  isDragEnabled,
  setIsDragEnabled,
  isColumnManagementEnabled,
  setIsColumnManagementEnabled,
  columns,
  columnVisibility,
  toggleColumn,
  onAddEvent,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {onAddEvent && (
          <Button
            variant="primary"
            onClick={onAddEvent}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        )}

        <Button
          variant={isDragEnabled ? "primary" : "outline"}
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
              variant={isColumnManagementEnabled ? "primary" : "outline"}
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
