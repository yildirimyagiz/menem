// Server Component: Loads messages asynchronously and passes them to the client Providers
import { Providers } from "./Providers";
import type { ReactNode } from "react";

interface Messages {
  Index: {
    title: string;
    description: string;
    propertyManagement: {
      title: string;
      description: string;
    };
    waterManagement: {
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

export default async function ProvidersServer({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  let messages: Messages;
  try {
    const importedMessages: { default: Messages } = await import(`../../messages/${locale}.json`);
    messages = importedMessages.default;
  } catch (error) {
    const fallbackMessages: { default: Messages } = await import("../../messages/en.json");
    messages = fallbackMessages.default;
  }

  return (
    <Providers locale={locale} messages={messages}>
      {children}
    </Providers>
  );
}
