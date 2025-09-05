"use client";

import {
    BarChart3,
    Bell,
    Building2,
    FileCheck,
    FileText,
    Heart,
    HelpCircle,
    Home,
    MapPin,
    MessageSquare,
    PanelLeft,
    PanelLeftClose,
    Receipt,
    Settings,
    Shield,
    Users,
    Wallet,
    Wrench
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Button } from "@reservatior/ui/button";
import { cn } from "@reservatior/ui/lib/utils";
import { ScrollArea } from "@reservatior/ui/scroll-area";
import { Separator } from "@reservatior/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@reservatior/ui/tooltip";

import { useSidebar } from "~/context/SidebarContext";
import { useAuth } from "~/hooks/use-auth";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  AGENCY = "AGENCY",
  AGENCY_ADMIN = "AGENCY_ADMIN",
  AGENT_ADMIN = "AGENT_ADMIN",
  AGENT = "AGENT",
  SELLER = "SELLER",
  BUYER = "BUYER",
  GUEST = "GUEST",
  TENANT = "TENANT",
  MODERATOR = "MODERATOR",
  FACILITY_MANAGER = "FACILITY_MANAGER",
}

type NavCategory =
  | "dashboard"
  | "properties"
  | "communication"
  | "financial"
  | "admin"
  | "support";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onlyFor?: Role[];
  badge?: number;
  category: NavCategory;
  description?: string;
}

// Utility to check if a nav item is active
const isActiveLink = (currentPath: string, href: string) => {
  // Handle root path activation specifically for dashboard
  if (href === "/" && currentPath === "/") return true;
  // Handle other links
  if (href !== "/" && currentPath.startsWith(href)) return true;
  return false;
};

type Platform = "android" | "ios" | "web";

interface RoleSidebarProps {
  platform?: Platform;
}

