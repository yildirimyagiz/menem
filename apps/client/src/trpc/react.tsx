"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  loggerLink,
  splitLink,
  unstable_httpBatchStreamLink,
  wsLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import SuperJSON from "superjson";

import type { AppRouter } from "@reservatior/api";

import { env } from "~/env";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider({
  children,
  headers,
}: {
  children: React.ReactNode;
  headers: Headers;
}) {
  const queryClient = getQueryClient();

  // Router collisions on the backend cause the typed helper to be unusable here.
  // Use any with targeted ESLint suppressions until backend procedure names are fixed.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [trpcClient] = useState(() =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (api as any).createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        splitLink({
          condition: (op) => op.type === "subscription",
          true: wsLink({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            client:
              typeof window !== "undefined"
                ? (new WebSocket(getWsUrl()) as any)
                : (null as any),
            transformer: SuperJSON,
          }),
          false: unstable_httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + "/api/trpc",
            headers() {
              const h = new Headers(headers);
              h.set("x-trpc-source", "nextjs-react");
              return Object.fromEntries(h.entries());
            },
            // Ensure cookies are sent so NextAuth can read the session
            // This fixes UNAUTHORIZED errors on protectedProcedure endpoints
            fetch: (input, init) =>
              fetch(input as RequestInfo, {
                ...(init as RequestInit),
                credentials: "include",
              }) as any,
          }),
        }),
      ],
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const AnyProvider = (api as any).Provider as ComponentType<{ client: unknown; queryClient: QueryClient; children: ReactNode }>;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Using dynamic Provider due to router name collisions */}
      <AnyProvider client={trpcClient} queryClient={queryClient}>
        {children}
      </AnyProvider>
    </QueryClientProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const getWsUrl = () => {
  if (typeof window !== "undefined") {
    // Use the existing NEXT_PUBLIC_WS_URL environment variable
    const wsUrl = env.NEXT_PUBLIC_WS_URL;
    if (wsUrl) {
      // Convert HTTP URL to WebSocket URL
      return wsUrl.replace(/^http/, "ws");
    }
    // Fallback to localhost
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname;
    const port = "2998";
    return `${protocol}//${host}:${port}`;
  }
  return "ws://localhost:2998";
};
