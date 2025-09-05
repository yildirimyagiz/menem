"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@reservatior/ui/button";

interface EnhancedHeroSectionProps {
  onSearch?: (data: SearchData) => void;
}

interface SearchData {
  location: string;
  moveInDate: string;
  budget: string;
  propertyType: string;
}

// Aceternity UI Components
const BackgroundGradient = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/30 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-600/30 to-blue-700/30 blur-3xl" />
    <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-500/20 blur-2xl" />
  </div>
);

const FloatingCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="relative"
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm" />
    <div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
      {children}
    </div>
  </motion.div>
);

const AnimatedText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function EnhancedHeroSection({ onSearch }: EnhancedHeroSectionProps) {
  const t = useTranslations("Index");
  
  const [searchData, setSearchData] = useState<SearchData>({
    location: "",
    moveInDate: "",
    budget: "",
    propertyType: "",
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      onSearch?.(searchData);
    }, 1000);
  };

  const floatingElements = [
    { icon: Building2, delay: 0, position: "top-20 left-10" },
    { icon: Users, delay: 0.5, position: "top-40 right-20" },
    { icon: TrendingUp, delay: 1, position: "bottom-40 left-20" },
    { icon: Sparkles, delay: 1.5, position: "bottom-20 right-10" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20 ios-layout android-layout">
      {/* Enhanced Animated Background */}
      <BackgroundGradient />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>

      {/* Floating Elements with Enhanced Animation */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.position} z-10`}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1], 
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            delay: element.delay,
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm">
            <element.icon className="h-8 w-8 text-white/60" />
          </div>
        </motion.div>
      ))}

      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center">
          <AnimatedText>
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
              {t("hero.title")}
              <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                {t("hero.subtitle", { defaultValue: "Dream Home" })}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-blue-100 md:text-2xl">
              {t("hero.description")}
            </p>
          </AnimatedText>
        </div>

        {/* Enhanced Search Bar with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-5xl"
        >
          <FloatingCard delay={0.3}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
              {/* Location */}
              <div className="relative lg:col-span-2">
                <input
                  type="text"
                  placeholder={t("search.location")}
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="mobile-input h-16 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-lg text-white placeholder-white/60 backdrop-blur-sm transition-all duration-200 focus:border-white/40 focus:ring-2 focus:ring-white/20"
                />
                <MapPin className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-white/60" />
              </div>

              {/* Property Type */}
              <div className="relative">
                <select
                  value={searchData.propertyType}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      propertyType: e.target.value,
                    }))
                  }
                  className="mobile-input h-16 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-lg text-white backdrop-blur-sm transition-all duration-200 focus:border-white/40 focus:ring-2 focus:ring-white/20"
                >
                  <option value="" className="bg-slate-800 text-white">{t("search.propertyType", { defaultValue: "Property Type" })}</option>
                  <option value="apartment" className="bg-slate-800 text-white">{t("search.propertyTypes.apartment", { defaultValue: "Apartment" })}</option>
                  <option value="house" className="bg-slate-800 text-white">{t("search.propertyTypes.house", { defaultValue: "House" })}</option>
                  <option value="condo" className="bg-slate-800 text-white">{t("search.propertyTypes.condo", { defaultValue: "Condo" })}</option>
                  <option value="studio" className="bg-slate-800 text-white">{t("search.propertyTypes.studio", { defaultValue: "Studio" })}</option>
                </select>
                <Building2 className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-white/60" />
              </div>

              {/* Move-in Date */}
              <div className="relative">
                <input
                  type="date"
                  value={searchData.moveInDate}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      moveInDate: e.target.value,
                    }))
                  }
                  className="mobile-input h-16 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-lg text-white backdrop-blur-sm transition-all duration-200 focus:border-white/40 focus:ring-2 focus:ring-white/20"
                />
                <Calendar className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-white/60" />
              </div>

              {/* Budget */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("search.budget")}
                  value={searchData.budget}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      budget: e.target.value,
                    }))
                  }
                  className="mobile-input h-16 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-lg text-white placeholder-white/60 backdrop-blur-sm transition-all duration-200 focus:border-white/40 focus:ring-2 focus:ring-white/20"
                />
                <DollarSign className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-white/60" />
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="mobile-button h-16 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-lg font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/25"
              >
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Search className="mr-2 h-6 w-6" />
                  </motion.div>
                ) : (
                  <>
                    <Search className="mr-2 h-6 w-6" />
                    {t("search.button")}
                  </>
                )}
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">
              <div className="flex items-center gap-2">
                <span className="mobile-text-sm font-medium text-white/80">{t("search.quickFilters")}:</span>
                <div className="flex gap-2">
                  {[
                    { key: "studio", label: t("filters.studio") },
                    { key: "1bed", label: t("filters.1bed") },
                    { key: "2bed", label: t("filters.2bed") },
                    { key: "petFriendly", label: t("filters.petFriendly") },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      className="mobile-button rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/40"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FloatingCard>
        </motion.div>

        {/* Enhanced Stats with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 gap-8 text-center md:grid-cols-4"
        >
          {[
            { value: "10,000+", label: t("stats.availableProperties"), icon: Building2 },
            { value: "500+", label: t("stats.neighborhoods"), icon: MapPin },
            { value: "24/7", label: t("stats.support"), icon: Users },
            { value: "4.9★", label: t("stats.rating", { defaultValue: "Average Rating" }), icon: TrendingUp },
          ].map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="mobile-fade-in"
            >
              <FloatingCard delay={0.7 + index * 0.1}>
                <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 