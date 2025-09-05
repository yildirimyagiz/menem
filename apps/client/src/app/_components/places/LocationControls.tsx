"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';

interface LocationControlsProps {
  userLocation: [number, number] | null;
  locationAccuracy: number | null;
  isTrackingLocation: boolean;
  locationPermission: string;
  onGetLocation: () => void;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

export default function LocationControls({
  userLocation,
  locationAccuracy,
  isTrackingLocation,
  locationPermission,
  onGetLocation,
  onStartTracking,
  onStopTracking,
}: LocationControlsProps) {
  const t = useTranslations();

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl ring-1 ring-blue-200 p-4 md:p-6 transition-all duration-200 hover:scale-[1.01] md:hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          {t('places.locationControls.title', { defaultValue: '📍 Real-time Location' })}
        </h3>
        <div className="flex items-center gap-2">
          {userLocation && (
            <span className="rounded-full bg-blue-100 px-2 md:px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              {locationAccuracy
                ? t('places.locationControls.accuracy', { defaultValue: '±{meters}m', meters: Math.round(locationAccuracy) })
                : t('places.locationControls.locationActive', { defaultValue: 'Location active' })}
            </span>
          )}
          {isTrackingLocation && (
            <span className="rounded-full bg-green-100 px-2 md:px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-200 animate-pulse">
              {t('places.locationControls.tracking', { defaultValue: '🔄 Tracking' })}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onGetLocation}
            disabled={isTrackingLocation}
            className="flex items-center justify-center gap-2 rounded-lg md:rounded-xl border border-blue-200 bg-white px-3 md:px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-50 disabled:opacity-50 w-full sm:w-auto"
          >
            {t('places.locationControls.getMyLocation', { defaultValue: '📍 Get My Location' })}
          </button>
          <button
            onClick={isTrackingLocation ? onStopTracking : onStartTracking}
            className={`flex items-center justify-center gap-2 rounded-lg md:rounded-xl px-3 md:px-4 py-2 text-sm font-medium transition-all duration-200 w-full sm:w-auto ${
              isTrackingLocation
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            {isTrackingLocation
              ? t('places.locationControls.stopTracking', { defaultValue: '🚫 Stop Tracking' })
              : t('places.locationControls.startTracking', { defaultValue: '🔄 Start Tracking' })}
          </button>
        </div>

        {userLocation && (
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 w-full sm:w-auto">
            <span className="font-medium">{t('places.locationControls.yourLocation', { defaultValue: 'Your Location:' })}</span>{" "}
            {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
          </div>
        )}

        {locationPermission === "denied" && (
          <div className="text-xs md:text-sm text-red-600 w-full sm:w-auto">
            {t('places.locationControls.locationDenied', { defaultValue: '⚠️ Location access denied. Please enable location permissions in your browser.' })}
          </div>
        )}
      </div>
    </div>
  );
} 