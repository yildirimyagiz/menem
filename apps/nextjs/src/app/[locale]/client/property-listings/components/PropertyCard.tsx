import type { FC } from "react";
import React, { memo, useMemo } from "react";
import Link from "next/link";

import type { Property } from "@acme/validators";

import BtnLikeIcon from "~/components/BtnLikeIcon";
import SaleOffBadge from "~/components/SaleOffBadge";
import GallerySlider from "./GallerySlider";

interface PropertyCardProps {
  data: Property & {
    saleOff?: number | null;
    Photo?: {
      url?: string;
      alt?: string;
    }[];
    PricingRules?: {
      finalAmount?: number;
      baseAmount?: number;
      currency?: string;
    }[];
  };
  className?: string;
  size?: "default" | "small";
}

interface PropertyDetailsProps {
  title: string;
  description: string;
  propertyType?: string;
  propertyStatus?: string;
  propertySize?: number;
  city?: string;
  country?: string;
  priceAmount?: number;
  priceCurrency: string;
  size: "default" | "small";
}

const PropertyDetails: FC<PropertyDetailsProps> = ({
  title,
  description,
  propertyType,
  propertyStatus,
  propertySize,
  city,
  country,
  priceAmount,
  priceCurrency,
  size,
}) => {
  const renderLocation = () => {
    if (!city || !country) return null;
    return (
      <div className="flex items-center space-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        <span>{`${city}, ${country}`}</span>
      </div>
    );
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className={size === "default" ? "space-y-4 p-4" : "space-y-1 p-3"}>
      <div className="flex items-center justify-between">
        <h2 className="line-clamp-1 font-semibold capitalize text-neutral-900 dark:text-white">
          {title}
        </h2>
      </div>
      {renderLocation()}
      <div className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </div>
      <div className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        {typeof propertySize === "number" && (
          <>
            <span>{propertySize} m²</span>
            <span>•</span>
          </>
        )}
        {propertyType && (
          <>
            <span>•</span>
            <span>{propertyType}</span>
          </>
        )}
        {propertyStatus && (
          <>
            <span>•</span>
            <span>{propertyStatus}</span>
          </>
        )}
      </div>
      {typeof priceAmount === "number" && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold">
            {formatPrice(priceAmount)}
            {priceCurrency !== "USD" && (
              <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
                {priceCurrency}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

const PropertyCard: FC<PropertyCardProps> = (props) => {
  const { data, className = "", size = "default" } = props;

  const {
    id,
    title,
    description,
    propertyType,
    propertyStatus,
    size: propertySize,
    Location,
    Photo,
    saleOff,
    PricingRules,
  } = data;

  const href = useMemo(() => (id ? `/property/${id}` : undefined), [id]);

  const photos = useMemo(() => (Array.isArray(Photo) ? Photo : []), [Photo]);

  const { priceAmount, priceCurrency } = useMemo(() => {
    const pricingRule = Array.isArray(PricingRules)
      ? PricingRules[0]
      : undefined;
    return {
      priceAmount: pricingRule?.finalAmount ?? pricingRule?.baseAmount,
      priceCurrency: pricingRule?.currency ?? "USD",
    };
  }, [PricingRules]);

  const renderSliderGallery = () => (
    <div className="relative w-full">
      <GallerySlider
        uniqueID={`PropertyCard_${id}`}
        ratioClass="aspect-w-4 aspect-h-3"
        photos={photos.map((photo) => ({
          src: photo.url ?? "",
          alt: photo.alt ?? title,
        }))}
        href={href ?? ""}
      />
      <BtnLikeIcon isLiked={false} className="absolute right-3 top-3 z-[1]" />
      {saleOff && saleOff > 0 && (
        <SaleOffBadge
          className="absolute left-3 top-3"
          percentage={saleOff}
          value={0}
        />
      )}
    </div>
  );

  return (
    <div
      className={`nc-PropertyCard group relative bg-white dark:bg-neutral-900 ${
        size === "default"
          ? "border border-neutral-100 dark:border-neutral-800"
          : ""
      } overflow-hidden rounded-2xl transition-shadow hover:shadow-xl ${className}`}
      data-nc-id="PropertyCard"
    >
      {renderSliderGallery()}
      {href ? (
        <Link href={href}>
          <PropertyDetails
            title={title}
            description={description}
            propertyType={propertyType}
            propertyStatus={propertyStatus}
            propertySize={propertySize}
            city={Location?.city}
            country={Location?.country}
            priceAmount={priceAmount}
            priceCurrency={priceCurrency}
            size={size}
          />
        </Link>
      ) : (
        <PropertyDetails
          title={title}
          description={description}
          propertyType={propertyType}
          propertyStatus={propertyStatus}
          propertySize={propertySize}
          city={Location?.city}
          country={Location?.country}
          priceAmount={priceAmount}
          priceCurrency={priceCurrency}
          size={size}
        />
      )}
    </div>
  );
};

export default memo(PropertyCard);
