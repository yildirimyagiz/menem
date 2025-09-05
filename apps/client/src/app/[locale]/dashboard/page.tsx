import {
  Building2,
  CheckSquare,
  CreditCard,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

import DashboardLayout from "../../_components/layouts/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome to the Admin Dashboard
        </h1>
        <p className="mb-6 text-muted-foreground">
          Here you can manage properties, users, tasks, and view analytics at a
          glance.
        </p>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Building2 className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-muted-foreground">+32 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <CreditCard className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,340</div>
            <p className="text-xs text-muted-foreground">+1,200 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <CheckSquare className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">-2 this week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin/properties"
                  className="text-primary hover:underline"
                >
                  Manage Properties
                </a>
              </li>
              <li>
                <a href="/admin/users" className="text-primary hover:underline">
                  User Management
                </a>
              </li>
              <li>
                <a href="/admin/tasks" className="text-primary hover:underline">
                  View Tasks
                </a>
              </li>
              <li>
                <a
                  href="/admin/analytics"
                  className="text-primary hover:underline"
                >
                  Analytics
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-green-600">
              All systems operational
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Last checked: 2 minutes ago
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
