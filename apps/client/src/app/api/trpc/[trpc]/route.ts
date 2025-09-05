import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";

import { appRouter, createTRPCContext } from "@reservatior/api";
import { authConfig } from "@reservatior/auth";
import { env } from "~/env";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response, req: NextRequest) => {
  const origin = req.headers.get("origin");
  
  // More flexible CORS for development and mobile
  const allowedOrigin = env.NODE_ENV === "production"
    ? ["https://yourdomain.com"] // Configure your production domains
    : ["http://localhost:3000", "http://localhost:3001", "http://192.168.1.1:3000", "http://192.168.1.1:3001"];
  
  const isAllowedOrigin = allowedOrigin.some(allowed => 
    origin?.includes(allowed.replace(/^https?:\/\//, ""))
  );
  
  if (isAllowedOrigin && origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, X-Platform, X-App-Version, x-trpc-source",
  );
};

export const OPTIONS = (req: NextRequest) => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response, req);
  return response;
};

console.log("[DEBUG] appRouter type:", typeof appRouter, appRouter);
console.log("[DEBUG] createTRPCContext type:", typeof createTRPCContext, createTRPCContext);
const handler = async (req: NextRequest) => {
  // Extract session from cookies using NextAuth
  const session = await getServerSession(authConfig);

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        session,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(response, req);
  return response;
};

export { handler as GET, handler as POST };
