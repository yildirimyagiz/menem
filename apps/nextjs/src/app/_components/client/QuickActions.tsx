"use client";

import { Plus, Search } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import { api } from "~/trpc/react";

const QuickActions = () => {
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
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Perform common tasks quickly.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Button>
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Find Tenants
          </Button>
          {/* Add more actions based on user role, e.g.:
            {user.role === "agent" && (<Button>Schedule Viewing</Button>)}
          */}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
