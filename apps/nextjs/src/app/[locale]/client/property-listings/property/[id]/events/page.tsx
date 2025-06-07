"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

import { api } from "~/trpc/react";
import EventList from "./components/EventList";

export default function PropertyEventsPage() {
  const params = useParams();
  const propertyId = params.id as string; // propertyId is always present
  const { data, isLoading } = api.event.byProperty.useQuery({ propertyId });

  // Optionally sort events by date
  const events = useMemo(() => {
    if (!data?.events) return [];
    return [...data.events].sort(
      (a, b) =>
        new Date(a?.scheduledAt ?? 0).getTime() -
        new Date(b?.scheduledAt ?? 0).getTime(),
    );
  }, [data]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <Calendar className="mr-2 inline-block h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventList events={events} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
