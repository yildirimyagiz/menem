import type { Route } from "next";
import type { FC } from "react";
import React from "react";
import Link from "next/link";

import type { Currency, Hotel, Location, Photo } from "~/utils/types";
import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import GallerySlider from "~/app/_components/GallerySlider";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import Badge from "~/shared/Badge";
import { PublishedStatus } from "~/utils/types";

export interface HotelCard2Props {
  className?: string;
  data: Partial<Hotel> & {
    id: string;
    name: string;
    slug: string;
    photos: Photo[];
    location?: Location | null;
    hotelType: string;
    stars: number;
    pricePerNight?: number | null;
    currency?: Currency;
    saleOff?: number | null;
    reviewCount?: number | null;
    averageRating?: number | null;
    publishedStatus: PublishedStatus;
  };
  size?: "default" | "small";
}

const createHotelDetailRoute = (slug: string): Route => {
  return `/listing-hotel-detail/${slug}` as Route;
};

const HotelCard2: FC<HotelCard2Props> = ({
  size = "default",
  className = "",
  data,
}) => {
  const {
    id,
    name,
    slug,
    stars,
    hotelType,
    pricePerNight,
    currency = "USD",
    saleOff,
    photos,
    reviewCount,
    averageRating,
    location,
    publishedStatus,
  } = data;

  const renderSliderGallery = () => {
    const hotelDetailRoute = createHotelDetailRoute(slug);

    return (
      <div className="relative w-full">
        <GallerySlider
          uniqueID={`HotelCard2_${id}`}
          ratioClass="aspect-w-12 aspect-h-11"
          photos={photos.map((photo) => ({
            src: photo.url,
            alt: photo.caption,
          }))}
          imageClass="rounded-lg"
          href={hotelDetailRoute}
        />
        <BtnLikeIcon isLiked={false} className="absolute right-3 top-3 z-[1]" />
        {saleOff && saleOff > 0 && (
          <SaleOffBadge className="absolute left-3 top-3" />
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "mt-3 space-y-3" : "mt-2 space-y-2"}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {hotelType} · {stars}★
            </span>
            {publishedStatus !== PublishedStatus.ACTIVE && (
              <Badge name={publishedStatus} color="yellow" />
            )}
          </div>
          <h2
            className={`font-semibold capitalize text-neutral-900 dark:text-white ${
              size === "default" ? "text-base" : "text-base"
            }`}
          >
            <span className="line-clamp-1">{name}</span>
          </h2>
          {location && (
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
              <span className="">{`${location.city}, ${location.country}`}</span>
            </div>
          )}
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
            }).format(pricePerNight ?? 0)}
            {` `}
            {size === "default" && (
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                /night
              </span>
            )}
          </span>
          {!!averageRating && (
            <StartRating
              reviewCount={reviewCount ?? 0}
              rating={averageRating}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-HotelCard2 group relative ${className}`}>
      {renderSliderGallery()}
      <Link href={createHotelDetailRoute(slug)}>{renderContent()}</Link>
    </div>
  );
};

export default HotelCard2;
