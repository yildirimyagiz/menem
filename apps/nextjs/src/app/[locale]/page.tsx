import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import HomePagePublic from "~/app/_components/client/HomePagePublic";
// import { AuthShowcase } from "../_components/auth-showcase"; // Not needed for dashboard
// import {
//   CreatePostForm,
//   PostCardSkeleton,
//   PostList,
// } from "../_components/posts"; // Not needed for dashboard

import QuickAccess from "~/app/_components/client/QuickAccess";
import SummaryStatistics from "~/app/_components/client/SummaryStatistics";
import UpcomingEvents from "~/app/_components/client/UpcomingEvents";
import DashboardLayout from "~/app/_components/layouts/DashboardLayout";
import MainPageClient from "~/app/MainPageClient"; // We will render content directly
import { api, HydrateClient } from "~/trpc/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Index"); // Or get translations for the dashboard
  return {
    title: t("title"), // Or a dashboard-specific title
    description: t("description"), // Or a dashboard-specific description
  };
}

export default async function HomePage() {
  const session = await api.auth.getSession();

  // Dynamic import to avoid SSR issues with useAuth/useToast in MainPageClient
  const MainPageClient = dynamic(() => import("../MainPageClient"), {
    ssr: false,
  });

  if (!session?.user) {
    return (
      <DashboardLayout>
        <HydrateClient>
          <HomePagePublic />
        </HydrateClient>
      </DashboardLayout>
    );
  }
  if (session.user && "role" in session.user && session.user.role === "admin") {
    return (
      <DashboardLayout>
        <HydrateClient>
          <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
            <p className="mb-8 text-muted-foreground">
              Welcome to your property management dashboard
            </p>
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-semibold">Quick Access</h2>
              <QuickAccess />
            </section>
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-semibold">
                Summary Statistics
              </h2>
              <Suspense fallback={<div>Loading Summary...</div>}>
                <SummaryStatistics />
              </Suspense>
            </section>
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Upcoming Events</h2>
              <Suspense fallback={<div>Loading Events...</div>}>
                <UpcomingEvents />
              </Suspense>
            </section>
          </div>
        </HydrateClient>
      </DashboardLayout>
    );
  }

  // Non-admin: render client main page
  return (
    <DashboardLayout>
      <HydrateClient>
        <MainPageClient />
      </HydrateClient>
    </DashboardLayout>
  );
}
