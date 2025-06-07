import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { inferAsyncReturnType } from "@trpc/server";
import { db } from "@acme/db";

export function createContext({ req }: CreateHTTPContextOptions) {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  return {
    db,
    session: null, // You'll want to add proper session handling here
    token, // Add required token field
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
