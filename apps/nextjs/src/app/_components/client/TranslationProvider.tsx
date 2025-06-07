"use client";
"use client";

import type { ReactNode } from "react";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";

interface ClientTranslationProviderProps {
  children: ReactNode;
}

export default function ClientTranslationProvider({
  children,
}: ClientTranslationProviderProps) {
  const locale = useLocale();
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
