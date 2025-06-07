"use client";

import React from "react";
import { Button } from "@acme/ui/button";
import { useLanguage } from "~/context/LanguageContext";

export default function GetStartedBanner() {
  const { t } = useLanguage();
  return (
    <section className="bg-primary-600 py-12 mt-16 text-center text-white">
      <h2 className="mb-2 text-2xl font-bold">
        {t("home.getStarted.title", { default: "Ready to find your next place?" })}
      </h2>
      <p className="mb-6 text-base">
        {t("home.getStarted.subtitle", { default: "Sign up to save your favorite listings, schedule tours, and more." })}
      </p>
      <Button className="bg-white text-primary-600 font-semibold hover:bg-primary-50" size="lg">
        {t("home.getStarted.button", { default: "Get Started" })}
      </Button>
    </section>
  );
}
