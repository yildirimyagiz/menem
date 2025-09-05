import "~/app/global.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Toaster } from "@reservatior/ui/toaster";

import { env } from "~/env";
import { useToast } from "~/hooks/use-toast";

import { Providers } from "./_components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Reservatior",
    template: "%s | Reservatior",
  },
  description: "Property Management System",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* ...existing head scripts... */}</head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <Providers locale="en" messages={{}}>
          {children}
          <Toaster useToast={useToast} />
        </Providers>
      </body>
    </html>
  );
}
