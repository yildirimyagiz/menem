"use client";

import type { IconType } from "react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FaDollarSign,
  FaHome,
  FaList,
  FaMapMarkerAlt,
  FaPhone,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";

// Define the property data interface
export interface PropertyData {
  id: string;
  title: string;
  description?: string;
  photos?: { url: string; alt?: string }[];
  reviews?: {
    id: string;
    rating: number;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
  price?: number;
  currency?: string;
  propertyAmenities?: { id: string; name: string }[];
  locationAmenities?: { id: string; name: string }[];
  facilityAmenities?: { id: string; name: string }[];
  videoUrl?: string | null;
  virtualTour?: string | null;
  propertyType?: string;
  propertyStatus?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  yearBuilt?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  owner?: {
    id: string;
    name: string | null;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
    responseTime?: string | null;
    responseRate?: number | null;
    memberSince?: Date | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface Tab {
  name: string;
  href: string;
  icon: IconType;
  count?: number;
  disabled?: boolean;
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const tabButtonVariants = {
  hover: {
    scale: 1.03,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
  focus: {
    outline: "none",
    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.5)",
  },
};

interface EnhancedPropertyTabsProps {
  propertyData: PropertyData;
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  stickyOffset?: number;
}

export default function EnhancedPropertyTabs({
  propertyData,
  className,
  activeTab: initialActiveTab,
  onTabChange,
  stickyOffset,
}: EnhancedPropertyTabsProps) {
  const _pathname = usePathname();
  const t = useTranslations("properties");
  const [activeTab, setActiveTab] = useState(initialActiveTab ?? "");
  const [isScrolled, setIsScrolled] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const tabs = useMemo(
    () => [
      {
        name: t("overview"),
        href: "#overview",
        icon: FaHome,
        count: 0,
      },
      {
        name: t("amenities"),
        href: "#amenities",
        icon: FaList,
        count:
          (propertyData.propertyAmenities?.length ?? 0) +
          (propertyData.locationAmenities?.length ?? 0) +
          (propertyData.facilityAmenities?.length ?? 0),
      },
      {
        name: t("location"),
        href: "#location",
        icon: FaMapMarkerAlt,
        count: propertyData.city || propertyData.country ? 1 : 0,
      },
      {
        name: t("pricing"),
        href: "#pricing",
        icon: FaDollarSign,
        disabled: !propertyData.price,
        count: propertyData.price ? 1 : 0,
      },
      {
        name: t("reviews"),
        href: "#reviews",
        icon: FaList,
        count: propertyData.reviews?.length ?? 0,
        disabled: !propertyData.reviews?.length,
      },
      {
        name: t("contact"),
        href: "#contact",
        icon: FaPhone,
        count: propertyData.owner?.phone || propertyData.owner?.email ? 1 : 0,
      },
    ],
    [propertyData, t],
  );

  // Handle tab change
  const handleTabChange = useCallback(
    (tabHref: string) => {
      setActiveTab(tabHref);
      if (onTabChange) {
        onTabChange(tabHref);
      }

      // Scroll to the section
      const element = document.querySelector(tabHref);
      if (element) {
        const headerOffset = stickyOffset ?? 80; // Default to 80px if stickyOffset is not provided
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    [onTabChange, stickyOffset],
  );

  // Handle scroll to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Update isScrolled state for header styling
      setIsScrolled(scrollPosition > 50);

      // Update active tab based on scroll position
      const sections = document.querySelectorAll("section[id]");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.getBoundingClientRect().height;

        if (
          scrollPosition >= sectionTop - 200 &&
          scrollPosition < sectionTop + sectionHeight - 200
        ) {
          currentSection = `#${section.id}`;
        }
      });

      if (currentSection && currentSection !== activeTab) {
        setActiveTab(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  // Scroll to section when tab is clicked
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      className={`sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hide-scrollbar flex overflow-x-auto py-3">
          <div className="flex space-x-1" ref={tabsContainerRef}>
            <AnimatePresence mode="wait">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.href;
                return (
                  <motion.div
                    key={tab.href}
                    custom={index}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <button
                      onClick={() => scrollToSection(tab.href)}
                      className={`group relative flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <tab.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{tab.name}</span>
                      {tab.count && (
                        <span className="bg-primary-100 text-primary-800 ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-medium">
                          {tab.count}
                        </span>
                      )}
                      {isActive && (
                        <motion.span
                          className="bg-primary-500 absolute bottom-0 left-0 right-0 h-0.5"
                          layoutId="activeTab"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
