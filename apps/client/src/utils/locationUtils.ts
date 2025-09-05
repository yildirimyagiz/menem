import type { JsonValue } from '@prisma/client/runtime/library';

interface Coordinates {
  lat: number;
  lng: number;
}

interface BackendLocation {
  id?: string;
  address: string;
  city: string;
  country: string;
  district?: string | undefined;
  postalCode?: string | undefined;
  coordinates?: Coordinates | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | undefined;
}

interface FrontendLocation {
  id: string;
  address: string;
  city: string;
  country: string;
  district: string | null;
  postalCode: string | null;
  coordinates: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

function isCoordinates(obj: unknown): obj is Coordinates {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'lat' in obj &&
    'lng' in obj &&
    (typeof (obj as { lat: unknown }).lat === 'number' || 
     typeof (obj as { lat: unknown }).lat === 'string') &&
    (typeof (obj as { lng: unknown }).lng === 'number' || 
     typeof (obj as { lng: unknown }).lng === 'string')
  );
}

export function toBackendLocation(
  location: FrontendLocation | null | undefined
): BackendLocation | undefined {
  if (!location) return undefined;

  const parseCoordinates = (coords: JsonValue | null): Coordinates | undefined => {
    if (!coords) return undefined;
    
    try {
      const parsed = typeof coords === 'string' ? JSON.parse(coords) : coords;
      
      if (isCoordinates(parsed)) {
        return {
          lat: typeof parsed.lat === 'number' ? parsed.lat : Number(parsed.lat),
          lng: typeof parsed.lng === 'number' ? parsed.lng : Number(parsed.lng)
        };
      }
      return undefined;
    } catch (error) {
      console.error('Invalid coordinates format:', error);
      return undefined;
    }
  };

  // Create a new object with the correct types
  const backendLocation: BackendLocation = {
    id: location.id,
    address: location.address,
    city: location.city,
    country: location.country,
    // Convert null to undefined for optional fields
    district: location.district === null ? undefined : location.district,
    postalCode: location.postalCode === null ? undefined : location.postalCode,
    coordinates: parseCoordinates(location.coordinates),
    createdAt: location.createdAt,
    updatedAt: location.updatedAt,
    deletedAt: location.deletedAt === null ? undefined : location.deletedAt,
  };

  return backendLocation;
}
