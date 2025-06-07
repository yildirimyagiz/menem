import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { Toaster } from "@acme/ui/toaster";

import { ChatBalloon } from "~/components/ChatBalloon";
import { ChatProvider } from "~/context/ChatContext";
import { useToast } from "~/hooks/use-toast";
import { Providers } from "../_components/Providers";
import { routing } from "../../i18n/routing";
import ar from "../../messages/ar.json";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fa from "../../messages/fa.json";
import fr from "../../messages/fr.json";
import hi from "../../messages/hi.json";
import it from "../../messages/it.json";
import ja from "../../messages/ja.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import zh from "../../messages/zh.json";

const messagesMap = {
  en,
  tr,
  zh,
  es,
  ar,
  hi,
  fr,
  fa,
  de,
  ja,
  it,
  ru,
};

function getMessagesForLocale(locale: string) {
  return messagesMap[locale as keyof typeof messagesMap] || en;
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: {
    locale:
      | "en"
      | "zh"
      | "es"
      | "ar"
      | "hi"
      | "fr"
      | "tr"
      | "fa"
      | "de"
      | "ja"
      | "it"
      | "ru";
  };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = getMessagesForLocale(locale);

  return (
    <Providers locale={locale} messages={messages}>
      <ChatProvider>
        {children}
        <ChatBalloon />
      </ChatProvider>
      <Toaster useToast={useToast} />
    </Providers>
  );
}
