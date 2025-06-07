"use client";

import type { IconType } from "react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaFilter,
  FaHome,
  FaMapMarkerAlt,
  FaStar,
  FaTag,
} from "react-icons/fa";

interface Tab {
  name: string;
  href: string;
  icon: IconType;
  count?: number;
}

interface MapPropertyTabsProps {
  onTabChange?: (tab: string) => void;
  totalProperties?: number;
  onToggleFilters?: () => void;
  isFiltersVisible?: boolean;
}

const MapPropertyTabs: React.FC<MapPropertyTabsProps> = ({
  onTabChange,
  totalProperties = 0,
  onToggleFilters,
  isFiltersVisible = true,
}) => {
  const pathname = usePathname();
  const t = useTranslations();

  const tabs = useMemo<Tab[]>(
    () => [
      {
        name: t("all"),
        href: "#all",
        icon: FaHome,
        count: totalProperties,
      },
      {
        name: t("forSale"),
        href: "#for-sale",
        icon: FaDollarSign,
      },
      {
        name: t("forRent"),
        href: "#for-rent",
        icon: FaHome,
      },
      {
        name: t("nearMe"),
        href: "#near-me",
        icon: FaMapMarkerAlt,
      },
      {
        name: t("popular"),
        href: "#popular",
        icon: FaStar,
      },
      {
        name: t("newPropertys"),
        href: "#new-listings",
        icon: FaTag,
      },
    ],
    [totalProperties, t],
  );

  const [activeTab, setActiveTab] = useState(tabs[0]?.href ?? "");
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Update active tab based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash ?? tabs[0]?.href ?? "";
      setActiveTab(hash);
      onTabChange?.(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs, onTabChange]);

  useEffect(() => {
    const container = tabsContainerRef.current;
    const updateArrows = () => {
      if (container) {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollWidth > container.clientWidth + container.scrollLeft,
        );
      }
    };

    updateArrows();
    window.addEventListener("resize", updateArrows);
    container?.addEventListener("scroll", updateArrows);
    return () => {
      window.removeEventListener("resize", updateArrows);
      container?.removeEventListener("scroll", updateArrows);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Scroll to active tab
  useEffect(() => {
    const container = tabsContainerRef.current;
    const activeElement = container?.querySelector(`[href*="${activeTab}"]`);

    if (container && activeElement) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      // Calculate the scroll position to center the active tab
      const scrollLeft =
        activeRect.left -
        containerRect.left -
        containerRect.width / 2 +
        activeRect.width / 2;

      container.scrollTo({
        left: container.scrollLeft + scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative flex items-center justify-center py-3">
          {/* Main tabs container with proper centering */}
          <div className="relative flex w-full max-w-3xl items-center">
            {/* Left scroll button - fixed position */}
            {showLeftArrow && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none"
                aria-label={t("scrollLeft")}
              >
                <FaChevronLeft className="h-3 w-3 text-gray-600" />
              </button>
            )}

            {/* Tabs container - scrollable */}
            <div
              ref={tabsContainerRef}
              className="no-scrollbar mx-auto flex w-full overflow-x-auto scroll-smooth py-2"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex space-x-2 px-4">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.href;
                  const Icon = tab.icon;

                  return (
                    <Link
                      key={tab.href}
                      href={`${pathname}${tab.href}`}
                      onClick={() => {
                        setActiveTab(tab.href);
                        onTabChange?.(tab.href);
                      }}
                      className={`flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <Icon
                        className={`mr-2 h-4 w-4 ${isActive ? "text-white" : "text-gray-500"}`}
                      />
                      <span>{tab.name}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right scroll button - fixed position */}
            {showRightArrow && (
              <button
                onClick={() => handleScroll("right")}
                className="absolute -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none"
                aria-label={t("scrollRight")}
              >
                <FaChevronRight className="h-3 w-3 text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter toggle button - positioned at the right */}
          <button
            onClick={onToggleFilters}
            className={`absolute right-4 flex items-center rounded-full px-3 py-2 text-sm font-medium transition-all ${
              isFiltersVisible
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
            aria-label={t("toggleFilters")}
          >
            <FaFilter
              className={`mr-1.5 h-3.5 w-3.5 ${isFiltersVisible ? "text-white" : "text-gray-500"}`}
            />
            <span>{t("filters")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPropertyTabs;
