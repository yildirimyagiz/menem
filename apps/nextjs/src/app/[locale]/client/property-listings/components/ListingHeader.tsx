"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FaFilter,
  FaMapMarkedAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaThLarge,
  FaTimes,
} from "react-icons/fa";

import type { PropertyFilterInput } from "@acme/validators";

interface PropertyHeaderProps {
  currentView: "grid" | "map";
  totalCount: number;
  filters: Partial<PropertyFilterInput>;
  onFilterChange: (filters: Partial<PropertyFilterInput>) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const PropertyHeader = ({
  currentView,
  totalCount,
  filters,
  onFilterChange,
  onSortChange,
}: PropertyHeaderProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.title ?? "");
  const _allowedSortFields = ["createdAt", "updatedAt", "price"] as const;
  const [sortBy, setSortBy] = useState<(typeof _allowedSortFields)[number]>(
    filters.sortBy ?? "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    filters.sortOrder ?? "desc",
  );

  // Keep local state in sync with parent filters
  // (optional: useEffect to sync if props.filters changes externally)

  const toggleView = () => {
    if (currentView === "grid") {
      router.push("/listing-real-estate-map");
    } else {
      router.push("/listing-real-estate");
    }
  };

  const handleSortChange = (newSortBy: (typeof _allowedSortFields)[number]) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setIsSortOpen(false);
    onSortChange(newSortBy, newSortOrder);
  };

  const handleSearch = () => {
    onFilterChange({ ...filters, title: searchTerm });
  };

  return (
    <motion.div
      className="sticky top-0 z-40 w-full bg-white/95 shadow-sm backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {t("All Properties")}
            </h1>
            <span className="text-sm text-gray-500">
              {totalCount} {totalCount === 1 ? t("property") : t("properties")}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search input */}
            <div className="relative hidden md:block">
              <input
                type="text"
                className="focus:border-primary-500 focus:ring-primary-500 w-64 rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1"
                placeholder={t("Search Properties")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    onFilterChange({ ...filters, title: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${isFilterOpen ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <FaFilter className="h-4 w-4" />
                <span className="hidden sm:inline">{t("Filter")}</span>
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      {/* Add filter buttons here if your backend supports them, e.g. featured, furnished, petFriendly */}
                      {/* Example:
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          onFilterChange({ ...filters, someField: true });
                          setIsFilterOpen(false);
                        }}
                      >
                        {t("Some Filter")}
                      </button>
                      */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort button */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${isSortOpen ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {sortOrder === "desc" ? (
                  <FaSortAmountDown className="h-4 w-4" />
                ) : (
                  <FaSortAmountUp className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{t("Sort")}</span>
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      <button
                        className={`block w-full px-4 py-2 text-left text-sm ${sortBy === "price" ? "text-primary-600 font-medium" : "text-gray-700"} hover:bg-gray-100`}
                        onClick={() => handleSortChange("price")}
                      >
                        {t("By Price")}
                      </button>
                      <button
                        className={`block w-full px-4 py-2 text-left text-sm ${sortBy === "createdAt" ? "text-primary-600 font-medium" : "text-gray-700"} hover:bg-gray-100`}
                        onClick={() => handleSortChange("createdAt")}
                      >
                        {t("By Date")}
                      </button>
                      <button
                        className={`block w-full px-4 py-2 text-left text-sm ${sortBy === "price" ? "text-primary-600 font-medium" : "text-gray-700"} hover:bg-gray-100`}
                        onClick={() => handleSortChange("price")}
                      >
                        {t("By Size")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View toggle button */}
            <button
              onClick={toggleView}
              className="flex items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
            >
              {currentView === "grid" ? (
                <>
                  <FaMapMarkedAlt className="h-4 w-4" />
                  <span>{t("Show Map View")}</span>
                </>
              ) : (
                <>
                  <FaThLarge className="h-4 w-4" />
                  <span>{t("Show Grid View")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyHeader;
