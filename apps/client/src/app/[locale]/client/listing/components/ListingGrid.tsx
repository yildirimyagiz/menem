import { Bath, Bed, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@reservatior/ui/card";
import { Skeleton } from "@reservatior/ui/skeleton";

import { getPropertyImageUrl } from "../../properties/components/getPropertyImageUrl";

interface ListingGridProps {
  listings: any[];
  isLoading: boolean;
  error: any;
  hoveredListingId: string | null;
  setHoveredListingId: (id: string | null) => void;
}

export default function ListingGrid({
  listings,
  isLoading,
  error,
  hoveredListingId,
  setHoveredListingId,
}: ListingGridProps) {
  if (error) {
    return (
      <div className="py-12 text-center text-red-600">
        {error.message || "Error loading listings."}
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <Skeleton className="h-48 w-full" />
            <CardContent>
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="mb-2 h-3 w-1/2" />
              <Skeleton className="mb-2 h-3 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (!listings.length) {
    return (
      <div className="py-12 text-center text-gray-600">No listings found.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, i) => {
        const imageUrl = getPropertyImageUrl(listing);
        return (
          <Card
            key={listing.id}
            className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition-all duration-200 hover:shadow-lg ${hoveredListingId === listing.id ? "ring-2 ring-blue-500" : ""}`}
            onMouseEnter={() => setHoveredListingId(listing.id)}
            onMouseLeave={() => setHoveredListingId(null)}
            tabIndex={0}
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={imageUrl}
                alt={listing.title || "Property Image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={i < 6}
              />
              {/* Featured Badge */}
              {listing.featured && (
                <div className="absolute left-3 top-3 z-20 rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-bold uppercase text-white shadow">
                  Featured
                </div>
              )}
              {/* Status Badge */}
              {listing.propertyStatus && (
                <div className="absolute left-3 top-10 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase text-white backdrop-blur-sm">
                  {listing.propertyStatus.replace("_", " ")}
                </div>
              )}
              {/* Price */}
              {listing.price && (
                <div className="absolute bottom-3 left-3 z-10 text-white">
                  <span className="text-2xl font-bold">
                    ${listing.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <CardHeader className="flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className="truncate font-semibold text-gray-900"
                  title={listing.title || ""}
                >
                  {listing.title}
                </h3>
                {listing.propertyNumber && (
                  <span
                    className="ml-2 rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500"
                    title="Property Number"
                  >
                    #{listing.propertyNumber}
                  </span>
                )}
              </div>
              <div
                className="truncate text-sm text-gray-500"
                title={listing.address || ""}
              >
                {listing.address}
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                {listing.category && (
                  <span className="rounded bg-blue-50 px-2 py-0.5 font-medium">
                    {listing.category}
                  </span>
                )}
                {listing.listingType && (
                  <span className="rounded bg-green-50 px-2 py-0.5 font-medium">
                    {listing.listingType}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                {listing.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="mr-1.5 h-4 w-4" />
                    <span>{listing.bedrooms} beds</span>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="mr-1.5 h-4 w-4" />
                    <span>{listing.bathrooms} baths</span>
                  </div>
                )}
                {listing.size && (
                  <div className="flex items-center">
                    <Square className="mr-1.5 h-4 w-4" />
                    <span>{listing.size.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <Link
                  href={`/listing/${listing.id}`}
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