export default function RoleSidebar({ platform = "web" }: RoleSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();

  if (!user) return null;
  const userRole: Role = Object.values(Role).includes(
    (user?.role ?? "") as Role,
  )
    ? ((user?.role ?? "") as Role)
    : Role.GUEST;

  // Platform-specific styling
  const getPlatformStyles = () => {
    if (platform === "ios") {
      return {
        // iOS-specific styles
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        WebkitOverflowScrolling: "touch" as const,
      };
    } else if (platform === "android") {
      return {
        // Android-specific styles
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      };
    }
    return {};
  };

  // Platform-specific sidebar width
  const getSidebarWidth = () => {
    if (platform === "ios") {
      return isCollapsed ? "w-20" : "w-64"; // iOS: standard width
    } else if (platform === "android") {
      return isCollapsed ? "w-16" : "w-60"; // Android: slightly narrower
    }
    return isCollapsed ? "w-20" : "w-64"; // Web: standard width
  };

  // Platform-specific classes
  const getPlatformClasses = () => {
    const baseClasses =
      "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ease-in-out";

    if (platform === "ios") {
      return `${baseClasses} ios-sidebar`;
    } else if (platform === "android") {
      return `${baseClasses} android-sidebar`;
    }

    return baseClasses;
  };

  // Define nav items based on the desired structure
  const allNavItems: NavItem[] = [
    // Dashboard
    {
      href: "/",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/"),
      category: "dashboard",
      description: "Overview and analytics",
    },

    // Properties
    {
      href: "/properties",
      label: "Properties",
      icon: <Building2 className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/properties"),
      category: "properties",
      description: "Manage your properties",
    },
    {
      href: "/client/property-listings/listing-real-estate",
      label: "Listings",
      icon: <MapPin className="h-5 w-5" />,
      isActive: isActiveLink(
        pathname,
        "/client/property-listings/listing-real-estate",
      ),
      category: "properties",
      description: "Property listings",
    },
    {
      href: "/client/property-listings/listing-real-estate-map",
      label: "Map View",
      icon: <MapPin className="h-5 w-5" />,
      isActive: isActiveLink(
        pathname,
        "/client/property-listings/listing-real-estate-map",
      ),
      category: "properties",
      description: "Property listings on map",
    },
    {
      href: "/properties/favorites",
      label: "Favorites",
      icon: <Heart className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/properties/favorites"),
      category: "properties",
      description: "Saved properties",
    },

    // Communication
    {
      href: "/chat",
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/chat"),
      category: "communication",
      description: "Chat with tenants and agents",
      badge: 3,
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/notifications"),
      category: "communication",
      description: "System notifications",
      badge: 2,
    },

    // Financial
    {
      href: "/payments",
      label: "Payments",
      icon: <Wallet className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/payments"),
      category: "financial",
      description: "Payment management",
    },
    {
      href: "/expenses",
      label: "Expenses",
      icon: <Receipt className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/expenses"),
      category: "financial",
      description: "Track expenses",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.FACILITY_MANAGER,
      ],
    },
    {
      href: "/tax-records",
      label: "Tax Records",
      icon: <FileCheck className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/tax-records"),
      category: "financial",
      description: "Tax documentation",
    },

    // Admin
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/admin/users"),
      category: "admin",
      description: "User management",
      onlyFor: [Role.ADMIN, Role.SUPER_ADMIN],
    },
    {
      href: "/admin/agencies",
      label: "Agencies",
      icon: <Building2 className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/admin/agencies"),
      category: "admin",
      description: "Agency management",
      onlyFor: [Role.ADMIN, Role.SUPER_ADMIN],
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/admin/analytics"),
      category: "admin",
      description: "Analytics dashboard",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
        Role.FACILITY_MANAGER,
      ],
    },
    {
      href: "/admin/reports",
      label: "Reports",
      icon: <FileText className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/admin/reports"),
      category: "admin",
      description: "Generate reports",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
        Role.FACILITY_MANAGER,
      ],
    },
    {
      href: "/admin/compliance",
      label: "Compliance",
      icon: <Shield className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/admin/compliance"),
      category: "admin",
      description: "Compliance management",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
      ],
    },
    {
      href: "/admin/facilities",
      label: "Facilities",
      icon: <Wrench className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/admin/facilities"),
      category: "admin",
      description: "Facility management",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
        Role.FACILITY_MANAGER,
      ],
    },

    // Support
    {
      href: "/help",
      label: "Help",
      icon: <HelpCircle className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/help"),
      category: "support",
      description: "Help center",
    },
    {
      href: "/support",
      label: "Support",
      icon: <Shield className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/support"),
      category: "support",
      description: "Contact support",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: isActiveLink(pathname, "/settings"),
      category: "support",
      description: "Account settings",
    },
  ];

  // Filter nav items by role
  const filteredNavItems = allNavItems.filter(
    (item) => !item.onlyFor || item.onlyFor.includes(userRole),
  );

  // Group by category
  const categories: Record<NavCategory, NavItem[]> = {
    dashboard: [],
    properties: [],
    communication: [],
    financial: [],
    admin: [],
    support: [],
  };
  filteredNavItems.forEach((item) => categories[item.category].push(item));

  // Handle nav click - close mobile sidebar on item click
  const handleNavClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Sidebar classes for toggling
  const sidebarClass = cn(
    getPlatformClasses(),
    getSidebarWidth(),
    isMobileOpen ? "translate-x-0" : "-translate-x-full",
    "md:w-64 md:translate-x-0 lg:sticky lg:w-auto",
    isCollapsed && "lg:w-20",
  );

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
      <aside className={sidebarClass} style={getPlatformStyles()}>
        {/* Header area */}
        <div className="flex h-16 shrink-0 items-center px-4">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Reservatior</span>
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
            {isCollapsed ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {/* Dashboard */}
            {categories.dashboard.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                handleNavClick={handleNavClick}
              />
            ))}

            {/* Properties */}
            {categories.properties.length > 0 && (
              <>
                {!isCollapsed && (
                  <p className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                    Properties
                  </p>
                )}
                {categories.properties.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    handleNavClick={handleNavClick}
                  />
                ))}
                {!isCollapsed && <Separator className="my-2" />}
              </>
            )}

            {/* Communication */}
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
                {!isCollapsed && <Separator className="my-2" />}
              </>
            )}

            {/* Financial */}
            {categories.financial.length > 0 && (
              <>
                {!isCollapsed && (
                  <p className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                    Financial
                  </p>
                )}
                {categories.financial.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    handleNavClick={handleNavClick}
                  />
                ))}
                {!isCollapsed && <Separator className="my-2" />}
              </>
            )}

            {/* Admin */}
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
                {!isCollapsed && <Separator className="my-2" />}
              </>
            )}

            {/* Support */}
            {categories.support.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                handleNavClick={handleNavClick}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
              <AvatarFallback>
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
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
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{navItem}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{item.label}</span>
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
