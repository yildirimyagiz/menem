// apps/client/src/app/[locale]/client/about/SectionStatistic.tsx

import React from "react";
import { useTranslations } from "next-intl";
import CountUp from "react-countup";

const SectionStatistic: React.FC = () => {
  const t = useTranslations('About');
  const stats = [
    { id: "1", label: t('stats.propertiesListed', { defaultValue: 'Properties Listed' }), value: '12,500+' },
    { id: "2", label: t('stats.happyClients', { defaultValue: 'Happy Clients' }), value: '8,200+' },
    { id: "3", label: t('stats.citiesCovered', { defaultValue: 'Cities Covered' }), value: '35+' },
  ];
  
  return (
    <section className="relative z-10 mx-auto max-w-4xl py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((stat: { id: string; label: string; value: string }) => (
          <div
            key={`stat-${stat.id}`}
            className="flex flex-col items-center rounded-2xl bg-white/80 p-8 shadow-md dark:bg-neutral-900/80"
          >
            <div className="text-4xl font-extrabold text-primary">
              <CountUp
                end={parseInt(stat.value.replace(/[^0-9]/g, ""))}
                duration={2}
                separator="," />{stat.value.includes("+") ? "+" : ""}
            </div>
            <div className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionStatistic;
