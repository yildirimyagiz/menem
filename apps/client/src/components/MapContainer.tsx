"use client";

import { Transition } from "@headlessui/react";
import {
  AcademicCapIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  BeakerIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import type {
  Photo,
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@reservatior/db";
import {
  AdvancedMarker,
  ControlPosition,
  Map,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";
import { useLocale } from "next-intl";
import Image from "next/image";
import type { FC } from "react";
import React, { Fragment, useMemo, useState } from "react";

import { CheckboxField } from "~/app/_components/client/Checkbox";
import { env } from "~/env";
import Button from "~/shared/Button";
import ButtonClose from "~/shared/ButtonClose";
import Checkbox from "~/shared/Checkbox";

// Define coordinates type
interface Coordinates {
  lat: number;
  lng: number;
}

// Define marker item type
interface MarkerItem {
  id: string;
  title: string;
  address: string;
  coordinates: Coordinates;
  position: Coordinates;
  price: number;
  currency: string;
  propertyType: PropertyType;
  propertyStatus: PropertyStatus;
  category: PropertyCategory;
  condition: PropertyCondition;
  features: PropertyFeatures[];
  amenities: PropertyAmenities[];
  photos: Photo[];
  bedrooms?: number;
  bathrooms?: number;
}

// Define MapContainer props
export interface MapContainerProps {
  currentHoverID?: string;
  markers?: MarkerItem[];
  locations?: MarkerItem[];
  className?: string;
  // Lightweight input; internally adapted to MarkerItem
  points?: {
    id: string;
    coordinates: Coordinates;
    title?: string;
    address?: string;
    price?: number;
    currency?: string;
    photos?: { url?: string }[];
    bedrooms?: number;
    bathrooms?: number;
  }[];
  autoFit?: boolean;
}

const MapContainer: FC<MapContainerProps> = ({
  currentHoverID,
  markers = [],
  locations = [],
  className = "",
  points = [],
  autoFit = true,
}) => {
  const locale = useLocale();
  const [hoverID, setHoverID] = useState<string>(currentHoverID ?? "");
  const [activeTab, setActiveTab] = useState<string>("restaurants");
  const tabs: { id: string; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
    { id: "schools", label: "Schools", Icon: AcademicCapIcon },
    { id: "restaurants", label: "Restaurants", Icon: BuildingStorefrontIcon },
    { id: "groceries", label: "Groceries", Icon: ShoppingCartIcon },
    { id: "coffee", label: "Coffee", Icon: BeakerIcon },
    { id: "banks", label: "Banks", Icon: BanknotesIcon },
    { id: "shops", label: "Shops", Icon: BuildingStorefrontIcon },
    { id: "fitness", label: "Fitness", Icon: BuildingLibraryIcon },
  ];
  const markerData: MarkerItem[] =
    markers.length > 0
      ? markers
      : locations.length > 0
        ? locations
        : points.length > 0
          ? points.map((p) => ({
              id: p.id,
              title: p.title ?? "",
              address: p.address ?? "",
              coordinates: p.coordinates,
              position: p.coordinates,
              price: p.price ?? 0,
              currency: p.currency ?? "",
              // Below casts are safe placeholders; card UI tolerates missing details
              propertyType: "OTHER" as unknown as PropertyType,
              propertyStatus: "AVAILABLE" as unknown as PropertyStatus,
              category: "OTHER" as unknown as PropertyCategory,
              condition: "GOOD" as unknown as PropertyCondition,
              features: [],
              amenities: [],
              photos: ((p.photos ?? []) as unknown as Photo[]),
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
            }))
          : [];
  const validMarkers = markerData.filter(
    (item: MarkerItem): item is MarkerItem & { coordinates: Coordinates } =>
      Boolean(item.coordinates),
  );
  const defaultCenter = validMarkers.length > 0 ? validMarkers[0]?.coordinates : { lat: 0, lng: 0 };
  const map = useMap();
  // Memoized dependency key for bounds to satisfy lint rules
  const boundsKey = useMemo(
    () => validMarkers.map((m) => `${m.coordinates.lat},${m.coordinates.lng}`).join("|"),
    [validMarkers],
  );

  // Sync external hover id when provided
  React.useEffect(() => {
    if (typeof currentHoverID === "string") {
      setHoverID(currentHoverID);
    }
  }, [currentHoverID]);

  // Auto-fit bounds to include all markers
  React.useEffect(() => {
    if (!autoFit) return;
    if (!map) return;
    if (!validMarkers.length) return;
    const bounds = new google.maps.LatLngBounds();
    for (const m of validMarkers) bounds.extend(m.coordinates as google.maps.LatLngLiteral);
    // If only one marker, set a friendly zoom
    if (validMarkers.length === 1) {
      const only = validMarkers[0];
      if (!only) return;
      map.setCenter(only.coordinates as google.maps.LatLngLiteral);
      map.setZoom(14);
      return;
    }
    map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
    // Cap max zoom so clustering area is visible
    const listener = google.maps.event.addListenerOnce(map, "bounds_changed", () => {
      const z = map.getZoom() ?? 0;
      if (z > 16) map.setZoom(16);
    });
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [autoFit, map, boundsKey, validMarkers]);

  return (
    <div className="h-full w-full">
      <div className="h-full w-full overflow-hidden">
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultZoom={12}
          defaultCenter={defaultCenter}
          gestureHandling={"greedy"}
          mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          className={className}
        >
          {/* Top floating control */}
          <MapControl position={ControlPosition.TOP_CENTER}>
            <div className="z-10 mt-5 min-w-max rounded-2xl bg-neutral-100 px-4 py-2 shadow-xl dark:bg-neutral-900">
              <CheckboxField>
                <Checkbox name="search_as_i_move" defaultChecked />
                <span className="text-xs text-neutral-800 xl:text-sm">
                  Search as I move the map
                </span>
              </CheckboxField>
            </div>
          </MapControl>

          {/* Bottom tabs control */}
          <MapControl position={ControlPosition.BOTTOM_CENTER}>
            <div className="pointer-events-auto mb-4 max-w-full overflow-x-auto">
              <div className="mx-auto flex min-w-max items-center gap-2 rounded-xl bg-neutral-100 p-2 shadow-xl dark:bg-neutral-900">
                {tabs.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      activeTab === id
                        ? "bg-neutral-800 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-white text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                    aria-pressed={activeTab === id}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </MapControl>
          {validMarkers.map((item: MarkerItem) => (
            <AdvancedMarker
              key={item.id}
              position={item.coordinates}
              zIndex={hoverID === item.id ? 1000 : 1}
              onMouseEnter={() => {
                if (hoverID !== item.id) {
                  setHoverID(item.id);
                }
              }}
              onMouseLeave={() => {
                setHoverID("");
              }}
            >
              <AdvancedMarkerCard
                isSelected={!!hoverID && hoverID === item.id}
                key={item.id}
                marker={item}
                locale={locale}
              />
            </AdvancedMarker>
          ))}
        </Map>
        <div className="absolute left-3 top-3">
          <ButtonClose
            onClick={() => {
              /* handle close */
            }}
          />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 shadow-2xl">
          <Button href="#">
            <XMarkIcon className="size-6" />
            <span>Hide map</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;

const AdvancedMarkerCard = ({
  marker,
  isSelected,
  locale,
}: {
  marker: MarkerItem;
  isSelected?: boolean;
  locale: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <p
        className={`flex min-w-max items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold shadow-lg transition-colors ${
          isSelected
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            : "bg-white hover:bg-neutral-900 hover:text-white dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-neutral-900"
        }`}
      >
        {marker.currency} {marker.price.toLocaleString()}
      </p>
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute -left-12 top-full z-50 w-64 pt-3">
          <div className="rounded-3xl bg-white p-4 shadow-2xl dark:bg-neutral-900">
            {marker.photos[0]?.url && (
              <Image
                src={marker.photos[0].url}
                alt={marker.title}
                width={256}
                height={112}
                className="mb-2 h-28 w-full rounded object-cover"
              />
            )}
            <strong className="text-lg font-semibold">{marker.title}</strong>
            <p className="text-sm text-gray-600">{marker.address}</p>
            {marker.price && (
              <p className="text-primary-600 mt-1 text-sm font-medium">
                {marker.currency} {marker.price.toLocaleString()}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-700">
              {marker.bedrooms && <span>{marker.bedrooms} beds</span>}
              {marker.bathrooms && <span>{marker.bathrooms} baths</span>}
            </div>
            <a
              href={`/${locale}/client/property/${marker.id}`}
              className="mt-3 inline-block rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              View Details
            </a>
          </div>
        </div>
      </Transition>
    </div>
  );
};
