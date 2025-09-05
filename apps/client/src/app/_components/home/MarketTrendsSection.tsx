"use client";

import React from "react";

import { useLanguage } from "~/context/LanguageContext";

// Demo stats (replace with real data or chart integration)
const demoStats = [
  {
    label: "home.trends.avgPrice",
    value: "$2,450",
    defaultLabel: "Avg. Price (Rent)",
  },
  {
    label: "home.trends.newListings",
    value: "1,200",
    defaultLabel: "New Listings This Month",
  },
  {
    label: "home.trends.avgDaysOnMarket",
    value: "18",
    defaultLabel: "Avg. Days on Market",
  },
  {
    label: "home.trends.totalCities",
    value: "35",
    defaultLabel: "Cities Covered",
  },
];

export default function MarketTrendsSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-primary-50 relative overflow-hidden py-10">
      {/* AceternityUI-inspired animated gradient background */}
      <div className="animate-gradient-x pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-100/80 via-purple-100/60 to-pink-100/60" />
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          {t("home.trends.title", { default: "Market Trends & Insights" })}
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {demoStats.map((stat) => (
            <div
              key={stat.value}
              className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white p-6 text-center shadow-lg transition-shadow hover:shadow-2xl"
            >
              {/* AceternityUI-inspired animated gradient overlay */}
              <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="text-primary-600 mb-2 text-2xl font-bold">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">
                  {t(stat.label, { default: stat.defaultLabel })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
