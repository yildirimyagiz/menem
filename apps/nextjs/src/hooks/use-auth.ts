"use client";

import { useCallback, useMemo } from "react";
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
}

interface UseAuthReturn {
  user: User | null;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

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
      // Optionally add any post-logout logic here
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, []);

  return {
    user,
    logout,
    isLoading: status === "loading",
    error:
      session === null && status === "unauthenticated"
        ? new Error("Not authenticated")
        : null,
  };
}
