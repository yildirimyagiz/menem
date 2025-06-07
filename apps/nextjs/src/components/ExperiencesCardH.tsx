import type { FC } from "react";
import React from "react";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";

import type { ExperiencesDataType } from "~/data/types";
import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import GallerySlider from "~/app/_components/GallerySlider";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import { DEMO_EXPERIENCES_LISTINGS } from "~/data/listings";
import Avatar from "~/shared/Avatar";
import Badge from "~/shared/Badge";

export interface ExperiencesCardHProps {
  className?: string;
  data?: ExperiencesDataType;
}

const DEMO_DATA: ExperiencesDataType = DEMO_EXPERIENCES_LISTINGS[0];

const ExperiencesCardH: FC<ExperiencesCardHProps> = ({
  className = "",
  data = DEMO_DATA,
}) => {
  const {
    galleryImgs,
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
    id,
  } = data;

  return (
    <div
      className={`nc-ExperiencesCardH group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
    >
      <Link href={href} passHref>
        <a className="absolute inset-0" aria-label={title} />
      </Link>

      <div className="md:flex md:flex-row">
        {/* Gallery Slider */}
        <div className="relative w-full flex-shrink-0 overflow-hidden md:w-72">
          <GallerySlider
            ratioClass="aspect-w-12 aspect-h-9 md:aspect-h-11"
            galleryImgs={galleryImgs}
            uniqueID={`ExperiencesCardH_${id}`}
            href={href}
          />
          <BtnLikeIcon isLiked={like} className="absolute right-3 top-3" />
          {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
        </div>

        {/* Content */}
        <div className="flex flex-grow flex-col p-3 sm:p-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {isAds && <Badge name="ADS" color="green" />}
              <h2 className="text-lg font-medium capitalize">
                <span className="line-clamp-1">{title}</span>
              </h2>
            </div>
            <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
              <StartRating reviewCount={reviewCount} point={reviewStart} />
              <span>·</span>
              <div className="flex items-center">
                <MapPinIcon className="hidden h-4 w-4 sm:block" />
                <span className="sm:ml-2">{address}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 hidden text-sm text-neutral-500 dark:text-neutral-400 sm:block">
            <span className="line-clamp-2">
              Making a cup of coffee in Vietnam is a whole process that you
              barely have free time in the middle. But it&apos;s also not a
              really complicated task to start the day with
            </span>
          </div>
          <div className="mt-4 flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
              <i className="las la-clock text-lg"></i>
              <span>3 hours</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
              <i className="las la-user text-lg"></i>
              <span>Up to 6 people</span>
            </div>
          </div>
          <div className="my-4 w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
          <div className="flex items-end justify-between">
            <div className="flex items-center space-x-3 text-sm text-neutral-700 dark:text-neutral-300">
              <Avatar imgUrl={author.avatar} userName={author.displayName} />
              <span className="hidden sm:inline-block">
                Hosted by {author.displayName}
              </span>
            </div>
            <span className="text-secondary-700 text-base font-semibold">
              {price}{" "}
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                /person
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesCardH;
