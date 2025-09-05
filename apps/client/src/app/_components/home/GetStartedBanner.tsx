"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@reservatior/ui/button";

export default function GetStartedBanner() {
  const t = useTranslations("Index");
  return (
    <section className="relative mt-16 overflow-hidden py-12 text-center text-white">
      {/* AceternityUI-inspired animated gradient background */}
      <div className="animate-gradient-x pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-pink-500/80 opacity-90" />
      <h2 className="mb-2 text-2xl font-bold drop-shadow-lg">
        {t("getStarted.title", {
          defaultValue: "Ready to find your next place?",
        })}
      </h2>
      <p className="mb-6 text-base drop-shadow">
        {t("getStarted.subtitle", {
          defaultValue:
            "Sign up to save your favorite listings, schedule tours, and more.",
        })}
      </p>
      <Button
        className="text-primary-700 bg-gradient-to-r from-white/90 to-blue-100/80 font-semibold shadow-lg transition-transform hover:scale-105 hover:from-white hover:to-blue-50 focus:ring-2 focus:ring-white/40"
        size="lg"
      >
        {t("getStarted.button", { defaultValue: "Get Started" })}
      </Button>
    </section>
  );
}
