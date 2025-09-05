"use client";

import React, { useState } from "react";
import Image from "next/image";

// List of city images and labels (update as needed)
const cityImages = [
  {
    src: "/images/cities/San-Francisco-Cityscape-Aerial-Photo.jpg",
    label: "San Francisco",
  },
  {
    src: "/images/cities/Los-Angeles-Instagrammable-Best-Photo-Spots-Away-Lands-096.jpg",
    label: "Los Angeles",
  },
  {
    src: "/images/cities/Photospots-paris-photographer-flytographer-5.jpeg",
    label: "Paris",
  },
  {
    src: "/images/cities/Kolner-Dom-in-Cologne-Germany.webp",
    label: "Cologne",
  },
  {
    src: "/images/cities/Fischmarkt-Cologne-Photo-location-4.webp",
    label: "Cologne Fischmarkt",
  },
  {
    src: "/images/cities/photogenic-los-angeles-griffith-observatory.jpg",
    label: "Los Angeles Observatory",
  },
  {
    src: "/images/cities/Sunset-at-the-Hohenzollernbrucke-in-Cologne-Germany.webp",
    label: "Cologne Sunset",
  },
  {
    src: "/images/cities/San-Francisco-Cityscape-Aerial-Photo (1).jpg",
    label: "San Francisco Alt",
  },
  {
    src: "/images/cities/kranhaeuser-cologne-germany.avif",
    label: "Cologne Kranhäuser",
  },
  {
    src: "/images/cities/photo-spots-los-angeles-photographer-flytographer-1.jpeg",
    label: "Los Angeles Photographer",
  },
  {
    src: "/images/cities/header.jpg",
    label: "City Header",
  },
  {
    src: "/images/cities/Add Listings.png",
    label: "Add Listings",
  },
];

export default function CitySlider() {
  const [current, setCurrent] = useState(0);
  const visibleCount = 5;
  const total = cityImages.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Get visible images (wrap around)
  const getVisible = () => {
    return Array.from({ length: visibleCount }, (_, i) => cityImages[(current + i) % total]).filter((city): city is { src: string; label: string } => Boolean(city));
  };

  return (
    <div className="w-full py-8">
      <h2 className="mb-6 text-2xl font-bold">Browse Homes by City</h2>
      <div className="relative flex items-center">
        <button
          aria-label="Previous"
          onClick={prev}
          className="z-10 rounded-full bg-white p-2 shadow hover:bg-gray-100 disabled:opacity-50"
          disabled={total <= visibleCount}
        >
          &#8592;
        </button>
        <div className="flex flex-1 justify-center gap-6 overflow-x-auto px-4">
          {getVisible().map((city, idx) =>
            city ? (
              <div
                key={city.src}
                className="flex flex-col items-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-3 shadow hover:scale-105 transition-transform min-w-[170px] max-w-[180px]"
              >
                <div className="relative h-24 w-40 mb-2 rounded-lg overflow-hidden">
                  <Image
                    src={city.src}
                    alt={city.label}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 180px"
                    priority={idx === 0}
                  />
                </div>
                <span className="text-base font-semibold text-gray-900 text-center whitespace-nowrap">
                  {city.label}
                </span>
              </div>
            ) : null
          )}
        </div>
        <button
          aria-label="Next"
          onClick={next}
          className="z-10 rounded-full bg-white p-2 shadow hover:bg-gray-100 disabled:opacity-50"
          disabled={total <= visibleCount}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
