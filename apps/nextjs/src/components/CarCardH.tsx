import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import { DEMO_CAR_LISTINGS } from "~/data/listings";
import { CarDataType } from "~/data/types";
import Avatar from "~/shared/Avatar";
import Badge from "~/shared/Badge";

export interface CarCardHProps {
  className?: string;
  data?: CarDataType;
}

const DEMO_DATA: CarDataType = DEMO_CAR_LISTINGS[0];

const CarCardH: FC<CarCardHProps> = ({ className = "", data = DEMO_DATA }) => {
  const {
    address,
    title,
    href,
    like,
    saleOff,
    isAds,
    price,
    reviewStart,
    reviewCount,
    author,
    featuredImage,
  } = data;

  const renderSliderGallery = () => (
    <div className="relative flex w-full flex-shrink-0 items-center justify-center border-r border-neutral-200/80 dark:border-neutral-700 md:w-72">
      <div className="w-full py-5 sm:py-0">
        <Image
          alt={`Featured image of ${title}`}
          className="w-full"
          src={featuredImage}
          sizes="(max-width: 640px) 100vw, 300px"
          aria-hidden="true"
        />
      </div>
      <BtnLikeIcon
        isLiked={like}
        className="absolute right-3 top-3"
        aria-label={like ? "Unlike this car" : "Like this car"}
      />
      {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
    </div>
  );

  const renderContent = () => (
    <div className="flex flex-grow flex-col p-3 sm:p-5">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {isAds && <Badge name="ADS" color="green" />}
          <h2 className="text-xl font-semibold capitalize">
            <span className="line-clamp-1">{title}</span>
          </h2>
        </div>
        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
          <StartRating reviewCount={reviewCount} point={reviewStart} />
          <span>·</span>
          <div className="flex items-center">
            <span
              className="hidden text-base sm:inline-block"
              aria-hidden="true"
            >
              <i className="las la-map-marked" />
            </span>
            <span className="line-clamp-1 sm:ml-2">{address}</span>
          </div>
        </div>
      </div>
      <div className="my-4 hidden w-14 border-b border-neutral-200/80 dark:border-neutral-700 sm:block"></div>
      {/* MOBILE VIEW */}
      <div className="mt-4 flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400 sm:mt-0 sm:hidden">
        <span>4 seats</span>
        <span>·</span>
        <span>Auto gearbox</span>
        <span>·</span>
        <span>2 bags</span>
      </div>
      {/* DESKTOP VIEW */}
      <div className="hidden items-center space-x-8 sm:flex">
        <div className="flex items-center space-x-2">
          <i className="las la-user-friends text-xl" aria-hidden="true" />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            4 seats
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <i className="las la-dharmachakra text-xl" aria-hidden="true" />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Auto gearbox
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <i className="las la-suitcase text-xl" aria-hidden="true" />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            2 bags
          </span>
        </div>
      </div>

      <div className="my-4 w-14 border-b border-neutral-200/80 dark:border-neutral-700"></div>
      <div className="flex items-end justify-between">
        <div className="flex items-center space-x-3 text-sm text-neutral-700 dark:text-neutral-300">
          <Avatar imgUrl={author.avatar} userName={author.displayName} />
          <span className="hidden sm:inline-block">
            <span className="hidden sm:inline">Car owner </span>
            {author.displayName}
          </span>
        </div>
        <span className="text-secondary-700 text-lg font-semibold">
          {price}
          <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
            {" "}
            /day
          </span>
        </span>
      </div>
    </div>
  );

  return (
    <div
      className={`nc-CarCardH group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
      aria-label={`Car card for ${title}`}
    >
      <Link
        href={href}
        className="flex flex-col md:flex-row"
        aria-label={`View details for ${title}`}
      >
        {renderSliderGallery()}
        {renderContent()}
      </Link>
    </div>
  );
};

export default React.memo(CarCardH);
