// import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
// import { env } from "~/env";

import { APIProvider } from "@vis.gl/react-google-maps";

import MapContainer from "~/components/MapContainer";
import { env } from "~/env";

interface ListingMapProps {
  listings: any[];
  hoveredListingId: string | null;
  setHoveredListingId: (id: string | null) => void;
}

export default function ListingMap({
  listings,
  hoveredListingId,
  setHoveredListingId,
}: ListingMapProps) {
  if (!listings.length) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded bg-blue-100">
        <span className="text-lg font-semibold text-blue-700">
          [Map with property pins and price markers will appear here]
        </span>
      </div>
    );
  }

  // Map listings to MarkerItem type expected by MapContainer
  const markers = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    address: listing.address || listing.Location?.address || "",
    coordinates: listing.coordinates ||
      listing.Location?.coordinates || { lat: 0, lng: 0 },
    position: listing.coordinates ||
      listing.Location?.coordinates || { lat: 0, lng: 0 },
    price: listing.price || listing.marketValue || 0,
    currency: listing.currency || "USD",
    propertyType: listing.propertyType,
    propertyStatus: listing.propertyStatus,
    category: listing.category,
    condition: listing.condition,
    features: listing.features || [],
    amenities: listing.amenities || [],
    photos: listing.photos || listing.Photo || [],
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
  }));

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <MapContainer
        currentHoverID={hoveredListingId || undefined}
        markers={markers}
        className="h-full w-full rounded border bg-white shadow"
      />
    </APIProvider>
  );
}
