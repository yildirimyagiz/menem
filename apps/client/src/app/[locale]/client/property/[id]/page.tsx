"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo } from "react";
import FactChip from "~/components/FactChip";
import SectionCard from "~/components/SectionCard";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { getCityImage } from "~/utils/getCityImage";
import ExpensesCard from "../components/ExpensesCard";
import ExtraServicesCard from "../components/ExtraServicesCard";
import ForRentSidebar from "../components/ForRentSidebar";
import ForSaleSidebar from "../components/ForSaleSidebar";
import HeroMosaic from "../components/HeroMosaic";
import IncludedServicesCard from "../components/IncludedServicesCard";
import ReservationSidebar from "../components/ReservationSidebar";
import StickySectionNav from "../components/StickySectionNav";

// Sidebars per listing type

const MapContainer = dynamic(() => import("@/components/MapContainer"), { ssr: false });

// Helpers
function enumLabel(v?: string) {
  if (!v) return "";
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// Safely extract TRPC-like error code without relying on any
function extractErrorCode(e: unknown): string | undefined {
  if (!e || typeof e !== "object") return undefined;
  const data = (e as { data?: unknown }).data;
  if (!data || typeof data !== "object") return undefined;
  const code = (data as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

// Helper to normalize possibly-null numbers
function asNumber(x: unknown): number | undefined {
  return typeof x === "number" ? x : undefined;
}

// Lightweight tolerant type view so we don't couple tightly to backend shape
interface MaybeProperty {
  id: string;
  title?: string;
  name?: string;
  description?: string;

  // media
  photos?: { url?: string; caption?: string }[];
  Photos?: { url?: string; caption?: string }[];
  Photo?: { url?: string; caption?: string }[];

  // basic
  listingType?: "SALE" | "RENT" | "BOOKING";
  propertyType?: string;
  propertyStatus?: string;
  category?: string;
  featured?: boolean;
  averageRating?: number;
  favoriteCount?: number;

  // numbers
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  yearBuilt?: number;

  // physical/technical/ownership/financial/etc.
  condition?: string;
  constructionType?: string;
  buildingClass?: string;
  energyRating?: string;
  energyEfficiencyRating?: string;
  heatingType?: string;
  coolingType?: string;
  architecturalStyle?: string;
  parkingType?: string;
  parkingSpaces?: number;
  greenCertification?: string;

  // extras
  amenities?: string[];
  features?: string[];
  locationAmenities?: string[];
  facilityAmenities?: string[];
  Facility?: { amenities?: string[] } | null;

  // policies/notes
  checkInTime?: Date | string | null;
  checkOutTime?: Date | string | null;
  cancellationPolicy?: string | null;
  rules?: string | null;
  specialNotes?: string | null;
  nearbyAttractions?: string | null;
  transportOptions?: string | null;

  // ownership/legal
  ownershipType?: string;
  ownershipCategory?: string;
  titleDeedNumber?: string | null;
  titleDeedDate?: Date | string | null;

  // financial
  marketValue?: number | null;
  taxValue?: number | null;
  insuranceValue?: number | null;
  mortgageEligible?: boolean;

  // contacts
  contactMethod?: string;
  contactEmail?: string | null;
  contactPhone?: string | null;

  // location
  Address?: { formatted?: string };
  address?: string;
  Location?: {
    address?: string;
    city?: string;
    country?: string;
    coordinates?: { lat?: number; lng?: number };
  };
  coordinates?: { lat?: number; lng?: number };

  // price context (optional)
  price?: number;
  currency?: string;
}

export default function PropertyDetailPage({ params }: { params: { locale: string; id: string } }) {
  const { id } = params;
  const t = useTranslations("ClientPropertyDetail");
  const locale = useLocale();

  // Efficient fetch: use publicProperty.byId with a minimal typed surface to avoid any-casts
  interface PublicPropertyAPI {
    publicProperty: {
      byId: {
        useQuery: (
          args: { id: string },
          opts?: { retry?: boolean },
        ) => { data?: unknown; isLoading: boolean; isError: boolean; error?: unknown };
      };
      all: {
        useQuery: (
          args: { propertyType?: string; page: number; pageSize: number },
          opts?: { keepPreviousData?: boolean; enabled?: boolean },
        ) => { data?: { data?: unknown[] } };
      };
    };
  }
  const trpcRead = api as unknown as PublicPropertyAPI;
  const { data: property, isLoading, isError, error } = trpcRead.publicProperty.byId.useQuery(
    { id },
    { retry: false },
  );

  // Media
  const gallery = useMemo(
    () => ((property as MaybeProperty | undefined)?.photos
      ?? (property as MaybeProperty | undefined)?.Photos
      ?? (property as MaybeProperty | undefined)?.Photo
      ?? []),
    [property],
  );
  const sliderPhotos = useMemo(
    () => (
      ((gallery as (string | { url: string; caption?: string })[] | undefined)?.map((p) => {
        if (typeof p === "string") {
          return {
            src: p,
            alt: (property as MaybeProperty | undefined)?.title ?? t("untitled", { default: "Property" }),
          };
        }
        if (typeof p === "object" && typeof p.url === "string" && p.url) {
          return {
            src: p.url,
            alt: p.caption ?? ((property as MaybeProperty | undefined)?.title ?? t("untitled", { default: "Property" })),
          };
        }
        return null;
      }) ?? [])
        .filter((x): x is { src: string; alt: string } => Boolean(x?.src))
    ),
    [gallery, property, t],
  );
  // City image fallback (if gallery empty)
  const enhancedSliderPhotos = useMemo(() => {
    if (sliderPhotos.length > 0) return sliderPhotos;
    const city = (property as MaybeProperty | undefined)?.Location?.city
      ?? (property as MaybeProperty | undefined)?.Address?.formatted;
    const src = getCityImage(typeof city === "string" ? city : undefined);
    return [
      { src, alt: city ?? (t("untitled", { default: "Property" })) },
    ];
  }, [sliderPhotos, property, t]);

  // Address
  const formattedAddress =
    ((property as MaybeProperty | undefined)?.Address?.formatted
      ?? (property as MaybeProperty | undefined)?.address
      ?? (property as MaybeProperty | undefined)?.Location?.address)
    ?? undefined;

  // Map point
  interface MapPoint {
    id: string;
    coordinates: { lat: number; lng: number };
    title?: string;
    address?: string;
    price?: number;
    currency?: string;
    photos?: { url?: string }[];
    bedrooms?: number;
    bathrooms?: number;
  }
  const mapPoints = useMemo<MapPoint[]>(() => {
    const maybe = property as MaybeProperty | undefined;
    if (!maybe) return [];
    const coords = (maybe.coordinates ?? maybe.Location?.coordinates) as { lat?: number; lng?: number } | undefined;
    if (!coords || typeof coords.lat !== "number" || typeof coords.lng !== "number") return [];
    return [
      {
        id: maybe.id,
        coordinates: { lat: coords.lat, lng: coords.lng },
        title: maybe.title ?? maybe.name ?? "",
        address: formattedAddress,
        price: typeof maybe.price === "number" ? maybe.price : undefined,
        currency: maybe.currency,
        photos: gallery,
        bedrooms: maybe.bedrooms,
        bathrooms: maybe.bathrooms,
      },
    ];
  }, [property, formattedAddress, gallery]);

  // Not found inline
  const notFoundInline = useMemo(() => {
    if (isLoading) return false;
    const code = extractErrorCode(error);
    const notFound = isError && code === "NOT_FOUND";
    if (notFound) return true;
    if (!isError && !property) return true;
    return false;
  }, [isLoading, isError, error, property]);

  const listingType = ((property as MaybeProperty | undefined)?.listingType ?? "").toString().toUpperCase();

  // Similar properties (lightweight, optional)
  // const _city = (property as MaybeProperty | undefined)?.Location?.city; // reserved for future filters
  const type = (property as MaybeProperty | undefined)?.propertyType;
  // Only fetch when we have a type; keep size small
  const { data: similarData } = trpcRead.publicProperty.all.useQuery(
    { propertyType: type, page: 1, pageSize: 6 },
    { keepPreviousData: true, enabled: Boolean(type) },
  );
  const similarList = useMemo<MaybeProperty[]>(() => {
    const raw = (similarData as { data?: MaybeProperty[] } | undefined)?.data;
    return Array.isArray(raw) ? raw : [];
  }, [similarData]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {notFoundInline && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {t("notFound", { default: "Property not found or unavailable." })}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-1/3 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <div className="md:col-span-3">
              <div className="aspect-[4/3] w-full rounded-lg border bg-gray-100" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="h-20 rounded bg-gray-100" />
                <div className="h-20 rounded bg-gray-100" />
                <div className="h-20 rounded bg-gray-100" />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="h-[240px] rounded-lg border bg-gray-100" />
              <div className="mt-3 h-60 rounded-lg border bg-gray-100" />
            </div>
          </div>
        </div>
      )}

      {/* Hero Mosaic Gallery */}
      <div className="mb-4">
        <HeroMosaic photos={enhancedSliderPhotos} />
      </div>

      {/* Header + Breadcrumbs + Spotlight */}
      <div className="relative">
        {/* spotlight background */}
        <div className="pointer-events-none absolute -inset-x-6 -top-6 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black/[0.04] via-transparent to-transparent" />
        <nav aria-label="Breadcrumb" className="mb-2 text-xs text-muted-foreground">
          <ol className="flex items-center gap-1">
            <li><a href={`/${locale}`} className="hover:text-foreground">{t("breadcrumb.home", { default: "Home" })}</a></li>
            <li aria-hidden className="mx-1">/</li>
            <li><a href={`/${locale}/client/property`} className="hover:text-foreground">{t("breadcrumb.properties", { default: "Properties" })}</a></li>
            <li aria-hidden className="mx-1">/</li>
            <li aria-current="page" className="truncate max-w-[60ch] text-foreground">
              {(property as MaybeProperty | undefined)?.title ?? (property as MaybeProperty | undefined)?.name ?? t("untitled", { default: "Property" })}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" aria-label={t("untitled", { default: "Property" })}>
              {(property as MaybeProperty | undefined)?.title
                ?? (property as MaybeProperty | undefined)?.name
                ?? t("untitled", { default: "Property" })}
            </h1>
            {formattedAddress && (
              <p className="text-sm text-muted-foreground">{formattedAddress}</p>
            )}
            {/* Facts row (chips) */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {typeof (property as MaybeProperty | undefined)?.size === "number" && (
                <div className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5">
                  {t("facts.size", { default: "Size" })}: {(property as MaybeProperty).size}
                </div>
              )}
              {typeof (property as MaybeProperty | undefined)?.bedrooms === "number" && (
                <div className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5">
                  {t("facts.bedrooms", { default: "Bedrooms" })}: {(property as MaybeProperty).bedrooms}
                </div>
              )}
              {typeof (property as MaybeProperty | undefined)?.bathrooms === "number" && (
                <div className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5">
                  {t("facts.bathrooms", { default: "Bathrooms" })}: {(property as MaybeProperty).bathrooms}
                </div>
              )}
              {(property as MaybeProperty | undefined)?.propertyType && (
                <div className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5">
                  {t("facts.type", { default: "Type" })}: {enumLabel((property as MaybeProperty).propertyType)}
                </div>
              )}
              {(property as MaybeProperty | undefined)?.propertyStatus && (
                <div className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5">
                  {t("facts.status", { default: "Status" })}: {enumLabel((property as MaybeProperty).propertyStatus)}
                </div>
              )}
              {(property as MaybeProperty | undefined)?.category && (
                <div className="rounded-full bg-white px-2.5 py-1 ring-1 ring-black/5">
                  {enumLabel((property as MaybeProperty).category)}
                </div>
              )}
              {(property as MaybeProperty | undefined)?.featured && (
                <div className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
                  {t("badges.featured", { default: "Featured" })}
                </div>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {listingType && (
              <span className="rounded-full bg-gray-900 px-3 py-1 text-white">
                {listingType === "SALE" ? t("listingType.sale", { default: "For Sale" }) :
                 listingType === "RENT" ? t("listingType.rent", { default: "For Rent" }) :
                 listingType === "BOOKING" ? t("listingType.booking", { default: "Booking" }) : listingType}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Sticky in-page navigation */}
      <StickySectionNav
        sections={[
          { id: "overview", label: t("tabs.overview", { default: "Overview" }) },
          { id: "details", label: t("tabs.details", { default: "Details" }) },
          { id: "amenities", label: t("tabs.amenities", { default: "Amenities" }) },
          { id: "features", label: t("tabs.features", { default: "Features" }) },
          { id: "location", label: t("tabs.location", { default: "Location" }) },
          { id: "policies", label: t("tabs.policies", { default: "Policies" }) },
          { id: "financial", label: t("tabs.financial", { default: "Financial" }) },
          { id: "contacts", label: t("tabs.contacts", { default: "Contacts" }) },
          { id: "similar", label: t("tabs.similar", { default: "Similar" }) },
        ]}
      />

      {/* Anchored sections + right sidebar */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-5">
        <div className="md:col-span-3">
          <div id="overview">
            <SectionCard title={t("atAGlance", { default: "At a glance" })}>
              <div className="flex flex-wrap gap-2">
                <FactChip label={t("facts.size", { default: "Size" })} value={(property as MaybeProperty | undefined)?.size} />
                <FactChip label={t("facts.bedrooms", { default: "Bedrooms" })} value={(property as MaybeProperty | undefined)?.bedrooms} />
                <FactChip label={t("facts.bathrooms", { default: "Bathrooms" })} value={(property as MaybeProperty | undefined)?.bathrooms} />
                <FactChip label={t("facts.floors", { default: "Floors" })} value={(property as MaybeProperty | undefined)?.floors} />
                <FactChip label={t("facts.yearBuilt", { default: "Year Built" })} value={(property as MaybeProperty | undefined)?.yearBuilt} />
              </div>
            </SectionCard>
            {(property as MaybeProperty | undefined)?.description && (
              <SectionCard title={t("about", { default: "About this property" })}>
                <p className="text-sm leading-6 text-muted-foreground">
                  {(property as MaybeProperty).description}
                </p>
              </SectionCard>
            )}
          </div>

          <div id="details">
            <SectionCard title={t("facts.title", { default: "Property Facts" })}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-foreground">{t("facts.physical", { default: "Physical" })}</div>
                  <div className="flex flex-wrap gap-2">
                    <FactChip label={t("facts.size", { default: "Size" })} value={(property as MaybeProperty | undefined)?.size} />
                    <FactChip label={t("facts.bedrooms", { default: "Bedrooms" })} value={(property as MaybeProperty | undefined)?.bedrooms} />
                    <FactChip label={t("facts.bathrooms", { default: "Bathrooms" })} value={(property as MaybeProperty | undefined)?.bathrooms} />
                    <FactChip label={t("facts.floors", { default: "Floors" })} value={(property as MaybeProperty | undefined)?.floors} />
                    <FactChip label={t("facts.yearBuilt", { default: "Year Built" })} value={(property as MaybeProperty | undefined)?.yearBuilt} />
                    <FactChip label={t("facts.condition", { default: "Condition" })} value={enumLabel((property as MaybeProperty | undefined)?.condition)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-foreground">{t("facts.technical", { default: "Technical" })}</div>
                  <div className="flex flex-wrap gap-2">
                    <FactChip label={t("facts.construction", { default: "Construction" })} value={enumLabel((property as MaybeProperty | undefined)?.constructionType)} />
                    <FactChip label={t("facts.buildingClass", { default: "Building Class" })} value={enumLabel((property as MaybeProperty | undefined)?.buildingClass)} />
                    <FactChip label={t("facts.energy", { default: "Energy" })} value={enumLabel((property as MaybeProperty | undefined)?.energyRating)} />
                    <FactChip label={t("facts.efficiency", { default: "Efficiency" })} value={enumLabel((property as MaybeProperty | undefined)?.energyEfficiencyRating)} />
                    <FactChip label={t("facts.heating", { default: "Heating" })} value={enumLabel((property as MaybeProperty | undefined)?.heatingType)} />
                    <FactChip label={t("facts.cooling", { default: "Cooling" })} value={enumLabel((property as MaybeProperty | undefined)?.coolingType)} />
                    <FactChip label={t("facts.style", { default: "Style" })} value={enumLabel((property as MaybeProperty | undefined)?.architecturalStyle)} />
                    <FactChip label={t("facts.parking", { default: "Parking" })} value={enumLabel((property as MaybeProperty | undefined)?.parkingType)} />
                    <FactChip label={t("facts.parkingSpaces", { default: "Spaces" })} value={(property as MaybeProperty | undefined)?.parkingSpaces} />
                    <FactChip label={t("facts.greenCertification", { default: "Green Cert." })} value={enumLabel((property as MaybeProperty | undefined)?.greenCertification)} />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div id="amenities">
            {(() => {
              const am = (property as MaybeProperty | undefined)?.amenities ?? [];
              return Array.isArray(am) && am.length > 0;
            })() && (
              <SectionCard title={t("amenities", { default: "Amenities" })}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(((property as MaybeProperty | undefined)?.amenities ?? [])).slice(0, 12).map((a, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3 shadow-sm hover:shadow transition-shadow">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-foreground">
                        {String(enumLabel(String(a))).charAt(0)}
                      </div>
                      <div className="text-sm text-foreground">{enumLabel(String(a))}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          <div id="features">
            {(() => {
              const ft = (property as MaybeProperty | undefined)?.features ?? [];
              return Array.isArray(ft) && ft.length > 0;
            })() && (
              <SectionCard title={t("features.title", { default: "Features" })} subtitle={t("features.subtitle", { default: "Key property features" })}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(((property as MaybeProperty | undefined)?.features ?? [])).slice(0, 12).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3 shadow-sm hover:shadow transition-shadow">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-foreground">
                        {String(enumLabel(String(f))).charAt(0)}
                      </div>
                      <div className="text-sm text-foreground">{enumLabel(String(f))}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          <div id="location">
            <div className="h-[240px] overflow-hidden rounded-lg border">
              {env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <MapContainer className="h-full" points={mapPoints} autoFit />
                </APIProvider>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-red-50 text-sm text-red-600">
                  {t("mapsKeyMissing", { default: "Google Maps API key missing." })}
                </div>
              )}
            </div>
          </div>

          <div id="policies">
            {(() => {
              const p = property as MaybeProperty | undefined;
              return Boolean(
                (p?.checkInTime ??
                p?.checkOutTime) ??
                p?.cancellationPolicy ??
                p?.rules ??
                p?.specialNotes ??
                p?.nearbyAttractions ??
                p?.transportOptions,
              );
            })() && (
              <SectionCard title={t("policies.title", { default: "Policies & Notes" })}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1 text-sm">
                    <FactChip label={t("policies.checkIn", { default: "Check-in" })} value={(property as MaybeProperty | undefined)?.checkInTime ? String((property as MaybeProperty).checkInTime) : undefined} />
                    <FactChip label={t("policies.checkOut", { default: "Check-out" })} value={(property as MaybeProperty | undefined)?.checkOutTime ? String((property as MaybeProperty).checkOutTime) : undefined} />
                    <FactChip label={t("policies.cancellation", { default: "Cancellation" })} value={(property as MaybeProperty | undefined)?.cancellationPolicy ?? undefined} />
                  </div>
                  <div className="space-y-1 text-sm">
                    <FactChip label={t("policies.rules", { default: "Rules" })} value={(property as MaybeProperty | undefined)?.rules ?? undefined} />
                    <FactChip label={t("policies.notes", { default: "Notes" })} value={(property as MaybeProperty | undefined)?.specialNotes ?? undefined} />
                    <FactChip label={t("policies.attractions", { default: "Attractions" })} value={(property as MaybeProperty | undefined)?.nearbyAttractions ?? undefined} />
                    <FactChip label={t("policies.transport", { default: "Transport" })} value={(property as MaybeProperty | undefined)?.transportOptions ?? undefined} />
                  </div>
                </div>
              </SectionCard>
            )}
          </div>

          <div id="financial">
          {(
            (property as MaybeProperty | undefined)?.marketValue !== undefined ||
            (property as MaybeProperty | undefined)?.taxValue !== undefined ||
            (property as MaybeProperty | undefined)?.insuranceValue !== undefined ||
            (property as MaybeProperty | undefined)?.mortgageEligible !== undefined
          ) && (
            <SectionCard title={t("financial.title", { default: "Financial" })}>
              <div className="flex flex-wrap gap-2">
                <FactChip label={t("financial.marketValue", { default: "Market Value" })} value={(property as MaybeProperty | undefined)?.marketValue ?? undefined} />
                <FactChip label={t("financial.taxValue", { default: "Tax Value" })} value={(property as MaybeProperty | undefined)?.taxValue ?? undefined} />
                <FactChip label={t("financial.insuranceValue", { default: "Insurance Value" })} value={(property as MaybeProperty | undefined)?.insuranceValue ?? undefined} />
                <FactChip label={t("financial.mortgageEligible", { default: "Mortgage Eligible" })} value={(property as MaybeProperty | undefined)?.mortgageEligible ? t("common.yes", { default: "Yes" }) : (property as MaybeProperty | undefined)?.mortgageEligible === false ? t("common.no", { default: "No" }) : undefined} />
              </div>
            </SectionCard>
          )}
        </div>

        {/* Services and expenses (schema-aligned, tolerant mapping) */}
        {(() => {
          const p = property as MaybeProperty | undefined;
          const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object";
          const arr = (v: unknown): unknown[] => (Array.isArray(v) ? (v as unknown[]) : []);
          const base = isObj(p) ? (p as unknown as Record<string, unknown>) : undefined;

           
          const includedRaw = base ? (base.IncludedService ?? base.IncludedServices ?? base.Included) : undefined;
          const extraRaw = base ? (base.ExtraCharge ?? base.ExtraCharges ?? base.Extras) : undefined;
          const expensesRaw = base ? (base.Expense ?? base.Expenses) : undefined;
           

          const included = arr(includedRaw);
          const extra = arr(extraRaw);
          const expenses = arr(expensesRaw);

          const normalizeService = (x: unknown) => {
            if (!isObj(x)) return { name: "" };
            const name = typeof x.name === "string" ? x.name
              : typeof x.title === "string" ? x.title
              : typeof x.label === "string" ? x.label
              : "";
            const description = typeof x.description === "string" ? x.description
              : typeof x.desc === "string" ? x.desc
              : typeof x.details === "string" ? x.details
              : undefined;
            const icon = typeof x.icon === "string" ? x.icon : undefined;
            return { name, description, icon };
          };

          const normalizeExtra = (x: unknown) => {
            if (!isObj(x)) return { name: "" };
            const name = typeof x.name === "string" ? x.name
              : typeof x.title === "string" ? x.title
              : typeof x.label === "string" ? x.label
              : "";
            const description = typeof x.description === "string" ? x.description
              : typeof x.desc === "string" ? x.desc
              : typeof x.details === "string" ? x.details
              : undefined;
            const icon = typeof x.icon === "string" ? x.icon : undefined;
            const amount = typeof x.amount === "number" ? x.amount : undefined;
            const currency = typeof x.currency === "string" ? x.currency : undefined;
            return { name, description, icon, amount, currency };
          };

          const normalizeExpense = (x: unknown) => {
            if (!isObj(x)) return {};
            const name = typeof x.name === "string" ? x.name
              : typeof x.title === "string" ? x.title
              : typeof x.label === "string" ? x.label
              : undefined;
            const description = typeof x.description === "string" ? x.description
              : typeof x.desc === "string" ? x.desc
              : typeof x.details === "string" ? x.details
              : undefined;
            const amount = typeof x.amount === "number" ? x.amount : undefined;
            const currency = typeof x.currency === "string" ? x.currency : undefined;
            const dueDate = typeof x.dueDate === "string" ? x.dueDate
              : x.dueDate instanceof Date ? (x.dueDate).toISOString()
              : null;
            const paidDate = typeof x.paidDate === "string" ? x.paidDate
              : x.paidDate instanceof Date ? (x.paidDate).toISOString()
              : null;
            const status = typeof x.status === "string" ? x.status : undefined;
            return { name, description, amount, currency, dueDate, paidDate, status };
          };

          const incList = included.map(normalizeService);
          const extList = extra.map(normalizeExtra);
          const expList = expenses.map(normalizeExpense);

          return (
            <>
              <IncludedServicesCard services={incList} />
              <ExtraServicesCard items={extList} />
              <ExpensesCard expenses={expList} />
            </>
          );
        })()}

          <div id="contacts">
            {(() => {
              const p = property as MaybeProperty | undefined;
              return Boolean((p?.contactMethod ?? p?.contactEmail) ?? p?.contactPhone);
            })() && (
              <SectionCard title={t("contacts.title", { default: "Contacts" })}>
                <div className="flex flex-wrap gap-2">
                  <FactChip label={t("contacts.preferred", { default: "Preferred" })} value={enumLabel((property as MaybeProperty | undefined)?.contactMethod)} />
                  <FactChip label={t("contacts.email", { default: "Email" })} value={(property as MaybeProperty | undefined)?.contactEmail ?? undefined} />
                  <FactChip label={t("contacts.phone", { default: "Phone" })} value={(property as MaybeProperty | undefined)?.contactPhone ?? undefined} />
                </div>
              </SectionCard>
            )}
          </div>

          <div id="similar">
            {similarList.length > 0 && (
              <SectionCard title={t("similar.title", { default: "Similar Properties" })}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {similarList.map((p: MaybeProperty) => {
                    const pCover = (p.photos ?? p.Photos ?? p.Photo ?? [])[0]?.url;
                    return (
                      <a key={p.id} href={`/${locale}/client/property/${p.id}`} className="group overflow-hidden rounded-lg border bg-white">
                        <div className="relative aspect-[4/3]">
                          {pCover ? (
                            <Image src={pCover} alt={p.title ?? p.name ?? "Property"} fill className="object-cover transition-transform group-hover:scale-[1.03]" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-500">{t("noImage", { default: "No image" })}</div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="line-clamp-1 text-sm font-medium">{p.title ?? p.name ?? "Property"}</div>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {typeof p.bedrooms === "number" && <span>{p.bedrooms} bd</span>}
                            {typeof p.bathrooms === "number" && <span>{p.bathrooms} ba</span>}
                            {typeof p.size === "number" && <span>{p.size} m²</span>}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </SectionCard>
            )}
          </div>
        </div>

        {/* Right column: contextual sidebar only */}
        <div className="md:col-span-2">
          <div className="sticky top-4 space-y-3">
            {listingType === "BOOKING" && Boolean(property) && (
              <ReservationSidebar
                property={{
                  price: asNumber((property as MaybeProperty | undefined)?.price),
                  marketValue: asNumber((property as MaybeProperty | undefined)?.marketValue),
                  currency: (property as MaybeProperty | undefined)?.currency,
                }}
                locale={locale}
              />
            )}
            {listingType === "RENT" && Boolean(property) && (
              <ForRentSidebar
                property={{
                  price: asNumber((property as MaybeProperty | undefined)?.price),
                  currency: (property as MaybeProperty | undefined)?.currency,
                }}
                locale={locale}
              />
            )}
            {listingType === "SALE" && Boolean(property) && (
              <ForSaleSidebar
                property={{
                  price: asNumber((property as MaybeProperty | undefined)?.price),
                  marketValue: asNumber((property as MaybeProperty | undefined)?.marketValue),
                  currency: (property as MaybeProperty | undefined)?.currency,
                }}
                locale={locale}
              />
            )}
          </div>
        </div>
      </div>

      {isError && !notFoundInline && (
        <div className="mt-4 text-sm text-red-600">{t("loadFailed", { default: "Failed to load property." })}</div>
      )}
    </div>
  );
}