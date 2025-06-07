import type { FC } from "react";
import React from "react";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";

import type { ExperienceFilterParams } from "../_actions/filters/ExperienceFilter";
import type { Currency, Photo, PhotoFormat, Price } from "~/utils/types";
import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import GallerySlider from "~/app/_components/GallerySlider";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import Badge from "~/shared/Badge";

export interface ExperiencesCardProps {
  location: {
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    id: string;
    address: string;
    slug: string;
  }[];
  price: {
    baseAmount: number;
    finalAmount: number;
    currency: Currency;
    isActive: boolean;
  }[];
  photos: {
    id: string;
    url: string;
    alt: string | null;
    width: number;
    height: number;
    caption: string | null;
    format: PhotoFormat;
    metadata: Record<string, unknown> | null;
  }[];
  className?: string;
  ratioClass?: string;
  data: Experience;
  size?: "default" | "small";
  onFilterChange: (selectedFilters: Partial<ExperienceFilterParams>) => void;
  currentFilters?: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

export interface Experience {
  id: string;
  photos: {
    id: string;
    url: string;
    alt: string | null;
    width: number;
    height: number;
    caption: string | null;
    format: PhotoFormat;
    metadata: Record<string, unknown> | null;
  }[];
  location: {
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    slug: string;
  }[];
  price: {
    baseAmount: number;
    finalAmount: number;
    currency: Currency;
    isActive: boolean;
  }[];
  title: string;
  href: string;
  like: boolean;
  saleOff: boolean;
  isAds: boolean;
  reviewCount: number;
  averageRating: number;
  viewCount: number;
  commentCount?: number;
  maxGuests: number;
}

const ExperiencesCard: FC<ExperiencesCardProps> = ({
  size = "default",
  className = "",
  data,
  ratioClass = "aspect-w-3 aspect-h-3",
}) => {
  const {
    id,
    photos = [],
    location,
    title,
    href,
    like,
    saleOff,
    isAds,
    price,
    reviewCount,
    averageRating,
  } = data;

  return (
    <div
      className={`nc-ExperiencesCard group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
    >
      <Link
        href={href}
        className="absolute inset-0"
        aria-label="Experience link"
      />
      <div className="relative w-full overflow-hidden rounded-2xl">
        <GallerySlider
          uniqueID={`ExperiencesCard_${id}`}
          ratioClass={ratioClass}
          photos={photos.map((photo) => ({ src: photo.url, alt: title }))}
          href={href}
        />
        <BtnLikeIcon isLiked={like} className="absolute right-3 top-3" />
        {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
      </div>

      <div
        className={`flex flex-col p-3 sm:p-4 space-y-${size === "default" ? "3" : "1"}`}
      >
        <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          {size === "default" && <MapPinIcon className="h-4 w-4" />}
          <span>{location.map((loc) => loc.city).join(", ")}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isAds && <Badge name="ADS" color="green" />}
          <h2
            className={`font-medium capitalize ${size === "small" ? "text-sm" : "text-base"}`}
          >
            <span className="line-clamp-1">{title}</span>
          </h2>
        </div>
        <div className="border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">
            {price.map((p) => `${p.baseAmount} ${p.currency}`).join(", ")}
            {size === "default" && (
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                {" "}
                /person
              </span>
            )}
          </span>
          <StartRating reviewCount={reviewCount} rating={averageRating} />
        </div>
      </div>
    </div>
  );
};

export default ExperiencesCard;
