import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

import { db } from "@reservatior/db";

import { validateToken } from "./utils/jwt";

export function createContext({ req, session }: { req: any; session?: any }) {
  // Use provided session (from NextAuth/cookies) if available
  if (session) {
    return { db, session, token: null };
  }
  // Fallback: Extract token from Authorization header (for mobile/JWT)
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const sessionFromToken = token ? validateToken(token) : null;
  return { db, session: sessionFromToken, token };
}

export type Context = inferAsyncReturnType<typeof createContext>;
