import type { Cell, ColumnDef } from "@tanstack/react-table";
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Calendar,
  Columns,
  Grid,
  GripVertical,
  List,
  MoreHorizontal,
  Star,
  Users,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  TableHeader,
  TableRow,
} from "@reservatior/ui/table";
import { TooltipProvider } from "@reservatior/ui/tooltip";

import type { Event } from "~/utils/interfaces";
import { DraggableColumns } from "./DraggableColumns";
import { EventGridItem } from "./EventGridItem";

const DraggableEventRow = React.memo(
  React.forwardRef<
    HTMLTableRowElement,
    {
      index: number;
      reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
      isDragEnabled: boolean;
      cells: Cell<Event, unknown>[];
      onDragEnd: () => void;
    }
  >(({ index, reorderRow, isDragEnabled, cells, onDragEnd }, ref) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: "event",
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
      accept: "event",
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

DraggableEventRow.displayName = "DraggableEventRow";

interface EventTableProps {
  events: Event[];
  onViewDetails: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-800",
  PUBLISHED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
} as const;

const EventTable: React.FC<EventTableProps> = ({
  events,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [orderedEvents, setOrderedEvents] = React.useState<Event[]>(events);
  const [isDragEnabled, setIsDragEnabled] = React.useState(false);
  const [isColumnManagementEnabled, setIsColumnManagementEnabled] =
    React.useState(false);
  const [columnVisibility, setColumnVisibility] = React.useState({
    image: true,
    details: true,
    date: true,
    status: true,
    attendees: true,
    rating: true,
  });
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");

  const visibleColumns = Object.entries(columnVisibility)
    .filter(([_, isVisible]) => isVisible)
    .map(([key]) => key);

  const columns = React.useMemo<ColumnDef<Event>[]>(
    () => [
      {
        id: "image",
        header: "Image",
        cell: ({ row }) => {
          const event = row.original;
          return (
            <div className="flex items-center space-x-4">
              {event.Property?.id ? (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                  <span className="text-xs font-medium">
                    {event.Property.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <div className="h-10 w-10 rounded bg-muted" />
              )}
            </div>
          );
        },
      },
      {
        id: "details",
        header: "Details",
        cell: ({ row }) => {
          const event = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{event.title}</span>
              <span className="text-sm text-muted-foreground">
                {event.description ?? "No description"}
              </span>
            </div>
          );
        },
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => {
          const event = row.original;
          const startDate = new Date(event.scheduledAt);
          const endDate = event.duration
            ? new Date(startDate.getTime() + event.duration * 60 * 1000)
            : startDate;

          return (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </span>
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          const status = isActive ? "ACTIVE" : "INACTIVE";
          return (
            <Badge
              className={
                STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
                STATUS_COLORS.DRAFT
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "attendees",
        header: "Attendees",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.attendees?.length ?? 0}</span>
          </div>
        ),
      },
      {
        id: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span>N/A</span>
          </div>
        ),
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) => row.original.Property?.title ?? "N/A",
      },
      {
        id: "actions",
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

  const [mutableColumns, setMutableColumns] = React.useState(columns);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([
    "image",
    "details",
    "date",
    "status",
    "attendees",
    "rating",
    "location",
    "actions",
  ]);

  const table = useReactTable({
    data: orderedEvents,
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
    (newColumns: ColumnDef<Event, unknown>[]) => {
      setMutableColumns(newColumns);
      const newOrder = newColumns
        .filter(
          (col): col is ColumnDef<Event, unknown> & { id: string } =>
            col.id !== undefined,
        )
        .map((col) => col.id);
      setColumnOrder(newOrder);
      table.setColumnOrder(newOrder);
    },
    [table],
  ) as (columns: ColumnDef<Event, unknown>[]) => void;

  const toggleColumn = (columnKey: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  React.useEffect(() => {
    setOrderedEvents(events);
  }, [events]);

  const reorderItems = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!isDragEnabled) return;

      setOrderedEvents((prev) => {
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
                            aria-label={`Toggle ${column.id} column`}
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
                        setColumns={handleColumnReorder as any}
                        isManagementEnabled={isColumnManagementEnabled}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <DraggableEventRow
                  key={row.id}
                  index={index}
                  reorderRow={reorderItems}
                  isDragEnabled={isDragEnabled}
                  cells={row.getVisibleCells()}
                  onDragEnd={() => {}}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedEvents.map((event, index) => (
              <EventGridItem
                key={event.id}
                event={event}
                index={index}
                onViewDetails={() => onViewDetails(event)}
                onEdit={() => onEdit(event)}
                onDelete={() => onDelete(event.id)}
                isDragEnabled={isDragEnabled}
                reorderEvent={reorderItems}
                visibleColumns={visibleColumns}
              />
            ))}
          </div>
        )}

        {isDragEnabled && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Drag events to reorder them in {viewMode} view
          </div>
        )}
      </DndProvider>
    </TooltipProvider>
  );
};

class EventTableErrorBoundary extends React.Component<
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
      return <div>Something went wrong loading the event table.</div>;
    }

    return this.props.children;
  }
}

export default function EventTableWithErrorBoundary(props: EventTableProps) {
  return (
    <EventTableErrorBoundary>
      <EventTable {...props} />
    </EventTableErrorBoundary>
  );
}
