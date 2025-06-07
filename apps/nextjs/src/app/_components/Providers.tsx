"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

import { LanguageProvider } from "~/context/LanguageContext";
import { TRPCReactProvider } from "~/trpc/react";

interface Messages {
  Index: {
    title: string;
    description: string;
    propertyManagement: {
      title: string;
      description: string;
    };
  };
  Auth: {
    signIn: string;
    signOut: string;
    welcomeBack: string;
  };
  Posts: {
    create: string;
    title: string;
    content: string;
    loading: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    noPostsYet: string;
    errorUnauthorized: string;
    errorCreatePost: string;
    errorUpdatePost: string;
    errorDeletePost: string;
  };
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
          <LanguageProvider>{children}</LanguageProvider>
        </NextIntlClientProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
