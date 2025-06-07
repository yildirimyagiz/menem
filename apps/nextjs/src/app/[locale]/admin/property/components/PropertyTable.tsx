import type { Cell, ColumnDef } from "@tanstack/react-table";
import type { z } from "zod";
import React from "react";
import Image from "next/image";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { isEqual } from "lodash";
import {
  Columns,
  Grid,
  GripVertical,
  List,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Property, PropertyFeatures, PropertyAmenities } from "@acme/validators";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { TooltipProvider } from "@acme/ui/tooltip";

import { DraggableColumns } from "./DraggableColumns";
import { PropertyGridItem } from "./PropertyGridItem";

const DraggablePropertyRow = React.memo(
  React.forwardRef<
    HTMLTableRowElement,
    {
      index: number;
      reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
      isDragEnabled: boolean;
      cells: Cell<Property, unknown>[];
      onDragEnd: () => void;
    }
  >(({ index, reorderRow, isDragEnabled, cells, onDragEnd }, ref) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: "property",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => isDragEnabled,
      end: (_item, monitor) => {
        if (!monitor.didDrop()) {
          onDragEnd();
        }
      },
    });

    const [, dropRef] = useDrop({
      accept: "property",
      hover: (draggedItem: { index: number }) => {
        if (!isDragEnabled) return;
        if (draggedItem.index !== index) {
          reorderRow(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
      drop: () => {
        onDragEnd();
      },
    });

    const rowRef = (node: HTMLTableRowElement | null) => {
      dropRef(node);
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const cellRef = (node: HTMLTableCellElement | null) => {
      dragRef(node);
    };

    return (
      <TableRow
        ref={rowRef}
        className={`${isDragging ? "opacity-50" : "opacity-100"} relative`}
      >
        {isDragEnabled && (
          <TableCell ref={cellRef} className="w-[50px]">
            <GripVertical
              className={`h-4 w-4 ${
                isDragEnabled ? "cursor-move" : "cursor-not-allowed"
              } text-muted-foreground`}
            />
          </TableCell>
        )}
        {cells.map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }),
);

DraggablePropertyRow.displayName = "DraggablePropertyRow";

interface PropertyTableProps {
  properties: Property[];
  onViewDetails: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS = {
  Available: "bg-green-100 text-green-800",
  Reserved: "bg-yellow-100 text-yellow-800",
  Sold: "bg-red-100 text-red-800",
  Rented: "bg-blue-100 text-blue-800",
  UnderConstruction: "bg-orange-100 text-orange-800",
  NewProject: "bg-purple-100 text-purple-800",
  Empty: "bg-gray-100 text-gray-800",
  Owner: "bg-indigo-100 text-indigo-800",
} as const;

const LISTING_TYPE_COLORS = {
  ForSale: "bg-blue-100 text-blue-800",
  ForRent: "bg-green-100 text-green-800",
  Booking: "bg-purple-100 text-purple-800",
} as const;

const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [orderedProperties, setOrderedProperties] =
    React.useState<Property[]>(properties);
  const [isDragEnabled, setIsDragEnabled] = React.useState(false);
  const [isColumnManagementEnabled, setIsColumnManagementEnabled] =
    React.useState(false);
  const [columnVisibility, setColumnVisibility] = React.useState({
    image: true,
    details: true,
    price: true,
    status: true,
    type: true,
    rating: true,
  });
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
  const [isDragging, setIsDragging] = React.useState(false);

  const visibleColumns = Object.entries(columnVisibility)
    .filter(([_, isVisible]) => isVisible)
    .map(([key]) => key);

  const columns = React.useMemo<ColumnDef<Property>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
          const property = row.original;
          return (
            <div className="flex items-center space-x-4">
              {property.Photo?.find((p) => p.featured)?.url ? (
                <Image
                  src={property.Photo.find((p) => p.featured)?.url ?? ""}
                  alt={property.title}
                  className="h-10 w-10 rounded object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="h-10 w-10 rounded bg-muted" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => {
          const property = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{property.title}</span>
              <span className="text-sm text-muted-foreground">
                {property.size} m²
              </span>
              <span className="text-xs text-muted-foreground">
                {property.Location?.address ?? "-"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const property = row.original;
          return (
            <div className="flex items-center">
              {typeof property.marketValue === "number"
                ? property.marketValue.toLocaleString()
                : "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.propertyStatus;
          return (
            <Badge
              className={
                STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
                STATUS_COLORS.Empty
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => row.original.propertyType,
      },
      {
        accessorKey: "features",
        header: "Features",
        cell: ({ row }) => {
          const features = row.original.features;
          return (
            <div className="flex flex-wrap gap-1">
              {features && features.length > 0
                ? features.map((f) => (
                    <span key={f} className="badge badge-sm">
                      {PropertyFeatures.enum[f as keyof typeof PropertyFeatures.enum] ||
                        f}
                    </span>
                  ))
                : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "amenities",
        header: "Amenities",
        cell: ({ row }) => {
          const amenities = row.original.amenities;
          return (
            <div className="flex flex-wrap gap-1">
              {amenities && amenities.length > 0
                ? amenities.map((a) => (
                    <span key={a} className="badge badge-sm">
                      {PropertyAmenities.enum[a as keyof typeof PropertyAmenities.enum] ||
                        a}
                    </span>
                  ))
                : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span>
              {typeof row.original.averageRating !== "undefined"
                ? row.original.averageRating
                : "N/A"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(row.original.id)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onViewDetails, onEdit, onDelete],
  );

  const [mutableColumns, setMutableColumns] = React.useState(
    columns as ColumnDef<Property, unknown>[],
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>([
    "image",
    "details",
    "price",
    "status",
    "type",
    "rating",
    "actions",
  ]);

  const table = useReactTable({
    data: orderedProperties,
    columns: mutableColumns,
    state: {
      columnOrder,
      columnVisibility,
    },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  const handleColumnReorder = React.useCallback(
    (newColumns: ColumnDef<Property, unknown>[]) => {
      setMutableColumns(newColumns);
      const newOrder = newColumns
        .map((col) => col.id)
        .filter((id): id is string => typeof id === "string");
      setColumnOrder(newOrder);
      table.setColumnOrder(newOrder);
    },
    [table],
  );

  const toggleColumn = (columnKey: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  React.useEffect(() => {
    setOrderedProperties(properties);
  }, [properties]);

  const reorderItems = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!isDragEnabled) return;

      setOrderedProperties((prev) => {
        const newItems = [...prev];
        const draggedItem = newItems[dragIndex];
        if (!draggedItem) return prev;

        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);
        return newItems;
      });
    },
    [isDragEnabled],
  );

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={isDragEnabled ? "default" : "outline"}
              onClick={() => {
                setIsDragEnabled(!isDragEnabled);
                setIsColumnManagementEnabled(false);
              }}
              className="flex items-center gap-2"
            >
              <GripVertical className="h-4 w-4" />
              {isDragEnabled
                ? "Disable Row Reordering"
                : "Enable Row Reordering"}
            </Button>

            {viewMode === "list" && (
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
                    const columnKey =
                      column.id as keyof typeof columnVisibility;
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleColumn(columnKey);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={columnVisibility[columnKey]}
                            onChange={
                              /* istanbul ignore next */ () => undefined
                            }
                            className="mr-2"
                          />
                          <span>
                            {column.id.charAt(0).toUpperCase() +
                              column.id.slice(1)}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {viewMode === "list" && (
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
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              aria-label="List view"
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

        {viewMode === "list" ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnOrder = headerGroup.headers.map((h, index) => ({
                      id: h.column.id ?? "",
                      index,
                    }));

                    return (
                      <DraggableColumns
                        key={header.id}
                        header={header}
                        col={header.column}
                        columnOrder={columnOrder}
                        columns={mutableColumns}
                        setColumns={handleColumnReorder}
                        isManagementEnabled={isColumnManagementEnabled}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <DraggablePropertyRow
                  key={row.id}
                  index={index}
                  reorderRow={reorderItems}
                  isDragEnabled={isDragEnabled}
                  cells={row.getVisibleCells()}
                  onDragEnd={() => setIsDragging(false)}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedProperties.map((property, index) => (
              <PropertyGridItem
                key={property.id}
                property={property}
                index={index}
                onViewDetails={() => onViewDetails(property)}
                onEdit={() => onEdit(property)}
                onDelete={() => onDelete(property.id)}
                isDragEnabled={isDragEnabled}
                reorderProperty={reorderItems}
                visibleColumns={visibleColumns}
              />
            ))}
          </div>
        )}

        {isDragEnabled && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Drag properties to reorder them in {viewMode} view
          </div>
        )}
      </DndProvider>
    </TooltipProvider>
  );
};

class PropertyTableErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong loading the property table.</div>;
    }

    return this.props.children;
  }
}

export default function PropertyTableWithErrorBoundary(
  props: PropertyTableProps,
) {
  return (
    <PropertyTableErrorBoundary>
      <PropertyTable {...props} />
    </PropertyTableErrorBoundary>
  );
}
