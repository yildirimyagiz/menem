"use client";

import React from "react";
import { Calendar, CheckCircle, Home, Search } from "lucide-react";

import { useLanguage } from "~/context/LanguageContext";

const steps = [
  {
    icon: <Search className="text-primary-500 mb-2 h-8 w-8" />,
    label: "home.howItWorks.search",
    defaultLabel: "Search Properties",
    description: "home.howItWorks.searchDesc",
    defaultDescription: "Find homes, apartments, and investments in your area.",
  },
  {
    icon: <Calendar className="text-primary-500 mb-2 h-8 w-8" />,
    label: "home.howItWorks.tour",
    defaultLabel: "Schedule Tours",
    description: "home.howItWorks.tourDesc",
    defaultDescription: "Book in-person or virtual tours easily.",
  },
  {
    icon: <CheckCircle className="text-primary-500 mb-2 h-8 w-8" />,
    label: "home.howItWorks.apply",
    defaultLabel: "Apply Online",
    description: "home.howItWorks.applyDesc",
    defaultDescription: "Submit applications and documents securely.",
  },
  {
    icon: <Home className="text-primary-500 mb-2 h-8 w-8" />,
    label: "home.howItWorks.moveIn",
    defaultLabel: "Move In!",
    description: "home.howItWorks.moveInDesc",
    defaultDescription: "Sign your lease and get the keys.",
  },
];

export default function HowItWorksSection() {
  const { t } = useLanguage();
  return (
    <section className="container relative mx-auto my-16 px-4">
      {/* AceternityUI-inspired animated gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/60 dark:from-blue-950/20 dark:to-purple-950/20" />
      <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900">
        {t("home.howItWorks.title", { default: "How It Works" })}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col items-center overflow-hidden rounded-lg border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-2xl"
          >
            {/* AceternityUI-inspired animated gradient overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center">
              {step.icon}
              <div className="text-primary-700 mb-2 text-lg font-semibold">
                {t(step.label, { default: step.defaultLabel })}
              </div>
              <div className="text-center text-sm text-gray-500">
                {t(step.description, { default: step.defaultDescription })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
