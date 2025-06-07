"use client";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

const QuickAccess = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Loading user data...</div>;
  }
  const { data: user } = api.auth.getUserById.useQuery({ userId });

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
        <CardDescription>
          Here are some quick links to get you started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {/* Example links; replace with your actual quick access links */}
          <li>
            <a href="/properties" className="hover:underline">
              Manage Properties
            </a>
          </li>
          <li>
            <a href="/listings/new" className="hover:underline">
              Create New Listing
            </a>
          </li>
          {/* Add more links as needed based on user role */}
        </ul>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
