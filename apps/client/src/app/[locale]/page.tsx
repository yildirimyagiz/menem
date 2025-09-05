import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Index");
  return {
    title: t("title"),
    description: t("description"),
  };
}

// Client component for the homepage content
const HomePageContent = dynamic(() => import("~/app/[locale]/client/HomePageContent"), {
    ssr: false,
  });

export default function HomePage() {
  return <HomePageContent />;
}
