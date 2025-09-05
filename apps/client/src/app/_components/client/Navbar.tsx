"use client";

import { motion } from "framer-motion";
import {
  Building,
  HelpCircle,
  Home,
  MessageCircle,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";


import { Button } from "@reservatior/ui/button";


import { useAuth } from "~/hooks/use-auth";
import UserAvatar from "../../../components/ui/UserAvatar";
import CurrLangDropdown from "./CurrLangDropdown";

// Define the structure for navigation items


interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

// Spotlight component extracted for clarity
const Spotlight = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          opacity,
        }}
      />
      {children}
    </div>
  );
};

// Unauthenticated Navbar extracted - Apartments.com Style
const UnauthNavbar = () => (
  <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="hidden md:flex sticky top-0 z-40 w-full border-b border-blue-200/50 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-blue-800/50 dark:bg-blue-950/90"
  >
    <div className="container flex h-16 items-center px-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mr-4 flex items-center"
      >
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative">
            <Building className="h-6 w-6 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="hidden bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-lg font-bold text-transparent sm:inline-block">
            Reservatior
          </span>
        </Link>
      </motion.div>

      {/* Search Bar - Apartments.com Style */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-8 max-w-md flex-1"
      >
        <div className="relative">

        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="ml-auto flex items-center gap-2"
      >
        <Link href="/auth/login">
          <Button
            variant="ghost"
            className="rounded-xl text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            Login
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl">
            Sign Up
          </Button>
        </Link>
      </motion.div>
    </div>
  </motion.nav>
);

export default function Navbar() {
  const { user } = useAuth();
  // const { isMobileOpen, setIsMobileOpen } = useSidebar(); // Removed unused
  const pathname = usePathname();


  // Only render Navbar on md+ screens
  // Render nothing on mobile/tablet (smaller than md)
  // This ensures Navbar never appears on mobile/tablet
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return null;
  }

  if (!user) {
    return <UnauthNavbar />;
  }

  const navItems: NavItem[] = [
    {
      href: "/client/property",
      label: "Listings",
      icon: <Home className="h-5 w-5" />,
      isActive: pathname?.startsWith("/client/property") ?? false,
    },
    {
      href: "/client/agents",
      label: "Agents",
      icon: <Users className="h-5 w-5" /  >,
      isActive: pathname?.startsWith("/client/agents") ?? false,
    },
    {
      href: "/client/agencies",
      label: "Agencies",
      icon: <Building className="h-5 w-5" />,
      isActive: pathname?.startsWith("/client/agencies") ?? false,
    },
    {
      href: "/client/facility",
      label: "Facilities",
      icon: <Warehouse className="h-5 w-5" />,
      isActive: pathname?.startsWith("/client/facility") ?? false,
    },
    {
      href: "/client/about",
      label: "About",
      icon: <HelpCircle className="h-5 w-5" />,
      isActive: pathname?.startsWith("/client/about") ?? false,
    },
    {
      href: "/client/contact",
      label: "Contact",
      icon: <MessageCircle className="h-5 w-5" />,
      isActive: pathname?.startsWith("/client/contact") ?? false,
    },
  ]

  const languageMeta = [
    { id: "en", code: "en", name: "English", nativeName: "English" },
    { id: "tr", code: "tr", name: "Turkish", nativeName: "Türkçe" },
    { id: "zh", code: "zh", name: "Chinese", nativeName: "中文" },
    { id: "es", code: "es", name: "Spanish", nativeName: "Español" },
    { id: "ar", code: "ar", name: "Arabic", nativeName: "العربية" },
    { id: "hi", code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { id: "fr", code: "fr", name: "French", nativeName: "Français" },
    { id: "fa", code: "fa", name: "Persian", nativeName: "فارسی" },
    { id: "de", code: "de", name: "German", nativeName: "Deutsch" },
    { id: "ja", code: "ja", name: "Japanese", nativeName: "日本語" },
    { id: "it", code: "it", name: "Italian", nativeName: "Italiano" },
    { id: "ru", code: "ru", name: "Russian", nativeName: "Русский" },
    { id: "th", code: "th", name: "Thai", nativeName: "ไทย" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden md:flex sticky top-0 z-40 w-full border-b border-blue-200/50 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-blue-800/50 dark:bg-blue-950/90"
    >
      <div className="container flex h-16 items-center px-4">
        {/* Logo (left) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center"
        >
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <Building className="h-6 w-6 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <span className="hidden bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-lg font-bold text-transparent sm:inline-block">
              Reservatior
            </span>
          </Link>
        </motion.div>

        {/* Centered navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-1 justify-center"
        >
          <div className="flex items-center gap-1 rounded-2xl bg-gradient-to-r from-blue-50/50 to-blue-100/50 px-3 py-2 shadow-lg backdrop-blur-sm dark:from-blue-900/50 dark:to-blue-800/50">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="w-[110px] flex-shrink-0"
              >
                <Link href={item.href}>
                  <Spotlight className="w-full">
                    <Button
                      variant={item.isActive ? "default" : "ghost"}
                      className={`h-10 w-full rounded-xl transition-all duration-300 ${
                        item.isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                          : "border-0 text-blue-700 hover:bg-blue-100/80 dark:text-blue-300 dark:hover:bg-blue-800/80"
                      }`}
                      size="sm"
                    >
                      <div className="flex w-full items-center justify-start gap-2">
                        <div
                          className={`${
                            item.isActive
                              ? "text-white"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {typeof item.icon === "object" &&
                          React.isValidElement(item.icon) ? (
                            React.cloneElement(
                              item.icon as React.ReactElement,
                              {
                                className: `h-4 w-4`,
                              },
                            )
                          ) : (
                            <div className="h-4 w-4">{item.icon}</div>
                          )}
                        </div>
                        <span
                          className={`truncate text-sm ${
                            item.isActive ? "font-medium" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                        
                      </div>
                    </Button>
                  </Spotlight>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User/profile actions (right) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="ml-auto flex items-center gap-1 sm:gap-2"
        >
          <CurrLangDropdown
            languages={languageMeta}
            currencies={[]}
            aria-label="Select language"
          />
          
          <UserAvatar
            user={{
              id: user.id,
                email: user.email ?? "",
                username: user.username || "",
                displayName: user.name ?? "",
                name: user.name ?? "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phoneNumber: null,
                profilePicture: user.profileImageUrl || "",
                image: user.image ?? "",
                role: user.role ?? "USER",
                type: "EMAIL",
                isActive: true,
                lastLogin: new Date(),
                emailVerified: new Date(),
                responseTime: new Date().toISOString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: new Date(),
                locale: "en",
                timezone: "UTC",
                preferences: {},
                agencyId: null,
                status: "ACTIVE",
                ticketsCreated: [],
                ticketsAssigned: [],
                Account: [],
                Analytics: [],
                CommunicationLog: [],
                Hashtag: [],
                MentionsByUser: [],
                MentionsToUser: [],
                MentionsGenericUser: [],
                createdEvents: [],
                attendingEvents: [],
                Subscription: [],
                Notification: [],
                Offer: [],
                Photo: [],
                Post: [],
                Reservation: [],
                Review: [],
                Session: [],
                TasksAssigned: [],
                TasksCreated: [],
                Tenant: null,
                Agency: null,
                OwnedAgencies: [],
                Permission: [],
                OwnedProperties: [],
                ListedProperties: [],
                PurchasedProperties: [],
                Facility: null,
                facilityId: null,
                IncludedService: null,
                includedServiceId: null,
                ExtraCharge: null,
                extraChargeId: null,
                Agent: [],
                Location: null,
                locationId: null,
                Favorite: [],
                Report: [],
                lastSeen: null,
                isOnline: false,
                currencyId: null,
              }}
            />
          
        </motion.div>
      </div>
      {/* Mobile navigation now managed by SidebarContext and Sidebar component */}
    </motion.nav>
  );
}
