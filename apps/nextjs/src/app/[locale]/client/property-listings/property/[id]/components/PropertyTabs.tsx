"use client";

import type { IconType } from "react-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import {
  FaBus,
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaGraduationCap,
  FaHome,
  FaInfoCircle,
  FaList,
  FaMapMarkerAlt,
  FaMapPin,
  FaPhone,
  FaStar,
} from "react-icons/fa";



interface Tab {
  name: string;
  href: string;
  icon: IconType;
  count?: number;
}

const slideIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const tabVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.4,
    },
  }),
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const tabVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.4
    }
  })
};

interface PropertyTabsProps {
  propertyData: Property;
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({ propertyData }) => {
  const pathname = usePathname();
  const _searchParams = useSearchParams();
  const t = useTranslations("properties");
  const [activeTab, setActiveTab] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const tabs = useMemo<Tab[]>(
    () => [
      {
        name: t("tab_pricing"),
        href: "#pricing",
        icon: FaDollarSign,
      },
      { name: t("tab_about"), href: "#about", icon: FaHome },
      { name: t("tab_contact"), href: "#contact", icon: FaPhone },
      { name: t("tab_amenities"), href: "#amenities", icon: FaList },
      {
        name: t("tab_feesAndPolicies"),
        href: "#fees-and-policies",
        icon: FaInfoCircle,
      },
      {
        name: t("tab_location"),
        href: "#location",
        icon: FaMapMarkerAlt,
      },
      {
        name: t("tab_education"),
        href: "#education",
        icon: FaGraduationCap,
      },
      {
        name: t("tab_transportation"),
        href: "#transportation",
        icon: FaBus,
      },
      {
        name: t("tab_pointsOfInterest"),
        href: "#points-of-interest",
        icon: FaMapPin,
      },
      {
        name: t("tab_reviews"),
        href: "#reviews",
        icon: FaStar,
        count: propertyData.Review?.length ?? 0,
      },
    ],
    [propertyData.Review?.length, t],
  );

  const [activeTab, setActiveTab] = useState(tabs[0]?.href ?? "");
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Update active tab based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || tabs[0]?.href) ?? "";
      setActiveTab(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we can scroll left or right
  const checkScroll = useCallback(() => {
    const container = tabsContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth,
      );
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-md backdrop-blur-md" : "bg-white"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-22 flex items-center justify-between">
          <motion.button
            onClick={() => handleScroll("left")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`-ml-2 flex h-12 w-12 items-center justify-center rounded-full transition-all ${canScrollLeft ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "invisible"}`}
            aria-label={t("tab_scrollLeft")}
          >
            <FaChevronLeft className="h-6 w-6" />
          </motion.button>

          <div
            ref={tabsContainerRef}
            className="hide-scrollbar flex-1 overflow-x-auto scroll-smooth px-2"
            onScroll={checkScroll}
          >
            <div className="flex space-x-1 py-2 sm:space-x-4">
              <AnimatePresence mode="wait">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.href;
                  const Icon = tab.icon;

                  return (
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            className="bg-primary-500 absolute bottom-0 left-0 h-0.5 w-full"
                            layoutId="activeTab"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            onClick={() => handleScroll("right")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`-mr-2 flex h-12 w-12 items-center justify-center rounded-full transition-all ${canScrollRight ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "invisible"}`}
            aria-label={t("tab_scrollRight")}
          >
            <FaChevronRight className="h-6 w-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyTabs;
