"use client";

import { useState } from "react";
import PlaceCard from "./PlaceCard";

interface PlacesGridProps {
  places: any[];
  viewMode: "list" | "map";
  onPlaceSelect: (place: any) => void;
}

import { useTranslations } from 'next-intl';

export default function PlacesGrid({ places, viewMode, onPlaceSelect }: PlacesGridProps) {
  const t = useTranslations();
  const [mapActive, setMapActive] = useState(false);

  if (viewMode === "map") {
    return (
      <div className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden">
        {/* Example map container, replace with your map component */}
        <div className={`w-full h-full bg-blue-200 ${mapActive ? '' : 'filter blur-md pointer-events-none select-none'}`}>
          {/* Map goes here, e.g. <MapComponent ... /> */}
        </div>
        {!mapActive && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              className="px-6 py-3 rounded-xl bg-blue-700 text-white font-bold shadow-lg ring-2 ring-blue-300 backdrop-blur-md hover:bg-blue-800 transition"
              onClick={() => setMapActive(true)}
            >
              {t('places.placesGrid.activateMap', { defaultValue: 'Activate Map' })}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl ring-1 ring-blue-200 p-4 md:p-6 transition-all duration-200 hover:scale-[1.01] md:hover:scale-[1.02]">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {t('places.placesGrid.featuredPlaces', { defaultValue: 'Featured Places' })}
        </h2>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place, idx) => (
          <PlaceCard
            key={place.id || idx}
            place={place}
            onClick={onPlaceSelect}
          />
        ))}
      </div>
    </div>
  );
} 