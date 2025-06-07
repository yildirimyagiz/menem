"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building,
  ClipboardList,
  CreditCard,
  Globe,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  PieChart,
  Settings,
  Shield,
  Users,
} from "lucide-react";

import { Button } from "@acme/ui/button";

import { useAuth } from "~/hooks/use-auth";
import { useToast } from "~/hooks/use-toast";

export default function MainPageClient() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Redirect unauthenticated users from dashboard routes
  useEffect(() => {
    if (
      !user &&
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/home") ||
        window.location.pathname.startsWith("/admin"))
    ) {
      router.push("/auth");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      router.push("/auth");
    } catch {
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your property management dashboard
          </p>
        </div>
        {/* Overview Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Properties</h3>
              <Building className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">5</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Active properties
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tenants</h3>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">12</p>
            <p className="mt-1 text-xs text-muted-foreground">Total tenants</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Payments</h3>
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">$8,540</p>
            <p className="mt-1 text-xs text-muted-foreground">This month</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tasks</h3>
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">7</p>
            <p className="mt-1 text-xs text-muted-foreground">Pending tasks</p>
          </div>
        </div>
        {/* User Info */}
        <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold">User Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Username
              </p>
              <p>{user.username ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user.email ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p>{user.role ?? "-"}</p>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => router.push("/admin/properties")}>
              <Building className="mr-2 h-4 w-4" /> Properties
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin")}>
              <Home className="mr-2 h-4 w-4" /> Admin Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/tenants")}
            >
              <Users className="mr-2 h-4 w-4" /> Tenants
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/payments")}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Payments
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Show WelcomeScreen if not authenticated
  return (
    <div className="from-primary-50 min-h-screen bg-gradient-to-b to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="relative">
            <div className="relative inline-block">
              <div className="absolute -inset-10 rounded-full bg-primary/5 blur-xl"></div>
              <h1 className="relative text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
                RentalProc
              </h1>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
            Your comprehensive property management solution for owners, tenants,
            and agents
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/auth">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/home">
              <Button variant="outline" size="lg" className="gap-2">
                Explore Features <Globe className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Comprehensive Property Management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to manage your real estate portfolio
              efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative rounded-lg bg-muted/40 p-6 transition-all hover:shadow-md">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Property Management
              </h3>
              <p className="text-muted-foreground">
                Efficiently manage properties, units, and facilities with
                detailed analytics and reporting.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="relative rounded-lg bg-muted/40 p-6 transition-all hover:shadow-md">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tenant Management</h3>
              <p className="text-muted-foreground">
                Handle tenant onboarding, maintenance requests, lease
                agreements, and payments.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="relative rounded-lg bg-muted/40 p-6 transition-all hover:shadow-md">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Financial Tools</h3>
              <p className="text-muted-foreground">
                Track expenses, manage payments, and generate financial reports
                for your properties.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="relative rounded-lg bg-muted/40 p-6 transition-all hover:shadow-md">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Map Integration</h3>
              <p className="text-muted-foreground">
                Visualize your properties on interactive maps with neighborhood
                insights and analytics.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="relative rounded-lg bg-muted/40 p-6 transition-all hover:shadow-md">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Analytics & Insights
              </h3>
              <p className="text-muted-foreground">
                Make data-driven decisions with comprehensive analytics and
                property performance metrics.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="relative rounded-lg bg-muted/40 p-6 transition-all hover:shadow-md">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Communication Tools
              </h3>
              <p className="text-muted-foreground">
                Built-in messaging system with notifications to keep everyone
                informed and connected.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-lg bg-white p-8 shadow-lg sm:p-12">
            <div className="absolute left-0 right-0 top-0 h-1 bg-primary"></div>
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  Ready to streamline your property management?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Join thousands of property owners, managers, and tenants who
                  trust RentalProc for their real estate needs.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/auth">
                  <Button size="lg" className="gap-2">
                    Sign Up Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg" className="gap-2">
                    Learn More <Shield className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-muted/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center">
              <Home className="mr-2 h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">RentalProc</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/features">
                <Button
                  variant="link"
                  className="text-muted-foreground hover:text-primary"
                >
                  Features
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="link"
                  className="text-muted-foreground hover:text-primary"
                >
                  Pricing
                </Button>
              </Link>
              <Link href="/testimonials">
                <Button
                  variant="link"
                  className="text-muted-foreground hover:text-primary"
                >
                  Testimonials
                </Button>
              </Link>
              <Link href="/faq">
                <Button
                  variant="link"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQ
                </Button>
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} RentalProc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
