import React from "react";
import Link from "next/link";

import type {
  Availability,
  Hotel,
  HotelAmenity,
  HotelRoomType,
  Location,
  Photo,
  PhotoFormat,
} from "~/utils/types";
import BtnLikeIcon from "./BtnLikeIcon";
import GallerySlider from "./GallerySlider";
import SaleOffBadge from "./SaleOffBadge";
import StartRating from "./StartRating";

export interface HotelCardHProps {
  className?: string;
  data: Hotel & {
    rooms: {
      id: string;
      name: string;
      roomType: HotelRoomType;
      allowedGuests: number;
      beds: number;
      bathrooms: number;
      configuration: Record<string, unknown> | null;
      description: string | null;
      capacity: number;
      basePrice: number | null;
      weekendAmount: number | null;
      weekDayAmount: number | null;
      maxOccupancy: number;
      bookingRules: Record<string, unknown> | null;
      amenities: HotelAmenity[];
      features: Record<string, unknown> | null;
      availability: Availability[];
      photos: {
        id: string;
        url: string;
        caption: string | null;
        alt: string | null;
        width: number;
        height: number;
        format: PhotoFormat;
        metadata: Record<string, unknown> | null;
        slug: string;
      }[];
      isActive: boolean;
      deletedAt: Date | null;
    }[];
    photos: Photo[];
    Location: Location | null;
  };
}

const HotelCardH: React.FC<HotelCardHProps> = ({ className = "", data }) => {
  const {
    hotelType,
    Location: location,
    name,
    slug,
    saleOff,
    averageRating,
    reviewCount,
    id,
    amenities,
    rooms,
  } = data;

  const finalCurrency = "USD"; // Adjust as necessary

  const renderSliderGallery = () => {
    const galleryPhotos = data.photos.map((photo) => ({
      src: photo.url || "",
      alt: photo.caption ?? name,
    }));

    return (
      <div className="relative w-full flex-shrink-0 md:w-72">
        <GallerySlider
          ratioClass="aspect-w-6 aspect-h-5"
          photos={galleryPhotos}
          uniqueID={`HotelCardH_${id}`}
          href={""}
        />
        <BtnLikeIcon isLiked={false} className="absolute right-3 top-3" />
        {saleOff && saleOff > 0 && (
          <SaleOffBadge className="absolute left-3 top-3" />
        )}
      </div>
    );
  };

  const renderAmenities = () => {
    const noSmoking = amenities.includes("NO_SMOKING" as HotelAmenity);

    return (
      <div className="hidden grid-cols-3 gap-2 sm:grid">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <i className="las la-user text-lg"></i>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Available
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="las la-bed text-lg"></i>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {rooms[0]?.beds} beds
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <i className="las la-bath text-lg"></i>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {rooms[0]?.bathrooms} baths
            </span>
          </div>
          {noSmoking && (
            <div className="flex items-center space-x-3">
              <i className="las la-smoking-ban text-lg"></i>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                No smoking
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const room = rooms[0];
    const roomPrice = room?.basePrice ?? 0;

    return (
      <div className="flex flex-grow flex-col p-3 sm:p-5">
        <div className="space-y-2">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            <span>
              {hotelType} in {location?.city}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium capitalize">
              <span className="line-clamp-1">{name}</span>
            </h2>
          </div>
        </div>
        <div className="my-4 hidden w-14 border-b border-neutral-100 dark:border-neutral-800 sm:block"></div>
        {renderAmenities()}
        <div className="my-4 w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex items-end justify-between">
          <StartRating
            reviewCount={reviewCount ?? 0}
            rating={averageRating ?? 0}
          />
          <span className="text-base font-semibold text-secondary-500">
            {roomPrice > 0
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: finalCurrency,
                }).format(roomPrice)
              : "Contact for price"}
            {roomPrice > 0 && (
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                /night
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCardH group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-shadow hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      <Link
        href={`/listing-hotel-detail/${slug}`}
        passHref
        className="absolute inset-0"
      >
        <div className="grid grid-cols-1 md:flex md:flex-row">
          {renderSliderGallery()}
          {renderContent()}
        </div>
      </Link>
    </div>
  );
};

export default HotelCardH;
