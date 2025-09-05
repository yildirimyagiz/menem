import type { Prisma } from "@reservatior/db";
import type { FC } from "react";
import React, { memo } from "react";
import Link from "next/link";

import type { Hotel, HotelRoom } from "~/utils/types";
import StartRating from "~/app/_components/StartRating";
import Badge from "~/shared/Badge";

interface ListViewHotelCardProps {
  className?: string;
  data: Hotel & {
    photos: {
      url: string;
      caption: string | null;
      width: number;
      height: number;
      format: string;
      metadata: JSON | null; // Ensure this matches your Prisma schema
    }[];
    Location: {
      address: string;
      latitude: number | null;
      longitude: number | null;
      city: string;
      state: string;
      country: string;
    }[];
    rooms?: HotelRoom[];
  };
}

const ListViewHotelCard: FC<ListViewHotelCardProps> = ({
  className = "",
  data: {
    id,
    name,
    slug,
    hotelType,
    saleOff = 100,
    photos = [],
    reviewCount = 0,
    averageRating,
    Location: location = [],
    publishedStatus = "INACTIVE",
    stars,
    allowedGuests,
    chainName,
    checkInTime,
    checkOutTime,
  },
}) => {
  const pricePerNight = saleOff ?? 0;

  // Helper function to render location
  const renderLocation = () => {
    if (location.length > 0 && location[0]?.city && location[0].country) {
      return (
        <div className="flex items-center space-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
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
          <span>{`${location[0].city}, ${location[0].country}`}</span>
        </div>
      );
    }
    return null;
  };

  // Helper function to format price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  return (
    <div
      className={`nc-ListViewHotelCard group relative overflow-hidden rounded-md border-b border-neutral-100 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      data-nc-id="ListViewHotelCard"
    >
      <Link href={`/listing-hotel-detail/${slug}`}>
        <div className="flex items-center space-x-3 p-3">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-cover">
            {photos.length > 0 && (
              <img
                src={photos[0]?.url}
                alt={photos[0]?.caption ?? name}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h2 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                {name}
              </h2>
              {stars && (
                <span className="text-xs text-yellow-500">{stars}★</span>
              )}
            </div>

            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {hotelType} • {allowedGuests} guests
            </div>

            {renderLocation()}

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {pricePerNight
                  ? formatPrice(pricePerNight)
                  : "Contact for price"}{" "}
                /night
              </span>
              {!!averageRating && (
                <StartRating
                  reviewCount={reviewCount ?? 0}
                  rating={averageRating ?? 0}
                />
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(ListViewHotelCard);
