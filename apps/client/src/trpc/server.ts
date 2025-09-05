import { cache } from "react";
import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@reservatior/api";
import { createCaller, createTRPCContext } from "@reservatior/api";

import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = () => {
  // WARNING: This context does NOT include session/auth info for SSR hydration.
  // Use the full async context (with auth) only in API routes or server actions.
  // DO NOT call headers() at module scope (outside request context)
  const heads = new Headers(); // Use empty headers for SSR hydration
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    session: null, // or undefined
    headers: heads,
  });
};

const getQueryClient = cache(createQueryClient);

const caller = (createCaller as any)(createContext());

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
