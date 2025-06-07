import { NextResponse } from "next/server";

import { auth } from "@acme/auth";

export async function GET(request: Request) {
  const requestOrigin = request.headers.get("Origin");
  let allowedOrigin = "YOUR_PRODUCTION_FRONTEND_URL"; // TODO: Replace with your production Flutter app URL

  if (process.env.NODE_ENV === "development") {
    if (requestOrigin && requestOrigin.startsWith("http://localhost:")) {
      allowedOrigin = requestOrigin;
    } else {
      // Fallback for development if Origin header is missing or not localhost
      // You might use a common port or "*" (with caution)
      allowedOrigin = "*"; // Or a specific common dev port like "http://localhost:61144"
    }
  }

  // CORS headers for cross-origin requests
  const headers = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  const session = await auth();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401, headers });
  }

  return NextResponse.json({ user: session.user }, { status: 200, headers });
}

export async function OPTIONS(request: Request) {
  const requestOrigin = request.headers.get("Origin");
  let allowedOrigin = "YOUR_PRODUCTION_FRONTEND_URL"; // TODO: Replace with your production Flutter app URL

  if (process.env.NODE_ENV === "development") {
    if (requestOrigin && requestOrigin.startsWith("http://localhost:")) {
      allowedOrigin = requestOrigin;
    } else {
      allowedOrigin = "*"; // Or a specific common dev port
    }
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
