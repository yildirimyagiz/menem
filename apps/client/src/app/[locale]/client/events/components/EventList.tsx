"use client";

import { CalendarIcon, ClockIcon, PersonIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import type { EventType } from "@reservatior/validators";
import { Badge } from "@reservatior/ui/badge";
import { Card } from "@reservatior/ui/card";
import { Skeleton } from "@reservatior/ui/skeleton";

import { api } from "~/trpc/react";

interface Event {
  id: string;
  propertyId: string;
  title: string;
  description: string | null;
  eventType: string;
  scheduledAt: Date;
  duration: number | null;
  createdById: string | null;
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Property: {
    id: string;
    title: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
  } | null;
  attendees: {
    id: string;
    name: string;
  }[];
}

interface EventResponse {
  data: (Event | null)[];
  page: number;
  limit: number;
  total: number;
}

export function EventList() {
  const { data, isLoading } = api.event.all.useQuery({
    page: 1,
    pageSize: 10,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const events = Array.isArray(data?.data)
    ? data.data.filter((event): event is Event => event !== null)
    : [];

  if (events.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No events found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first event to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {event.description}
              </p>
            </div>
            <Badge variant="secondary">
              {event.eventType.replace("_", " ")}
            </Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {format(new Date(event.scheduledAt), "PPP")}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {format(new Date(event.scheduledAt), "p")}
            </div>
            {event.duration && (
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {event.duration} minutes
              </div>
            )}
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-1">
                <PersonIcon className="h-4 w-4" />
                {event.attendees.length} attendees
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
