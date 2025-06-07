import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import { DEMO_CAR_LISTINGS } from "~/data/listings";
import { CarDataType } from "~/data/types";
import Badge from "~/shared/Badge";

export interface CarCardProps {
  className?: string;
  data?: CarDataType;
  size?: "default" | "small";
}

const DEMO_DATA: CarDataType = DEMO_CAR_LISTINGS[0];

const CarCard: FC<CarCardProps> = ({
  size = "default",
  className = "",
  data = DEMO_DATA,
}) => {
  const {
    featuredImage,
    title,
    href,
    like,
    saleOff,
    isAds,
    price,
    reviewStart,
    reviewCount,
    seats,
    gearshift,
  } = data;

  const renderSliderGallery = () => (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div className="aspect-w-16 aspect-h-9">
        <Image
          fill
          src={featuredImage}
          alt={`Featured image of ${title}`}
          sizes="(max-width: 640px) 100vw, 350px"
          aria-hidden="true"
        />
      </div>
      <BtnLikeIcon
        isLiked={like}
        className="absolute right-3 top-3 z-[1]"
        aria-label={like ? "Unlike this car" : "Like this car"}
      />
      {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
    </div>
  );

  const renderContent = () => (
    <div
      className={`p-${size === "default" ? "5" : "3"} space-y-${size === "default" ? "4" : "2"}`}
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {isAds && <Badge name="ADS" color="green" />}
          <h2
            className={`capitalize ${size === "default" ? "text-xl font-semibold" : "text-base font-medium"}`}
          >
            <span className="line-clamp-1">{title}</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>{seats} seats</span>
          <span>-</span>
          <span>{gearshift}</span>
        </div>
      </div>
      <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">
          {price}
          {size === "default" && (
            <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
              {" "}
              /day
            </span>
          )}
        </span>
        <StartRating reviewCount={reviewCount} point={reviewStart} />
      </div>
    </div>
  );

  return (
    <div
      className={`nc-CarCard group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
      aria-label={`Car card for ${title}`}
    >
      <Link
        href={href}
        className="flex flex-col"
        aria-label={`View details for ${title}`}
      >
        {renderSliderGallery()}
        {renderContent()}
      </Link>
    </div>
  );
};

export default React.memo(CarCard);
