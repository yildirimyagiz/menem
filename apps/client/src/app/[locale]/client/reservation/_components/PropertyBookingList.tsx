import React from "react";

import type { Property } from "@reservatior/validators";

import AnimatedPropertyCard from "~/app/[locale]/client/properties/components/AnimatedPropertyCard";

// Minimal interface for property card display
interface PropertyCardData {
  id: string;
  title: string | null;
  propertyNumber: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  parkingSpaces: number;
  propertyType: string | null;
  category: string | null;
  listingType: string | null;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  averageRating: number;
  Agency: { name: string } | null;
  Photo: { url: string; alt: string | null }[];
  PricingRules: {
    basePrice?: number;
    weekdayPrices?: number;
    currencyId?: string;
  }[];
  marketValue: number | null;
}

interface PropertyBookingListProps {
  properties: Property[];
  onBook: (property: Property) => void;
  isLoading?: boolean;
}

const toPropertyCardData = (property: Property): PropertyCardData => {
  return {
    id: property.id,
    title: property.title ?? null,
    propertyNumber: property.propertyNumber ?? null,
    address: property.Location?.address ?? null,
    city: property.Location?.city ?? null,
    country: property.Location?.country ?? null,
    bedrooms: property.bedrooms ?? null,
    bathrooms: property.bathrooms ?? null,
    size: property.size ?? null,
    parkingSpaces: property.parkingSpaces ? Number(property.parkingSpaces) : 0,
    propertyType: property.propertyType ?? null,
    category: property.category ?? null,
    listingType:
      (property as any).listingType ?? (property as any).ListingType ?? null,
    isActive: property.isActive ?? true,
    featured: property.featured ?? false,
    createdAt: property.createdAt ?? new Date(),
    averageRating: property.averageRating ?? 0,
    Agency: property.Agency ? { name: property.Agency.name } : null,
    Photo: (property.Photo ?? []).map((photo: any) => ({
      url: photo.url ?? "",
      alt: photo.alt ?? null,
    })),
    PricingRules: property.PricingRules ?? [],
    marketValue: property.marketValue ?? null,
  };
};

const PropertyBookingList: React.FC<PropertyBookingListProps> = ({
  properties,
  onBook,
  isLoading,
}) => {
  if (isLoading) return <div>Loading properties...</div>;
  if (!properties.length)
    return <div>No properties available for booking.</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <div key={property.id} className="flex flex-col">
          <AnimatedPropertyCard
            property={toPropertyCardData(property) as any}
            index={0}
            onFavoriteToggle={() => {
              /* no-op */
            }}
            isFavorite={false}
          />
          <button
            className="btn-primary mt-2 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            onClick={() => onBook(property)}
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default PropertyBookingList;
