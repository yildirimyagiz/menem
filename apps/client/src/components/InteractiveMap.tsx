"use client";

import React, { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapPin, Minus, Plus } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent } from "@reservatior/ui/card";

interface InteractiveMapProps {
  places: any[];
  center: { lat: number; lng: number };
  zoom: number;
  onPlaceSelect?: (place: any) => void;
  selectedPlace?: any;
  className?: string;
  userLocation?: [number, number] | null;
  isTrackingLocation?: boolean;
}

const CATEGORY_EMOJI = {
  restaurant: "🍽️",
  school: "🏫",
  facility: "🏢",
  sport: "🏟️",
  default: "📍",
};

// Safe render helper
const safeRender = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value) && value.length === 0) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export default function InteractiveMap({
  places,
  center,
  zoom,
  onPlaceSelect,
  selectedPlace,
  className = "h-[600px] w-full",
  userLocation,
  isTrackingLocation,
}: InteractiveMapProps) {
  // Get emoji for place type
  const getPlaceEmoji = useCallback((place: any) => {
    const type = (place.type || "").toLowerCase();
    if (
      type.includes("restaurant") ||
      type.includes("cafe") ||
      type.includes("bar")
    ) {
      return CATEGORY_EMOJI.restaurant;
    }
    if (
      type.includes("school") ||
      type.includes("university") ||
      type.includes("college")
    ) {
      return CATEGORY_EMOJI.school;
    }
    if (
      type.includes("facility") ||
      type.includes("center") ||
      type.includes("community")
    ) {
      return CATEGORY_EMOJI.facility;
    }
    if (
      type.includes("sport") ||
      type.includes("gym") ||
      type.includes("stadium")
    ) {
      return CATEGORY_EMOJI.sport;
    }
    return CATEGORY_EMOJI.default;
  }, []);

  // Filter places with valid coordinates
  const placesWithCoords = useMemo(() => {
    return places.filter(
      (place: any) => place.location?.lat && place.location?.lng,
    );
  }, [places]);

  return (
    <div className={`relative overflow-hidden rounded-lg border ${className}`}>
      {/* Enhanced Map Visualization with Interactive Elements */}
      <div className="relative h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-6xl">🗺️</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              Interactive Map
            </h3>
            <p className="mb-4 text-gray-600">
              {placesWithCoords.length} places found
            </p>

            {/* User Location Display */}
            {userLocation && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-2xl">📍</span>
                  <span className="font-semibold text-blue-800">
                    Your Location
                  </span>
                  {isTrackingLocation && (
                    <span className="animate-pulse text-blue-600">🔄</span>
                  )}
                </div>
                <div className="text-sm text-blue-700">
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </div>
              </div>
            )}

            {/* Interactive Place Markers */}
            <div className="flex max-w-2xl flex-wrap justify-center gap-2">
              {placesWithCoords.slice(0, 8).map((place, idx) => (
                <div
                  key={place.id || idx}
                  className="cursor-pointer rounded-lg bg-white/80 p-3 shadow-sm transition-all hover:scale-105 hover:bg-white hover:shadow-md"
                  onClick={() => onPlaceSelect?.(place)}
                >
                  <div className="mb-1 text-2xl">{getPlaceEmoji(place)}</div>
                  <div className="max-w-20 truncate text-xs font-medium text-gray-700">
                    {safeRender(place.name)}
                  </div>
                  {place.rating && (
                    <div className="mt-1 text-xs text-yellow-600">
                      ⭐ {place.rating.toFixed(1)}
                    </div>
                  )}
                  {place.distance && (
                    <div className="mt-1 text-xs text-blue-600">
                      📍 {place.distance}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Overlay */}
        {places.length > 8 && (
          <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/95 p-4 shadow-lg">
            <h4 className="mb-2 font-semibold">More Places</h4>
            <div className="max-h-32 overflow-y-auto">
              {placesWithCoords.slice(8, 12).map((place, idx) => (
                <div
                  key={place.id || idx}
                  className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50"
                  onClick={() => onPlaceSelect?.(place)}
                >
                  <span className="text-lg">{getPlaceEmoji(place)}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {safeRender(place.name)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {safeRender(place.address)}
                    </div>
                    {place.distance && (
                      <div className="text-xs text-blue-600">
                        📍 {place.distance}
                      </div>
                    )}
                  </div>
                  {place.price && (
                    <div className="text-sm font-semibold text-primary">
                      ${place.price}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Place Details */}
        {selectedPlace && (
          <div className="absolute right-4 top-4 w-80 rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                {safeRender(selectedPlace.name)}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPlaceSelect?.(null as any)}
              >
                ×
              </Button>
            </div>
            {selectedPlace.image && (
              <img
                src={selectedPlace.image}
                alt={safeRender(selectedPlace.name)}
                className="mb-3 h-32 w-full rounded object-cover"
              />
            )}
            <div className="space-y-2">
              {selectedPlace.type && (
                <Badge variant="secondary">
                  {safeRender(selectedPlace.type)}
                </Badge>
              )}
              {selectedPlace.address && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {safeRender(selectedPlace.address)}
                </div>
              )}
              {selectedPlace.distance && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <span>📍</span>
                  <span>{safeRender(selectedPlace.distance)} from you</span>
                </div>
              )}
              {selectedPlace.price && (
                <div className="text-lg font-semibold text-primary">
                  ${selectedPlace.price}
                </div>
              )}
              {selectedPlace.description && (
                <p className="text-sm text-gray-600">
                  {safeRender(selectedPlace.description)}
                </p>
              )}
              <Button className="w-full">View Details</Button>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => console.log("Zoom in")}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => console.log("Zoom out")}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
