import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Calendar, MoreHorizontal, Star, Users } from "lucide-react";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@acme/ui/tooltip";

import type { Event } from "~/utils/types";

const EventCell = React.memo(({ event }: { event: Event }) => (
  <div className="flex items-center space-x-4">
    <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
      <Calendar className="text-muted-foreground h-5 w-5" />
    </div>
  </div>
));

EventCell.displayName = "EventCell";

export const createColumns = (
  onViewDetails: (event: Event) => void,
  onEdit: (event: Event) => void,
  onDelete: (id: string) => Promise<void> | void,
): ColumnDef<Event>[] => [
  {
    id: "icon",
    header: "Icon",
    cell: ({ row }) => <EventCell event={row.original} />,
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex max-w-[200px] flex-col">
              <span className="truncate font-medium">{event.title}</span>
              <span className="text-muted-foreground text-sm">
                {event.description}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{event.title}</p>
            <p className="text-muted-foreground text-sm">{event.description}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "schedule",
    header: "Schedule",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              {new Date(event.startTime).toLocaleDateString()} -{" "}
              {new Date(event.endTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm">
              {new Date(event.startTime).toLocaleTimeString()} -{" "}
              {new Date(event.endTime).toLocaleTimeString()}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline">{event.status}</Badge>
        </div>
      );
    },
  },
  {
    id: "stats",
    header: "Statistics",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{event.attendees ?? 0} attendees</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              {event.averageRating?.toFixed(1) ?? "0.0"} (
              {event.reviewCount ?? 0} reviews)
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;
      const handleDelete = async () => {
        if (
          window.confirm(`Are you sure you want to delete "${event.title}"?`)
        ) {
          await onDelete(event.id);
        }
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-muted h-8 w-8 p-0"
                aria-label={`Actions for ${event.title}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onViewDetails(event)}
                className="cursor-pointer"
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(event)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const defaultColumnOrder = [
  "icon",
  "details",
  "schedule",
  "status",
  "stats",
  "actions",
] as const;

export const defaultColumnVisibility: Record<
  (typeof defaultColumnOrder)[number],
  boolean
> = {
  icon: true,
  details: true,
  schedule: true,
  status: true,
  stats: true,
  actions: true,
};
