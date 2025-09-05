"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
    BulbChargingIcon,
    FavouriteIcon,
    Idea01Icon,
    Logout01Icon,
    SettingsIcon,
    Task01Icon,
    UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { cn } from "~/lib/utils";
import Avatar from "~/shared/Avatar";
import { Divider } from "~/shared/divider";
import SwitchDarkMode2 from "~/shared/SwitchDarkMode2";
import type { User } from "~/utils/interfaces";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  className?: string;
}

const sizeClasses: Record<
  "sm" | "md" | "lg" | "xl",
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  import("~/shared/Avatar").AvatarProps["sizeClass"]
> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "w-12 h-12",
};

export default function UserAvatar({
  user,
  size = "md",
  showStatus = false,
  className,
}: UserAvatarProps) {
  const notifications = [
    {
      name:
        (user.displayName ?? user.name ?? user.username ?? user.email) ||
        "User",
      description: "You have a new notification.",
      time: "Just now",
      href: "#",
      avatar: user.profilePicture ?? user.image ?? "",
    },
  ];

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user.displayName) {
      return user.displayName.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getStatusColor = () => {
    if (!user.isActive) return "bg-gray-400";
    if (user.lastLogin) {
      const lastLogin = new Date(user.lastLogin);
      const now = new Date();
      const diffHours =
        (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

      if (diffHours < 1) return "bg-green-500"; // Online
      if (diffHours < 24) return "bg-yellow-500"; // Away
      return "bg-gray-400"; // Offline
    }
    return "bg-gray-400"; // Default offline
  };

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <Popover>
        <PopoverButton
          className={
            "focus-visible:outline-hidden relative flex cursor-pointer items-center justify-center rounded-full p-2.5 text-blue-700 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-300 dark:hover:text-blue-200 dark:hover:bg-blue-900/50"
          }
        >
          <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-blue-500"></span>
          <BellIcon className="h-6 w-6" />
        </PopoverButton>
        <PopoverPanel
          transition
          anchor={{
            to: "bottom end",
            gap: 16,
          }}
          className="w-sm data-closed:translate-y-1 data-closed:opacity-0 z-40 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out"
        >
          <div className="relative grid gap-8 bg-white p-7 dark:bg-neutral-800">
            <h3 className="text-xl font-semibold">Notifications</h3>
            {notifications.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="focus:outline-hidden focus-visible:ring-3 relative -m-3 flex rounded-lg p-2 pe-8 transition duration-150 ease-in-out hover:bg-gray-100 focus-visible:ring-orange-500/50 dark:hover:bg-gray-700"
              >
                <Avatar
                  imgUrl={item.avatar}
                  userName={item.name}
                  sizeClass="w-8 h-8 sm:h-11 sm:w-11"
                />
                <div className="ms-3 space-y-1 sm:ms-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">
                    {item.time}
                  </p>
                </div>
                <span className="absolute end-1 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-blue-500"></span>
              </Link>
            ))}
          </div>
        </PopoverPanel>
      </Popover>
      <Popover>
        <PopoverButton className="focus-visible:outline-hidden flex cursor-pointer items-center justify-center rounded-full p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/50">
          <Avatar
            imgUrl={user.profilePicture ?? user.image ?? ""}
            userName={
              (user.displayName ?? user.name ?? user.username ?? user.email) ||
              "User"
            }
            sizeClass={sizeClasses[size]}
          />
          {showStatus && (
            <span
              className={cn(
                "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
                getStatusColor(),
              )}
            />
          )}
        </PopoverButton>
        <PopoverPanel
          transition
          anchor={{ to: "bottom end", gap: 16 }}
          className="data-closed:translate-y-1 data-closed:opacity-0 z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out"
        >
          <div className="relative grid grid-cols-1 gap-6 bg-white px-6 py-7 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <Avatar
                imgUrl={user.profilePicture ?? user.image ?? ""}
                userName={
                  (user.displayName ??
                    user.name ??
                    user.username ??
                    user.email) ||
                  "User"
                }
                sizeClass={sizeClasses.xl}
              />
              <div className="grow">
                <h4 className="font-semibold">
                  {(user.displayName ??
                    user.name ??
                    user.username ??
                    user.email) ||
                    "User"}
                </h4>
                <p className="mt-0.5 text-xs">
                  {user.Location?.city ??
                    user.timezone ??
                    user.locationId ??
                    "-"}
                </p>
              </div>
            </div>
            <Divider />
            <Link
              href={"/admin/profile"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Profile</p>
            </Link>
            <Link
              href={"/client/my-listings"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">My Listings</p>
            </Link>
            <Link
              href={"/client/chat"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon
                  icon={BulbChargingIcon}
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <p className="ms-4 text-sm font-medium">Messages</p>
            </Link>
            <Link
              href={"/client/favorites"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <p className="ms-4 text-sm font-medium">Favorites</p>
            </Link>
            <Link
              href={"/client/notification"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Notifications</p>
            </Link>
            <Link
              href={"/client/settings"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon
                  icon={SettingsIcon}
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <p className="ms-4 text-sm font-medium">Settings</p>
            </Link>
            <div className="-m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon
                    icon={Idea01Icon}
                    size={24}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="ms-4 text-sm font-medium">Dark theme</p>
              </div>
              <SwitchDarkMode2 />
            </div>
            <Link
              href={"/client/help"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon
                  icon={BulbChargingIcon}
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <p className="ms-4 text-sm font-medium">Help</p>
            </Link>
            <Link
              href={"/logout"}
              className="focus:outline-hidden focus-visible:ring-3 -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon
                  icon={Logout01Icon}
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <p className="ms-4 text-sm font-medium">Log out</p>
            </Link>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  );
}
