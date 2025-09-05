"use client";

import { useTranslations } from 'next-intl';
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import("./Map"), { ssr: false });

interface InteractiveMapProps {
  places: any[];
  center: [number, number];
  zoom: number;
  onPlaceSelect: (place: any) => void;
  selectedPlace: any;
  userLocation: [number, number] | null;
  isTrackingLocation: boolean;
  className?: string;
}

export default function InteractiveMap({
  places,
  center,
  zoom,
  onPlaceSelect,
  selectedPlace,
  userLocation,
  isTrackingLocation,
  className,
}: InteractiveMapProps) {
  const t = useTranslations();

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl ring-1 ring-blue-200 p-4 md:p-6 transition-all duration-200 hover:scale-[1.01] md:hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          {t('places.interactiveMap.title', { defaultValue: 'Interactive Map' })}
        </h3>
        <span className="rounded-full bg-blue-100 px-2 md:px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-200">
          {t('places.interactiveMap.placesFound', { defaultValue: '{count} places found', count: places.length })}
          {userLocation && ` • ${t('places.interactiveMap.locationEnabled', { defaultValue: 'Location enabled' })}`}
        </span>
      </div>
      <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-lg md:rounded-xl">
        <Map
          center={center}
          zoom={zoom}
          className={className}
        />
      </div>
    </div>
  );
} 