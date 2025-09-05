"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useSidebar } from "~/context/SidebarContext";
import { MobileMenu } from "../client/MobileMenu";
import RoleSidebar from "../client/RoleSidebar";

type Platform = "android" | "ios" | "web";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const t = useTranslations();
  const [platform, setPlatform] = useState<Platform>("web");

  // Detect platform
  useEffect(() => {
    const detectPlatform = () => {
      const isCapacitor =
        typeof window !== "undefined" && (window as any).Capacitor;

      if (isCapacitor) {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("android")) {
          setPlatform("android");
        } else if (
          userAgent.includes("iphone") ||
          userAgent.includes("ipad") ||
          userAgent.includes("ipod")
        ) {
          setPlatform("ios");
        } else {
          setPlatform("web");
        }
      } else {
        setPlatform("web");
      }
    };

    detectPlatform();
  }, []);

  // Platform-specific main content padding
  const getMainContentPadding = () => {
    if (platform === "ios") {
      return "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20"; // iOS: extra bottom padding for home indicator
    } else if (platform === "android") {
      return "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-16"; // Android: standard padding
    }
    return "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"; // Web: standard padding
  };

  // Platform-specific container classes
  const getContainerClasses = () => {
    const baseClasses = "flex min-h-screen flex-col";

    if (platform === "ios") {
      return `${baseClasses} ios-dashboard-layout`;
    } else if (platform === "android") {
      return `${baseClasses} android-dashboard-layout`;
    }

    return baseClasses;
  };

  return (
    <div className={getContainerClasses()}>
      <div className="flex flex-1">
        {/* Sidebar for larger screens */}
        <RoleSidebar platform={platform} />

        {/* Main Content Area - takes remaining width */}
        <main className={getMainContentPadding()}>{children}</main>

        {/* Mobile Menu Overlay - appears on top */}
        <MobileMenu
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          platform={platform}
        />
      </div>
    </div>
  );
}
