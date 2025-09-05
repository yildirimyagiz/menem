import type { Cell } from "@tanstack/react-table";
import type {
  ConnectDragSource,
  ConnectDropTarget,
  DragSourceMonitor,
} from "react-dnd";
import React from "react";
import { flexRender } from "@tanstack/react-table";
import { GripVertical, Move } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

import type { Property } from "@reservatior/validators";
import { cn } from "@reservatior/ui";
import { TableCell, TableRow } from "@reservatior/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useLanguage } from "~/context/LanguageContext";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const mergeRefs = (
  ref: React.ForwardedRef<HTMLTableRowElement>,
  dragRef: ConnectDragSource,
  dropRef: ConnectDropTarget,
): ((node: HTMLTableRowElement | null) => void) => {
  return (node: HTMLTableRowElement | null) => {
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
    dragRef(node);
    dropRef(node);
  };
};

interface DraggablePropertyRowProps {
  property: Property;
  index: number;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
  isDragEnabled: boolean;
  cells: Cell<Property, unknown>[];
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const DraggablePropertyRow = React.forwardRef<
  HTMLTableRowElement,
  DraggablePropertyRowProps
>((props, ref) => {
  const { t } = useLanguage();
  const {
    property,
    index,
    reorderRow,
    isDragEnabled,
    cells,
    onDragStart,
    onDragEnd,
  } = props;

  const [{ isDragging }, dragRef] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: "property",
    item: () => {
      onDragStart?.();
      return {
        index,
        id: property.id,
        type: "property",
      };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isDragEnabled,
    end: () => {
      onDragEnd?.();
    },
  });

  const [{ isOver, canDrop }, dropRef] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "property",
    hover: (draggedItem: DragItem) => {
      if (!isDragEnabled) return;
      if (draggedItem.index !== index) {
        reorderRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const rowClassName = cn("relative transition-all duration-200", {
    "opacity-50": isDragging,
    "bg-muted/50": isOver && canDrop,
    "hover:bg-muted/30": !isDragging && isDragEnabled,
    "border-2 border-dashed border-primary": isOver && canDrop,
  });

  return (
    <TableRow
      ref={mergeRefs(ref, dragRef, dropRef)}
      className={rowClassName}
      data-draggable={isDragEnabled}
      data-dragging={isDragging}
      aria-grabbed={isDragging}
      role="row"
    >
      {isDragEnabled && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableCell className="w-[50px]" role="gridcell">
                {isDragging ? (
                  <Move className="h-4 w-4 animate-pulse text-primary" />
                ) : (
                  <GripVertical
                    className={cn("h-4 w-4 text-muted-foreground", {
                      "cursor-move": true,
                      "cursor-not-allowed": !isDragEnabled,
                    })}
                  />
                )}
              </TableCell>
            </TooltipTrigger>
            <TooltipContent>{t("Property.table.dragToReorder")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {cells.map((cell) => (
        <TableCell
          key={cell.id}
          className={cn({
            "animate-pulse": isDragging,
          })}
          role="gridcell"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
});

DraggablePropertyRow.displayName = "DraggablePropertyRow";
