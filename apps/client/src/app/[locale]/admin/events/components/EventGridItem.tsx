import type { Identifier } from "dnd-core";
import React, { useCallback } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  GripVertical,
  MapPin,
  MoreHorizontal,
  Star,
  Users,
} from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@reservatior/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

import type { Event } from "~/utils/types";

interface EventGridItemProps {
  event: Event;
  index: number;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragEnabled: boolean;
  reorderEvent: (dragIndex: number, hoverIndex: number) => void;
  visibleColumns: string[];
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-800",
  PUBLISHED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  POSTPONED: "bg-yellow-100 text-yellow-800",
};

export const EventGridItem = React.memo(function EventGridItem({
  event,
  index,
  onViewDetails,
  onEdit,
  onDelete,
  isDragEnabled,
  reorderEvent,
}: EventGridItemProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "event",
    item: () => ({ index, id: event.id, type: "event" }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isDragEnabled,
  });

  const [, dropRef] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
    {
      accept: "event",
      hover: useCallback(
        (draggedItem: DragItem) => {
          if (!isDragEnabled) return;
          if (draggedItem.index !== index) {
            reorderEvent(draggedItem.index, index);
            draggedItem.index = index;
          }
        },
        [index, isDragEnabled, reorderEvent],
      ),
    },
  );

  const renderImage = useCallback(() => {
    if (!event.photoUrl) {
      return <div className="bg-muted aspect-video w-full rounded-t-lg" />;
    }

    return (
      <div className="relative aspect-video w-full">
        <Image
          src={event.photoUrl}
          alt={event.title}
          className="rounded-t-lg object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          quality={75}
        />
      </div>
    );
  }, [event.photoUrl, event.title]);

  const formattedStartTime = new Date(event.startTime).toLocaleString();
  const formattedEndTime = new Date(event.endTime).toLocaleString();

  return (
    <Card
      ref={(node) => {
        dragRef(node);
        dropRef(node);
      }}
      className={`group transition-opacity duration-200 ${
        isDragging ? "opacity-50" : "opacity-100"
      } relative hover:shadow-md`}
    >
      {isDragEnabled && (
        <div className="absolute left-2 top-2 z-10">
          <GripVertical
            className={`h-6 w-6 ${
              isDragEnabled ? "cursor-move" : "cursor-not-allowed"
            } text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100`}
          />
        </div>
      )}

      <CardHeader className="relative p-0">
        {renderImage()}
        <Badge
          variant="outline"
          className={`absolute right-4 top-4 ${STATUS_COLORS[event.status]} backdrop-blur-sm`}
        >
          {event.status}
        </Badge>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="line-clamp-1 font-semibold">{event.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">{event.averageRating ?? "N/A"}</span>
          </div>
        </div>

        <div className="text-muted-foreground space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="line-clamp-1">{formattedStartTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="line-clamp-1">{formattedEndTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.locationId ?? "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.attendees ?? 0} attendees</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-muted/50 h-8 w-8 p-0"
              aria-label="Open menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onViewDetails}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
});

EventGridItem.displayName = "EventGridItem";
