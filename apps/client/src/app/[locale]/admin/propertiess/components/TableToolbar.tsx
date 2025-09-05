import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Columns, Grid, GripVertical, List, Plus } from "lucide-react";
import { useLanguage } from "~/context/LanguageContext";

import type { Property } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

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
  const { t } = useLanguage();
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
            {t("Property.table.addProperty")}
          </Button>
        )}

        <Button
          variant={isDragEnabled ? "default" : "outline"}
          onClick={() => {
            setIsDragEnabled(!isDragEnabled);
            setIsColumnManagementEnabled(false);
          }}
          className="flex items-center gap-2"
          aria-label={
            isDragEnabled ? "Disable row reordering" : "Enable row reordering"
          }
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
          {isDragEnabled ? t("Property.table.disableRowReordering") : t("Property.table.enableRowReordering")}
        </Button>

        {viewMode === "list" && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" aria-label={t("Property.table.toggleColumnVisibilityButton")}>
                  <Columns className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("Property.table.toggleColumns")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>{t("Property.table.visibleColumns")}</DropdownMenuLabel>
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
                          aria-label={t("Property.table.toggleColumnVisibility", { column: displayName })}
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
              aria-label={
                isColumnManagementEnabled
                  ? "Disable column reordering"
                  : "Enable column reordering"
              }
            >
              <GripVertical className="h-4 w-4" aria-hidden="true" />
              {isColumnManagementEnabled
                ? t("Property.table.disableColumnReorder")
                : t("Property.table.enableColumnReorder")}
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
          aria-label={t("Property.table.switchToListView")}
          aria-pressed={viewMode === "list"}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("grid")}
          aria-label={t("Property.table.switchToGridView")}
          aria-pressed={viewMode === "grid"}
        >
          <Grid className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
