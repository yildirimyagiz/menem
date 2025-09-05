"use client";

import { Transition } from "@headlessui/react";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
    AdvancedMarker,
    APIProvider,
    Map as GoogleMap,
    useAdvancedMarkerRef,
    useMap,
} from "@vis.gl/react-google-maps";
import {
    Coffee,
    Dumbbell,
    Hospital as HospitalIcon,
    Landmark as LandmarkIcon,
    Loader2,
    Pill,
    School,
    ShoppingBag,
    ShoppingCart,
    Trees,
    Utensils
} from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@reservatior/ui/button";
import React from "react";
import Image from "next/image";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import type { MapContainerProps, MarkerItem, POI, POIType } from "./types";

// Default map center (Istanbul)
const DEFAULT_CENTER = { lat: 41.0082, lng: 28.9784 };
const DEFAULT_ZOOM = 12;

// Default POI Icons
const DEFAULT_POI_ICONS: Partial<Record<POIType, React.ReactNode>> = {
  school: <School className="h-4 w-4" />,
  bank: <LandmarkIcon className="h-4 w-4" />,
  restaurant: <Utensils className="h-4 w-4" />,
  cafe: <Coffee className="h-4 w-4" />,
  hospital: <HospitalIcon className="h-4 w-4" />,
  pharmacy: <Pill className="h-4 w-4" />,
  supermarket: <ShoppingCart className="h-4 w-4" />,
  park: <Trees className="h-4 w-4" />,
  gym: <Dumbbell className="h-4 w-4" />,
  shopping_mall: <ShoppingBag className="h-4 w-4" />,
};

// Default map controls
const DEFAULT_CONTROLS = {
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
};

// Default cluster options (reserved for future use)
const _DEFAULT_CLUSTER_OPTIONS = {
  gridSize: 60,
  maxZoom: 20,
  minimumClusterSize: 2,
};

// Default loading component
const DefaultLoading = () => (
  <div className="flex h-full w-full items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

// Default error component
const DefaultError = ({ error }: { error: Error }) => (
  <div className="flex h-full w-full items-center justify-center bg-red-50 p-4">
    <div className="text-center">
      <h3 className="text-lg font-medium text-red-800">Error loading map</h3>
      <p className="mt-1 text-sm text-red-700">{error.message}</p>
    </div>
  </div>
);

// Default no markers component
const DefaultNoMarkers = () => (
  <div className="flex h-full w-full items-center justify-center bg-gray-50 p-4">
    <p className="text-sm text-muted-foreground">No locations to display</p>
  </div>
);

// Default marker component
const DefaultMarker = ({
  marker,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  marker: MarkerItem;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const [markerRef] = useAdvancedMarkerRef();
  
  return (
    <AdvancedMarker
      ref={markerRef}
      position={marker.coordinates}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "flex items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold shadow-lg transition-colors",
        isHovered
          ? "z-10 scale-110 transform bg-primary text-primary-foreground"
          : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
      )}
    >
      {marker.currency} {marker.price.toLocaleString()}
    </AdvancedMarker>
  );
};

