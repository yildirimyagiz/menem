"use client";

import { Filter, List, Map as MapIcon, Search } from "lucide-react";

interface SearchAndFilterProps {
  viewMode: "list" | "map";
  searchQuery: string;
  onToggleViewMode: () => void;
  onSearchChange: (query: string) => void;
}

import { useTranslations } from 'next-intl';

export default function SearchAndFilter({
  viewMode,
  searchQuery,
  onToggleViewMode,
  onSearchChange,
}: SearchAndFilterProps) {
  const t = useTranslations();
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl ring-1 ring-blue-200 p-4 md:p-6 transition-all duration-200 hover:scale-[1.01] md:hover:scale-[1.02]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
          <button
            onClick={onToggleViewMode}
            className={`flex items-center justify-center gap-2 rounded-lg md:rounded-xl px-3 md:px-4 py-2 text-sm font-medium transition-all duration-200 w-full sm:w-auto ${
              viewMode === "list"
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            <List className="h-4 w-4" />
            {t('places.searchAndFilter.listView', { defaultValue: 'List View' })}
          </button>
          <button
            onClick={onToggleViewMode}
            className={`flex items-center justify-center gap-2 rounded-lg md:rounded-xl px-3 md:px-4 py-2 text-sm font-medium transition-all duration-200 w-full sm:w-auto ${
              viewMode === "map"
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            <MapIcon className="h-4 w-4" />
            {t('places.searchAndFilter.mapView', { defaultValue: 'Map View' })}
          </button>
        </div>
        <div className="relative w-full md:max-w-md md:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('places.searchAndFilter.searchPlaceholder', { defaultValue: 'Search places...' })}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg md:rounded-xl border border-blue-200 pl-10 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-xs md:text-sm text-gray-600">{t('places.searchAndFilter.filterBy', { defaultValue: 'Filter by:' })}</span>
        </div>
      </div>
    </div>
  );
} 