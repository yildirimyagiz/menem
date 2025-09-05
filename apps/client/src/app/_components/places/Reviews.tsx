import React from "react";

interface Review {
  id: string;
  place: string;
  reviewer: string;
  rating: number;
  text: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    place: "Golden Gate Restaurant",
    reviewer: "Jane D.",
    rating: 5,
    text: "Amazing food and a stunning view! Highly recommend the seafood platter.",
  },
  {
    id: "2",
    place: "Downtown Sports Complex",
    reviewer: "Mike S.",
    rating: 4,
    text: "Great facilities, but can get crowded on weekends.",
  },
];

import { useTranslations } from 'next-intl';

export default function Reviews() {
  const t = useTranslations();
  return (
    <section className="rounded-xl bg-white/70 p-4 shadow-sm md:p-6 mt-4">
      <h2 className="mb-2 text-xl font-semibold text-blue-900">{t('places.reviews.title', { defaultValue: 'Recent Reviews' })}</h2>
      <ul className="space-y-4">
        {mockReviews.map((review) => (
          <li key={review.id} className="border-l-4 border-blue-400 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-blue-700">{review.place}</span>
              <span className="text-xs text-gray-500">{t('places.reviews.by', { defaultValue: 'by {reviewer}', reviewer: review.reviewer })}</span>
              <span className="ml-auto text-yellow-500">{t('places.reviews.stars', { defaultValue: '{stars}{emptyStars}', stars: '★'.repeat(review.rating), emptyStars: '☆'.repeat(5 - review.rating) })}</span>
            </div>
            <p className="italic text-gray-700">“{review.text}”</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
