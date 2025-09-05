import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authConfig } from "@reservatior/auth";

export async function GET(request: Request) {
  const requestOrigin = request.headers.get("Origin");
  const allowedOrigin =
    process.env.NODE_ENV === "production"
      ? "https://your-production-frontend.com" // <-- Set this to your deployed frontend/mobile app URL
      : requestOrigin?.startsWith("http://localhost:")
        ? requestOrigin
        : "*"; // For dev, allow all or restrict as needed

  // CORS headers for cross-origin requests
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401, headers });
  }

  // Type-safe access to session.token if using JWT session strategy
  type SessionWithToken = typeof session & { token?: string };
  const sessionWithToken = session as SessionWithToken;
  return NextResponse.json(
    { user: sessionWithToken.user, token: sessionWithToken.token },
    { status: 200, headers },
  );
}

export async function OPTIONS(request: Request) {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
  ];
  const requestOrigin = request.headers.get("Origin");
  const allowedOrigin = process.env.NODE_ENV === "production"
    ? "https://your-production-frontend.com"
    : (requestOrigin && allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0]);

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Credentials": "true",
    } as Record<string, string>,
  });
}
