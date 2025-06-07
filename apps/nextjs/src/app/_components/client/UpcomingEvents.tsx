import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

const UpcomingEvents = () => {
  // Replace this with actual data fetching from your database
  const events = [
    {
      id: 1,
      title: "Property Viewing",
      date: new Date("2024-03-15T10:00:00"),
      location: "123 Main St, Anytown",
    },
    {
      id: 2,
      title: "Meeting with Owner",
      date: new Date("2024-03-22T14:00:00"),
      location: "Conference Room A",
    },
    // Add more events as needed
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Your schedule for the next 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {event.date.toLocaleDateString()} -{" "}
                  {event.date.toLocaleTimeString()}
                </p>
                {/* <p className="text-sm text-muted-foreground">{event.location}</p> */}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
export default UpcomingEvents;
