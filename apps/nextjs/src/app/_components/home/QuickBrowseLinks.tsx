"use client";

import React from "react";
import { Button } from "@acme/ui/button";
import { useLanguage } from "~/context/LanguageContext";

const demoCities = [
  { name: "San Francisco", slug: "san-francisco" },
  { name: "New York", slug: "new-york" },
  { name: "Miami", slug: "miami" },
  { name: "Chicago", slug: "chicago" },
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Seattle", slug: "seattle" },
];

export default function QuickBrowseLinks() {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto my-8 px-4">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        {t("home.quickBrowse.title", { default: "Browse Homes by City" })}
      </h2>
      <div className="flex flex-wrap gap-3">
        {demoCities.map((city) => (
          <Button key={city.slug} variant="outline" className="text-base">
            {t(`home.quickBrowse.city.${city.slug}`, { default: city.name })}
          </Button>
        ))}
      </div>
    </section>
  );
}
