"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Footer from "~/app/_components/Footer";
import Header from "~/app/_components/Header";

function HomePageContent() {
  const t = useTranslations("Index");

  const PlacesList = dynamic(() => import("./places/PlacesList"), {
    ssr: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 ios-layout android-layout">
      {/* Header */}
      <Header />

      {/* Hero Section - Apartments.com Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 ios-layout android-layout">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold text-white">
              {t("hero.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-blue-100">
              {t("hero.description")}
            </p>
          </div>

          {/* Search Bar - Apartments.com Style */}
          <div className="mx-auto max-w-4xl">
            <div className="mobile-card rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm ios-mobile-menu android-mobile-menu">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search.location")}
                    className="mobile-input h-14 w-full rounded-xl border border-blue-200 pl-12 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>

                <div className="relative">
                  <input
                    type="date"
                    className="mobile-input h-14 w-full rounded-xl border border-blue-200 pl-12 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search.budget")}
                    className="mobile-input h-14 w-full rounded-xl border border-blue-200 pl-12 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>

                <button className="mobile-button h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl">
                  <svg
                    className="mr-2 inline h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {t("search.button")}
                </button>
              </div>

              {/* Quick Filters */}
              <div className="mt-6 flex items-center justify-between border-t border-blue-200/50 pt-6">
                <div className="flex items-center gap-2">
                  <span className="mobile-text-sm text-gray-600">Quick filters:</span>
                  <div className="flex gap-2">
                    <button className="mobile-button rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                      Studio
                    </button>
                    <button className="mobile-button rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                      1 Bed
                    </button>
                    <button className="mobile-button rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                      2 Bed
                    </button>
                    <button className="mobile-button rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                      Pet Friendly
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div className="mobile-fade-in">
              <div className="mb-2 text-3xl font-bold text-white">10,000+</div>
              <div className="text-blue-100">Available Properties</div>
            </div>
            <div className="mobile-fade-in">
              <div className="mb-2 text-3xl font-bold text-white">500+</div>
              <div className="text-blue-100">Neighborhoods</div>
            </div>
            <div className="mobile-fade-in">
              <div className="mb-2 text-3xl font-bold text-white">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 mobile-text-xl font-bold lg:text-3xl">
              Featured Properties
            </h2>
            <p className="mobile-text-base text-gray-600 dark:text-gray-300">
              Discover our handpicked selection of premium properties
            </p>
          </div>
          <PlacesList />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <div className="mobile-card mobile-fade-in rounded-xl border border-blue-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
            <div className="text-center">
              <h2 className="mb-4 mobile-text-xl font-bold lg:text-3xl">
                How It Works
              </h2>
              <p className="mobile-text-base text-gray-600 dark:text-gray-300">
                Simple steps to find your perfect home
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="mobile-scale-in text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="mobile-text-lg font-semibold">Search</h3>
                <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                  Browse through thousands of properties in your desired location
                </p>
              </div>

              <div className="mobile-scale-in text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="mobile-text-lg font-semibold">Compare</h3>
                <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                  Compare prices, amenities, and locations to find the best match
                </p>
              </div>

              <div className="mobile-scale-in text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="mobile-text-lg font-semibold">Connect</h3>
                <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                  Connect with agents and schedule viewings for your favorite properties
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhood Highlights */}
      <section className="py-16 ios-layout android-layout">
        <div className="container mx-auto px-4">
          <div className="mobile-card mobile-fade-in rounded-xl border border-blue-200/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
            <div className="text-center">
              <h2 className="mb-4 mobile-text-xl font-bold lg:text-3xl">
                Popular Neighborhoods
              </h2>
              <p className="mobile-text-base text-gray-600 dark:text-gray-300">
                Explore the most sought-after areas in the city
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Downtown", image: "/images/cities/downtown.jpg", count: "150+" },
                { name: "Midtown", image: "/images/cities/midtown.jpg", count: "200+" },
                { name: "Uptown", image: "/images/cities/uptown.jpg", count: "180+" },
                { name: "Suburbs", image: "/images/cities/suburbs.jpg", count: "300+" },
              ].map((neighborhood, index) => (
                <div
                  key={neighborhood.name}
                  className="mobile-scale-in cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-lg dark:border-gray-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="p-4">
                    <h3 className="mobile-text-lg font-semibold">{neighborhood.name}</h3>
                    <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                      {neighborhood.count} properties
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePageContent; 