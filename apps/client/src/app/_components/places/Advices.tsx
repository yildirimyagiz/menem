import React from "react";

interface Advice {
  id: string;
  text: string;
  author?: string;
}

const mockAdvices: Advice[] = [
  {
    id: "1",
    text: "Always check the opening hours before visiting any place.",
    author: "Local Guide",
  },
  {
    id: "2",
    text: "Try to visit popular restaurants during off-peak hours for the best experience.",
    author: "Foodie Resident",
  },
];

import { useTranslations } from 'next-intl';

export default function Advices() {
  const t = useTranslations();
  return (
    <section className="rounded-xl bg-white/70 p-4 shadow-sm md:p-6">
      <h2 className="mb-2 text-xl font-semibold text-blue-900">{t('places.advices.title', { defaultValue: 'Local Advices' })}</h2>
      <ul className="space-y-3">
        {mockAdvices.map((advice) => (
          <li key={advice.id} className="border-l-4 border-blue-400 pl-3 italic text-gray-700">
            “{advice.text}”
            {advice.author && (
              <span className="ml-2 text-xs text-blue-600 font-medium">{t('places.advices.authorPrefix', { defaultValue: '— ' })}{advice.author}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
