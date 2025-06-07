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
    <section className="bg-primary-50 py-10">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 text-center">
          {t("home.trends.title", { default: "Market Trends & Insights" })}
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {demoStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-white p-6 text-center shadow-sm border border-gray-100"
            >
              <div className="mb-2 text-2xl font-bold text-primary-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">
                {t(stat.label, { default: stat.defaultLabel })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
