"use client";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Checkbox } from "@reservatior/ui/checkbox";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@reservatior/ui/select";
import { Separator } from "@reservatior/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@reservatior/ui/sheet";
import { APIProvider } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import PropertyCardEnhanced from "~/components/PropertyCardEnhanced";
import { env } from "~/env";
import { api } from "~/trpc/react";
import type { PropertyWithRelations } from "./components/types";



const MapContainer = dynamic(() => import("@/components/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <div className="animate-pulse text-gray-500">Loading map...</div>
    </div>
  ),
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }>{
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Render error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded">
          <div className="font-semibold mb-2">Render error</div>
          <div className="text-sm whitespace-pre-wrap">{String(this.state.error)}</div>
        </div>
      );
    }
    return this.props.children as JSX.Element;
  }
}

function SortTabs(props: {
  value: "recommended" | "price_low" | "price_high" | "recent";
  onValueChange: (v: "recommended" | "price_low" | "price_high" | "recent") => void;
  labels: { recommended: string; price_low: string; price_high: string; recent: string; aria: string };
}) {
  const { value, onValueChange, labels } = props;
  const TabButton = ({ v, label }: { v: typeof value; label: string }) => (
    <Button
      variant={value === v ? "default" : "outline"}
      size="sm"
      onClick={() => onValueChange(v)}
    >
      {label}
    </Button>
  );
  return (
    <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label={labels.aria}>
      <TabButton v="recommended" label={labels.recommended} />
      <TabButton v="price_low" label={labels.price_low} />
      <TabButton v="price_high" label={labels.price_high} />
      <TabButton v="recent" label={labels.recent} />
    </div>
  );
}

interface Range { gte?: number; lte?: number }
interface PropertyFilterInput {
  sortBy?: "createdAt" | "price";
  sortOrder?: "asc" | "desc";
  propertyType?: string;
  propertyStatus?: string;
  category?: string;
  amenities?: string[];
  features?: string[];
  priceMin?: number;
  priceMax?: number;
  bedrooms?: Range;
  bathrooms?: Range;
  page?: number;
  pageSize?: number;
}

// Use shared UI-focused shape

// Map UI tabs to API-friendly sort params
const sortMapping: Record<string, { sortBy?: "createdAt" | "price"; sortOrder?: "asc" | "desc" }> = {
  recommended: {}, // let API use default recommendation logic
  price_low: { sortBy: "price", sortOrder: "asc" },
  price_high: { sortBy: "price", sortOrder: "desc" },
  recent: { sortBy: "createdAt", sortOrder: "desc" },
};

