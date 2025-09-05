import { memo } from "react";
import Link from "next/link";

import type { Currency } from "~/utils/interfaces";
import Badge from "~/shared/Badge";
import { getCityImage } from "~/utils/getCityImage";
import BtnLikeIcon from "./BtnLikeIcon";
import GallerySlider from "./GallerySlider";
import StartRating from "./StartRating";

interface PropertyCardInput {
  id: string;
  title: string;
  description?: string;
  propertyType: string;
  propertyStatus: string;
  photos: { url: string; alt: string; featured?: boolean }[];
  location: { city: string; country: string };
  price: { isActive: boolean; finalAmount: number; currency: Currency }[];
  averageRating?: number;
  reviewCount?: number;
  garageSpaces?: number;
  ecoFriendly?: boolean;
  petFriendly?: boolean;
  size: string | number;
  sizePrefix?: string;
  slug: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: PropertyCardInput;
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
      photos = [],
      location = { city: "", country: "" },
      price = [],
      slug,
      garageSpaces,
      ecoFriendly,
      petFriendly,
    },
    className = "",
    size: _cardSize = "default",
  }: PropertyCardProps) => {
    const activePrice = price.find((p) => p.isActive);

    // Sort photos to put featured first
    let sortedPhotos = Array.isArray(photos) ? photos.filter(Boolean) : [];
    if (sortedPhotos.length > 1) {
      const featuredIdx = sortedPhotos.findIndex((p) => p.featured);
      if (featuredIdx > 0) {
        const [featuredPhoto] = sortedPhotos.splice(featuredIdx, 1);
        if (featuredPhoto) {
          sortedPhotos.unshift(featuredPhoto);
        }
      }
    }
    if (sortedPhotos.length === 0) {
      sortedPhotos = [
        {
          url: getCityImage(location.city),
          alt: title || "Property photo",
        },
      ];
    }

    const renderLocation = () =>
      location.city && location.country ? (
        <div className="flex items-center space-x-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{`${location.city}, ${location.country}`}</span>
        </div>
      ) : null;

    const formatPrice = (amount: number, currency: Currency) => {
      return `${amount.toLocaleString()} ${currency.code}`;
    };

    return (
      <Link
        href={`/property/${slug}`}
        className={`group block h-full transition-shadow duration-200 hover:shadow-2xl focus:outline-none ${className}`}
        tabIndex={0}
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900`}
          data-nc-id="PropertyCard"
        >
          {/* Image section */}
          <div className="aspect-w-4 aspect-h-3 relative w-full overflow-hidden">
            <GallerySlider
              uniqueID={`PropertyCard_${id}`}
              ratioClass="aspect-w-4 aspect-h-3"
              photos={sortedPhotos.map((photo) => ({
                src: photo.url,
                alt: photo.alt,
              }))}
              href={`/property/${slug}`}
            />
            {/* Featured badge */}
            {featured && (
              <span className="bg-primary-500 absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold text-white shadow">
                Featured
              </span>
            )}
            {/* Price badge */}
            {activePrice && (
              <span className="text-primary-700 absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow">
                {formatPrice(activePrice.finalAmount, activePrice.currency)}
              </span>
            )}
            <BtnLikeIcon
              isLiked={false}
              className="absolute bottom-3 right-3 z-[1]"
            />
          </div>

          {/* Card content */}
          <div className="flex flex-1 flex-col p-4">
            <h2 className="mb-1 line-clamp-2 text-lg font-semibold text-neutral-900 dark:text-white">
              {title}
            </h2>
            {renderLocation()}
            <div className="mb-2 line-clamp-3 min-h-[48px] text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </div>
            <div className="mb-2 flex flex-wrap gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span>{propertyType}</span>
              <span>•</span>
              <span>
                {String(size)} {sizePrefix ?? ""}
              </span>
              {typeof garageSpaces === "number" && (
                <>
                  <span>•</span>
                  <span>{garageSpaces} Garages</span>
                </>
              )}
              {ecoFriendly && <Badge name="Eco-friendly" color="green" />}
              {petFriendly && <Badge name="Pet-friendly" color="blue" />}
              <span>•</span>
              <span>{propertyStatus}</span>
            </div>
            <div className="mt-auto flex items-center justify-between">
              {typeof averageRating === "number" && averageRating > 0 ? (
                <StartRating rating={averageRating} reviewCount={reviewCount ?? 0} />
              ) : (
                <span className="text-xs text-neutral-400">No rating</span>
              )}
              <button
                className="bg-primary-500 hover:bg-primary-600 ml-2 rounded-full px-4 py-1 text-xs font-semibold text-white transition"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/property/${slug}`;
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  },
);

export default memo(PropertyCard);
