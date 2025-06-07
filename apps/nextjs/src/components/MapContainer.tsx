"use client";

import type { FC } from "react";
import { useCallback, useState } from "react";
import {
  AdvancedMarker,
  ControlPosition,
  InfoWindow,
  Map,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";

import { env } from "~/env";
import Checkbox from "~/shared/Checkbox";
import PlacePicker from "./PlacePicker";

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
  featuredImage?: string;
  price?: number;
  propertyType?: string;
}

// Define MapContainer props
export interface MapContainerProps {
  currentHoverID?: string;
  markers?: MarkerItem[];
  locations?: MarkerItem[];
  className?: string;
}

const MapContainer: FC<MapContainerProps> = ({
  currentHoverID = "",
  markers = [],
  locations = [],
  className = "",
}) => {
  const [selectedPlace, setSelectedPlace] = useState<MarkerItem | null>(null);
  const map = useMap();

  const handlePlaceChange = useCallback(
    (place: google.maps.places.PlaceResult | null) => {
      if (!place?.geometry?.location) {
        window.alert(
          "No details available for input: '" + (place?.name ?? "") + "'",
        );
        setSelectedPlace(null);
        return;
      }

      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      map?.panTo(newPosition);
    },
    [map],
  );

  const getMarkerIcon = (propertyType?: string) => {
    switch (propertyType?.toLowerCase()) {
      case "residential":
        return "🏠";
      case "commercial":
        return "🏢";
      case "land":
        return "🌳";
      case "industrial":
        return "🏭";
      default:
        return "📍";
    }
  };

  const getMarkerData = (): MarkerItem[] => {
    if (markers.length > 0) return markers;
    if (locations.length > 0) return locations;
    return [];
  };

  const markerData = getMarkerData();
  const validMarkers = markerData.filter(
    (item): item is MarkerItem & { coordinates: Coordinates } =>
      item.coordinates !== null && item.coordinates !== undefined,
  );
  const defaultCenter = validMarkers[0]?.coordinates ?? { lat: 0, lng: 0 };

  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultZoom={12}
      defaultCenter={defaultCenter}
      gestureHandling={"greedy"}
      mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      className={className}
    >
      <MapControl position={ControlPosition.TOP_LEFT}>
        <div className="z-10 mt-5 min-w-max rounded-2xl bg-neutral-100 px-4 py-2 shadow-xl dark:bg-neutral-900">
          <PlacePicker onPlaceChange={handlePlaceChange} />
        </div>
      </MapControl>

      <MapControl position={ControlPosition.TOP_CENTER}>
        <div className="z-10 mt-5 min-w-max rounded-2xl bg-neutral-100 px-4 py-2 shadow-xl dark:bg-neutral-900">
          <Checkbox
            className="text-xs text-neutral-800 xl:text-sm"
            name="search_as_i_move"
            label="Search as I move the map"
          />
        </div>
      </MapControl>

      {validMarkers.map((item) => (
        <AdvancedMarker
          key={item.id}
          position={item.coordinates}
          clickable
          onClick={() => setSelectedPlace(item)}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-2xl ${
              currentHoverID === item.id ? "bg-primary-500" : "bg-white"
            }`}
          >
            {getMarkerIcon(item.propertyType)}
          </div>
        </AdvancedMarker>
      ))}

      {selectedPlace && (
        <InfoWindow
          position={selectedPlace.coordinates}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="p-2">
            <strong className="text-lg font-semibold">
              {selectedPlace.title}
            </strong>
            <p className="text-sm text-gray-600">{selectedPlace.address}</p>
            {selectedPlace.price && (
              <p className="text-primary-600 mt-1 text-sm font-medium">
                ${selectedPlace.price.toLocaleString()}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};

export default MapContainer;
