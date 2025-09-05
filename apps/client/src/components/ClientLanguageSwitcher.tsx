"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const ClientLanguageSwitcher: FC = () => {
  const [switchText, setSwitchText] = useState("Switch Language");
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname ? (pathname.split("/")[1] ?? "en") : "en";
  const nextLocale = currentLocale === "en" ? "tr" : "en";

  // Use the existing translation infrastructure
  useEffect(() => {
    // Load translations from common namespace
    const loadTranslations = () => {
      try {
        // This will use your existing translation system
        // You can replace this with a direct call to your translation API if needed
        if (currentLocale === "en") {
          setSwitchText("Switch Language");
        } else if (currentLocale === "tr") {
          setSwitchText("Dil Değiştir");
        }
      } catch (error) {
        console.error("Failed to load translation:", error);
      }
    };

    void loadTranslations();
  }, [currentLocale]);

  const handleSwitchLanguage = () => {
    // Replace the current locale in the URL with the new one
    if (pathname) {
      const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
      router.push(newPath);
    } else {
      // Fallback if pathname is null
      router.push(`/${nextLocale}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleSwitchLanguage}
        className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        {switchText} ({nextLocale.toUpperCase()})
      </button>
    </div>
  );
};

export default ClientLanguageSwitcher;
