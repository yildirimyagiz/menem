"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@reservatior/ui";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface FloatingNavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

interface FloatingNavbarProps {
  navItems: FloatingNavItem[];
  className?: string;
  activeLink?: string;
  position?: "top" | "bottom" | "left";
  showIndicator?: boolean;
  magnifyActive?: boolean;
  glassmorphism?: boolean;
}

export function FloatingNavbar({
  navItems,
  className,
  activeLink,
  position = "bottom",
  showIndicator = true,
  magnifyActive = true,
  glassmorphism = true,
}: FloatingNavbarProps) {
  const [active, setActive] = useState(activeLink ?? navItems[0]?.link);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const [mounted, setMounted] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Set up the animation for the magnetic float
  const mouseX = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 100 });
  const magneticX = useTransform(springX, (val) => val / 10);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(typeof window !== "undefined" ? window.innerWidth : 0);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (activeLink) {
      setActive(activeLink);
    }
  }, [activeLink]);

  if (!mounted) {
    return null;
  }

  // Hide FloatingNavbar on large screens (e.g., desktop)
  if (windowWidth >= 1024) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-50",
        position === "top" && "left-0 right-0 top-6 mx-auto w-fit",
        position === "bottom" && "bottom-6 left-0 right-0 mx-auto w-fit",
        position === "left" && "left-6 top-1/2 flex -translate-y-1/2 flex-col",
        className,
      )}
    >
      <motion.div
        className={cn(
          "items-center rounded-full p-2",
          position !== "left" && "flex gap-2 px-4 py-2 sm:gap-4",
          position === "left" && "flex flex-col gap-2",
          glassmorphism
            ? "border border-white/10 bg-white/40 shadow-lg backdrop-blur-md dark:bg-gray-800/40"
            : "border border-slate-200 bg-slate-50 shadow-md dark:border-slate-700 dark:bg-slate-800",
        )}
        layoutId="navbar"
        layout="preserve-aspect"
        initial={{ opacity: 0, y: position === "top" ? -20 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          mouseX.set(e.clientX - rect.left - rect.width / 2);
        }}
        onMouseLeave={() => {
          mouseX.set(0);
          setHoveredLink(null);
        }}
        style={{
          x: magneticX,
        }}
      >
        {navItems.map((item) => {
          const isActive = item.link === active;

          return (
            <Link key={item.link} href={item.link}>
              <motion.a
                className={cn(
                  "relative cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium",
                  "transition-colors duration-200",
                  isActive
                    ? "text-primary-foreground"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
                )}
                onMouseEnter={() => setHoveredLink(item.link)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setActive(item.link)}
                whileHover={{ scale: magnifyActive ? 1.05 : 1 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10 flex items-center gap-1">
                  {item.icon && (
                    <span className="text-lg leading-none">{item.icon}</span>
                  )}
                  {item.name}
                </span>

                {isActive && showIndicator && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 z-0 rounded-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}

                {hoveredLink === item.link && !isActive && (
                  <motion.div
                    layoutId="hover-pill"
                    className="absolute inset-0 z-0 rounded-full bg-slate-100 dark:bg-slate-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </motion.a>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
