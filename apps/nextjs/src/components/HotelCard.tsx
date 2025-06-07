import type { FC } from "react";
import React, { memo } from "react";
import Link from "next/link";

import type {
  Availability,
  Currency,
  Hotel,
  HotelAmenity,
  HotelRoomType,
  PhotoFormat,
} from "~/utils/types";
import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import Badge from "~/shared/Badge";
import GallerySlider from "./GallerySlider";

interface HotelCardProps {
  className?: string;
  data: Hotel & {
    rooms: {
      hotelId: string;
      deletedAt: Date | null;
      isActive: boolean;
      availability: Availability[];
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

      photos: {
        url: string;
        alt: string | null;
        caption: string | null;
        width: number;
        height: number;
        format: PhotoFormat;
        metadata: Record<string, unknown> | null;
        slug: string;
        deletedAt: Date | null;
      }[];
      prices: {
        id: string;
        finalAmount: number;
        baseAmount: number;
        currency: Currency;
        isActive: boolean;
      }[];
    }[];

    photos: {
      url: string;
      caption: string | null;
      alt: string | null;
      width: number;
      height: number;
      format: string;
      metadata: Record<string, unknown> | null;
      deletedAt: Date | null;
    }[];
    Location?: {
      address: string;
      latitude: number | null;
      longitude: number | null;
      city: string;
      state: string;
      country: string;
      details: string | null;
      street: string;
      deletedAt: Date | null;
    } | null;
    saleOff?: number | null;
  };
  size?: "default" | "small";
  availability?: Availability[];
  price: {
    id: string;
    baseAmount: number;
    finalAmount: number;
    isActive: boolean;
    currency: Currency;
  }[];
}

const HotelCard: FC<HotelCardProps> = ({
  size = "default",
  className = "",
  data: {
    id,
    name,
    slug,
    hotelType,
    saleOff = null,
    featured,
    photos = [],
    reviewCount = 0,
    averageRating,
    Location: location = null,
    publishedStatus = "INACTIVE",
    stars,
    chainName,
    certifications = [],
    checkInTime,
    checkOutTime,
    rooms = [],
  },
  price,
}) => {
  const totalBeds = rooms.reduce((acc, room) => acc + (room.beds || 0), 0);
  const maxGuests = rooms.reduce(
    (acc, room) => acc + (room.allowedGuests || 0),
    0,
  );
  const pricePerNight = price[0]?.finalAmount ?? saleOff ?? 0;
  const pricePerWeekend = pricePerNight ? pricePerNight * 1.2 : null;

  const renderSliderGallery = () => {
    const href = `/listing-hotel-detail/${slug}`;
    return (
      <div className="relative w-full">
        <GallerySlider
          uniqueID={`HotelCard_${id}`}
          ratioClass="aspect-w-4 aspect-h-3"
          photos={photos.map((photo) => ({
            src: photo.url,
            alt: photo.caption ?? name,
          }))}
          href={href}
        />
        <BtnLikeIcon isLiked={false} className="absolute right-3 top-3 z-[1]" />
        {saleOff && saleOff > 0 && (
          <SaleOffBadge className="absolute left-3 top-3" />
        )}
      </div>
    );
  };

  const formatPrice = (price: number, currency: Currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);

  const renderLocation = () =>
    location?.city && location.country ? (
      <div className="flex items-center space-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        {size === "default" && (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
        <span>{`${location.city}, ${location.country}`}</span>
      </div>
    ) : null;

  const renderCheckTimes = () =>
    checkInTime && checkOutTime ? (
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        Check-in: {new Date(checkInTime).toLocaleTimeString()} - Check-out:{" "}
        {new Date(checkOutTime).toLocaleTimeString()}
      </div>
    ) : null;

  const renderAmenities = () => {
    const bedsText = totalBeds > 1 ? `${totalBeds} beds` : `${totalBeds} bed`;
    const guestsText =
      maxGuests > 1 ? `${maxGuests} guests` : `${maxGuests} guest`;

    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <span>{bedsText}</span>
        <span>•</span>
        <span>{guestsText}</span>
      </div>
    );
  };

  return (
    <div
      className={`nc-HotelCard group relative bg-white dark:bg-neutral-900 ${
        size === "default"
          ? "border border-neutral-100 dark:border-neutral-800"
          : ""
      } overflow-hidden rounded-2xl transition-shadow hover:shadow-xl ${className}`}
      data-nc-id="HotelCard"
    >
      {renderSliderGallery()}

      <Link href={`/listing-hotel-detail/${slug}`}>
        <div className={size === "default" ? "space-y-4 p-4" : "space-y-1 p-3"}>
          <div className={size === "default" ? "space-y-2" : "space-y-1"}>
            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              {chainName && <span>{chainName}</span>}
              <span>{hotelType}</span>
              <span>•</span>
              <span>{stars}★</span>
              {renderAmenities()}
            </div>

            <div className="flex items-center space-x-2">
              {featured && <Badge name="Featured" color="green" />}
              {certifications.length > 0 && (
                <Badge name={certifications[0]} color="blue" />
              )}
              {publishedStatus && publishedStatus !== "ACTIVE" && (
                <Badge name={publishedStatus} color="yellow" />
              )}
              <h2 className="font-semibold capitalize text-neutral-900 dark:text-white">
                <span className="line-clamp-1">{name}</span>
              </h2>
            </div>

            {renderLocation()}
            {renderCheckTimes()}
          </div>

          <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-base font-semibold">
                {pricePerNight
                  ? formatPrice(pricePerNight, price[0]?.currency)
                  : "Contact for price"}
                {pricePerNight && (
                  <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    /night
                  </span>
                )}
              </span>
              {pricePerWeekend && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Weekend: {formatPrice(pricePerWeekend, price[0]?.currency)}
                </div>
              )}
            </div>
            {!!averageRating && (
              <StartRating
                reviewCount={reviewCount ?? 0}
                rating={averageRating || 0}
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(HotelCard);
