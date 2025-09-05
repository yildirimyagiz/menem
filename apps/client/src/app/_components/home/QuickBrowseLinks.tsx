"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@reservatior/ui/button";

const demoCities = [
  { name: "San Francisco", slug: "san-francisco" },
  { name: "New York", slug: "new-york" },
  { name: "Miami", slug: "miami" },
  { name: "Chicago", slug: "chicago" },
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Seattle", slug: "seattle" },
];

export default function QuickBrowseLinks() {
  const t = useTranslations("Index");
  return (
    <section className="container relative mx-auto my-8 overflow-hidden px-4">
      {/* AceternityUI-inspired animated gradient background */}
      <div className="animate-gradient-x pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/60" />
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        {t("quickBrowse.title", { defaultValue: "Browse Homes by City" })}
      </h2>
      <div className="flex flex-wrap gap-3">
        {demoCities.map((city) => (
          <Button
            key={city.slug}
            variant="outline"
            className="bg-gradient-to-r from-blue-100/60 to-purple-100/60 text-base shadow transition-transform hover:scale-105 hover:from-blue-200 hover:to-purple-200 focus:ring-2 focus:ring-blue-400/40"
          >
            {t(`quickBrowse.city.${city.slug}`, { defaultValue: city.name })}
          </Button>
        ))}
      </div>
    </section>
  );
}
