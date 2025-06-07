"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  Home,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Settings,
} from "lucide-react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { ScrollArea } from "@acme/ui/scroll-area";
import { Separator } from "@acme/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import { useSidebar } from "~/context/SidebarContext";
import { useAuth } from "~/hooks/use-auth";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  AGENCY = "AGENCY",
  AGENT = "AGENT",
  SELLER = "SELLER",
  BUYER = "BUYER",
  GUEST = "GUEST",
  TENANT = "TENANT",
  OWNER = "OWNER",
}

type NavCategory = "dashboard" | "communication" | "admin";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onlyFor?: Role[];
  badge?: number;
  category: NavCategory;
}

// Utility to check if a nav item is active
const isActiveLink = (currentPath: string, href: string) => {
  // Handle root path activation specifically for dashboard
  if (href === "/" && currentPath === "/") return true;
  // Handle other links
  if (href !== "/" && currentPath.startsWith(href)) return true;
  return false;
};

export default function RoleSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();

  if (!user) return null;
  // const userRole: Role = user.role as Role; // userRole might be needed for filtering later if roles are reintroduced

  // Define nav items based on the desired structure
  const allNavItems: NavItem[] = [
    {
      href: "/", // Link root to dashboard
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/"),
      category: "dashboard",
    },
    {
      href: "/chat", // Assuming '/chat' is the messages page
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/chat"),
      badge: 3, // Placeholder badge count
      category: "communication",
    },
    {
      href: "/notifications", // Assuming '/notifications' is the notifications page
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/notifications"),
      badge: 2, // Placeholder badge count
      category: "communication",
    },
    {
      href: "/settings", // Assuming '/settings' is the settings page
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/settings"),
      category: "admin",
    },
    // Add other items like Help Desk, Subscription if they have dedicated pages
    // {
    //   href: "/helpdesk",
    //   label: "Help Desk",
    //   icon: <HelpCircle className="h-5 w-5" />,
    //   isActive: isActiveLink(pathname, "/helpdesk"),
    //   category: "admin", // Or a new 'support' category
    // },
    // {
    //   href: "/subscription",
    //   label: "Subscription",
    //   icon: <CreditCard className="h-5 w-5" />,
    //   isActive: isActiveLink(pathname, "/subscription"),
    //   category: "admin", // Or a new 'account' category
    // },
  ];

  // Since we are simplifying, we can directly use allNavItems or filter by a basic role if needed
  const filteredNavItems = allNavItems; // No role filtering for now based on the request

  // Group by category
  const categories: Record<NavCategory, NavItem[]> = {
    dashboard: [],
    communication: [],
    admin: [],
  };
  filteredNavItems.forEach((item) => categories[item.category].push(item));

  // Handle nav click - close mobile sidebar on item click
  const handleNavClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    // Optionally save collapsed state, but not mobile open state here
    // localStorage.setItem(
    //   "sidebarState",
    //   JSON.stringify({
    //     isCollapsed,
    //     // Do NOT save isMobileOpen here, always default to false on load
    //   }),
    // );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64", // Adjust width based on collapsed state
          isMobileOpen ? "translate-x-0" : "-translate-x-full", // Show/hide based on mobile state
          "md:w-64 md:translate-x-0 lg:sticky lg:w-auto", // Keep md sidebar open/wider, lg sticky/auto width
          // Further adjust lg width if needed, e.g., lg:w-72 or keep it flexible based on collapsed state lg:w-${isCollapsed ? '20' : '64'}
          // Note: For true responsive width on large screens based on collapsed state, you might need dynamic classes or inline styles.
          // The current lg:w-auto will make it fit content or rely on parent flex.
          isCollapsed && "lg:w-20",
        )}
      >
        {/* Header area, adjust spacing if needed */}
        <div className="flex h-16 shrink-0 items-center px-4">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              {/* Replace with your logo or site title */}
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">RentalProc</span>
            </Link>
          )}
          {/* Toggle button for large screens */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "ml-auto hidden lg:flex",
              isCollapsed && "w-full justify-center",
            )}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? ( // Use PanelLeftClose for collapsed to indicate it expands
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              // Use PanelLeft for expanded to indicate it collapses
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {/* Render Dashboard item */}
            {categories.dashboard.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                handleNavClick={handleNavClick}
              />
            ))}
            {categories.dashboard.length > 0 &&
              (categories.communication.length > 0 ||
                categories.admin.length > 0) &&
              !isCollapsed && <Separator className="my-2" />}
            {/* Render Communication category and items */}
            {categories.communication.length > 0 && (
              <>
                {!isCollapsed && (
                  <p className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                    Communication
                  </p>
                )}
                {categories.communication.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    handleNavClick={handleNavClick}
                  />
                ))}
                {categories.admin.length > 0 && !isCollapsed && (
                  <Separator className="my-2" />
                )}
              </>
            )}
            {/* Render Admin category and items */}
            {categories.admin.length > 0 && (
              <>
                {!isCollapsed && (
                  <p className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                    Admin
                  </p>
                )}
                {categories.admin.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    handleNavClick={handleNavClick}
                  />
                ))}
              </>
            )}
            {/* Add Sign out or other bottom items here if needed */}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  handleNavClick: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isCollapsed,
  handleNavClick,
}) => {
  const navItem = (
    <Link
      href={item.href}
      onClick={handleNavClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        item.isActive
          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          : "hover:bg-accent hover:text-accent-foreground",
        isCollapsed && "justify-center px-2",
      )}
    >
      {item.icon}
      {!isCollapsed && <span>{item.label}</span>}
      {!isCollapsed && item.badge && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {item.badge}
        </span>
      )}
      {/* Removed the extra ChevronRight for active state when not collapsed to simplify */}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{navItem}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return navItem;
};
