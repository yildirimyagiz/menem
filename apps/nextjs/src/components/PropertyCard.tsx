import { memo } from "react";
import Link from "next/link";

import type { Currency, Property } from "~/utils/interfaces";
import Badge from "~/shared/Badge";
import BtnLikeIcon from "./BtnLikeIcon";
import GallerySlider from "./GallerySlider";
import StartRating from "./StartRating";

interface PropertyCardProps {
  property: Property & {
    photos: { url: string; alt: string }[];
    location: {
      city: string;
      country: string;
    };
    price: {
      isActive: boolean;
      finalAmount: number;
      currency: Currency;
    }[];
    averageRating: number;
    reviewCount: number;
    garageSpaces: number;
    ecoFriendly: boolean;
    petFriendly: boolean;
    size: string;
    sizePrefix: string;
    propertyType: string;
    propertyStatus: string;
    slug: string;
  };
  className?: string;
  size?: "default" | "small";
}

const PropertyCard = memo(
  ({
    property: {
      id,
      title,
      description,
      propertyType,
      propertyStatus,
      featured,
      size,
      sizePrefix,
      averageRating,
      reviewCount,
      photos,
      location,
      price,
      slug,
      garageSpaces,
      ecoFriendly,
      petFriendly,
    },
    className = "",
    size: cardSize = "default",
  }: PropertyCardProps) => {
    const activePrice = price.find((p) => p.isActive);

    const renderSliderGallery = () => {
      const href = `/property/${slug}`;
      return (
        <div className="relative w-full">
          <GallerySlider
            uniqueID={`PropertyCard_${id}`}
            ratioClass="aspect-w-4 aspect-h-3"
            photos={photos.map((photo) => ({
              src: photo.url,
              alt: photo.alt ?? title,
            }))}
            href={href}
          />
          <BtnLikeIcon
            isLiked={false}
            className="absolute right-3 top-3 z-[1]"
          />
        </div>
      );
    };

    const renderLocation = () =>
      location.city && location.country ? (
        <div className="flex items-center space-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <span>{`${location.city}, ${location.country}`}</span>
        </div>
      ) : null;

    const formatPrice = (amount: number, currency: Currency) => {
      if (!currency) return `${amount.toLocaleString()} unknown`;
      return `${amount.toLocaleString()} ${currency.code}`;
    };

    return (
      <div
        className={`nc-PropertyCard group relative bg-white dark:bg-neutral-900 ${
          cardSize === "default"
            ? "border border-neutral-100 dark:border-neutral-800"
            : ""
        } overflow-hidden rounded-2xl transition-shadow hover:shadow-xl ${className}`}
        data-nc-id="PropertyCard"
      >
        {renderSliderGallery()}

        <Link href={`/property/${slug}`}>
          <div
            className={
              cardSize === "default" ? "space-y-4 p-4" : "space-y-1 p-3"
            }
          >
            <div className="flex items-center justify-between">
              <h2 className="line-clamp-1 font-semibold capitalize text-neutral-900 dark:text-white">
                {title}
              </h2>
              {featured && <Badge name="Featured" color="green" />}
            </div>
            {renderLocation()}
            <div className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{propertyType}</span>
              <span>•</span>
              <span>
                {size} {sizePrefix}
              </span>
              <span>•</span>
              <span>{garageSpaces} Garages</span>
              {ecoFriendly && <Badge name="Eco-friendly" color="green" />}
              {petFriendly && <Badge name="Pet-friendly" color="blue" />}
              <span>•</span>
              <span>{propertyStatus}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {activePrice && (
                <span className="text-lg font-semibold">
                  {formatPrice(activePrice.finalAmount, activePrice.currency)}
                </span>
              )}
              {averageRating && (
                <StartRating rating={averageRating} reviewCount={reviewCount} />
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  },
);

export default memo(PropertyCard);
