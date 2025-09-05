"use client";

import { TooltipProvider } from "@reservatior/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";



import { LanguageProvider } from "~/context/LanguageContext";
import { TRPCReactProvider } from "~/trpc/react";

// Replace the Messages type/interface definition with a recursive type that allows nested objects or strings
export interface Messages {
  [key: string]: string | string[] | Record<string, unknown> | Record<string, unknown>[] | Messages;
}

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: Messages;
}) {
  return (
    <SessionProvider>
      <TRPCReactProvider headers={new Headers()}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="America/Los_Angeles"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
