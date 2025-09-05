"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import type { PathName } from "~/routers/types";
import MenuBar from "~/shared/MenuBar";

type Platform = "android" | "ios" | "web";

interface FooterNavProps {
  platform?: Platform;
}

// Utility function to check if element is in viewport
const isInViewport = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

let WIN_PREV_POSITION = 0;
if (typeof window !== "undefined") {
  WIN_PREV_POSITION = window.pageYOffset;
}

interface NavItem {
  name: string;
  link?: PathName;
  icon: React.ComponentType<any>;
  action?: () => void;
}

const FooterNav: React.FC<FooterNavProps> = ({ platform = "web" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      // Show/hide footer based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      window.requestAnimationFrame(showHideFooterNav);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const showHideFooterNav = () => {
    const currentScrollPos = window.pageYOffset;
    if (!containerRef.current) return;

    if (currentScrollPos > WIN_PREV_POSITION) {
      if (
        isInViewport(containerRef.current) &&
        currentScrollPos - WIN_PREV_POSITION < 80
      ) {
        return;
      }
      containerRef.current.classList.add("FooterNav--hide");
    } else {
      if (
        !isInViewport(containerRef.current) &&
        WIN_PREV_POSITION - currentScrollPos < 80
      ) {
        return;
      }
      containerRef.current.classList.remove("FooterNav--hide");
    }

    WIN_PREV_POSITION = currentScrollPos;
  };

  // Platform-specific styling
  const getPlatformStyles = () => {
    if (platform === "ios") {
      return {
        // iOS-specific styles
        paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)",
        WebkitOverflowScrolling: "touch" as const,
      };
    } else if (platform === "android") {
      return {
        // Android-specific styles
        paddingBottom: "env(safe-area-inset-bottom)",
      };
    }
    return {};
  };

  // Platform-specific classes
  const getPlatformClasses = () => {
    const baseClasses =
      "FooterNav fixed inset-x-0 bottom-0 z-30 block border-t border-neutral-300 bg-white p-2 transition-transform duration-300 ease-in-out dark:border-neutral-700 dark:bg-neutral-800 md:hidden";

    if (platform === "ios") {
      return `${baseClasses} ios-footer-nav`;
    } else if (platform === "android") {
      return `${baseClasses} android-footer-nav`;
    }

    return baseClasses;
  };

  const NAV: NavItem[] = [
    {
      name: "Explore",
      link: "/",
      icon: MagnifyingGlassIcon,
    },
    {
      name: "Wishlists",
      link: "/favorites",
      icon: HeartIcon,
    },
    {
      name: "Theme",
      icon: mounted ? (isDarkMode ? MoonIcon : SunIcon) : () => null,
      action: toggleDarkMode,
    },
    {
      name: "Menu",
      icon: MenuBar,
    },
  ];

  const renderItem = (item: NavItem, index: number) => {
    const isActive = pathname === item.link;

    const commonClasses = `mobile-nav-item flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
      isActive ? "text-neutral-900 dark:text-neutral-100" : ""
    }`;

    if (item.action) {
      return (
        <motion.button
          key={index}
          onClick={item.action}
          className={commonClasses}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <item.icon className="h-6 w-6" />
          </motion.div>
          <span className="mt-1 text-[11px] leading-none">{item.name}</span>
        </motion.button>
      );
    }

    return item.link ? (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link href={item.link} className={commonClasses}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <item.icon
              className={`h-6 w-6 ${isActive ? "text-red-600" : ""}`}
            />
          </motion.div>
          <span
            className={`mt-1 text-[11px] leading-none ${isActive ? "text-red-600" : ""}`}
          >
            {item.name}
          </span>
        </Link>
      </motion.div>
    ) : (
      <motion.div
        key={index}
        className={commonClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <item.icon className="h-6 w-6" />
        <span className="mt-1 text-[11px] leading-none">{item.name}</span>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          className={getPlatformClasses()}
          style={getPlatformStyles()}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <motion.div
            className="mx-auto flex w-full max-w-lg justify-around text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {NAV.map(renderItem)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FooterNav;
