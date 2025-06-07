"use client";

import React from "react";
import { Button } from "@acme/ui/button";
import { useLanguage } from "~/context/LanguageContext";

export default function HeroSearchSection() {
  const { t } = useLanguage();
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[380px] bg-gradient-to-br from-primary-100 to-blue-50 px-4 py-16 text-center">
      {/* Headline */}
      <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
        {t("home.hero.title", { default: "Find your dream home or investment" })}
      </h1>
      {/* Subtitle */}
      <p className="mb-8 max-w-2xl text-lg text-gray-600">
        {t("home.hero.subtitle", { default: "Search thousands of listings, compare neighborhoods, and find apartments, houses, or investments that fit your lifestyle." })}
      </p>
      {/* Search Bar */}
      <form className="flex w-full max-w-2xl flex-col gap-3 rounded-lg bg-white/90 p-4 shadow-md md:flex-row md:gap-0">
        <input
          className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-300"
          type="text"
          placeholder={t("home.hero.searchPlaceholder", { default: "City, Neighborhood, Address, or ZIP" })}
        />
        <select className="mx-0 md:mx-2 rounded-md border border-gray-200 px-3 py-2 text-base">
          <option value="rent">{t("home.hero.forRent", { default: "For Rent" })}</option>
          <option value="sale">{t("home.hero.forSale", { default: "For Sale" })}</option>
        </select>
        <Button className="mt-2 w-full md:mt-0 md:w-auto" type="submit">
          {t("home.hero.searchButton", { default: "Search" })}
        </Button>
      </form>
      {/* Popular tags */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
        <span className="text-gray-400">{t("home.hero.popular", { default: "Popular:" })}</span>
        {["Downtown", "Beachfront", "Uptown", "Events"].map((tag) => (
          <Button key={tag} variant="ghost" className="px-3 py-1 text-gray-700">
            {t(`home.hero.tag.${tag.toLowerCase()}`, { default: tag })}
          </Button>
        ))}
      </div>
    </section>
  );
}
