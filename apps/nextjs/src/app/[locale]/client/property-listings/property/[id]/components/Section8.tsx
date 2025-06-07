"use client";



import type { Property } from "~/utils/types";

interface ThingsToKnowProps {
  propertyData: Property;
}

const ThingsToKnow: React.FC<ThingsToKnowProps> = ({ propertyData }) => {
  // Direct translation mapping to avoid any prefixes
  const translate = (key: string) => {
    // Map keys directly without any prefixes
    const translations: Record<string, string> = {
      "thingsToKnow": "Things to Know",
      "cancellationPolicy": "Cancellation Policy",
      "noCancellationPolicy": "No cancellation policy provided",
      "checkInTime": "Check-in & Check-out",
      "checkIn": "Check-in",
      "checkOut": "Check-out",
      "notSpecified": "Not specified",
      "specialNote": "Special Note"
    };
    return translations[key] ?? key;
  };

  return (
    <div className="listingSection__wrap">
      {/* HEADING */}
      <h2 className="text-2xl font-semibold">{translate("thingsToKnow")}</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

      {/* CONTENT */}
      <div>
        <h4 className="text-lg font-semibold">
          {translate("cancellationPolicy")}
        </h4>
        <span className="mt-3 block text-neutral-500 dark:text-neutral-400">
          {propertyData.cancellationPolicy ??
            translate("noCancellationPolicy")}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

      {/* CONTENT */}
      <div>
        <h4 className="text-lg font-semibold">
          {translate("checkInTime")}
        </h4>
        <div className="mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
          <div className="flex justify-between gap-x-10 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
            <span>{translate("checkIn")}</span>
            <span>
              {propertyData.checkInTime
                ? new Date(propertyData.checkInTime).toLocaleTimeString()
                : translate("notSpecified")}
            </span>
          </div>
          <div className="flex justify-between gap-x-10 p-3">
            <span>{translate("checkOut")}</span>
            <span>
              {propertyData.checkOutTime
                ? new Date(propertyData.checkOutTime).toLocaleTimeString()
                : translate("notSpecified")}
            </span>
          </div>
        </div>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

      {/* CONTENT */}
      <div>
        <h4 className="text-lg font-semibold">
          {translate("specialNote")}
        </h4>
        <div className="prose sm:prose">
          <ul className="mt-3 space-y-2 text-neutral-500 dark:text-neutral-400">
            {propertyData.specialNotes
              ?.split("\n")
              .map((note, index) => <li key={index}>{note}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThingsToKnow;
