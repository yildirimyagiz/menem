import React from "react";
import { PrismaClient } from "@acme/db";
import { auth as rawAuth } from "@acme/auth";
import type { Session } from "next-auth";
import QuickAccess from "~/app/_components/client/QuickAccess";
import QuickActions from "~/app/_components/client/QuickActions";
import SummaryStatistics from "~/app/_components/client/SummaryStatistics";
import AdminLayout from "~/app/_components/layouts/admin-layout";

const auth = rawAuth as () => Promise<Session | null>;
const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="px-8 py-10">
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="mb-8 text-muted-foreground">Welcome to your property management dashboard</p>

        {/* Quick Access Section */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Quick Access</h2>
          <QuickAccess />
        </section>

        {/* Summary Statistics Section */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Summary Statistics</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Total Properties</h3>
              <p className="text-2xl font-bold">32</p>
              <p className="text-sm text-muted-foreground">
                occupancyRate: 84.4%
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Monthly Cashflow</h3>
              <p className="text-2xl font-bold">$42,500.00</p>
              <p className="text-sm text-muted-foreground">
                pendingPayments: 7
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Pending Tasks</h3>
              <p className="text-2xl font-bold">23</p>
              <p className="text-sm text-muted-foreground">-5 thisWeek</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Total Tenants</h3>
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-muted-foreground">newTenants: 5</p>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Upcoming Events Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Events</h2>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
              <div>
                <h3 className="text-lg font-semibold">
                  Lease Renewal - Sarah Johnson
                </h3>
                <p className="text-sm text-muted-foreground">Apr 25, 2025</p>
              </div>
              <button className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                View Details
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
              <div>
                <h3 className="text-lg font-semibold">
                  Rent Due - 8 Properties
                </h3>
                <p className="text-sm text-muted-foreground">May 1, 2025</p>
              </div>
              <button className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                View Details
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between border-b pb-4 last:mb-0 last:border-b-0 last:pb-0">
              <div>
                <h3 className="text-lg font-semibold">Scheduled Maintenance</h3>
                <p className="text-sm text-muted-foreground">May 3, 2025</p>
              </div>
              <button className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                View Details
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between pb-4 last:mb-0 last:border-b-0 last:pb-0">
              <div>
                <h3 className="text-lg font-semibold">New Tenant Move-in</h3>
                <p className="text-sm text-muted-foreground">May 5, 2025</p>
              </div>
              <button className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                View Details
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
