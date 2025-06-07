"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart4,
  Bell,
  Building,
  CircleDollarSign,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  Users,
  Wallet,
  Warehouse,
  Wrench,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";

import { useLanguage } from "~/context/LanguageContext";
import { useAuth } from "~/hooks/use-auth";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  // Example unread counts; replace with state if needed
  const unreadMessageCount = 4;
  const unreadNotificationCount = 5;

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
      icon: <Home className="mr-3 h-5 w-5" />,
      isActive: pathname === basePath || pathname === `${basePath}/`,
    },
    {
      href: `${basePath}/properties`,
      label: t("nav.properties"),
      icon: <Building className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/properties"),
    },
    {
      href: `${basePath}/tenants`,
      label: t("nav.tenants"),
      icon: <Users className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/tenants"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/payments`,
      label: t("nav.payments"),
      icon: <Wallet className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/payments"),
    },
    {
      href: `${basePath}/tasks`,
      label: t("nav.tasks"),
      icon: <Wrench className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/tasks"),
    },
    {
      href: `${basePath}/expenses`,
      label: t("nav.expenses"),
      icon: <CircleDollarSign className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/expenses"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/facilities`,
      label: t("nav.facilities"),
      icon: <Warehouse className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/facilities"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/messages`,
      label: t("nav.messages"),
      icon: <MessageCircle className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/messages"),
      badge: unreadMessageCount,
    },
    {
      href: `${basePath}/notifications`,
      label: t("nav.notifications"),
      icon: <Bell className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/notifications"),
      badge: unreadNotificationCount,
    },
    {
      href: `${basePath}/helpdesk`,
      label: t("nav.helpdesk"),
      icon: <HelpCircle className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/helpdesk"),
    },
    {
      href: `${basePath}/analytics`,
      label: t("nav.analytics"),
      icon: <BarChart4 className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/analytics"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/subscription`,
      label: t("nav.subscription"),
      icon: <CircleDollarSign className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/subscription"),
    },
    {
      href: `${basePath}/settings`,
      label: t("nav.settings"),
      icon: <Settings className="mr-3 h-5 w-5" />,
      isActive: pathname.includes("/settings"),
    },
  ].filter((item) => {
    if (!item.onlyFor) return true;
    if (!user?.role) return false;
    return item.onlyFor.includes(user.role as UserRole);
  });

  if (!user) return null;

  return (
    <aside className="hidden overflow-y-auto border-r border-gray-200 bg-white transition-all md:flex md:w-64 md:flex-col">
      {/* User Profile Section */}
      {user && (
        <div className="flex flex-col items-center gap-2 border-b border-gray-100 px-6 py-6">
          <Avatar className="h-14 w-14">
            {user.profileImageUrl && (
              <AvatarImage
                src={user.profileImageUrl}
                alt={getUserDisplayName}
              />
            )}
            <AvatarFallback>{getInitials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="text-base font-semibold text-gray-900">
              {getUserDisplayName}
            </div>
            <div className="max-w-[170px] truncate text-xs text-gray-500">
              {user.email}
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                item.isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge className="ml-auto" variant="destructive">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-md bg-blue-100 p-4">
          <h3 className="mb-2 text-sm font-medium text-blue-600">
            {t("sidebar.help.title")}
          </h3>
          <p className="mb-3 text-xs text-gray-500">
            {t("sidebar.help.description")}
          </p>
          <Button className="w-full">
            <HelpCircle className="mr-2 h-4 w-4" />
            {t("sidebar.help.button")}
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Link href={`${basePath}/settings`}>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              {t("nav.settings")}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-600"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("nav.logout")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
