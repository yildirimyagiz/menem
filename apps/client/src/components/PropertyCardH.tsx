import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import type { Property } from "~/utils/interfaces";
import Badge from "~/shared/Badge";
import BtnLikeIcon from "./BtnLikeIcon";
import GallerySlider from "./GallerySlider";
import SaleOffBadge from "./SaleOffBadge";
import StartRating from "./starRating";

export interface PropertyCardHProps {
  property: Property;
}

const PropertyCardH: FC<PropertyCardHProps> = ({ property }) => {
  if (!property) return null;

  const {
    id,
    title,
    slug,
    propertyType,
    listingType,
    Photo = [],
    Location,
    PricingRules = [],
    featured,
    Review = [],
    averageRating,
    size,
    sizePrefix,
    isActive,
    Owner,
  } = property as any; // fallback for extra fields

  // Photos: use Photo array, fallback to placeholder
  import { getCityImage } from "~/utils/getCityImage";
// ...
const photos =
    Array.isArray(Photo) && Photo.length > 0
      ? Photo.map((photo: any) => ({
          src: photo.url,
          alt: photo.alt ?? title,
        }))
      : [
          {
            src: getCityImage(Location?.city),
            alt: title || "Property photo",
          },
        ];

  // Price: use first PricingRule with finalAmount, fallback to marketValue
  const price =
    Array.isArray(PricingRules) && PricingRules.length > 0
      ? PricingRules[0]
      : null;
  const priceAmount =
    price?.finalAmount ?? price?.baseAmount ?? property.marketValue ?? null;
  const priceCurrency = price?.currency ?? "USD";

  // Location: use Location object
  const location = Location || {};

  // Owner: use Owner object
  const owner = Owner || {};

  // Rating: use averageRating or compute from Review
  const reviewCount = Array.isArray(Review) ? Review.length : 0;
  const rating =
    typeof averageRating === "number"
      ? averageRating
      : reviewCount > 0
        ? Review.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
          reviewCount
        : null;

  const formatPrice = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(amount);
    } catch {
      return `${new Intl.NumberFormat("en-US").format(amount)} ${currency}`;
    }
  };

  const renderSliderGallery = () => (
    <div className="relative w-full flex-shrink-0 p-3 sm:w-64">
      <GallerySlider
        ratioClass="aspect-w-1 aspect-h-1"
        photos={photos}
        className="h-full w-full overflow-hidden rounded-2xl"
        uniqueID={`PropertyCard_${id}`}
        href={`/property/${id}`}
      />
      {featured && (
        <Badge
          name="Featured"
          color="green"
          className="absolute right-5 top-5"
        />
      )}
      {!isActive && (
        <Badge
          name="Inactive"
          color="red"
          className="absolute bottom-5 right-5"
        />
      )}
    </div>
  );

  const renderContent = () => (
    <div className="flex flex-grow flex-col items-start p-3 sm:pr-6">
      <div className="w-full space-y-4">
        <div className="inline-flex space-x-3">
          <Badge name={propertyType} />
          {listingType && <Badge name={listingType} color="yellow" />}
        </div>
        <h2 className="line-clamp-2 text-lg font-medium capitalize">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {size && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              <i className="las la-expand-arrows-alt"></i> {`${size} m²`}
            </span>
          )}
          {location && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              <i className="las la-map-marker-alt"></i>{" "}
              {`${location.city || ""}${location.city && location.country ? ", " : ""}${location.country || ""}`}
            </span>
          )}
        </div>
        <div className="w-14 border-b border-neutral-200/80 dark:border-neutral-700"></div>
        <div className="flex w-full items-end justify-between">
          {rating != null && <StartRating rating={rating} />}
          <span className="border-secondary-500 text-secondary-500 flex items-center justify-center rounded-lg border-2 px-2.5 py-1.5 text-sm font-medium leading-none">
            {priceAmount && priceCurrency
              ? formatPrice(priceAmount, priceCurrency)
              : "Price not available"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`nc-PropertyCard group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-neutral-700 dark:bg-neutral-900`}
    >
      <Link
        href={`/property/${id}`}
        className="absolute inset-0"
        aria-label="Property link"
      />
      <div className="flex h-full w-full flex-col sm:flex-row sm:items-center">
        {renderSliderGallery()}
        {renderContent()}
      </div>
      <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-sm">
        {owner.image ? (
          <Image
            src={owner.image}
            alt={owner.userName ?? owner.name ?? "User"}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
        )}
        <span className="text-neutral-600 dark:text-neutral-400">
          {owner.userName ?? owner.name ?? "Unknown User"}
        </span>
      </div>
      {location && (
        <div className="absolute bottom-3 right-12 flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400">
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
          <span className="line-clamp-1">
            {location.city && location.country
              ? `${location.city}, ${location.country}`
              : location.address || "Location not specified"}
          </span>
        </div>
      )}
      <BtnLikeIcon
        colorClass="bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 hover:bg-opacity-70 text-neutral-600 dark:text-neutral-400"
        isLiked={false}
        className="absolute right-5 top-5 sm:right-3 sm:top-3"
      />
    </div>
  );
};

export default PropertyCardH;
