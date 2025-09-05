"use client";

import { MapPin } from "lucide-react";
import { getCityImage } from "~/utils/getCityImage";

interface PlaceCardProps {
  place: any;
  onClick: (place: any) => void;
}

import { useTranslations } from 'next-intl';

export default function PlaceCard({ place, onClick }: PlaceCardProps) {
  const t = useTranslations();
  const safeRender = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    return String(value);
  };

  return (
    <div
      className="group overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-md md:shadow-lg transition-all duration-300 hover:shadow-lg md:hover:shadow-xl dark:bg-blue-900 cursor-pointer"
      onClick={() => onClick(place)}
    >
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
        {place.image ? (
          <img
            src={place.image}
            alt={safeRender(place.name)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getCityImage(place.city ?? place.address);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400" aria-label={t('places.placeCard.noImage', { defaultValue: 'No image available' })}>
            <MapPin className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" />
          </div>
        )}
        {place.rating && (
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 rounded-lg bg-white/95 p-1 md:p-2 backdrop-blur-sm">
            <div className="text-xs md:text-sm font-bold text-gray-900">
              {t('places.placeCard.rating', { defaultValue: '⭐ {rating}', rating: place.rating.toFixed(1) })}
            </div>
          </div>
        )}
        {place.distance && (
          <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 rounded-lg bg-blue-600/95 p-1 md:p-2 backdrop-blur-sm">
            <div className="text-xs md:text-sm font-bold text-white">
              {t('places.placeCard.distance', { defaultValue: '📍 {distance}', distance: place.distance })}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 md:p-6">
        <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            {safeRender(place.name)}
          </h3>
          {place.type && (
            <span className="rounded-full bg-blue-100 px-2 md:px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-200 self-start sm:self-auto">
              {safeRender(place.type)}
            </span>
          )}
        </div>
        <p className="mb-3 md:mb-4 text-sm md:text-base text-gray-600 dark:text-gray-300 line-clamp-2">
          {safeRender(place.description)}
        </p>
        <div className="mb-3 md:mb-4 flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">{safeRender(place.address)}</span>
        </div>
        <button className="w-full rounded-lg md:rounded-xl border border-blue-200 bg-white px-3 md:px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-50">
          {t('places.placeCard.viewDetails', { defaultValue: 'View Details' })}
        </button>
      </div>
    </div>
  );
} 