export default function PropertiesPage() {
  const t = useTranslations("property");
  const [disableAdvancedFilters] = useState(false);
  const [properties, setProperties] = useState<PropertyWithRelations[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"recommended" | "price_low" | "price_high" | "recent">("recommended");
  const [page, setPage] = useState(1);
  const [showMap, setShowMap] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | undefined>(undefined);
  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 20;
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const googleApiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Filters
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  // Local enum key arrays (mirroring schema)
  const PROPERTY_TYPES = [
    "APARTMENT","HOUSE","VILLA","DUPLEX","PENTHOUSE","STUDIO","CONDO","TOWNHOUSE","LOFT","COTTAGE","BUNGALOW","OFFICE","SHOP","RETAIL","WAREHOUSE","OTHER",
  ] as const;
  const PROPERTY_STATUS = [
    "AVAILABLE","UNDER_CONTRACT","SOLD","RENTED","PENDING_APPROVAL","OFF_MARKET",
  ] as const;
  const PROPERTY_CATEGORIES = ["RESIDENTIAL","COMMERCIAL","LAND","INDUSTRIAL","OTHER"] as const;
  const PROPERTY_AMENITIES = [
    "POOL","GYM","GARDEN","PARKING","SECURITY","ELEVATOR","STORAGE","BALCONY","TERRACE","AIR_CONDITIONING","HEATING","WIFI","SAUNA","JACUZZI","FIREPLACE","BBQ","PET_FRIENDLY","WHEELCHAIR_ACCESS","LAUNDRY","DISHWASHER","SMART_HOME","SOLAR_PANELS","CONCIERGE","PLAYGROUND","TENNIS_COURT","BASKETBALL_COURT","CINEMA_ROOM","GAME_ROOM","ROOFTOP","SEA_VIEW","MOUNTAIN_VIEW","CITY_VIEW",
  ] as const;
  const PROPERTY_FEATURES = [
    "FURNISHED","PARTIALLY_FURNISHED","UNFURNISHED","OPEN_FLOOR_PLAN","HIGH_CEILING","BALCONY","TERRACE","GARDEN","SEA_VIEW","MOUNTAIN_VIEW","CITY_VIEW","SMART_HOME","ENERGY_EFFICIENT","SOLAR_PANELS","EARTHQUAKE_RESISTANT","SOUNDPROOF","WHEELCHAIR_ACCESSIBLE","PET_FRIENDLY","HOME_OFFICE","WALK_IN_CLOSET",
  ] as const;

  // Additional filters
  const [amenities, setAmenities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [bedMin, setBedMin] = useState<string>("");
  const [bedMax, setBedMax] = useState<string>("");
  const [bathMin, setBathMin] = useState<string>("");
  const [bathMax, setBathMax] = useState<string>("");

  const trpcInput: PropertyFilterInput = useMemo((): PropertyFilterInput => {
    const mapping = sortMapping[activeTab] ?? {};
    const input: PropertyFilterInput = {
      sortBy: mapping.sortBy,
      sortOrder: mapping.sortOrder,
      propertyType: typeFilter,
      propertyStatus: statusFilter,
      category: categoryFilter,
      amenities: amenities.length ? amenities : undefined,
      features: features.length ? features : undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
    };
    if (bedMin || bedMax) {
      input.bedrooms = {
        gte: bedMin ? Number(bedMin) : undefined,
        lte: bedMax ? Number(bedMax) : undefined,
      };
    }
    if (bathMin || bathMax) {
      input.bathrooms = {
        gte: bathMin ? Number(bathMin) : undefined,
        lte: bathMax ? Number(bathMax) : undefined,
      };
    }
    // pagination
    input.page = page;
    input.pageSize = PAGE_SIZE;
    return input;
  }, [activeTab, typeFilter, statusFilter, categoryFilter, amenities, features, priceMin, priceMax, bedMin, bedMax, bathMin, bathMax, page]);
  interface PropertyAllResult { data: PropertyWithRelations[]; total: number }
  type PublicPropertyAllHook = (
    input: PropertyFilterInput,
    opts?: { keepPreviousData?: boolean },
  ) => { data: PropertyAllResult | undefined; isLoading: boolean; isError?: boolean; error?: unknown };
  const publicClient = api as unknown as {
    publicProperty: { all: { useQuery: PublicPropertyAllHook } };
  };
  const { data: queryData, isLoading, isError, error } = publicClient.publicProperty.all.useQuery(trpcInput, {
    keepPreviousData: true,
  });
  useEffect(() => {
    if (isError) {
      const msg = typeof error === "object" && error && "message" in (error as Record<string, unknown>)
        ? String((error as { message?: unknown }).message)
        : "Failed to load properties.";
      setLoadError(msg);
    }
  }, [isError, error]);
  const isLoadingMore = isLoading && page > 1;

  // Derive lightweight points for the map from fetched properties
  const mapPoints = useMemo(() => {
    const pts = properties
      .map((p) => {
        const maybe = p as unknown as {
          id: string;
          title?: string;
          name?: string;
          price?: number;
          currency?: string;
          photos?: { url?: string }[];
          Photos?: { url?: string }[];
          bedrooms?: number;
          bathrooms?: number;
          address?: string;
          Address?: { formatted?: string };
          coordinates?: { lat?: number; lng?: number };
          Location?: { coordinates?: { lat?: number; lng?: number } };
        };
        const coords = maybe.coordinates ?? maybe.Location?.coordinates;
        if (!coords || typeof coords.lat !== "number" || typeof coords.lng !== "number") return null;
        return {
          id: maybe.id,
          coordinates: { lat: coords.lat, lng: coords.lng },
          title: maybe.title ?? maybe.name ?? "",
          address: maybe.Address?.formatted ?? maybe.address ?? "",
          price: typeof maybe.price === "number" ? maybe.price : undefined,
          currency: maybe.currency ?? undefined,
          photos: (maybe.photos ?? maybe.Photos) ?? [],
          bedrooms: maybe.bedrooms,
          bathrooms: maybe.bathrooms,
        };
      })
      .filter(Boolean);
    return pts as {
      id: string;
      coordinates: { lat: number; lng: number };
      title?: string;
      address?: string;
      price?: number;
      currency?: string;
      photos?: { url?: string }[];
      bedrooms?: number;
      bathrooms?: number;
    }[];
  }, [properties]);

  useEffect(() => {
    if (!queryData) return;
    const result = queryData as unknown as PropertyAllResult;
    // Append on subsequent pages, replace on first page
    setProperties((prev) => (page > 1 ? [...prev, ...result.data] : result.data));
    setTotalCount(typeof result.total === "number" ? result.total : 0);
    // Clear load error on successful fetch
    setLoadError(null);
  }, [queryData, page]);

  // Reset pagination when filters/sort change
  const filterSignature = JSON.stringify({ activeTab, typeFilter, statusFilter, categoryFilter, amenities, features, priceMin, priceMax, bedMin, bedMax, bathMin, bathMax });
  useEffect(() => {
    setPage(1);
    // Replace list immediately while new page=1 fetch resolves
    setProperties([]);
    // Scroll to top of list smoothly
    if (listRef.current) listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    setLoadError(null);
  }, [filterSignature]);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    const rootEl = listRef.current;
    const target = sentinelRef.current;
    if (!rootEl || !target) return;

    const hasMore = properties.length < totalCount;
    if (!hasMore) return;
    if (loadError) return;

    const maxPage = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Avoid duplicate increments while loading
            if (!isLoading) {
              setPage((p) => (p < maxPage ? p + 1 : p));
            }
          }
        }
      },
      { root: rootEl, rootMargin: "0px 0px 400px 0px", threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [properties.length, totalCount, isLoading, loadError]);

  return (
    <ErrorBoundary>
    <div className="max-w-[1600px] mx-auto px-4 py-4">
      {/* Header: Tabs + result count */}
      <div className="flex items-center justify-between gap-4">
        <SortTabs
          value={activeTab}
          onValueChange={setActiveTab}
          labels={{
            recommended: t("list.sort.recommended", { default: "Recommended" }),
            price_low: t("list.sort.priceLow", { default: "Lowest Price" }),
            price_high: t("list.sort.priceHigh", { default: "Highest Price" }),
            recent: t("list.sort.recent", { default: "Newest" }),
            aria: t("list.sort.ariaLabel", { default: "Sort" }),
          }}
        />
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground whitespace-nowrap mb-4">
            {isLoading
              ? t("loading.title", { default: "Loading properties..." })
              : t("list.results", { default: "{count} results", count: totalCount || properties.length })}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowMap((v) => !v)} className="mb-4">
            {showMap ? t("list.hideMap", { default: "Hide map" }) : t("list.showMap", { default: "Show map" })}
          </Button>
        </div>
      </div>
      <Separator className="mb-4" />

      {/* Filters toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {disableAdvancedFilters ? (
          <div className="text-sm text-muted-foreground">{t("list.filtersDisabled", { default: "Filters disabled for debugging" })}</div>
        ) : (
          <>
        {/* Type */}
        <div className="flex items-center gap-2">
          <Badge variant="outline">{t("list.type", { default: "Type" })}</Badge>
          <Select value={typeFilter ?? undefined} onValueChange={(v) => setTypeFilter(v === "ALL" ? undefined : v)}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder={t("common.any", { default: "Any" })} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("common.any", { default: "Any" })}</SelectItem>
              {PROPERTY_TYPES.map((t_) => (
                <SelectItem key={t_} value={t_}>{t_.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant="outline">{t("list.status", { default: "Status" })}</Badge>
          <Select value={statusFilter ?? undefined} onValueChange={(v) => setStatusFilter(v === "ALL" ? undefined : v)}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder={t("common.any", { default: "Any" })} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("common.any", { default: "Any" })}</SelectItem>
              {PROPERTY_STATUS.map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <Badge variant="outline">{t("list.category", { default: "Category" })}</Badge>
          <Select value={categoryFilter ?? undefined} onValueChange={(v) => setCategoryFilter(v === "ALL" ? undefined : v)}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder={t("common.any", { default: "Any" })} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("common.any", { default: "Any" })}</SelectItem>
              {PROPERTY_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">{t("filters.price.section", { default: "Price" })}</Button>
          </SheetTrigger>
          <SheetContent className="w-[360px] sm:w-[420px] p-4">
            <div className="space-y-3">
              <div className="font-medium">{t("filters.price.dropdownLabel", { default: "Price Range" })}</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="priceMin">{t("filters.price.minLabel", { default: "Min" })}</Label>
                  <Input id="priceMin" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder={t("filters.price.minPlaceholder", { default: "Min" })} />
                </div>
                <div>
                  <Label htmlFor="priceMax">{t("filters.price.maxLabel", { default: "Max" })}</Label>
                  <Input id="priceMax" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder={t("filters.price.maxPlaceholder", { default: "Max" })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setPriceMin(""); setPriceMax(""); }}>{t("filters.clearAll", { default: "Clear" })}</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Amenities */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">{t("details.amenities", { default: "Amenities" })}</Button>
          </SheetTrigger>
          <SheetContent className="w-[360px] sm:w-[420px] p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="font-medium">{t("details.amenities", { default: "Amenities" })}</div>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={amenities.includes(a)} onCheckedChange={(c) => {
                      const checked = Boolean(c);
                      setAmenities((prev) => checked ? [...prev, a] : prev.filter((x) => x !== a));
                    }} />
                    <span>{a.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setAmenities([])}>{t("filters.clearAll", { default: "Clear" })}</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Features */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">{t("details.features", { default: "Features" })}</Button>
          </SheetTrigger>
          <SheetContent className="w-[360px] sm:w-[420px] p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="font-medium">{t("details.features", { default: "Features" })}</div>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_FEATURES.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={features.includes(f)} onCheckedChange={(c) => {
                      const checked = Boolean(c);
                      setFeatures((prev) => checked ? [...prev, f] : prev.filter((x) => x !== f));
                    }} />
                    <span>{f.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setFeatures([])}>{t("filters.clearAll", { default: "Clear" })}</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Rooms */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              {t("list.rooms", { default: "Rooms" })} {(bedMin||bedMax||bathMin||bathMax) ? `(${bedMin||0}/${bathMax||bathMin||0})` : ""}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[360px] sm:w-[420px] p-4">
            <div className="space-y-3">
              <div className="font-medium">{t("list.bedrooms", { default: "Bedrooms" })}</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="bedMin">{t("filters.price.minLabel", { default: "Min" })}</Label>
                  <Input id="bedMin" type="number" value={bedMin} onChange={(e) => setBedMin(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="bedMax">{t("filters.price.maxLabel", { default: "Max" })}</Label>
                  <Input id="bedMax" type="number" value={bedMax} onChange={(e) => setBedMax(e.target.value)} placeholder="10" />
                </div>
              </div>
              <div className="font-medium">{t("list.bathrooms", { default: "Bathrooms" })}</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="bathMin">{t("filters.price.minLabel", { default: "Min" })}</Label>
                  <Input id="bathMin" type="number" value={bathMin} onChange={(e) => setBathMin(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="bathMax">{t("filters.price.maxLabel", { default: "Max" })}</Label>
                  <Input id="bathMax" type="number" value={bathMax} onChange={(e) => setBathMax(e.target.value)} placeholder="10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setBedMin(""); setBedMax(""); setBathMin(""); setBathMax(""); }}>{t("filters.clearAll", { default: "Clear" })}</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Clear all */}
        <Button variant="ghost" size="sm" onClick={() => {
          setTypeFilter(undefined);
          setStatusFilter(undefined);
          setCategoryFilter(undefined);
          setAmenities([]);
          setFeatures([]);
          setPriceMin("");
          setPriceMax("");
          setBedMin("");
          setBedMax("");
          setBathMin("");
          setBathMax("");
        }}>{t("filters.clearAll", { default: "Clear all" })}</Button>
          </>
        )}
      </div>

      {/* Active filter chips */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {typeFilter && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("list.type", { default: "Type" })}: {typeFilter.replace(/_/g, " ")}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => setTypeFilter(undefined)}>✕</button>
          </Badge>
        )}
        {statusFilter && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("list.status", { default: "Status" })}: {statusFilter.replace(/_/g, " ")}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => setStatusFilter(undefined)}>✕</button>
          </Badge>
        )}
        {categoryFilter && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("list.category", { default: "Category" })}: {categoryFilter.replace(/_/g, " ")}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => setCategoryFilter(undefined)}>✕</button>
          </Badge>
        )}
        {!!amenities.length && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("details.amenities", { default: "Amenities" })}: {amenities.length}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => setAmenities([])}>✕</button>
          </Badge>
        )}
        {!!features.length && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("details.features", { default: "Features" })}: {features.length}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => setFeatures([])}>✕</button>
          </Badge>
        )}
        {(priceMin || priceMax) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("filters.price.section", { default: "Price" })}: {priceMin || 0} - {priceMax || "∞"}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => { setPriceMin(""); setPriceMax(""); }}>✕</button>
          </Badge>
        )}
        {(bedMin || bedMax) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("list.bedrooms", { default: "Bedrooms" })}: {bedMin || 0}-{bedMax || "∞"}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => { setBedMin(""); setBedMax(""); }}>✕</button>
          </Badge>
        )}
        {(bathMin || bathMax) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {t("list.bathrooms", { default: "Bathrooms" })}: {bathMin || 0}-{bathMax || "∞"}
            <button className="ml-1 text-xs opacity-70 hover:opacity-100" onClick={() => { setBathMin(""); setBathMax(""); }}>✕</button>
          </Badge>
        )}
      </div>

      <div className={`grid grid-cols-1 ${showMap ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-4`}>
        {/* Property List (independent scroll) */}
        <div ref={listRef} className="flex flex-col gap-3 h-[calc(100vh-4rem)] overflow-auto pr-1">
          {properties.map((property) => (
            <div key={property.id} className="flex-none">
              <PropertyCardEnhanced
                property={property}
                onHover={(id) => setHoveredId(id ?? undefined)}
                isHovered={hoveredId === property.id}
              />
            </div>
          ))}

          {loadError && (
            <div className="flex-none rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {/* Loading skeletons for infinite fetch */}
          {isLoadingMore && (
            <div className="flex-none space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg border p-4 bg-white">
                  <div className="h-32 w-full rounded bg-gray-200" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {/* Sentinel for infinite scrolling */}
          <div ref={sentinelRef} className="flex-none h-2" />
        </div>

        {/* Map */}
        {showMap && (
        <div className="sticky top-4 h-[calc(100vh-4rem)] hidden lg:block">
          {mounted ? (
            googleApiKey ? (
              <APIProvider apiKey={googleApiKey}>
                <MapContainer className="h-full" points={mapPoints} autoFit currentHoverID={hoveredId} />
              </APIProvider>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-red-50">
                <div className="text-red-600 text-sm">Google Maps API key missing.</div>
              </div>
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <div className="animate-pulse text-gray-500">Loading map...</div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
