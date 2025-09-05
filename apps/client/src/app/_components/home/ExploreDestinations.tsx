"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "~/context/LanguageContext";

const cities = [
  {
    name: "New York, USA",
    image: "/images/cities/new-york.jpg",
    count: "144,000+ properties",
  },
  {
    name: "Singapore",
    image: "/images/cities/singapore.jpg",
    count: "188,288+ properties",
  },
  {
    name: "Paris, France",
    image: "/images/cities/paris.jpg",
    count: "218,288+ properties",
  },
  {
    name: "London, UK",
    image: "/images/cities/london.jpg",
    count: "116,288+ properties",
  },
  {
    name: "Tokyo, Japan",
    image: "/images/cities/tokyo.jpg",
    count: "232,288+ properties",
  },
];

export default function ExploreDestinations() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t("home.exploreDestinations.title", {
              default: "Let's go on an adventure",
            })}
          </h2>
          <p className="max-w-2xl text-gray-600 dark:text-gray-300">
            {t("home.exploreDestinations.subtitle", {
              default: "Explore the best places to stay in the world.",
            })}
          </p>
        </div>
        <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-6 overflow-x-auto pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {cities.map((city) => (
            <div
              key={city.name}
              className="w-64 flex-shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg"
              style={{ scrollSnapAlign: "start" }}
            >
              <Image
                src={city.image}
                alt={city.name}
                width={320}
                height={220}
                className="h-56 w-full object-cover"
              />
              <div className="p-4">
                <div className="text-lg font-semibold">{city.name}</div>
                <div className="text-gray-500">{city.count}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        </div>
      </div>
    </section>
  );
}
