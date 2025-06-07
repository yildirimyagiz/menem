import React, { useState } from "react";
import Image from "next/image";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BeakerIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CakeIcon,
  FireIcon,
  HeartIcon,
  HomeIcon,
  KeyIcon,
  MapIcon,
  MapPinIcon,
  PhotoIcon,
  ShoppingBagIcon,
  TvIcon,
  UsersIcon,
  VideoCameraIcon,
  WifiIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";

import type {
  FacilityAmenities,
  LocationAmenities,
  PropertyAmenities,
} from "~/utils/interfaces";

interface PhotoSidebarProps {
  phoneNumber?: string;
  onClose?: () => void;
  isOpen: boolean;
  title: string;
  photos: {
    url: string;
    caption?: string | null;
    alt: string | null;
  }[];
  currentPhotoIndex?: number;
  propertyAmenities?: PropertyAmenities[];
  locationAmenities?: LocationAmenities[];
  facilityAmenities?: FacilityAmenities[];
  videoUrl?: string | null;
  virtualTour?: string | null;
}

const navigationItems = [
  { label: "Photos", href: "#photos", icon: PhotoIcon },
  { label: "Videos", href: "#videos", icon: VideoCameraIcon },
  { label: "Virtual Tour", href: "#virtual-tour", icon: HomeIcon },
  { label: "Property Map", href: "#property-map", icon: MapIcon },
  { label: "Location", href: "#location", icon: MapPinIcon },
];

const amenityIcons = {
  // Property Amenities
  wifi: WifiIcon,
  tv: TvIcon,
  parking: KeyIcon,
  fireplace: FireIcon,
  kitchen: CakeIcon,
  workspace: BuildingOfficeIcon,
  elevator: BuildingLibraryIcon,

  // Location Amenities
  Market: ShoppingBagIcon,
  Hospital: HeartIcon,
  Pharmacy: BeakerIcon,
  School: AcademicCapIcon,

  // Facility Amenities
  indoorPool: BeakerIcon,
  outdoorPool: BeakerIcon,
  gym: UsersIcon,
};

const PhotoSidebar = ({
  phoneNumber = "(708) 797-6742",
  onClose,
  isOpen,
  title,
  photos,
  currentPhotoIndex = 0,
  propertyAmenities = [],
  locationAmenities = [],
  facilityAmenities = [],
  videoUrl,
  virtualTour,
}: PhotoSidebarProps) => {
  const t = useTranslations("photoSidebar");
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedPhotoIndex, setSelectedPhotoIndex] =
    useState(currentPhotoIndex);

  if (!isOpen) return null;

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "photos":
        return (
          <div className="relative flex h-[calc(100%-200px)] flex-col">
            <div className="relative flex-1">
              {/* Current Photo */}
              <div className="relative h-full w-full">
                {photos[selectedPhotoIndex] ? (
                  <Image
                    src={photos[selectedPhotoIndex].url}
                    alt={photos[selectedPhotoIndex].alt ?? "Property photo"}
                    className="h-full w-full object-contain"
                    width={800}
                    height={600}
                    priority={false}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    {t("noPhotoAvailable")}
                  </div>
                )}

                {/* Navigation Arrows */}
                {selectedPhotoIndex > 0 && (
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-gray-800 hover:bg-white"
                    onClick={handlePrevPhoto}
                    aria-label={t("navigation.previous")}
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                )}
                {selectedPhotoIndex < photos.length - 1 && (
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-gray-800 hover:bg-white"
                    onClick={handleNextPhoto}
                    aria-label={t("navigation.next")}
                  >
                    <ArrowRightIcon className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.url}
                  className={cn(
                    "flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:opacity-90",
                    index === selectedPhotoIndex
                      ? "border-[#67B82F] shadow-lg"
                      : "border-transparent",
                  )}
                  onClick={() => setSelectedPhotoIndex(index)}
                  aria-label={t("thumbnails.select", { number: index + 1 })}
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt ?? "Property photo"}
                    className="h-16 w-24 object-cover"
                    width={100}
                    height={75}
                    priority={false}
                  />
                </button>
              ))}
            </div>
          </div>
        );
      case "videos":
        return videoUrl ? (
          <div className="aspect-video w-full">
            <iframe src={videoUrl} className="h-full w-full" allowFullScreen />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-gray-500">
            {t("content.noVideos")}
          </div>
        );
      case "virtual-tour":
        return virtualTour ? (
          <div className="aspect-video w-full">
            <iframe
              src={virtualTour}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-gray-500">
            {t("content.noVirtualTour")}
          </div>
        );
      case "amenities":
        return (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Property Amenities */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                {t("amenities.property.title")}
              </h3>
              <div className="space-y-3">
                {propertyAmenities.map((amenity) => {
                  const Icon =
                    amenityIcons[amenity as keyof typeof amenityIcons] ??
                    BuildingOfficeIcon;
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="capitalize">
                        {t(
                          `amenities.property.items.${amenity.toLowerCase()}`,
                          {
                            defaultValue: amenity
                              .replace(/([A-Z])/g, " $1")
                              .trim(),
                          },
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Amenities */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                {t("amenities.location.title")}
              </h3>
              <div className="space-y-3">
                {locationAmenities.map((amenity) => {
                  const Icon =
                    amenityIcons[amenity as keyof typeof amenityIcons] ??
                    MapPinIcon;
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="capitalize">
                        {t(
                          `amenities.location.items.${amenity.toLowerCase()}`,
                          {
                            defaultValue: amenity
                              .replace(/([A-Z])/g, " $1")
                              .trim(),
                          },
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Facility Amenities */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                {t("amenities.facility.title")}
              </h3>
              <div className="space-y-3">
                {facilityAmenities.map((amenity) => {
                  const Icon =
                    amenityIcons[amenity as keyof typeof amenityIcons] ??
                    BuildingLibraryIcon;
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="capitalize">
                        {t(
                          `amenities.facility.items.${amenity.toLowerCase()}`,
                          {
                            defaultValue: amenity
                              .replace(/([A-Z])/g, " $1")
                              .trim(),
                          },
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative h-[90vh] w-full max-w-7xl overflow-y-auto bg-white p-6">
        {/* Header with Title and Phone */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${phoneNumber}`}
              className="text-lg font-semibold text-[#3B82F6] hover:text-blue-700"
            >
              {phoneNumber}
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label={t("header.close")}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b">
          <nav className="flex space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.href.replace("#", "");
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.href.replace("#", ""))}
                  className={cn(
                    "flex items-center gap-2 border-b-2 pb-4 text-sm font-medium transition-colors",
                    isActive
                      ? "border-[#67B82F] text-[#67B82F]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(`tabs.${item.href.replace("#", "")}`)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[400px]">{renderContent()}</div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Button className="flex-1 bg-[#67B82F] font-medium text-white hover:bg-[#5aa429]">
            {t("actions.scheduleTour")}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#67B82F] font-medium text-[#67B82F] hover:bg-[#67B82F] hover:text-white"
          >
            {t("actions.sendMessage")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoSidebar;
