"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Building as BuildingIcon,
  CreditCard,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  User,
  User as UserIcon,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@acme/ui/sheet";

import { useAuth } from "~/hooks/use-auth";
import { FloatingNavbar } from "./FloatingNavbar";

export function AccountNavbar() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If we don't have a user, don't render the navbar
  if (!user) {
    return null;
  }

  // Floating nav items
  const navItems = [
    { name: t("home"), link: `/${locale}/`, icon: <Home /> },
    { name: t("favorites"), link: `/${locale}/favorites`, icon: <Heart /> },
    {
      name: t("listings"),
      link: `/${locale}/account/my-listings`,
      icon: <BuildingIcon />,
    },
    {
      name: t("messages"),
      link: `/${locale}/chat`,
      icon: <MessageCircle />,
    },
    {
      name: t("notifications"),
      link: `/${locale}/account/notifications`,
      icon: <Bell />,
    },
    { name: t("payments"), link: `/${locale}/payments`, icon: <CreditCard /> },
    {
      name: t("settings"),
      link: `/${locale}/account/settings`,
      icon: <Settings />,
    },
    {
      name: t("profile"),
      link: `/${locale}/account/profile`,
      icon: <UserIcon />,
    },
  ];

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U"; // Default fallback
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          {/* Logo and site title */}
          <div className="mr-4 flex items-center">
            <Link href={`/${locale}/`} className="flex items-center gap-2">
              <BuildingIcon className="h-6 w-6 text-primary" />
              <span className="hidden text-lg font-bold md:inline-block">
                {t("sitetitle")}
              </span>
            </Link>
          </div>

          {/* Right side items: profile */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
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
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <span className="w-fit rounded bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">
                    {user.role.toLowerCase()}
                  </span>
                </div>

                <div className="p-2">
                  <div className="grid grid-cols-1 gap-1">
                    <Link href={`/${locale}/profile`}>
                      <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                        <User className="mr-2 h-4 w-4" />
                        {t("profile")}
                      </DropdownMenuItem>
                    </Link>

                    <Link href={`/${locale}/favorites`}>
                      <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {t("favorites")}
                      </DropdownMenuItem>
                    </Link>

                    <Link href={`/${locale}/my-listings`}>
                      <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                        <BuildingIcon className="mr-2 h-4 w-4" />
                        {t("listings")}
                      </DropdownMenuItem>
                    </Link>

                    <Link href={`/${locale}/messages`}>
                      <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {t("messages")}
                      </DropdownMenuItem>
                    </Link>

                    <Link href={`/${locale}/notifications`}>
                      <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {t("notifications")}
                      </DropdownMenuItem>
                    </Link>

                    <Link href={`/${locale}/payments`}>
                      <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="2"
                            y="7"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                          />
                          <path d="M16 3h-1a2 2 0 0 0-2 2v2" />
                        </svg>
                        {t("payments")}
                      </DropdownMenuItem>
                    </Link>

                    <Link href={`/${locale}/settings`}>
                      <DropdownMenuItem className="h-9 cursor-pointer rounded-md focus:bg-accent">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.37a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.63 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 12 4.63V4a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        {t("settings")}
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="h-9 cursor-pointer rounded-md text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                      onClick={() => void handleLogout()}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoggingOut ? t("loggingOut") : t("logout")}
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-6 w-6 text-primary" />
                    <SheetTitle className="text-left">
                      {t("sitetitle")}
                    </SheetTitle>
                  </div>
                  <SheetClose asChild>
                    <DropdownMenuItem
                      onClick={() => void logout()}
                      className="text-red-500 focus:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </DropdownMenuItem>
                  </SheetClose>
                </SheetHeader>

                <div className="py-6">
                  {/* User profile info in mobile menu */}
                  <div className="mb-6 flex items-center">
                    <Avatar className="mr-3 h-12 w-12">
                      <AvatarImage
                        src={user.profileImageUrl || ""}
                        alt={user.username || ""}
                      />
                      <AvatarFallback className="bg-primary/10 text-lg text-primary">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile menu items */}
                  <div className="flex flex-col space-y-1">
                    <SheetClose asChild>
                      <Link href={`/${locale}/profile`}>
                        <Button
                          variant="ghost"
                          className="h-11 w-full justify-start px-4"
                        >
                          <User className="mr-3 h-5 w-5" />
                          {t("profile")}
                        </Button>
                      </Link>
                    </SheetClose>

                    {/* Logout button in mobile menu */}
                    <Button
                      variant="ghost"
                      className="h-11 w-full justify-start px-4 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                      onClick={() => void handleLogout()}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      {isLoggingOut ? t("loggingout") : t("logout")}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <FloatingNavbar navItems={navItems} />
    </>
  );
}

// Translation keys expected in your messages files (e.g. en.json):
// home, favorites, Properties, messages, notifications, payments, settings, profile, logout, loggingOut, siteTitle
