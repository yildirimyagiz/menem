"use client";

import type { AbstractIntlMessages } from "next-intl";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

interface ClientTranslationProviderProps {
  messages: AbstractIntlMessages;
  locale: string;
  children: ReactNode;
}

export default function ClientTranslationProvider({
  messages,
  locale,
  children,
}: ClientTranslationProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
