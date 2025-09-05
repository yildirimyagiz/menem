"use client";

import {
  BarChart4,
  Bell,
  Building,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Crown,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Warehouse,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";

import { useLanguage } from "~/context/LanguageContext";
import { useSidebar } from "~/context/SidebarContext";
import { useAuth } from "~/hooks/use-auth";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { isCollapsed, isMobileOpen, close, setIsCollapsed } = useSidebar();
  const [mounted, setMounted] = React.useState(false);

  // Only show sidebar on admin routes (supports localized paths like /tr/admin)
  const isAdminRoute = React.useMemo(() => {
    if (!pathname) return false;
    return /\/admin(\/|$)/.test(pathname);
  }, [pathname]);

  // Memoized user initials and display name for Avatar
  const getInitials = React.useMemo(() => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  }, [user]);

  const getUserDisplayName = React.useMemo(() => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.username) {
      return user.username;
    }
    return user.email?.split("@")[0] ?? "User";
  }, [user]);

  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Hide sidebar entirely for non-admin routes
  if (!isAdminRoute) return null;

  // Example unread counts; replace with state if needed
  const unreadMessageCount = 4;
  const unreadNotificationCount = 5;

  type UserRole =
    | "ADMIN"
    | "PROPERTY_MANAGER"
    | "OWNER"
    | "TENANT"
    | "USER"
    | "SUPPORT";

  const basePath =
    user?.role && ["ADMIN", "PROPERTY_MANAGER", "OWNER"].includes(user.role)
      ? "/admin"
      : "/client";

  const navItems = [
    {
      href: `${basePath}`,
      label: t("nav.home"),
      icon: <Home className="h-5 w-5" />,
      isActive: pathname === basePath || pathname === `${basePath}/`,
      category: "main",
    },
    {
      href: `${basePath}/properties`,
      label: t("nav.properties"),
      icon: <Building className="h-5 w-5" />,
      isActive: pathname?.includes("/properties"),
      category: "management",
    },
    {
      href: `${basePath}/tenants`,
      label: t("nav.tenants"),
      icon: <Users className="h-5 w-5" />,
      isActive: pathname?.includes("/tenants"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
      category: "management",
    },
    {
      href: `${basePath}/payments`,
      label: t("nav.payments"),
      icon: <Wallet className="h-5 w-5" />,
      isActive: pathname?.includes("/payments"),
      category: "financial",
    },
    {
      href: `${basePath}/tasks`,
      label: t("nav.tasks"),
      icon: <Wrench className="h-5 w-5" />,
      isActive: pathname?.includes("/tasks"),
      category: "operations",
    },
    {
      href: `${basePath}/expenses`,
      label: t("nav.expenses"),
      icon: <CircleDollarSign className="h-5 w-5" />,
      isActive: pathname?.includes("/expenses"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
      category: "financial",
    },
    {
      href: `${basePath}/facilities`,
      label: t("nav.facilities"),
      icon: <Warehouse className="h-5 w-5" />,
      isActive: pathname?.includes("/facilities"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
      category: "management",
    },
    {
      href: `${basePath}/messages`,
      label: t("nav.messages"),
      icon: <MessageCircle className="h-5 w-5" />,
      isActive: pathname?.includes("/messages"),
      badge: unreadMessageCount,
      category: "communication",
    },
    {
      href: `${basePath}/notification`,
      label: t("nav.notification"),
      icon: <Bell className="h-5 w-5" />,
      isActive: pathname?.includes("/notification"),
      badge: unreadNotificationCount,
      category: "communication",
    },
    {
      href: `${basePath}/analytics`,
      label: t("nav.analytics"),
      icon: <BarChart4 className="h-5 w-5" />,
      isActive: pathname?.includes("/analytics"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
      category: "analytics",
    },
    {
      href: `${basePath}/subscription`,
      label: t("nav.subscription"),
      icon: <CircleDollarSign className="h-5 w-5" />,
      isActive: pathname?.includes("/subscription"),
      category: "financial",
    },
    {
      href: `${basePath}/help`,
      label: t("nav.help"),
      icon: <HelpCircle className="h-5 w-5" />,
      isActive: pathname?.includes("/help"),
      category: "support",
    },
    {
      href: `${basePath}/settings`,
      label: t("nav.settings"),
      icon: <Settings className="h-5 w-5" />,
      isActive: pathname?.includes("/settings"),
      category: "settings",
    },
  ].filter((item) => {
    if (!item.onlyFor) return true;
    if (!user?.role) return false;
    return item.onlyFor.includes(user.role as UserRole);
  });

  if (!user) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-white via-gray-50/50 to-white shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Header with logo and toggle */}
        <div className="flex items-center justify-between border-b border-gray-200/50 bg-white/80 px-6 py-6 backdrop-blur-sm">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {t("nav.dashboard")}
                </h2>
                <p className="text-xs text-gray-500">Property Management</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={close}
              className="lg:hidden rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Desktop collapse toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex rounded-full p-2 hover:bg-gray-100 transition-all duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 px-6 py-6">
            <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
                  {user.profileImageUrl && (
                    <AvatarImage
                      src={user.profileImageUrl}
                      alt={getUserDisplayName}
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials}
                  </AvatarFallback>
                </Avatar>
                {user.role === "ADMIN" && (
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-md">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 truncate">
                    {getUserDisplayName}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-500 capitalize">
                      {user.role?.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href={`${basePath}/users/new`}
                  className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-white hover:shadow-sm"
                >
                  <Plus className="h-4 w-4 text-blue-600" />
                  <span>Add User</span>
                </Link>
                <Link
                  href={`${basePath}/properties/new`}
                  className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-white hover:shadow-sm"
                >
                  <Building className="h-4 w-4 text-green-600" />
                  <span>Add Property</span>
                </Link>
                <Link
                  href={`${basePath}/analytics`}
                  className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-white hover:shadow-sm"
                >
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span>View Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Main
              </div>
              {navItems.filter(item => item.category === "main").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Management */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Management
              </div>
              {navItems.filter(item => item.category === "management").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Financial */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Financial
              </div>
              {navItems.filter(item => item.category === "financial").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Operations */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Operations
              </div>
              {navItems.filter(item => item.category === "operations").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Communication */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Communication
              </div>
              {navItems.filter(item => item.category === "communication").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Analytics */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Analytics
              </div>
              {navItems.filter(item => item.category === "analytics").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Support */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Support
              </div>
              {navItems.filter(item => item.category === "support").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>

            {/* Settings */}
            <div className="space-y-2">
              <div className={`px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${isCollapsed ? 'hidden' : ''}`}>
                Settings
              </div>
              {navItems.filter(item => item.category === "settings").map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 px-4 py-6">
          {!isCollapsed && (
            <div className="mb-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 border border-blue-200/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-700">
                  {t("sidebar.help.title")}
                </h3>
              </div>
              <p className="mb-3 text-xs text-gray-600">
                {t("sidebar.help.description")}
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" size="sm">
                <HelpCircle className="mr-2 h-4 w-4" />
                {t("sidebar.help.button")}
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link href={`${basePath}/settings`}>
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-lg hover:bg-gray-100 transition-all duration-200 ${
                  isCollapsed ? "justify-center px-2" : ""
                }`}
                title={isCollapsed ? t("nav.settings") : undefined}
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-2">{t("nav.settings")}</span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className={`w-full justify-start rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${
                isCollapsed ? "justify-center px-2" : ""
              }`}
              onClick={logout}
              title={isCollapsed ? t("nav.logout") : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">{t("nav.logout")}</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Enhanced NavItem component
interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean | undefined;
  badge?: number;
  category: string;
  onlyFor?: string[];
}

function NavItem({ item, isCollapsed }: { item: NavItemProps; isCollapsed: boolean }) {
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md ${
        item.isActive 
          ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md border border-blue-200/50" 
          : "hover:text-gray-900"
      } ${isCollapsed ? "justify-center px-2" : ""}`}
      aria-current={item.isActive ? "page" : undefined}
      title={isCollapsed ? item.label : undefined}
    >
      <div className={`flex items-center justify-center rounded-lg p-1.5 transition-all duration-200 ${
        item.isActive 
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
          : "text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50"
      }`}>
        {item.icon}
      </div>
      {!isCollapsed && (
        <span className="flex-1 text-sm font-medium">{item.label}</span>
      )}
             {item.badge && !isCollapsed && (
         <Badge className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm">
           {item.badge}
         </Badge>
       )}
    </Link>
  );
}

// Enhanced Mobile menu button component
export function MobileMenuButton() {
  const { toggle } = useSidebar();
  const pathname = usePathname();
  const isAdminRoute = React.useMemo(() => {
    if (!pathname) return false;
    return /\/admin(\/|$)/.test(pathname);
  }, [pathname]);

  if (!isAdminRoute) return null;

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggle} 
      className="lg:hidden rounded-full p-2 hover:bg-gray-100 transition-all duration-200"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