// Default info window component
const DefaultInfoWindow = ({
  marker,
  locale,
  onClose,
}: {
  marker: MarkerItem;
  locale: string;
  onClose: () => void;
}) => {
  return (
    <div className="w-64 rounded-lg bg-white p-4 shadow-xl dark:bg-gray-900">
      {marker.photos[0]?.url && (
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-md">
          <Image
            src={marker.photos[0].url}
            alt={marker.title}
            fill
            sizes="(max-width: 768px) 100vw, 256px"
            className="object-cover"
          />
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {marker.title}
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {marker.address}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-medium text-primary">
          {marker.currency} {marker.price.toLocaleString()}
        </span>
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          asChild
        >
          <a href={`/${locale}/property/${marker.id}`}>View Details</a>
        </Button>
      </div>
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-full bg-white p-1 text-gray-500 shadow-md hover:bg-gray-100"
      >
        <MapPinIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

// Main map component
// POI Controls Component
const POIControls = ({
  enabledPOITypes = [],
  onTogglePOI,
  customPOIIcons = {},
}: {
  enabledPOITypes: POIType[];
  onTogglePOI: (type: POIType) => void;
  customPOIIcons: Partial<Record<POIType, string>>;
}) => {
  const allPOITypes = [
    'school', 'bank', 'restaurant', 'cafe', 'hospital', 
    'pharmacy', 'supermarket', 'park', 'gym', 'shopping_mall'
  ] as const;

  return (
    <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 rounded-lg bg-white p-3 shadow-lg">
      <h3 className="text-sm font-medium text-gray-700">Points of Interest</h3>
      <div className="grid grid-cols-2 gap-2">
        {allPOITypes.map((type) => {
          const isActive = enabledPOITypes.includes(type);
          const custom = customPOIIcons[type as POIType];
          const Icon = custom
            ? (
              <Image
                src={custom}
                alt={`${type} icon`}
                width={16}
                height={16}
                className="h-4 w-4"
                unoptimized
              />
            )
            : (DEFAULT_POI_ICONS[type] ?? <MapPinIcon className="h-4 w-4" />);
          
          return (
            <button
              key={type}
              onClick={() => onTogglePOI(type)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={String(type).replace('_', ' ')}
            >
              <span className="flex-shrink-0">{Icon}</span>
              <span className="capitalize">{String(type).replace('_', ' ')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const MapComponent = ({
  markers = [],
  locations = [],
  points = [],
  className = "",
  autoFit = true,
  showPOIs = false,
  enabledPOITypes: initialPOITypes = [],
  onPOIClick,
  customPOIIcons = {},

  onMarkerClick,
  onMarkerHover,
  renderMarker,
  renderInfoWindow,
  defaultCenter = DEFAULT_CENTER,
  defaultZoom = DEFAULT_ZOOM,
  minZoom,
  maxZoom,
  controls = {},
  styles,
  mapTypeId = "roadmap",
  gestureHandling = "greedy",
  loadingComponent = <DefaultLoading />,
  errorComponent = (error: Error) => <DefaultError error={error} />,
  noMarkersComponent = <DefaultNoMarkers />,
}: Omit<MapContainerProps, 'googleMapsApiKey'>) => {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerItem | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [activePOIs, setActivePOIs] = useState<POIType[]>([...initialPOITypes]);
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([]);
  const [_isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const [currentHoverID, setCurrentHoverID] = useState<string>('');
  const map = useMap();

  // Merge default controls with user-provided controls
  const mapControls = useMemo(
    () => ({
      ...DEFAULT_CONTROLS,
      ...controls,
    }),
    [controls]
  );

  // Process markers data
  const markerData = useMemo(() => {
    try {
      if (markers.length > 0) return markers;
      if (locations.length > 0) return locations;
      
      return points.map((p) => ({
          id: p.id,
          title: p.title ?? "",
          address: p.address ?? "",
          coordinates: p.coordinates,
          position: p.coordinates,
          price: p.price ?? 0,
          currency: p.currency ?? "$",
          propertyType: "APARTMENT" as const,
          propertyStatus: "AVAILABLE" as const,
          category: "RESIDENTIAL" as const,
          condition: "GOOD" as const,
          features: [],
          amenities: [],
          photos: (p.photos ?? []).map((photo) => ({
              id: "",
              url: photo.url ?? "",
              caption: "",
              propertyId: "",
              isPrimary: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              originalName: null,
              filename: null,
              type: "IMAGE" as const,
              alt: null,
              src: null,
              featured: false,
              width: 0,
              height: 0,
              size: 0,
              mimeType: "",
              blurDataURL: "",
              order: 0,
              userId: "",
              postId: null,
          })),
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
      })) as unknown as MarkerItem[];
    } catch (err) {
      console.error("Error processing markers:", err);
      setError(err instanceof Error ? err : new Error("Failed to process markers"));
      return [];
    }
  }, [markers, locations, points]);

  // Filter out markers with invalid coordinates
  const validMarkers = useMemo(
    () =>
      markerData.filter(
        (marker) =>
          typeof marker.coordinates.lat === "number" &&
          typeof marker.coordinates.lng === "number"
      ),
    [markerData]
  );

  // Calculate bounds for auto-fit
  const bounds = useMemo(() => {
    if (!autoFit || validMarkers.length === 0) return null;

    const bounds = new window.google.maps.LatLngBounds();
    validMarkers.forEach((marker) => {
      bounds.extend(marker.coordinates);
    });
    return bounds;
  }, [autoFit, validMarkers]);

  // Fetch nearby POIs when map bounds or active POIs change
  useEffect(() => {
    if (!map || !showPOIs || activePOIs.length === 0) {
      setNearbyPOIs([]);
      return;
    }

    const fetchPOIs = async () => {
      try {
        setIsLoadingPOIs(true);
        const bounds = map.getBounds();
        if (!bounds) return;

        const center = bounds.getCenter();
        const service = new google.maps.places.PlacesService(
          document.createElement('div')
        );

        const requests = activePOIs.map((type) => {
          return new Promise<POI[]>((resolve) => {
            service.nearbySearch(
              {
                location: center,
                radius: 1000, // 1km radius
                type: type as string,
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  const pois = results.map<POI>((place) => ({
                    id: place.place_id ?? String(Math.random()),
                    type,
                    name: place.name ?? 'Unnamed Place',
                    coordinates: {
                      lat: place.geometry?.location?.lat() ?? 0,
                      lng: place.geometry?.location?.lng() ?? 0,
                    },
                    icon: place.icon,
                    rating: place.rating,
                    userRatingsTotal: place.user_ratings_total,
                    address: place.vicinity,
                    isOpen: place.opening_hours?.open_now,
                  }));
                  resolve(pois);
                } else {
                  resolve([]);
                }
              }
            );
          });
        });

        const results = await Promise.all(requests);
        setNearbyPOIs(results.flat());
      } catch (err) {
        console.error('Error fetching POIs:', err);
        setNearbyPOIs([]);
      } finally {
        setIsLoadingPOIs(false);
      }
    };

    // Debounce the API calls
    const timer = setTimeout(() => {
      void fetchPOIs();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [map, showPOIs, activePOIs]);

  // Auto-fit map to bounds when bounds change
  useEffect(() => {
    if (!map || !bounds) return;

    const listener = map.addListener("bounds_changed", () => {
      const currentZoom = map.getZoom() ?? defaultZoom;
      const newZoom = Math.min(currentZoom, 16); // Cap max zoom
      if (newZoom !== currentZoom) {
        map.setZoom(newZoom);
      }
    });

    if (validMarkers.length === 1) {
      const only = validMarkers[0];
      if (only) {
        map.setCenter(only.coordinates);
        map.setZoom(14);
      }
    } else {
      map.fitBounds(bounds, {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60,
      });
    }

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [map, bounds, validMarkers, defaultZoom]);

  // Handle marker click
  const handleMarkerClick = useCallback((marker: MarkerItem) => {
    if (onMarkerClick) {
      onMarkerClick(marker);
    } else {
      setSelectedMarker(marker);
      setInfoWindowPosition(marker.coordinates);
      setInfoWindowOpen(true);
    }
  }, [onMarkerClick]);

  // Handle marker hover
  const handleMarkerHover = useCallback((markerId: string | null) => {
    if (onMarkerHover) {
      onMarkerHover(markerId);
    }
    setCurrentHoverID(markerId ?? '');
  }, [onMarkerHover]);

  // Toggle POI type
  const handleTogglePOI = useCallback((type: POIType) => {
    setActivePOIs(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  // Handle POI click
  const handlePOIClick = useCallback((poi: POI) => {
    if (onPOIClick) {
      onPOIClick(poi);
    } else {
      setSelectedPOI(poi);
      setInfoWindowPosition(poi.coordinates);
      setInfoWindowOpen(true);
    }
  }, [onPOIClick]);

  // Handle map click (ignore event to avoid type mismatches)
  const handleMapClick = useCallback(() => {
    setInfoWindowOpen(false);
    setSelectedMarker(null);
    setSelectedPOI(null);
  }, []);

  // Close info window
  const handleCloseInfoWindow = useCallback(() => {
    setInfoWindowOpen(false);
    setSelectedMarker(null);
    setSelectedPOI(null);
  }, []);

  // Handle map load
  useEffect(() => {
    // Consider map ready when hook returns a map instance
    if (map) setIsLoading(false);
  }, [map]);

  // (Removed onError handler - GoogleMap does not support onError prop)

  // Show loading state
  if (isLoading) {
    return <div className={cn("h-full w-full", className)}>{loadingComponent}</div>;
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("h-full w-full", className)}>
        {typeof errorComponent === "function"
          ? errorComponent(error)
          : errorComponent}
      </div>
    );
  }

  // Show no markers state
  if (validMarkers.length === 0) {
    return <div className={cn("h-full w-full", className)}>{noMarkersComponent}</div>;
  }

  // Render POI marker
  const renderPOIMarker = (poi: POI) => {
    const Icon = DEFAULT_POI_ICONS[poi.type] ?? <MapPinIcon className="h-4 w-4" />;
    
    return (
      <AdvancedMarker
        key={`${poi.type}-${poi.coordinates.lat}-${poi.coordinates.lng}`}
        position={poi.coordinates}
        onClick={() => handlePOIClick(poi)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white/90 p-1 shadow-md transition-transform hover:scale-110",
          {
            'text-blue-500': poi.type === 'school',
            'text-green-600': poi.type === 'park',
            'text-yellow-600': poi.type === 'restaurant' || poi.type === 'cafe',
            'text-red-500': poi.type === 'hospital' || poi.type === 'pharmacy',
            'text-purple-500': poi.type === 'bank',
            'text-orange-500': poi.type === 'supermarket' || poi.type === 'shopping_mall',
            'text-indigo-500': poi.type === 'gym',
          }
        )}
      >
        {Icon}
      </AdvancedMarker>
    );
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      {showPOIs && (
        <POIControls 
          enabledPOITypes={activePOIs}
          onTogglePOI={handleTogglePOI}
          customPOIIcons={customPOIIcons}
        />
      )}
      <GoogleMap
        id="map"
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        zoom={defaultZoom}
        center={defaultCenter}
        minZoom={minZoom}
        maxZoom={maxZoom}
        mapTypeId={mapTypeId}
        gestureHandling={gestureHandling}
        onClick={handleMapClick}
        styles={styles}
        {...mapControls}
      >
        {/* Render POI Markers */}
        {showPOIs && nearbyPOIs.map((poi, index) => (
          <React.Fragment key={`poi-${index}`}>
            {renderPOIMarker(poi)}
          </React.Fragment>
        ))}
        
        {/* Render Property Markers */}
        {validMarkers.map((marker) => {
          const isHovered = currentHoverID === marker.id;
          
          return renderMarker ? (
            <div
              key={marker.id}
              onClick={() => handleMarkerClick(marker)}
              onMouseEnter={() => handleMarkerHover(marker.id)}
              onMouseLeave={() => handleMarkerHover(null)}
            >
              {renderMarker(marker, isHovered)}
            </div>
          ) : (
            <DefaultMarker
              key={marker.id}
              marker={marker}
              isHovered={isHovered}
              onClick={() => handleMarkerClick(marker)}
              onMouseEnter={() => handleMarkerHover(marker.id)}
              onMouseLeave={() => handleMarkerHover(null)}
            />
          );
        })}

        {/* Property Info Window */}
        {infoWindowOpen && selectedMarker && infoWindowPosition && (
          <AdvancedMarker position={infoWindowPosition}>
            <div className="relative">
              <div className="absolute bottom-4 left-1/2 z-10 w-full max-w-xs -translate-x-1/2 transform">
                <Transition
                  show={!!selectedMarker}
                  enter="transition-opacity duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {renderInfoWindow ? (
                    renderInfoWindow(selectedMarker)
                  ) : (
                    <DefaultInfoWindow
                      marker={selectedMarker}
                      locale={locale}
                      onClose={handleCloseInfoWindow}
                    />
                  )}
                </Transition>
              </div>
            </div>
          </AdvancedMarker>
        )}

        {/* POI Info Window */}
        {infoWindowOpen && selectedPOI && infoWindowPosition && (
          <AdvancedMarker position={infoWindowPosition}>
            <div className="relative">
              <div className="absolute bottom-4 left-1/2 z-50 w-64 -translate-x-1/2 transform rounded-lg bg-white p-4 shadow-xl">
                <Transition
                  show={infoWindowOpen}
                  enter="transition-opacity duration-150"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {selectedPOI.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {selectedPOI.address}
                      </p>
                      {selectedPOI.rating !== undefined && (
                        <div className="mt-2 flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-sm text-gray-700">
                            {selectedPOI.rating.toFixed(1)}
                            {selectedPOI.userRatingsTotal && ` (${selectedPOI.userRatingsTotal})`}
                          </span>
                          {selectedPOI.isOpen !== undefined && (
                            <span className={`ml-2 text-xs ${selectedPOI.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedPOI.isOpen ? 'Open Now' : 'Closed'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCloseInfoWindow}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </AdvancedMarker>
        )}
      </GoogleMap>
    </div>
  );
};

// Main export with API provider
const MapContainer = ({
  googleMapsApiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  ...props
}: MapContainerProps) => {
  if (!googleMapsApiKey) {
    console.error("Google Maps API key is required");
    return (
      <div className="flex h-64 items-center justify-center bg-red-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-800">
            Google Maps API key is missing
          </h3>
          <p className="mt-1 text-sm text-red-700">
            Please provide a valid Google Maps API key
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={googleMapsApiKey}>
      <MapComponent {...props} />
    </APIProvider>
  );
};

export { MapContainer };
