"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

import { Button } from "@reservatior/ui/button";

interface Neighborhood {
  id: number;
  name: string;
  image: string;
  description: string;
  defaultDescription: string;
}

const demoNeighborhoods: Neighborhood[] = [
  {
    id: 1,
    name: "Downtown",
    image: "/images/neighborhood1.jpg",
    description: "neighborhoods.downtown.desc",
    defaultDescription:
      "Vibrant city living with shopping, dining, and entertainment.",
  },
  {
    id: 2,
    name: "Beachfront",
    image: "/images/neighborhood2.jpg",
    description: "neighborhoods.beachfront.desc",
    defaultDescription:
      "Relax by the ocean in beautiful beachfront communities.",
  },
  {
    id: 3,
    name: "Uptown",
    image: "/images/neighborhood3.jpg",
    description: "neighborhoods.uptown.desc",
    defaultDescription: "Trendy area with cafes, boutiques, and nightlife.",
  },
];

const NeighborhoodHighlights: React.FC = () => {
  const t = useTranslations("Index");
  return (
    <section className="container mx-auto my-16 px-4">
      <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg text-center">
        {t("neighborhoods.title", { defaultValue: "Neighborhood Highlights" })}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {demoNeighborhoods.map((n) => (
          <div
            key={n.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/80 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-none backdrop-blur-md"
          >
            {/* Glassmorphism/gradient overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Image
              src={n.image}
              alt={n.name}
              className="h-48 w-full rounded-t-2xl object-cover transition-transform duration-300 group-hover:scale-105"
              width={400}
              height={192}
              style={{ objectFit: "cover" }}
              priority={false}
            />
            <div className="relative z-10 flex flex-1 flex-col p-6">
              <div className="mb-2 text-xl font-bold text-gray-900">
                {t(`neighborhoods.${n.name.toLowerCase()}.name`, {
                  defaultValue: n.name,
                })}
              </div>
              <div className="mb-4 flex-1 text-base text-gray-500">
                {t(n.description, { defaultValue: n.defaultDescription })}
              </div>
              <Button
                className="mt-auto w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-400/40 py-3 text-base"
                variant="outline"
              >
                {t("neighborhoods.readGuide", { defaultValue: "Read Guide" })}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NeighborhoodHighlights;
