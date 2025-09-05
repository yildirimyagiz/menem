import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import {
  authConfig as baseAuthConfig,
  isSecureContext,
} from "@reservatior/auth";

import { env } from "~/env";

// Compose providers here for Next.js API route
const providers = [
  GoogleProvider({
    clientId: env.AUTH_GOOGLE_ID,
    clientSecret: env.AUTH_GOOGLE_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
];

const authConfig = {
  ...baseAuthConfig,
  providers,
};

const handler = NextAuth(authConfig);

/**
 * In development, rewrite the request URL to use localhost instead of host IP address
 * to avoid Next.js CSRF protection issues with mobile apps.
 * @param req The request to modify
 * @returns The modified request.
 */
function rewriteRequestUrlInDevelopment(req: NextRequest) {
  if (isSecureContext) return req;

  const host = req.headers.get("host");
  const newURL = new URL(req.url);
  newURL.host = host ?? req.nextUrl.host;
  return new NextRequest(newURL, req);
}

export const OPTIONS = (req: NextRequest) => {
  const NODE_ENV = env.NODE_ENV ?? "development";

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
    "capacitor://localhost",
    "ionic://localhost",
  ];
  const originRaw = req.headers.get("origin");
  const origin = originRaw || allowedOrigins[0];
  const checkedOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  const allowOrigin =
    NODE_ENV === "production"
      ? "https://your-production-frontend.com"
      : checkedOrigin;

  return new NextResponse(null, {
    status: 204,
    headers: {
      // Allow Capacitor app and web on localhost in dev
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Credentials": "true",
    } as Record<string, string>,
  });
};

export const POST = async (
  _req: NextRequest,
  { params }: { params: { nextauth: string[] } },
) => {
  // Rewrite request URL for development
  const req = rewriteRequestUrlInDevelopment(_req);

  // Use NextAuth default handler
  return handler(req, { params });
};

export const GET = async (
  _req: NextRequest,
  { params }: { params: { nextauth: string[] } },
) => {
  // Rewrite request URL for development
  const req = rewriteRequestUrlInDevelopment(_req);

  // Use NextAuth default handler
  return handler(req, { params });
};
