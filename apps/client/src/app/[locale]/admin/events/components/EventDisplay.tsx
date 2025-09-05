import React, { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  MoreHorizontal,
  Star,
  Users,
} from "lucide-react";

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
import { TableCell, TableRow } from "@reservatior/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@reservatior/ui/tooltip";

import type { Event } from "~/utils/types";
import { env } from "~/env";
import { api } from "~/trpc/client/react";

interface EventDisplayProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-800",
  PUBLISHED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  POSTPONED: "bg-yellow-100 text-yellow-800",
};

const EventDisplay = React.memo(function EventDisplay({
  event,
  onViewDetails,
  onEdit,
  onDelete,
}: EventDisplayProps) {
  const {
    data: eventDetails,
    isLoading,
    error,
  } = api.event.byId.useQuery(
    { id: event.id },
    {
      enabled: !!event.id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  const displayEvent = useMemo(
    () => ({ ...event, ...eventDetails }),
    [event, eventDetails],
  );

  const handleDelete = useCallback(() => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    onDelete(event.id);
  }, [onDelete, event.id]);

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="animate-pulse">
          <div className="h-16 w-full rounded bg-gray-200" />
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-red-600">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span>Error loading event details: {error.message}</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  const formattedStartTime = new Date(displayEvent.startTime).toLocaleString();
  const formattedEndTime = new Date(displayEvent.endTime).toLocaleString();

  return (
    <TableRow className="group transition-colors hover:bg-gray-50">
      <TableCell>
        <div className="relative h-16 w-20 overflow-hidden">
          <Image
            src={displayEvent.image ?? "/defaultEvent.png"}
            fill
            className="rounded-md object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 80px, 120px"
            priority={false}
            quality={75}
            alt={displayEvent.title}
          />
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <p className="line-clamp-1 font-medium">{displayEvent.title}</p>
          <p className="line-clamp-2 text-sm text-gray-500">
            {displayEvent.description}
          </p>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <Badge className={STATUS_COLORS[displayEvent.status]}>
            {displayEvent.status}
          </Badge>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{formattedStartTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{formattedEndTime}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{displayEvent.locationId ?? "N/A"}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{displayEvent.attendees ?? 0} attendees</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{displayEvent.averageRating ?? "N/A"}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span>Organizer: {displayEvent.organizerAgentId ?? "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Agency: {displayEvent.organizerAgencyId ?? "N/A"}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(event)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(event)}>
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

export default EventDisplay;
