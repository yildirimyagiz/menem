// Shared flexible types for property-related UI in prop2 flows

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationRef {
  address?: string;
  city?: string;
  country?: string;
  coordinates?: Coordinates;
}

export interface PhotoRef {
  url: string;
  caption?: string;
}

// A tolerant, UI-focused shape. Keep fields optional to accommodate varying API payloads.
export interface PropertyWithRelations {
  id: string;
  title?: string;
  name?: string;
  description?: string;

  // classification
  propertyType?: string;
  propertyStatus?: string;
  category?: string;
  condition?: string;

  // numbers
  size?: number | string;
  bedrooms?: number;
  bathrooms?: number;
  marketValue?: number;

  // flags
  featured?: boolean;

  // collections
  amenities?: string[];
  features?: string[];

  // relations
  Location?: LocationRef | null;
  Photo?: PhotoRef[] | null;
}
