"use client";

import type { ReactNode } from "react";
import { useLocale, useMessages } from "next-intl";

import ClientTranslationProvider from "~/app/_components/client/TranslationProvider";

interface FilterTranslationProviderProps {
  children: ReactNode;
}

/**
 * Provides translation context for filter components
 * This wrapper ensures all filter components have access to translations
 */
export default function FilterTranslationProvider({
  children,
}: FilterTranslationProviderProps) {
  // useLocale and useMessages are still called for context, but ClientTranslationProvider now pulls them internally
  useLocale();
  useMessages();
  return (
    <ClientTranslationProvider>
      {children}
    </ClientTranslationProvider>
  );
}
