import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Columns, Grid, List, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@reservatior/ui/dropdown-menu";
import { Input } from "@reservatior/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";

import { useDebounce } from "~/hooks/use-debounce";
import type { Property } from "~/utils/interfaces";
import PropertyCardEnhanced from "../../../../../components/PropertyCardEnhanced";
import type { PropertyWithRelations } from "../../../client/property/components/types";
import AddProperty from "./AddProperty";
import { createColumns } from "./columns";
import PropertyDetailsModal from "./PropertyDetailsModal";

interface PropertyTableProps {
  properties: Property[];
  locale?: string;
  onEdit?: (property: Property) => void;
  onViewDetails?: (property: Property) => void;
}

export function PropertyTable({ properties, locale: _locale, onEdit, onViewDetails }: PropertyTableProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  // Load column visibility from localStorage if available
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    if (typeof window === "undefined") return {
      title: true,
      description: true,
      propertyType: true,
      propertyStatus: true,
      size: true,
      price: true,
      location: true,
      createdAt: true,
    } as VisibilityState;
    try {
      const raw = window.localStorage.getItem("propertyTable:columns");
      if (raw) return JSON.parse(raw) as VisibilityState;
    } catch (e) {
      console.warn("Failed to load columnVisibility from localStorage", e);
    }
    return {
      title: true,
      description: true,
      propertyType: true,
      propertyStatus: true,
      size: true,
      price: true,
      location: true,
      createdAt: true,
    } as VisibilityState;
  });

  // Persist column visibility changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "propertyTable:columns",
          JSON.stringify(columnVisibility),
        );
      }
    } catch (e) {
      console.warn("Failed to persist columnVisibility to localStorage", e);
    }
  }, [columnVisibility]);

  const handlePropertyClick = (property: Property) => {
    if (onViewDetails) {
      onViewDetails(property);
      return;
    }
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    if (onEdit) {
      onEdit(property);
      return;
    }
    // Fallback: open local details modal
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteProperty = async (_id: string) => {
    // Implement delete functionality
  };

  const debouncedSearch = useDebounce(searchQuery, 300);
  const filteredProperties = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter((property) => {
      const title = String(property.title).toLowerCase();
      const desc = String(property.description).toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [properties, debouncedSearch]);

  const baseColumns = createColumns(
    handlePropertyClick,
    handleEditProperty,
    handleDeleteProperty,
  );

  // Create mutable columns for drag and drop
  const [mutableColumns, _setMutableColumns] =
    useState<ColumnDef<Property, unknown>[]>(baseColumns);

  const table = useReactTable({
    data: filteredProperties,
    columns: mutableColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="space-y-4 ios-layout android-layout">
      {/* Mobile-optimized toolbar */}
      <div className="mobile-card space-y-3 rounded-xl border border-blue-200/50 bg-white/80 p-3 md:p-2 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
        {/* Search and filters row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search properties..."
                aria-label="Search properties"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                aria-label="Add property"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Property
              </Button>
            </div>
          </div>
          
          {/* View mode and controls */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                aria-pressed={viewMode === "list"}
                aria-label="List view"
                onClick={() => setViewMode("list")}
              >
                <List className="mr-2 h-4 w-4" /> List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                aria-pressed={viewMode === "grid"}
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="mr-2 h-4 w-4" /> Grid
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="mobile-button">
                  <Columns className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mobile-card ios-mobile-menu android-mobile-menu">
                {table.getAllLeafColumns().map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    className="mobile-nav-item"
                    onClick={() => column.toggleVisibility(!column.getIsVisible())}
                  >
                    {column.id}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table/Grid Content */}
      <div className="mobile-card rounded-xl border border-blue-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <Table className="text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-2 py-2 text-xs font-medium">
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
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="mobile-nav-item h-10 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                      onClick={() => handlePropertyClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-2 py-2 text-sm">
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
                      colSpan={mutableColumns.length}
                      className="h-24 text-center mobile-text-base"
                    >
                      No properties found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCardEnhanced
                key={property.id}
                property={property as unknown as PropertyWithRelations}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddProperty
          onClose={() => setIsAddModalOpen(false)}
          // Close modal after successful add; parent page handles list refresh
          onPropertyAdded={() => setIsAddModalOpen(false)}
        />
      )}

      {selectedProperty && isDetailsModalOpen && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
