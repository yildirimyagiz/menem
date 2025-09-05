"use client";

import { Plus, Search } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@reservatior/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";

import { api } from "~/trpc/react";

const QuickActions = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: user } = api.auth.getUserById.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  if (!userId || !user) {
    return <div>{t("quickActions.loading", { defaultValue: "Loading user data..." })}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("quickActions.title", { defaultValue: "Quick Actions" })}</CardTitle>
        <CardDescription>{t("quickActions.description", { defaultValue: "Perform common tasks quickly." })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("quickActions.addProperty", { defaultValue: "Add New Property" })}
          </Button>
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            {t("quickActions.findTenants", { defaultValue: "Find Tenants" })}
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
