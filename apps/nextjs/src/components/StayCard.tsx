import type { FC } from "react";
import React from "react";
import Link from "next/link";

import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import { DEMO_STAY_LISTINGS } from "~/data/listings";
import { StayDataType } from "~/data/types";
import Badge from "~/shared/Badge";
import GallerySlider from "./GallerySlider";

export interface StayCardProps {
  className?: string;
  data?: StayDataType;
  size?: "default" | "small";
}

const DEMO_DATA = DEMO_STAY_LISTINGS[0];

const StayCard: FC<StayCardProps> = ({
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
        uniqueID={`StayCard_${id}`}
        ratioClass="aspect-w-4 aspect-h-3"
        galleryImgs={galleryImgs}
        href={href}
      />
      <BtnLikeIcon isLiked={like} className="absolute right-3 top-3 z-[1]" />
      {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
    </div>
  );

  const renderContent = () => (
    <div
      className={`p-${size === "default" ? "4" : "3"} space-y-${size === "default" ? "4" : "1"}`}
    >
      <div className={`space-y-${size === "default" ? "2" : "1"}`}>
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
    <div
      className={`nc-StayCard group relative overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-xl dark:bg-neutral-900 ${className} ${size === "default" ? "border border-neutral-100 dark:border-neutral-800" : ""}`}
      data-nc-id="StayCard"
    >
      {renderSliderGallery()}
      <Link href={href}>{renderContent()}</Link>
    </div>
  );
};

export default StayCard;
