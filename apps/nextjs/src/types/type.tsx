import type { ParsedUrlQuery } from "querystring";
import type { ComponentType } from "react";

// Basic route type
export interface Route<T = string> {
  pathname: T;
  path: string;
  query?: ParsedUrlQuery;
  hash?: string;
}

// Define PathName as a string type
export type PathName = string;

// Next.js specific route types
export type NextRoute = Route<string>;
export type DynamicRoute = Route<string>;

// Href type for Next.js Link component
export type Href = string | NextRoute;

// Page component type
export type PageComponent<P = object> = ComponentType<P> & {
  getInitialProps?: (ctx: unknown) => Promise<P> | P;
};

// Page type with additional Next.js properties
export type NextPage<P = object, _IP = P> = PageComponent<P> & {
  defaultProps?: Partial<P>;
  displayName?: string;
};

// Dynamic route params
export interface DynamicParams extends ParsedUrlQuery {
  [key: string]: string | string[];
}

// Route configuration for app directory
export interface AppRouteConfig {
  page: string;
  pathname: string;
  filename: string;
  bundlePath: string;
}

// Helper type for string literal routes
export type RouteLiteral<T extends string> = T;

// Utility type for creating type-safe route helpers
export type RouteHelper<T extends string> = (
  ...args: string[]
) => RouteLiteral<T>;
// Guest related types
export interface GuestComposition {
  adultCount: number;
  childCount: number;
}

export interface GuestData {
  adults: {
    count: number;
    composition: GuestComposition;
  };
  children: {
    count: number;
    composition: GuestComposition;
  };
  infants: {
    count: number;
    composition: GuestComposition;
  };
  specialRequests?: string;
  loyaltyPoints?: number;
  isVIP?: boolean;
}

// Legacy type - maintained for backward compatibility
export interface GuestsObject {
  guestAdults: number;
  guestChildren: number;
  guestInfants: number;
  composition?: GuestComposition;
}

// Search form related types
export type StaySearchFormFields =
  | "location"
  | "guests"
  | "dates"
  | "price"
  | "propertyType";

// Property related types - aligned with prisma schema
export enum PropertyType {
  Apartment = "Apartment",
  Villa = "Villa",
  Residence = "Residence",
  Condo = "Condo",
  Mansion = "Mansion",
  Building = "Building",
  Office = "Office",
  Shop = "Shop",
  SharedRoom = "SharedRoom",
  SharedPlace = "SharedPlace",
  SingleHouse = "SingleHouse",
  DublexHouse = "DublexHouse",
  Penthouse = "Penthouse",
  Restaurant = "Restaurant",
  Warehouse = "Warehouse",
  Industrial = "Industrial",
}

export interface PropertyTypeOption {
  name: PropertyType;
  description: string;
  checked: boolean;
}

// Date related types
export type DateRange = [Date | null, Date | null];

// Status types - aligned with prisma schema
export enum PropertyStatus {
  Available = "Available",
  Owner = "Owner",
  Rented = "Rented",
  UnderConstruction = "UnderConstruction",
  NewProject = "NewProject",
  Reserved = "Reserved",
  Sold = "Sold",
  Empty = "Empty",
}

// Listing types - aligned with prisma schema
export enum ListingType {
  ForSale = "ForSale",
  ForRent = "ForRent",
  Booking = "Booking",
}

// Additional useful types
export interface PropertyFilters {
  propertyType?: PropertyType;
  status?: PropertyStatus;
  listingType?: ListingType;
  priceRange?: [number, number];
  amenities?: string[];
  location?: string;
  dates?: DateRange;
  guests?: GuestsObject;
}
