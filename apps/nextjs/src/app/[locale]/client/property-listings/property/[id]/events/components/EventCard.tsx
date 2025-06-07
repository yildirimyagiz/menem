import Link from "next/link";
import { Calendar, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    eventType: string;
    scheduledAt: string;
    attendees?: { id: string; firstName: string; lastName: string }[];
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Calendar className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-semibold">
          <Link href={`./events/${event.id}`}>{event.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm text-muted-foreground">
          {event.description}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="rounded bg-muted px-2 py-0.5">
            {event.eventType}
          </span>
          <span className="text-muted-foreground">
            {new Date(event.scheduledAt).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {event.attendees?.length ?? 0} attending
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
