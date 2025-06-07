"use client";

import React from "react";
import { Button } from "@acme/ui/button";
import { useLanguage } from "~/context/LanguageContext";

const demoNeighborhoods = [
  {
    id: 1,
    name: "Downtown",
    image: "/images/neighborhood1.jpg",
    description: "home.neighborhoods.downtown.desc",
    defaultDescription: "Vibrant city living with shopping, dining, and entertainment.",
  },
  {
    id: 2,
    name: "Beachfront",
    image: "/images/neighborhood2.jpg",
    description: "home.neighborhoods.beachfront.desc",
    defaultDescription: "Relax by the ocean in beautiful beachfront communities.",
  },
  {
    id: 3,
    name: "Uptown",
    image: "/images/neighborhood3.jpg",
    description: "home.neighborhoods.uptown.desc",
    defaultDescription: "Trendy area with cafes, boutiques, and nightlife.",
  },
];

import Image from "next/image";

export default function NeighborhoodHighlights() {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto my-12 px-4">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        {t("home.neighborhoods.title", { default: "Neighborhood Highlights" })}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {demoNeighborhoods.map((n) => (
          <div key={n.id} className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <Image
              src={n.image}
              alt={n.name}
              className="h-40 w-full rounded-t-lg object-cover"
              width={400}
              height={160}
              style={{ objectFit: "cover" }}
              priority={false}
            />
            <div className="p-4 flex-1 flex flex-col">
              <div className="mb-2 text-lg font-semibold text-gray-900">
                {t(`home.neighborhoods.${n.name.toLowerCase()}.name`, { default: n.name })}
              </div>
              <div className="mb-3 text-sm text-gray-500 flex-1">
                {t(n.description, { default: n.defaultDescription })}
              </div>
              <Button className="w-full mt-auto" variant="outline">
                {t("home.neighborhoods.readGuide", { default: "Read Guide" })}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
