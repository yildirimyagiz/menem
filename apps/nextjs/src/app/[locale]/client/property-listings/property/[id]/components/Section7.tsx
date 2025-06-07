"use client";

import { useTranslations } from "next-intl";

import type { Property } from "~/utils/types";

interface LocationProps {
  propertyData: Property;
}

const Location: React.FC<LocationProps> = ({ propertyData }) => {
  const t = useTranslations("properties");

  const location = propertyData.location;
  const hasValidLocation = location?.address || location?.city || location?.country;
  const formattedAddress = hasValidLocation
    ? [
        location.address,
        location.city,
        location.state,
        location.country,
      ]
        .filter(Boolean)
        .join(", ")
    : t("detail.locationNotAvailable");

  return (
    <div className="listingSection__wrap">
      {/* HEADING */}
      <div>
        <h2 className="text-2xl font-semibold">{t("detail.sections.location")}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {formattedAddress}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

      {/* MAP */}
      {hasValidLocation && (
        <div className="aspect-h-5 aspect-w-5 sm:aspect-h-3 z-0 rounded-xl ring-1 ring-black/10">
          <div className="z-0 overflow-hidden rounded-xl">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY&q=${encodeURIComponent(
                formattedAddress
              )}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
