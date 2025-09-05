import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input") ?? "";
  if (!input) return NextResponse.json([]);

  try {
    const response = await client.textSearch({
      params: {
        query: input,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      },
    });
    return NextResponse.json(response.data.results || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}
