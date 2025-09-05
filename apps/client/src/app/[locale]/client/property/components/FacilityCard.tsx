"use client";

import { useTranslations } from "next-intl";

interface FacilityLike {
  name?: string;
  type?: string;
  status?: string;
  FacilityAmenities?: string[] | undefined;
  locationAmenities?: string[] | undefined;
}

export default function FacilityCard({ facility }: { facility?: FacilityLike | null }) {
  const t = useTranslations("ClientPropertyDetail");
  if (!facility) return null;

  const fa = Array.isArray(facility.FacilityAmenities) ? facility.FacilityAmenities : [];
  const la = Array.isArray(facility.locationAmenities) ? facility.locationAmenities : [];

  return (
    <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-foreground">{t("facility.title", { default: "Facility" })}</h3>
        <div className="text-xs text-muted-foreground">
          {facility.type && <span className="mr-2 rounded bg-gray-100 px-2 py-0.5">{facility.type}</span>}
          {facility.status && <span className="rounded bg-gray-100 px-2 py-0.5">{facility.status}</span>}
        </div>
      </div>
      {facility.name && <p className="text-sm text-foreground">{facility.name}</p>}

      {fa.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">{t("facility.amenities", { default: "Facility amenities" })}</p>
          <div className="flex flex-wrap gap-2">
            {fa.slice(0, 16).map((a, i) => (
              <span key={i} className="rounded-md bg-white px-2 py-1 text-xs text-foreground ring-1 ring-black/5">
                {a.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}

      {la.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">{t("facility.locationAmenities", { default: "Location amenities" })}</p>
          <div className="flex flex-wrap gap-2">
            {la.slice(0, 16).map((l, i) => (
              <span key={i} className="rounded-md bg-white px-2 py-1 text-xs text-foreground ring-1 ring-black/5">
                {l.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
