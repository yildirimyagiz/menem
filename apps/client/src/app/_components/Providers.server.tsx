// Server Component: Loads messages asynchronously and passes them to the client Providers
import type { ReactNode } from "react";

import { Providers } from "./Providers";

import type { Messages } from "./Providers";

interface Props {
  children: ReactNode;
  locale: string;
  messages: Messages;
}

export default function ProvidersServer({ children, locale, messages }: Props) {
  return (
    <Providers locale={locale} messages={messages}>
      {children}
    </Providers>
  );
}
