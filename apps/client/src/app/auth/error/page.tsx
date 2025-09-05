"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthErrorRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to detect the user's preferred locale, fallback to 'en'
    const locale =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language.split("-")[0]
        : "en";
    // Preserve error query param if present
    const error = searchParams?.get("error");
    const query = error ? `?error=${encodeURIComponent(error)}` : "";
    router.replace(`/${locale}/auth/error${query}`);
  }, [router, searchParams]);

  return null;
}
