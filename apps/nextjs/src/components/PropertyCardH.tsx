import type { FC } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import type { Property } from "~/utils/types";
import BtnLikeIcon from "~/app/_components/BtnLikeIcon";
import GallerySlider from "~/app/_components/GallerySlider";
import SaleOffBadge from "~/app/_components/SaleOffBadge";
import StartRating from "~/app/_components/StartRating";
import Badge from "~/shared/Badge";

export interface PropertyCardHProps {
  property: Property;
}

const PropertyCardH: FC<PropertyCardHProps> = ({ property }) => {
  if (!property) return null;

  const {
    id,
    title,
    slug,
    type,
    listingType,
    photos = [],
    location,
    price = [],
    saleOff,
    featured,
    reviewCount,
    averageRating,
    size,
    sizePrefix,
    isActive,
    owner,
  } = property;

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
        photos={photos.map((photo) => ({
          src: photo.url,
          alt: photo.caption ?? title,
        }))}
        className="h-full w-full overflow-hidden rounded-2xl"
        uniqueID={`PropertyCard_${id}`}
        href={`/properties/${slug}`}
      />
      {saleOff && saleOff > 0 && (
        <SaleOffBadge className="absolute left-5 top-5" />
      )}
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
          <Badge
            name={
              <>
                <i className="las la-home text-sm"></i> {type}
              </>
            }
          />
          <Badge
            name={
              <>
                <i className="las la-tag text-sm"></i> {listingType}
              </>
            }
            color="yellow"
          />
        </div>
        <h2 className="line-clamp-2 text-lg font-medium capitalize">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {size && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              <i className="las la-expand-arrows-alt"></i>{" "}
              {`${size} ${sizePrefix}`}
            </span>
          )}
          {location && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              <i className="las la-map-marker-alt"></i>{" "}
              {`${location.city}, ${location.state}, ${location.country}`}
            </span>
          )}
        </div>
        <div className="w-14 border-b border-neutral-200/80 dark:border-neutral-700"></div>
        <div className="flex w-full items-end justify-between">
          {averageRating != null && reviewCount != null && (
            <StartRating reviewCount={reviewCount} rating={averageRating} />
          )}
          <span className="flex items-center justify-center rounded-lg border-2 border-secondary-500 px-2.5 py-1.5 text-sm font-medium leading-none text-secondary-500">
            {price[0]?.finalAmount && price[0]?.currency
              ? formatPrice(price[0].finalAmount, price[0].currency)
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
        href={`/properties/${slug}`}
        className="absolute inset-0"
        aria-label="Property link"
      />
      <div className="flex h-full w-full flex-col sm:flex-row sm:items-center">
        {renderSliderGallery()}
        {renderContent()}
      </div>
      <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-sm">
        {owner && owner.image ? (
          <Image
            src={owner.image}
            alt={owner.userName || "User"}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
        )}
        <span className="text-neutral-600 dark:text-neutral-400">
          {owner.userName ?? "Unknown User"}
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
