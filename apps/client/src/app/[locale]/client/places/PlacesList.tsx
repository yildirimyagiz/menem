"use client";

import { useCallback, useMemo, useState } from "react";
import { useLanguage } from "~/context/LanguageContext";

// Import the new components
import CategoryFilters from "~/app/_components/places/CategoryFilters";
import InteractiveMap from "~/app/_components/places/InteractiveMap";
import LocationControls from "~/app/_components/places/LocationControls";
import MapLegend from "~/app/_components/places/MapLegend";
import PlacesGrid from "~/app/_components/places/PlacesGrid";
import SearchAndFilter from "~/app/_components/places/SearchAndFilter";

// Types
type Category = "all" | "restaurant" | "school" | "facility" | "sport";

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  id: string;
  name: string;
  type?: Category;
  description?: string;
  address?: string;
  image?: string;
  location?: Location;
  price?: string;
  rating?: number;
}

export default function PlacesList({
  city = "San Francisco",
}: {
  city?: string;
}) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapCenter] = useState<[number, number]>([37.7749, -122.4194]);

  // Mock data - replace with actual API call
  const places: Place[] = useMemo(() => [
    {
      id: "1",
      name: t("places.goldenGateRestaurant.name"),
      type: "restaurant",
      description: t("places.goldenGateRestaurant.description"),
      address: t("places.goldenGateRestaurant.address"),
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      location: { lat: 37.8199, lng: -122.4783 },
      price: "$$",
      rating: 4.5,
    },
    {
      id: "2",
      name: t("places.sanFranciscoHighSchool.name"),
      type: "school",
      description: t("places.sanFranciscoHighSchool.description"),
      address: t("places.sanFranciscoHighSchool.address"),
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=400&h=300&fit=crop",
      location: { lat: 37.7749, lng: -122.4194 },
      rating: 4.2,
    },
    {
      id: "3",
      name: t("places.downtownFitnessCenter.name"),
      type: "facility",
      description: t("places.downtownFitnessCenter.description"),
      address: t("places.downtownFitnessCenter.address"),
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      location: { lat: 37.7849, lng: -122.4094 },
      price: "$",
      rating: 4.0,
    },
    {
      id: "4",
      name: t("places.marinaSportsComplex.name"),
      type: "sport",
      description: t("places.marinaSportsComplex.description"),
      address: t("places.marinaSportsComplex.address"),
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
      location: { lat: 37.8049, lng: -122.4394 },
      price: "$$",
      rating: 4.3,
    },
  ], [t]);

  // Filter places based on category and search
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesCategory = selectedCategory === "all" || place.type === selectedCategory;
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
         place.address?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [places, selectedCategory, searchQuery]);

  // Get category labels with translations
  const getCategoryLabels = () => ({
    all: t("places.categories.all"),
    restaurant: t("places.categories.restaurant"),
    school: t("places.categories.school"),
    facility: t("places.categories.facility"),
    sport: t("places.categories.sport"),
  });

  // Handle category change with proper type conversion
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category as Category);
  }, []);

  // Location control handlers
  const handleGetLocation = useCallback(() => {
    // TODO: Implement location getting functionality
    console.log("Getting user location...");
  }, []);

  const handleStartTracking = useCallback(() => {
    // TODO: Implement location tracking start
    console.log("Starting location tracking...");
  }, []);

  const handleStopTracking = useCallback(() => {
    // TODO: Implement location tracking stop
    console.log("Stopping location tracking...");
  }, []);

  return (
    <div className="ios-layout android-layout">
      {/* Header */}
      <div className="mobile-fade-in mb-8 text-center">
        <h1 className="mobile-text-xl font-bold lg:text-3xl">
          {t("places.title", { city })}
        </h1>
        <p className="mobile-text-base text-gray-600 dark:text-gray-300">
          {t("places.subtitle")}
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mobile-card mobile-fade-in mb-8 rounded-xl border border-blue-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(viewMode === "list" ? "map" : "list")}
        />
      </div>

      {/* Category Filters */}
      <div className="mobile-fade-in mb-8">
        <CategoryFilters
          category={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={getCategoryLabels()}
        />
      </div>

      {/* Content */}
      <div className="space-y-6">
        {viewMode === "list" ? (
          <div className="mobile-fade-in">
            <PlacesGrid
              places={filteredPlaces}
              viewMode={viewMode}
              onPlaceSelect={(place: Place) => {
                // Handle place click
                console.log("Place clicked:", place);
              }}
            />
          </div>
        ) : (
          <div className="mobile-fade-in">
            <div className="mobile-card rounded-xl border border-blue-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80">
              <div className="mb-4">
                <LocationControls
                  userLocation={null}
                  locationAccuracy={null}
                  isTrackingLocation={false}
                  locationPermission={"prompt"}
                  onGetLocation={handleGetLocation}
                  onStartTracking={handleStartTracking}
                  onStopTracking={handleStopTracking}
                />
              </div>

              <div className="h-96 rounded-lg overflow-hidden">
                <InteractiveMap
                  places={filteredPlaces}
                  center={mapCenter}
                  zoom={13}
                  onPlaceSelect={(place: Place) => {
                    // Handle place select
                    console.log("Place selected:", place);
                  }}
                  selectedPlace={null}
                  userLocation={null}
                  isTrackingLocation={false}
                  className=""
                />
              </div>

              <div className="mt-4">
                <MapLegend userLocation={null} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mobile-fade-in mt-8 text-center">
        <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
          {t("places.resultsSummary", { 
            showing: filteredPlaces.length, 
            total: places.length 
          })}
        </p>
      </div>
    </div>
  );
}


