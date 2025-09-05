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
export type NextPage<P = object, IP = P> = PageComponent<P> & {
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
