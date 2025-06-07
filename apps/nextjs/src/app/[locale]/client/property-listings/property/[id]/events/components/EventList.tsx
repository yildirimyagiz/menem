import { Calendar, Users } from "lucide-react";

import EventCard from "./EventCard";

interface EventListProps {
  events: any[];
  isLoading?: boolean;
}

export default function EventList({ events, isLoading }: EventListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="text-muted-foreground">Loading events...</span>
      </div>
    );
  }
  if (!events?.length) {
    return (
      <div className="flex flex-col items-center py-8">
        <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
        <span className="text-muted-foreground">
          No events found for this property.
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
