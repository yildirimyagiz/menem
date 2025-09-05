"use client";

import { useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";

import { api } from "~/trpc/react";
import { useTranslations } from 'next-intl';

const QuickAccess = () => {
  const t = useTranslations();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: user } = api.auth.getUserById.useQuery(
    { userId: userId ?? "" },
    { enabled: Boolean(userId) },
  );

  if (!userId) {
    return <div>{t("quickAccess.noSession", { defaultValue: "No user session." })}</div>;
  }
  if (!user) {
    return <div>{t("quickAccess.loading", { defaultValue: "Loading user data..." })}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("quickAccess.title", { defaultValue: "Quick Access" })}</CardTitle>
        <CardDescription>
          {t("quickAccess.description", { defaultValue: "Here are some quick links to get you started." })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {/* Example links; replace with your actual quick access links */}
          <li>
            <a href="/properties" className="hover:underline">
              {t("quickAccess.manageProperties", { defaultValue: "Manage Properties" })}
            </a>
          </li>
          <li>
            <a href="/listings/new" className="hover:underline">
              {t("quickAccess.createListing", { defaultValue: "Create New Listing" })}
            </a>
          </li>
          {/* Add more links as needed based on user role */}
        </ul>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
