import type { FC } from "react";
import React from "react";
import Link from "next/link";

import type { StayDataType } from "~/data/types";
import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import GallerySlider from "~/app/_components/GallerySlider";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import { DEMO_STAY_LISTINGS } from "~/data/listings";
import Badge from "~/shared/Badge";

export interface StayCardHProps {
  className?: string;
  data?: StayDataType;
}

const DEMO_DATA = DEMO_STAY_LISTINGS[0];

const StayCardH: FC<StayCardHProps> = ({
  className = "",
  data = DEMO_DATA,
}) => {
  const {
    galleryImgs,
    listingCategory,
    address,
    title,
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
    <div className="relative w-full md:w-72">
      <GallerySlider
        ratioClass="aspect-w-6 aspect-h-5"
        galleryImgs={galleryImgs}
        uniqueID={`StayCardH_${id}`}
        href={href}
      />
      <BtnLikeIcon isLiked={like} className="absolute right-3 top-3" />
      {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
    </div>
  );

  const renderTienIch = () => (
    <div className="hidden grid-cols-3 gap-2 sm:grid">
      {[
        { icon: "las la-user", text: "6 guests" },
        { icon: "las la-bed", text: "6 beds" },
        { icon: "las la-bath", text: "3 baths" },
        { icon: "las la-smoking-ban", text: "No smoking" },
        { icon: "las la-door-open", text: "6 bedrooms" },
        { icon: "las la-wifi", text: "Wifi" },
      ].map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <i className={`${item.icon} text-lg`} />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );

  const renderContent = () => (
    <div className="flex flex-grow flex-col p-3 sm:p-5">
      <div className="space-y-2">
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {listingCategory.name} in {address}
        </div>
        <div className="flex items-center space-x-2">
          {isAds && <Badge name="ADS" color="green" />}
          <h2 className="line-clamp-1 text-lg font-medium capitalize">
            {title}
          </h2>
        </div>
      </div>
      <div className="my-4 hidden w-14 border-b border-neutral-100 dark:border-neutral-800 sm:block" />
      {renderTienIch()}
      <div className="my-4 w-14 border-b border-neutral-100 dark:border-neutral-800" />
      <div className="flex items-end justify-between">
        <StartRating reviewCount={reviewCount} point={reviewStart} />
        <span className="text-base font-semibold text-secondary-500">
          {price}{" "}
          <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
            /night
          </span>
        </span>
      </div>
    </div>
  );

  return (
    <div
      className={`nc-StayCardH relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-shadow hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      <Link href={href}>
        <a className="absolute inset-0"></a>
      </Link>
      <div className="grid grid-cols-1 md:flex md:flex-row">
        {renderSliderGallery()}
        {renderContent()}
      </div>
    </div>
  );
};

export default StayCardH;
