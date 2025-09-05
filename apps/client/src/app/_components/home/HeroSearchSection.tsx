"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "~/context/LanguageContext";

export default function HeroSearchSection() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    let ignore = false;
    const fetchSuggestions = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/location-autocomplete?input=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      if (!ignore) setSuggestions(data);
      setLoading(false);
    };
    fetchSuggestions();
    return () => {
      ignore = true;
    };
  }, [query]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setShowSuggestions(true);
  }

  function handleSelect(suggestion: any) {
    setQuery(suggestion.formatted_address || suggestion.name || "");
    setShowSuggestions(false);
    handleRedirect(suggestion.formatted_address || suggestion.name || "");
  }

  function handleRedirect(location: string) {
    if (!location) return;
    const url = `http://localhost:3000/tr/client/property?sortBy=createdAt&sortOrder=desc&page=1&pageSize=12&location=${encodeURIComponent(location)}`;
    window.location.href = url;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query) {
      handleRedirect(query);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20">
      <div className="absolute inset-0 bg-black/20" />
      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">
            {t("home.hero.title", { default: "Find Your Next Home" })}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-blue-100">
            {t("home.hero.subtitle", {
              default: "Search thousands of listings, agencies, and agents.",
            })}
          </p>
        </div>

        {/* Search Bar - Modern Style */}
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <input
                  type="text"
                  ref={inputRef}
                  placeholder={t("home.search.placeholder", {
                    default: "Enter a location",
                  })}
                  className="h-14 w-full rounded-xl border border-blue-200 pl-12 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={query}
                  onChange={handleInput}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                />
                <MapPinIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="date"
                  className="h-14 w-full rounded-xl border border-blue-200 pl-12 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                  placeholder={t("home.search.budget", { default: "Budget" })}
                  className="h-14 w-full rounded-xl border border-blue-200 pl-12 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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

              <button 
                type="submit"
                className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <svg className="h-5 w-5 animate-spin text-white mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  t("home.search.button", { default: "Search" })
                )}
              </button>
            </div>

            {/* Quick Filters */}
            <div className="mt-6 flex items-center justify-between border-t border-blue-200/50 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t("home.search.quickFilters", { default: "Quick filters:" })}</span>
                <div className="flex gap-2">
                  <button className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                    {t("home.filters.studio", { default: "Studio" })}
                  </button>
                  <button className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                    {t("home.filters.1bed", { default: "1 Bed" })}
                  </button>
                  <button className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                    {t("home.filters.2bed", { default: "2 Bed" })}
                  </button>
                  <button className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-50">
                    {t("home.filters.petFriendly", { default: "Pet Friendly" })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="mx-auto max-w-4xl mt-2">
            <ul className="rounded-xl border border-blue-100 bg-white shadow-2xl animate-fade-in">
              {suggestions.map((s, idx) => (
                <li
                  key={s.place_id}
                  className="flex items-center gap-2 cursor-pointer px-6 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors"
                  onMouseDown={() => handleSelect(s)}
                >
                  <MapPinIcon className="h-5 w-5 text-blue-400" />
                  {s.formatted_address || s.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes float-slow {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        .animate-float-slow {
          animation: float-slow 9s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
