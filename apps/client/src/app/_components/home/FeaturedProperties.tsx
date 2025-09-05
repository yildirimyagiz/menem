"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCurrency } from "~/context/CurrencyContext";
import { api } from "~/trpc/react";

const PLACEHOLDER_IMAGE = "/images/property-placeholder.jpg";

// Aceternity UI Components
const PropertyCard = ({ children, index }: { children: React.ReactNode; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl transition-all duration-500 hover:shadow-blue-500/25 dark:bg-slate-900/50"
  >
    {children}
  </motion.div>
);

const GlassmorphismBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm border border-white/30">
    {children}
  </span>
);

const AnimatedHeart = () => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    className="rounded-full bg-white/20 p-3 backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-white/30"
  >
    <Heart className="h-5 w-5 text-white" />
  </motion.button>
);

const PriceTag = ({ price, currency }: { price: number; currency: string }) => (
  <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm border border-white/30">
    <div className="text-2xl font-bold text-white">
      {currency}{price.toLocaleString()}
      <span className="text-sm font-normal text-white/80">/mo</span>
    </div>
  </div>
);

export default function FeaturedProperties() {
  const t = useTranslations("Index");
  const { formatCurrency } = useCurrency();
  const { data, isLoading, isError } = api.property.featured.useQuery({
    limit: 8,
  });
  const properties = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) {
    return (
      <section className="container mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="mb-6 text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {t("properties.title", { defaultValue: "Featured Properties" })}
          </h2>
          <div className="py-12 text-gray-400">
            {t("common.loading", { defaultValue: "Loading..." })}
          </div>
        </motion.div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="mb-6 text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {t("properties.title", { defaultValue: "Featured Properties" })}
          </h2>
          <div className="py-12 text-red-500">
            {t("common.error.generic", { defaultValue: "Failed to load properties." })}
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
            {t("properties.title", { defaultValue: "Featured Properties" })}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            {t("properties.description", { defaultValue: "Discover the best properties in your area" })}
          </p>
        </motion.div>

        {/* Property Grid - Enhanced with Aceternity UI */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property, idx) => {
            if (!property) return null;
            const photoUrl = property.Photo?.[0]?.url ?? PLACEHOLDER_IMAGE;
            const location =
              property.city ??
              property.Location?.city ??
              property.Location?.address ??
              "-";
            
            // PricingRules is an array of any, so we need to check for price/amount fields safely
            let price = 0;
            if (
              Array.isArray(property.PricingRules) &&
              property.PricingRules.length > 0
            ) {
              const rule = property.PricingRules[0];
              const rulePrice = (rule as any)?.price;
              const ruleAmount = (rule as any)?.amount;
              if (typeof rulePrice === "number") {
                price = rulePrice;
              } else if (typeof ruleAmount === "number") {
                price = ruleAmount;
              }
            } else if (typeof (property as any)?.price === "number") {
              price = (property as any).price;
            }

            return (
              <PropertyCard key={property.id} index={idx}>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={photoUrl}
                    alt={property.title ?? "Property"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={400}
                    height={256}
                    style={{ objectFit: "cover" }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Favorite Button */}
                  <div className="absolute right-4 top-4">
                    <AnimatedHeart />
                  </div>
                  
                  {/* Price Tag */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <PriceTag price={price} currency="$" />
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm border border-white/30">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-white">4.8</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                    {property.title ??
                      t("properties.noTitle", {
                        defaultValue: "Untitled Property",
                      })}
                  </h3>
                  
                  <div className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{location}</span>
                  </div>
                  
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-blue-500" />
                      <span>2 {t("properties.beds", { defaultValue: "beds" })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-blue-500" />
                      <span>2 {t("properties.baths", { defaultValue: "baths" })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4 text-blue-500" />
                      <span>1,200 {t("properties.sqft", { defaultValue: "sqft" })}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <GlassmorphismBadge>
                      {t("amenities.gym", { defaultValue: "Gym" })}
                    </GlassmorphismBadge>
                    <GlassmorphismBadge>
                      {t("amenities.pool", { defaultValue: "Pool" })}
                    </GlassmorphismBadge>
                    <GlassmorphismBadge>
                      {t("amenities.parking", { defaultValue: "Parking" })}
                    </GlassmorphismBadge>
                  </div>
                </div>
              </PropertyCard>
            );
          })}
        </div>
        
        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-0.5 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
            <span className="relative rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-blue-800">
              {t("properties.viewAll", { defaultValue: "View All Properties" })}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
