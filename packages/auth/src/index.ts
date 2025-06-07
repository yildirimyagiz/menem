import type { Session } from "next-auth";
import NextAuth from "next-auth";

import { authConfig } from "./config.js";

export type { Session } from "next-auth";

const nextAuthResult = NextAuth(authConfig);

export const handlers = nextAuthResult.handlers;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;

export const auth: () => Promise<Session | null> = nextAuthResult.auth;

export {
  invalidateSessionToken,
  validateToken,
  isSecureContext,
} from "./config.js";
