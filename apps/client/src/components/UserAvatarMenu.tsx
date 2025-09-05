import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import {
  Bell,
  ClipboardList,
  Heart,
  HelpCircle,
  LogOut,
  Moon,
  Settings as SettingsIcon,
  Sun,
  User,
} from "lucide-react";

import { useAuth } from "~/hooks/use-auth";

export function UserAvatarMenu() {
  const { user, logout } = useAuth();

  // Avatar and user info fallbacks
  const displayName =
    (user && (user as any).displayName) ||
    user?.name ||
    user?.username ||
    user?.email ||
    "User";
  const email = user?.email || "";
  const role = user?.role || "USER";
  // Use locationId as a fallback for location
  const location =
    (user &&
      ((user as any).location ||
        (user as any).city ||
        (user as any).timezone ||
        (user as any).locationId)) ||
    "";
  // Use image as fallback for avatar
  const avatarUrl =
    (user &&
      ((user as any).profilePicture ??
        (user as any).profileImageUrl ??
        user.image)) ??
    undefined;
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (
          displayName
            .split(" ")
            .map((n: string) => n[0])
            .join("") ?? "U"
        ).toUpperCase();

  // Notification badge
  const notifications = (user && (user as any).Notification) ?? [];
  const unreadNotifications = Array.isArray(notifications)
    ? notifications.filter((n: any) => !n.read).length
    : 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="flex flex-col items-center gap-2 px-6 pb-3 pt-6">
          <Avatar className="h-14 w-14">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="text-lg font-semibold">{displayName}</div>
            {email && (
              <div className="text-xs text-muted-foreground">{email}</div>
            )}
            {role && (
              <Badge variant="secondary" className="mt-1 w-fit text-xs">
                {role.replace(/_/g, " ")}
              </Badge>
            )}
            {location && (
              <div className="text-sm text-muted-foreground">{location}</div>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-3 h-5 w-5" /> My Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ClipboardList className="mr-3 h-5 w-5" /> My Listings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Heart className="mr-3 h-5 w-5" /> Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex w-full items-center">
            <Bell className="mr-3 h-5 w-5" /> Notifications
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="ml-auto h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon className="mr-3 h-5 w-5" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-3 h-5 w-5" /> Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-3 h-5 w-5" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
