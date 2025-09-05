"use client";

import {
  ArrowRight,
  Briefcase,
  Building,
  ClipboardList,
  CreditCard,
  Globe,
  Home,
  MapPin,
  MessageCircle,
  PieChart,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@reservatior/ui/button";

import { useAuth } from "~/hooks/use-auth";

export default function MainPageClient() {
  const { user } = useAuth();
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

  // Removed unused handleLogout function

  if (user) {
    return (
      <main className="flex-1 p-4 sm:p-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-background dark:bg-gray-950 min-h-[100dvh]">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your property management dashboard
          </p>
        </div>
        {/* Overview Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              <p>{user.username || "-"}</p>
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
            <Button
  aria-label="Quick action"
  className="min-h-[44px] min-w-[44px] focus:ring-2" onClick={() => router.push("/admin/properties")}>
              <Building className="mr-2 h-4 w-4" /> Properties
            </Button>
            <Button
  aria-label="Quick action"
  className="min-h-[44px] min-w-[44px] focus:ring-2" variant="outline" onClick={() => router.push("/admin")}>
              <Home className="mr-2 h-4 w-4" /> Admin Dashboard
            </Button>
            <Button
  aria-label="Quick action"
  className="min-h-[44px] min-w-[44px] focus:ring-2"
              variant="outline"
              onClick={() => router.push("/admin/tenants")}
            >
              <Users className="mr-2 h-4 w-4" /> Tenants
            </Button>
            <Button
  aria-label="Quick action"
  className="min-h-[44px] min-w-[44px] focus:ring-2"
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
                Reservatior
              </h1>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
            Your comprehensive property management solution for owners, tenants,
            and agents
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
  aria-label="Navigate"
  href="/auth">
              <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 gap-2" size="lg">Get Started <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link
  aria-label="Navigate"
  href="/home">
              <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 gap-2" variant="outline" size="lg">Explore Features <Globe className="h-4 w-4" /></Button>
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
                  trust Reservatior for their real estate needs.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link aria-label="Navigate" href="/auth">
  <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 gap-2" size="lg">Sign Up Now <ArrowRight className="h-4 w-4" /></Button>
</Link>
                <Link aria-label="Navigate" href="/features">
  <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 gap-2" variant="outline" size="lg">Learn More <Shield className="h-4 w-4" /></Button>
</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-muted/10 py-12 pt-[env(safe-area-inset-bottom)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center">
              <Home className="mr-2 h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">
                Reservatior
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
  aria-label="Navigate"
  href="/features">
                <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 text-muted-foreground hover:text-primary" variant="link">Features</Button>
              </Link>
              <Link
  aria-label="Navigate"
  href="/pricing">
                <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 text-muted-foreground hover:text-primary" variant="link">Pricing</Button>
              </Link>
              <Link
  aria-label="Navigate"
  href="/testimonials">
                <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 text-muted-foreground hover:text-primary" variant="link">Testimonials</Button>
              </Link>
              <Link
  aria-label="Navigate"
  href="/faq">
                <Button aria-label="Quick action" className="min-h-[44px] min-w-[44px] focus:ring-2 text-muted-foreground hover:text-primary" variant="link">FAQ</Button>
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Reservatior. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
