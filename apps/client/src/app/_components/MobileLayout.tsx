"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

type Platform = "android" | "ios" | "web";

export function MobileLayout({ children, className = "" }: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState<Platform>("web");

  useEffect(() => {
    // Check if we're in a mobile environment and detect platform
    const checkMobile = () => {
      const hasWindow = typeof window !== "undefined";
      const isCapacitor = hasWindow && "Capacitor" in window;
      const isMobileViewport = hasWindow ? window.innerWidth <= 768 : false;

      const isMobileEnv = isCapacitor ? true : isMobileViewport;
      setIsMobile(isMobileEnv);

      // Detect platform
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

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Platform-specific styles
  const getPlatformStyles = () => {
    if (platform === "ios") {
      return {
        // iOS-specific adjustments
        minHeight: "100vh",
        WebkitOverflowScrolling: "touch" as const,
      };
    } else if (platform === "android") {
      return {
        // Android-specific adjustments
        minHeight: "100vh",
      };
    }

    return {};
  };

  // Platform-specific classes
  const getPlatformClasses = () => {
    const baseClasses = "min-h-screen bg-background";

    if (platform === "ios") {
      return `${baseClasses} ios-layout`;
    } else if (platform === "android") {
      return `${baseClasses} android-layout`;
    }

    return baseClasses;
  };

  return (
    <div
      className={`${getPlatformClasses()} pt-safe pb-safe ${isMobile ? "mobile-layout" : ""} ${className}`}
      style={isMobile ? getPlatformStyles() : {}}
    >
      {children}
    </div>
  );
}
