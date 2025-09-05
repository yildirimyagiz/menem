import type { Column, ColumnDef, Header } from "@tanstack/react-table";
import type {
  ConnectDragSource,
  ConnectDropTarget,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import React, { useCallback, useMemo, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { GripVertical, Lock, Move } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

import type { Guest } from "@reservatior/validators";
import { cn } from "@reservatior/ui";
import { TableHead } from "@reservatior/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@reservatior/ui/tooltip";

interface DraggableColProps {
  header: Header<Guest, unknown>;
  col: Column<Guest, unknown>;
  columnOrder: { id: string; index: number }[];
  columns: ColumnDef<Guest, unknown>[];
  setColumns: (columns: ColumnDef<Guest, unknown>[]) => void;
  isManagementEnabled: boolean;
  onColumnReorderComplete?: () => void;
}

interface DragItem {
  id: string;
  index: number | undefined;
  type: string;
}

const useMergeRefs = (dragRef: ConnectDragSource, dropRef: ConnectDropTarget) =>
  useCallback(
    (node: HTMLTableCellElement | null) => {
      dragRef(node);
      dropRef(node);
    },
    [dragRef, dropRef],
  );

export const DraggableColumns = React.memo(function DraggableColumns({
  header,
  col,
  columnOrder,
  columns,
  setColumns,
  isManagementEnabled,
  onColumnReorderComplete,
}: DraggableColProps) {
  const [isDragStarted, setIsDragStarted] = useState(false);

  const isActionColumn = col.id === "actions";
  const canDrag = isManagementEnabled && !isActionColumn;

  const handleDragStart = useCallback(() => {
    setIsDragStarted(true);
    return {
      id: col.id,
      index: columnOrder.find((c) => c.id === col.id)?.index,
      type: "column",
    };
  }, [col.id, columnOrder]);

  const handleDragEnd = useCallback(() => {
    setIsDragStarted(false);
    onColumnReorderComplete?.();
  }, [onColumnReorderComplete]);

  const [{ isDragging }, dragRef] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: "column",
    item: handleDragStart,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => canDrag,
    end: handleDragEnd,
  });

  const handleColumnReorder = useCallback(
    (draggedColIndex: number, targetColIndex: number) => {
      if (!isManagementEnabled || isActionColumn) return;

      const newColumns = [...columns];
      const draggedColumn = newColumns[draggedColIndex];

      if (!draggedColumn) return;

      newColumns.splice(draggedColIndex, 1);
      newColumns.splice(targetColIndex, 0, draggedColumn);

      setColumns(newColumns);
    },
    [columns, isManagementEnabled, isActionColumn, setColumns],
  );

  const handleHover = useCallback(
    (draggedColumn: DragItem) => {
      if (!canDrag || !draggedColumn.index) return;

      const targetIndex = columnOrder.find((c) => c.id === col.id)?.index;
      if (targetIndex === undefined || draggedColumn.index === targetIndex)
        return;

      handleColumnReorder(draggedColumn.index, targetIndex);
      draggedColumn.index = targetIndex;
    },
    [canDrag, col.id, columnOrder, handleColumnReorder],
  );

  const [{ isOver, canDrop }, dropRef] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "column",
    hover: handleHover,
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const mergedRef = useMergeRefs(dragRef, dropRef);

  const className = useMemo(
    () =>
      cn("select-none transition-all duration-200", {
        "opacity-50": isDragging,
        "cursor-move": isManagementEnabled,
        "bg-muted/50": isOver && canDrop,
        "hover:bg-muted/30": isManagementEnabled && !isDragging,
        "border-2 border-dashed border-primary": isOver && canDrop,
        "shake-animation": isDragStarted && !canDrop,
      }),
    [isDragging, isManagementEnabled, isOver, canDrop, isDragStarted],
  );

  if (header.isPlaceholder || isActionColumn) {
    return (
      <TableHead>
        <div className="flex items-center justify-between">
          {flexRender(header.column.columnDef.header, header.getContext())}
          {isActionColumn && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top">Actions column locked</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableHead>
    );
  }

  return (
    <TableHead
      ref={mergedRef}
      className={className}
      data-draggable={canDrag}
      data-dragging={isDragging}
    >
      <div className="flex items-center gap-2 py-2">
        {isManagementEnabled && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mr-2 cursor-move">
                {isDragging ? (
                  <Move className="h-4 w-4 animate-pulse text-primary" />
                ) : (
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">Drag to reorder column</TooltipContent>
          </Tooltip>
        )}
        <div className="flex-1">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
      </div>
    </TableHead>
  );
});
