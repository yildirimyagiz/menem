"use client";

import React from "react";
import { useLanguage } from "~/context/LanguageContext";
import { Home, Search, Calendar, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-8 w-8 text-primary-500 mb-2" />,
    label: "home.howItWorks.search",
    defaultLabel: "Search Properties",
    description: "home.howItWorks.searchDesc",
    defaultDescription: "Find homes, apartments, and investments in your area.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary-500 mb-2" />,
    label: "home.howItWorks.tour",
    defaultLabel: "Schedule Tours",
    description: "home.howItWorks.tourDesc",
    defaultDescription: "Book in-person or virtual tours easily.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary-500 mb-2" />,
    label: "home.howItWorks.apply",
    defaultLabel: "Apply Online",
    description: "home.howItWorks.applyDesc",
    defaultDescription: "Submit applications and documents securely.",
  },
  {
    icon: <Home className="h-8 w-8 text-primary-500 mb-2" />,
    label: "home.howItWorks.moveIn",
    defaultLabel: "Move In!",
    description: "home.howItWorks.moveInDesc",
    defaultDescription: "Sign your lease and get the keys.",
  },
];

export default function HowItWorksSection() {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto my-16 px-4">
      <h2 className="mb-8 text-2xl font-semibold text-gray-900 text-center">
        {t("home.howItWorks.title", { default: "How It Works" })}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            {step.icon}
            <div className="mb-2 text-lg font-semibold text-primary-700">
              {t(step.label, { default: step.defaultLabel })}
            </div>
            <div className="text-sm text-gray-500 text-center">
              {t(step.description, { default: step.defaultDescription })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
