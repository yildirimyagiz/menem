import "~/app/global.css";

import { Toaster } from "@acme/ui/toaster";

import { useToast } from "~/hooks/use-toast";
import { Header } from "./_components/client/Header";
import Navbar from "./_components/client/Navbar";
import { Providers } from "./_components/Providers";

export const metadata = {
  title: "RentalProc",
  description: "Property Management System",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If you want to support dynamic locales, replace 'en' with your logic
  const locale = "en";

  // Minimal valid Messages object to satisfy Providers prop
  const defaultMessages = {
    Index: {
      title: "",
      description: "",
      propertyManagement: { title: "", description: "" },
    },
    Auth: {
      signIn: "",
      signOut: "",
      welcomeBack: "",
    },
    Posts: {
      create: "",
      title: "",
      content: "",
      loading: "",
      save: "",
      cancel: "",
      edit: "",
      delete: "",
      noPostsYet: "",
      errorUnauthorized: "",
      errorCreatePost: "",
      errorUpdatePost: "",
      errorDeletePost: "",
    },
  };

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={defaultMessages}>
          <Navbar />
          {children}
          <Toaster useToast={useToast} />
        </Providers>
      </body>
    </html>
  );
}
