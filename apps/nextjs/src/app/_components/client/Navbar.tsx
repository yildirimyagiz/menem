"use client";

import React, { useState } from "react";
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
  Menu,
  MessageCircle,
  Settings,
  User,
  Users,
  Wallet,
  Warehouse,
  Wrench,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { useCurrency } from "~/context/CurrencyContext";
import { useLanguage } from "~/context/LanguageContext";
import { useSidebar } from "~/context/SidebarContext";
import { useAuth } from "~/hooks/use-auth";
import { useToast } from "~/hooks/use-toast";

// Define the structure for navigation items
type UserRole =
  | "ADMIN"
  | "PROPERTY_MANAGER"
  | "OWNER"
  | "TENANT"
  | "USER"
  | "SUPPORT";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onlyFor?: UserRole[];
  badge?: number;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { currentCurrency, setCurrency, currencies } = useCurrency();
  const { toast } = useToast();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();
  const [unreadMessageCount, setUnreadMessageCount] = useState(3);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(5);

  // If not authenticated, show minimal navbar with logo and login/signup buttons
  if (!user) {
    return (
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              <span className="hidden text-lg font-bold sm:inline-block">
                RentalProc
              </span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="default">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const basePath =
    user.role && ["ADMIN", "PROPERTY_MANAGER", "OWNER"].includes(user.role)
      ? "/admin"
      : "/client";

  const navItems: NavItem[] = [
    {
      href: `${basePath}`,
      label: t("nav.home"),
      icon: <Home className="mr-2 h-5 w-5" />,
      isActive: pathname === basePath || pathname === `${basePath}/`,
    },
    {
      href: `${basePath}/properties`,
      label: t("nav.properties"),
      icon: <Building className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/properties"),
    },
    {
      href: `${basePath}/tenants`,
      label: t("nav.tenants"),
      icon: <Users className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/tenants"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/payments`,
      label: t("nav.payments"),
      icon: <Wallet className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/payments"),
    },
    {
      href: `${basePath}/tasks`,
      label: t("nav.tasks"),
      icon: <Wrench className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/tasks"),
    },
    {
      href: `${basePath}/expenses`,
      label: "Expenses",
      icon: <CircleDollarSign className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/expenses"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/facilities`,
      label: "Facilities",
      icon: <Warehouse className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/facilities"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/messages`,
      label: t("nav.messages"),
      icon: <MessageCircle className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/messages"),
      badge: unreadMessageCount,
    },
    {
      href: `${basePath}/notifications`,
      label: t("nav.notifications"),
      icon: <Bell className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/notifications"),
      badge: unreadNotificationCount,
    },
    {
      href: `${basePath}/helpdesk`,
      label: t("nav.helpdesk"),
      icon: <HelpCircle className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/helpdesk"),
    },
    {
      href: `${basePath}/analytics`,
      label: t("nav.analytics"),
      icon: <BarChart4 className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/analytics"),
      onlyFor: ["ADMIN", "OWNER", "PROPERTY_MANAGER"] as UserRole[],
    },
    {
      href: `${basePath}/subscription`,
      label: "Subscription",
      icon: <CircleDollarSign className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/subscription"),
    },
    {
      href: `${basePath}/settings`,
      label: t("nav.settings"),
      icon: <Settings className="mr-2 h-5 w-5" />,
      isActive: pathname.includes("/settings"),
    },
  ].filter((item) => {
    if (!item.onlyFor) return true;
    if (!user.role) return false;
    return item.onlyFor.includes(user.role as UserRole);
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("auth.logoutSuccess"),
        description: t("auth.logoutMessage"),
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t("auth.logoutFailed"),
        description:
          error instanceof Error ? error.message : t("common.unknownError"),
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo and site title */}
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="hidden text-lg font-bold sm:inline-block">
              RentalProc
            </span>
          </Link>
        </div>

        {/* Desktop navigation - fixed width tabs */}
        <div className="hidden flex-1 overflow-x-auto px-2 py-1 lg:flex">
          <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 shadow-inner">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-[110px] flex-shrink-0"
              >
                <Button
                  variant={item.isActive ? "default" : "ghost"}
                  className={`h-10 w-full rounded-lg transition-colors ${
                    item.isActive
                      ? "border-0 bg-primary font-medium text-primary-foreground shadow-md"
                      : "border-0 hover:bg-muted/80"
                  }`}
                  size="sm"
                >
                  <div className="flex w-full items-center justify-start gap-2">
                    <div
                      className={`${item.isActive ? "text-primary-foreground" : "text-primary"}`}
                    >
                      {typeof item.icon === "object" &&
                      React.isValidElement(item.icon) ? (
                        React.cloneElement(item.icon as React.ReactElement, {
                          className: `h-4 w-4`,
                        })
                      ) : (
                        <div className="h-4 w-4">{item.icon}</div>
                      )}
                    </div>
                    <span
                      className={`truncate text-sm ${item.isActive ? "font-medium" : ""}`}
                    >
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto flex h-4 min-w-4 items-center justify-center p-0 text-[9px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Medium screen icons-only navigation */}
        <div className="hidden flex-1 overflow-x-auto px-2 py-1 md:flex lg:hidden">
          <div className="flex items-center justify-start gap-1 rounded-md bg-muted/50 px-2 py-1 shadow-inner">
            {navItems.slice(0, 7).map((item) => (
              <Link key={item.href} href={item.href} className="flex-shrink-0">
                <Button
                  variant={item.isActive ? "default" : "ghost"}
                  size="icon"
                  className={`h-9 w-9 rounded-full ${
                    item.isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted/80"
                  }`}
                >
                  <div className="relative">
                    {typeof item.icon === "object" &&
                    React.isValidElement(item.icon) ? (
                      React.cloneElement(item.icon as React.ReactElement, {
                        className: `h-4 w-4`,
                      })
                    ) : (
                      <div className="h-4 w-4">{item.icon}</div>
                    )}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center">
                        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-red-500 text-[8px] font-medium text-white">
                          {item.badge}
                        </span>
                      </span>
                    )}
                  </div>
                </Button>
              </Link>
            ))}
            {/* More dropdown for additional items on medium screens */}
            {navItems.length > 7 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navItems.slice(7).map((item) => (
                    <Link key={item.href} href={item.href} legacyBehavior>
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          {typeof item.icon === "object" &&
                          React.isValidElement(item.icon) ? (
                            React.cloneElement(
                              item.icon as React.ReactElement,
                              {
                                className: `h-4 w-4 ${item.isActive ? "text-primary" : ""}`,
                              },
                            )
                          ) : (
                            <div className="h-4 w-4">{item.icon}</div>
                          )}
                          <span className={item.isActive ? "font-medium" : ""}>
                            {item.label}
                          </span>
                          {item.badge && item.badge > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile menu trigger - only visible on small screens */}
        <Button
          variant="outline"
          size="icon"
          className="relative border-primary/20 bg-primary/5 transition-transform hover:bg-primary/10 active:scale-95 md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu className="h-5 w-5 text-primary" />
          <span className="sr-only">Open menu</span>
          {/* Subtle pulse effect to draw attention */}
          <span className="absolute inset-0 -z-10 animate-pulse rounded-md bg-primary/5"></span>
        </Button>

        {/* Right side items: notifications, language, profile */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full"
              >
                <span className="relative flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                        {unreadNotificationCount}
                      </span>
                    </span>
                  )}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-base font-semibold">
                {t("nav.notifications")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-auto px-1">
                {/* Example notification items */}
                <DropdownMenuItem className="flex cursor-pointer flex-col items-start rounded-md p-3 hover:bg-muted">
                  <div className="flex w-full items-start">
                    <div className="flex-1">
                      <p className="font-medium">
                        {t("notifications.paymentReceived")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        10 {t("common.minutesAgo")}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      New
                    </Badge>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <Link href="/notifications" className="w-full">
                <DropdownMenuItem className="cursor-pointer justify-center font-medium text-primary">
                  {t("nav.viewAll")}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full border-2 border-transparent p-0 hover:border-primary/20"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.profileImageUrl || ""}
                    alt={user.username || ""}
                  />
                  <AvatarFallback className="bg-primary/10 font-medium text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 overflow-hidden p-0"
            >
              <div className="flex flex-col gap-1 bg-muted/50 p-4">
                <span className="text-lg font-bold">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName || ""}`
                    : user.username || ""}
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.email || ""}
                </span>
                <span className="w-fit rounded bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">
                  {user.role?.toLowerCase() || ""}
                </span>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-1 gap-1">
                  <Link href={`${basePath}/profile`} legacyBehavior>
                    <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      {t("nav.profile")}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`${basePath}/settings`} legacyBehavior>
                    <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                      <Settings className="mr-2 h-4 w-4 text-primary" />
                      {t("nav.settings")}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="h-9 cursor-pointer rounded-md text-red-500 hover:text-red-600 focus:bg-accent"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Mobile navigation now managed by SidebarContext and Sidebar component */}
    </nav>
  );
}
