import { skipCSRFCheck } from "@auth/core";
import * as jwt from "jsonwebtoken";
import GoogleProviderImport from "next-auth/providers/google";
import { env } from "../env";
import { CustomPrismaAdapter } from "./adapter";
const GoogleProvider = GoogleProviderImport.default || GoogleProviderImport;
// Add explicit types to all destructured callback parameters below (if any exist in the rest of the file).
const adapter = CustomPrismaAdapter();
export const isSecureContext = env.NODE_ENV !== "development";
export const authConfig = {
    adapter,
    // In development, we need to skip checks to allow mobile apps to work
    ...(!isSecureContext
        ? {
            skipCSRFCheck: skipCSRFCheck,
            trustHost: true,
        }
        : {}),
    secret: env.AUTH_SECRET,
    pages: {
        signIn: "/[locale]/auth/login",
        error: "/[locale]/auth/error",
    },
    events: {
        async linkAccount({ user, account, profile, }) {
            if (!account || !profile)
                return;
            // Handle account linking when signing in with a provider
            // that's already linked to another account
            if (account.provider === "google") {
                // You can add custom logic here if needed
                console.log("Account linked:", {
                    userId: user.id,
                    provider: account.provider,
                });
            }
        },
    },
    providers: [
        // Only enable Google OAuth if credentials are provided
        ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
            ? [
                GoogleProvider({
                    clientId: env.AUTH_GOOGLE_ID,
                    clientSecret: env.AUTH_GOOGLE_SECRET,
                    allowDangerousEmailAccountLinking: true,
                }),
            ]
            : []),
    ],
    callbacks: {
        async signIn({ user, account, profile, }) {
            if (!user)
                return false; // Add null check for user
            // Optionally add null checks for account/profile if you use them
            // Allow sign in if it's a Google OAuth account
            if (account?.provider === "google") {
                return true;
            }
            // For other providers or email/password, proceed with normal sign in
            return true;
        },
        session: (opts) => {
            if (!opts.user)
                throw new Error("unreachable with session strategy");
            if (!("user" in opts))
                throw new Error("unreachable with session strategy");
            return {
                ...opts.session,
                user: {
                    ...opts.session.user,
                    id: opts.user.id,
                    role: opts.user.role, // Add role from the database if present
                },
            };
        },
    },
};
/**
 * Validates a session token by first verifying its JWT signature and then checking the database.
 * @param token The JWT token to validate (with or without 'Bearer ' prefix)
 * @returns The session if valid, null otherwise
 */
export const validateToken = async (token) => {
    try {
        // Remove 'Bearer ' prefix if present
        const sessionToken = token.startsWith("Bearer ") ? token.slice(7) : token;
        // First verify the JWT signature
        const secret = env.AUTH_SECRET ?? "dev-secret";
        try {
            // This will throw if the token is invalid or expired
            jwt.verify(sessionToken, secret, { ignoreExpiration: false });
        }
        catch (error) {
            console.warn("JWT verification failed:", error);
            return null;
        }
        // Then check the session in the database
        const session = await adapter.getSessionAndUser?.(sessionToken);
        if (!session) {
            return null;
        }
        // Verify the session hasn't expired
        if (new Date(session.session.expires) < new Date()) {
            await adapter.deleteSession?.(sessionToken);
            return null;
        }
        return {
            user: {
                ...session.user,
            },
            expires: session.session.expires.toISOString(),
        };
    }
    catch (error) {
        console.warn("Token validation failed:", error);
        return null;
    }
};
/**
 * Invalidates a session token by removing it from the database
 * @param token The JWT token to invalidate (with or without 'Bearer ' prefix)
 */
export const invalidateSessionToken = async (token) => {
    try {
        const sessionToken = token.startsWith("Bearer ") ? token.slice(7) : token;
        await adapter.deleteSession?.(sessionToken);
    }
    catch (error) {
        console.warn("Failed to invalidate session token:", error);
    }
};
