"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@reservatior/ui/card";

export default function TestLayoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Layout Test Page</h1>
        <p className="text-muted-foreground">
          This page tests the new role-based sidebar layout
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Overview and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This card shows that the layout is working correctly.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Manage your properties</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Property management features will be available here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Chat and messaging</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Communication features will be available here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Payment management</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Financial features will be available here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Task management</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Task management features will be available here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Configuration options will be available here.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Layout Features</CardTitle>
          <CardDescription>What's new in the improved layout</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>Role-based navigation with proper filtering</li>
            <li>Collapsible sidebar with tooltips</li>
            <li>Mobile-responsive design</li>
            <li>
              Organized categories (Dashboard, Properties, Communication,
              Financial, Admin, Support)
            </li>
            <li>Improved header with search and user menu</li>
            <li>Better accessibility features</li>
            <li>Consistent styling across components</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
