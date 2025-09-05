"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Try to detect the user's preferred locale, fallback to 'en'
    const locale =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language.split("-")[0]
        : "en";
    router.replace(`/${locale}/auth/login`);
  }, [router]);

  return null;
}
