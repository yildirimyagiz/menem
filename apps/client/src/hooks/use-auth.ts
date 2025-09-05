"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import type { Role } from "~/utils/interfaces";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl: string;
  locale?: string | null;
  timezone?: string | null;
  preferences?: Record<string, unknown> | null;
}

interface UseAuthReturn {
  user: User | null;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  token: string | null;
  setToken: (token: string | null) => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  // JWT token state (localStorage-backed)
  const [token, setTokenState] = useState<string | null>(null);

  // Read token from localStorage on mount
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (stored) setTokenState(stored);
  }, []);

  // Helper to set token in both state and localStorage
  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("jwt", newToken);
      } else {
        localStorage.removeItem("jwt");
      }
    }
  }, [setTokenState]);

  const user = useMemo(() => {
    if (!session?.user) return null;

    return {
      ...session.user,
      role: (session.user as User).role ?? "USER",
      firstName: session.user.name?.split(" ")[0] ?? "",
      lastName: session.user.name?.split(" ").slice(1).join(" ") ?? "",
      username: session.user.name ?? "",
      profileImageUrl: session.user.image ?? "",
    };
  }, [session]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut({ redirect: false });
      setToken(null); // Clear JWT from localStorage and state only on logout
      // If you use cookies, clear those too
      // cookies.remove('jwt');
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, [setToken]);

  return {
    user,
    logout,
    isLoading: status === "loading",
    error:
      session === null && status === "unauthenticated"
        ? new Error("Not authenticated")
        : null,
    token,
    setToken,
  };
}

/**
 * NOTE: This hook now supports JWT token storage/retrieval in localStorage.
 * - Call setToken(token) after login if your API returns a JWT.
 * - Use the token value for API requests as needed.
 * - logout() will clear the token.
 *
 * Best practice: Use HTTPS, set secure cookie flags if using cookies, and NEVER store refresh tokens on the frontend.
 *
 * This pattern is ready for integrating JWT-based auth in the frontend if needed.
 */
