import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authConfig } from "@reservatior/auth";

import { env } from "~/env";

export async function GET(req: NextRequest) {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
  ];
  const origin = req.headers.get("origin") ?? allowedOrigins[0];
  const checkedOrigin: string = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];
  const allowOrigin: string =
    env.NODE_ENV === "production"
      ? "https://your-production-frontend.com"
      : checkedOrigin;

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401, headers });
  }

  return NextResponse.json({ user: session.user }, { status: 200, headers });
}

export const OPTIONS = (req: NextRequest) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
  ];
  const origin = req.headers.get("origin") ?? allowedOrigins[0];
  const checkedOrigin: string = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];
  const allowOrigin: string =
    env.NODE_ENV === "production"
      ? "https://your-production-frontend.com"
      : checkedOrigin;
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Credentials": "true",
    } as Record<string, string>,
  });
};
