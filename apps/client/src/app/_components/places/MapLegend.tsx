"use client";

interface MapLegendProps {
  userLocation: [number, number] | null;
}

import { useTranslations } from 'next-intl';

export default function MapLegend({ userLocation }: MapLegendProps) {
  const t = useTranslations();
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl ring-1 ring-blue-200 p-3 md:p-4 transition-all duration-200 hover:scale-[1.01] md:hover:scale-[1.02]">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">{t('places.mapLegend.title', { defaultValue: 'Legend:' })}</span>
        <span className="flex items-center gap-1">
          <span>🍽️</span>{t('places.mapLegend.restaurant', { defaultValue: 'Restaurant' })}
        </span>
        <span className="flex items-center gap-1">
          <span>🏫</span>{t('places.mapLegend.school', { defaultValue: 'School' })}
        </span>
        <span className="flex items-center gap-1">
          <span>🏢</span>{t('places.mapLegend.facility', { defaultValue: 'Facility' })}
        </span>
        <span className="flex items-center gap-1">
          <span>🏟️</span>{t('places.mapLegend.sportCenter', { defaultValue: 'Sport Center' })}
        </span>
        {userLocation && (
          <span className="flex items-center gap-1">
            <span>📍</span>{t('places.mapLegend.yourLocation', { defaultValue: 'Your Location' })}
          </span>
        )}
      </div>
    </div>
  );
}