"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "~/app/_components/client/Footer";
import { MobileMenu } from "~/app/_components/client/MobileMenu";
import Navbar from "~/app/_components/client/Navbar";
import { Sidebar } from "~/app/_components/client/Sidebar";
import { MobileLayout } from "~/app/_components/MobileLayout";
import FooterNav from "~/components/FooterNav";
import { useAuth } from "~/hooks/use-auth";

interface ClientLayoutProps {
  children: React.ReactNode;
}

type Platform = "android" | "ios" | "web";

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("web");

  // Detect platform
  useEffect(() => {
    const detectPlatform = () => {
      const isCapacitor =
        typeof window !== "undefined" && 'Capacitor' in window;

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

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    redirect("/auth/login");
  }

  // Platform-specific mobile menu positioning
  const getMobileMenuPosition = () => {
    if (platform === "ios") {
      return "fixed left-4 z-50 top-safe-4"; // iOS: safe-area aware top offset
    } else if (platform === "android") {
      return "fixed left-4 z-50 top-safe-4"; // Android: safe-area aware top offset
    }
    return "fixed left-4 top-4 z-50"; // Web: standard positioning
  };

  // Platform-specific main content padding
  const getMainContentPadding = () => {
    if (platform === "ios") {
      return "flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8 pb-20 ios-layout ios-dashboard-layout"; // iOS: extra bottom padding for home indicator
    } else if (platform === "android") {
      return "flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8 pb-16 android-layout android-dashboard-layout"; // Android: standard padding
    }
    return "flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8"; // Web: standard padding
  };

  return (
    <MobileLayout>
      <div className="flex min-h-screen flex-col ios-layout android-layout">
        <div className="flex flex-1 flex-col">
          {/* Enhanced Mobile Menu Trigger Button */}
          <AnimatePresence>
            {!mobileMenuOpen && (
              <motion.button
                className={`${getMobileMenuPosition()} mobile-button rounded-full border border-gray-200/50 bg-white/90 p-3 shadow-lg backdrop-blur-lg md:hidden ios-mobile-menu android-mobile-menu ${
                  platform === "ios"
                    ? "ios-menu-button"
                    : platform === "android"
                      ? "android-menu-button"
                      : ""
                }`}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Navbar only on md+ or when drawer is closed */}
          <div className="hidden md:block w-full">
            <Navbar />
          </div>

          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            platform={platform}
          />

          {/* Dashboard Layout with Sidebar */}
          <div className="flex flex-1">
            {/* Sidebar - only show on dashboard pages */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            
            {/* Main Content */}
            <main className={`${getMainContentPadding()} lg:ml-0`}>
              {children}
            </main>
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto"
        >
          <Footer />
        </motion.div>
        
        {/* Mobile Footer Navigation */}
        <div className="md:hidden">
          <FooterNav platform={platform} />
        </div>
      </div>
    </MobileLayout>
  );
}
