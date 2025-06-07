import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import { api } from "~/trpc/server";

const SummaryStatistics = () => {
  // Placeholder data; replace with actual data fetching in the future
  const stats = {
    totalProperties: 10,
    activeListings: 8,
    averageRating: 4.5,
    // Add more relevant statistics here
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Properties</CardTitle>
        </CardHeader>
        <CardContent>{stats.totalProperties}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Listings</CardTitle>
        </CardHeader>
        <CardContent>{stats.activeListings}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
        </CardHeader>
        <CardContent>{stats.averageRating}</CardContent>
      </Card>
    </div>
  );
};

export default SummaryStatistics;
