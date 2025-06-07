import type { FC } from "react";
import React from "react";
import Link from "next/link";

import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import GallerySlider from "~/app/_components/GallerySlider";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import { DEMO_STAY_LISTINGS } from "~/data/listings";
import { StayDataType } from "~/data/types";
import Badge from "~/shared/Badge";

export interface StayCard2Props {
  className?: string;
  data?: StayDataType;
  size?: "default" | "small";
}

const DEMO_DATA = DEMO_STAY_LISTINGS[0];

const StayCard2: FC<StayCard2Props> = ({
  size = "default",
  className = "",
  data = DEMO_DATA,
}) => {
  const {
    galleryImgs,
    listingCategory,
    address,
    title,
    bedrooms,
    href,
    like,
    saleOff,
    isAds,
    price,
    reviewStart,
    reviewCount,
    id,
  } = data;

  const renderSliderGallery = () => (
    <div className="relative w-full">
      <GallerySlider
        uniqueID={`StayCard2_${id}`}
        ratioClass="aspect-w-12 aspect-h-11"
        galleryImgs={galleryImgs}
        imageClass="rounded-lg"
        href={href}
      />
      <BtnLikeIcon isLiked={like} className="absolute right-3 top-3 z-[1]" />
      {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
    </div>
  );

  const renderContent = () => (
    <div
      className={`mt-${size === "default" ? "3" : "2"} space-y-${size === "default" ? "3" : "2"}`}
    >
      <div className="space-y-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {listingCategory.name} · {bedrooms} beds
        </span>
        <div className="flex items-center space-x-2">
          {isAds && <Badge name="ADS" color="green" />}
          <h2 className="line-clamp-1 text-base font-semibold capitalize text-neutral-900 dark:text-white">
            {title}
          </h2>
        </div>
        {size === "default" && (
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
            <span>{address}</span>
          </div>
        )}
      </div>
      <div className="w-14 border-b border-neutral-100 dark:border-neutral-800" />
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">
          {price}
          {size === "default" && (
            <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
              /night
            </span>
          )}
        </span>
        {reviewStart && (
          <StartRating reviewCount={reviewCount} point={reviewStart} />
        )}
      </div>
    </div>
  );

  return (
    <div className={`nc-StayCard2 group relative ${className}`}>
      {renderSliderGallery()}
      <Link href={href}>{renderContent()}</Link>
    </div>
  );
};

export default StayCard2;
