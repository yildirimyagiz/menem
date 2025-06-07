"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";

import { cn } from "@acme/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";

import { useAuth } from "~/hooks/use-auth";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void | Promise<void>;
  isDanger?: boolean;
  divider?: boolean;
}

export function UserAvatarDropdown() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      icon: <UserIcon className="h-4 w-4" />,
      onClick: () => {
        router.push("/profile");
        setIsOpen(false);
      },
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => {
        router.push("/settings");
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
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        !document.getElementById("dropdown-menu")?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  if (!user || isLoading) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User menu"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.image ?? user.profileImageUrl ?? undefined}
            alt={
              user.username ??
              user.name ??
              user.email ??
              user.firstName ??
              user.lastName ??
              undefined
            }
          />
          <AvatarFallback>
            {(() => {
              if (
                user.firstName &&
                user.lastName &&
                user.firstName[0] &&
                user.lastName[0]
              )
                return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
              if (user.username?.[0])
                return user.username[0].toUpperCase();
              if (user.name?.[0]) return user.name[0].toUpperCase();
              if (user.username?.[0]) return user.username[0].toUpperCase();
              if (user.email?.[0]) return user.email[0].toUpperCase();
              return "U";
            })()}
          </AvatarFallback>
        </Avatar>
        <span className="hidden font-medium text-foreground md:inline">
          {user.name}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="dropdown-menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-[9999] mt-2 w-56 origin-top-right rounded-md bg-popover p-1 shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none"
            onKeyDown={handleKeyDown}
            role="menu"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
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
                    role="menuitem"
                    tabIndex={-1}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
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
