"use client";

import { useLanguage } from "~/context/LanguageContext";

export default function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-16 dark:bg-blue-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div>
            <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">
              10,000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {t("home.stats.availableProperties", { default: "Available Properties" })}
            </div>
          </div>
          <div>
            <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">
              500+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {t("home.stats.neighborhoods", { default: "Neighborhoods" })}
            </div>
          </div>
          <div>
            <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {t("home.stats.support", { default: "Support" })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 