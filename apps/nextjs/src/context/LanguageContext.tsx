"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import { useLocale, useTranslations } from "next-intl";

import type { routing } from "~/i18n/routing";
import { useRouter } from "~/i18n/navigation";

export type LocaleType = (typeof routing.locales)[number];

interface Language {
  code: LocaleType;
  name: string;
  flag: string;
  region?: string;
}

interface LanguageContextType {
  currentLocale: LocaleType;
  languages: readonly Language[];
  changeLocale: (locale: LocaleType) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", region: "US" },
  { code: "zh", name: "中文", flag: "🇨🇳", region: "CN" },
  { code: "es", name: "Español", flag: "🇪🇸", region: "ES" },
  { code: "ar", name: "العربية", flag: "🇸🇦", region: "SA" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", region: "IN" },
  { code: "fr", name: "Français", flag: "🇫🇷", region: "FR" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", region: "TR" },
  { code: "fa", name: "فارسی", flag: "🇮🇷", region: "IR" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", region: "DE" },
  { code: "ja", name: "日本語", flag: "🇯🇵", region: "JP" },
  { code: "it", name: "Italiano", flag: "🇮🇹", region: "IT" },
  { code: "ru", name: "Русский", flag: "🇷🇺", region: "RU" },
] as const satisfies readonly Language[];

const LanguageContext = createContext<LanguageContextType>(
  {} as LanguageContextType,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as LocaleType;
  const router = useRouter();
  const t = useTranslations();

  const changeLocale = (newLocale: LocaleType) => {
    router.replace("/", { locale: newLocale });
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLocale: locale,
        languages,
        changeLocale,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
