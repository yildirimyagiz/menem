"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  Database,
  FileText,
  HelpCircle,
  Info,
  LogOut,
  Settings,
  Shield,
  User as UserIcon,
  Users,
} from "lucide-react";

import { cn } from "@reservatior/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";

import { useAuth } from "~/hooks/use-auth";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void | Promise<void>;
  isDanger?: boolean;
  divider?: boolean;
  badge?: number;
}

export function AdminAvatarDropdown() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: "Admin Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/dashboard");
        setIsOpen(false);
      },
    },
    {
      label: "User Management",
      icon: <Users className="h-4 w-4" />,
      badge: 5,
      onClick: () => {
        router.push("/admin/users");
        setIsOpen(false);
      },
    },
    {
      label: "Agency Management",
      icon: <Building2 className="h-4 w-4" />,
      badge: 3,
      onClick: () => {
        router.push("/admin/agencies");
        setIsOpen(false);
      },
    },
    {
      label: "Reports & Analytics",
      icon: <Activity className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/analytics");
        setIsOpen(false);
      },
    },
    {
      label: "System Logs",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/logs");
        setIsOpen(false);
      },
    },
    {
      label: "Database Management",
      icon: <Database className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/database");
        setIsOpen(false);
      },
    },
    {
      divider: true,
      label: "",
      icon: undefined,
    },
    {
      label: "Profile",
      icon: <UserIcon className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/profile");
        setIsOpen(false);
      },
    },
    {
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      badge: 8,
      onClick: () => {
        router.push("/admin/notifications");
        setIsOpen(false);
      },
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/settings");
        setIsOpen(false);
      },
    },
    {
      label: "Help & Support",
      icon: <HelpCircle className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/help");
        setIsOpen(false);
      },
    },
    {
      label: "About",
      icon: <Info className="h-4 w-4" />,
      onClick: () => {
        router.push("/admin/about");
        setIsOpen(false);
      },
    },
    {
      divider: true,
      label: "",
      icon: undefined,
    },
    {
      label: "Logout",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
      isDanger: true,
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      const dropdownMenu = document.getElementById("admin-dropdown-menu");
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        dropdownMenu &&
        !dropdownMenu.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen]);

  if (!user || isLoading) return null;

  // Get display name with fallbacks
  const displayName = (user.name ?? user.username) || user.email || "Admin";

  // Get image with fallbacks
  const userImage = user.profileImageUrl || user.image || undefined;

  // Get user role
  const userRole = user.role || "ADMIN";

  // Generate avatar fallback
  const getAvatarFallback = () => {
    if (
      user.firstName &&
      user.lastName &&
      user.firstName[0] &&
      user.lastName[0]
    ) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name?.[0]) {
      return user.name[0].toUpperCase();
    }
    if (user.username?.[0]) {
      return user.username[0].toUpperCase();
    }
    if (user.email?.[0]) {
      return user.email[0].toUpperCase();
    }
    return "A";
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Admin menu"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={userImage} alt={displayName} />
          <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
        </Avatar>
        <div className="hidden flex-col items-start md:flex">
          <span className="text-sm font-medium text-foreground">
            {displayName}
          </span>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-xs text-purple-800"
          >
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="admin-dropdown-menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-[9999] mt-2 w-72 origin-top-right rounded-md bg-popover p-1 shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info Header */}
            <div className="border-b border-border px-3 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userImage} alt={displayName} />
                  <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                  <Badge
                    variant="secondary"
                    className="mt-1 w-fit bg-purple-100 text-xs text-purple-800"
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    Administrator
                  </Badge>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => {
                if (item.divider) {
                  return (
                    <div
                      key={`divider-${index}`}
                      className="my-1 border-t border-border"
                    />
                  );
                }

                const isProcessing = item.label === "Logout" && isLoggingOut;

                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    disabled={isProcessing}
                    className={cn(
                      "flex w-full items-center rounded px-4 py-2 text-sm",
                      item.isDanger
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-foreground hover:bg-accent",
                      isProcessing && "opacity-70",
                    )}
                    tabIndex={-1}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {isProcessing && (
                      <span className="ml-auto h-2 w-2 animate-ping rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
