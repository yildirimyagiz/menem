"use client";

import { motion, useInView } from "framer-motion";
import {
  Building2,
  DollarSign,
  Heart,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";


interface StatItem {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
  description: string;
  color: string;
  delay: number;
}

// Aceternity UI Components
const FloatingCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative"
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm" />
    <div className="relative rounded-2xl border border-blue-200/30 bg-white/10 p-6 backdrop-blur-sm shadow-xl">
      {children}
    </div>
  </motion.div>
);

const AnimatedIcon = ({ icon: Icon, color, delay }: { icon: React.ComponentType<any>; color: string; delay: number }) => (
  <motion.div
    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
  >
    <Icon className="h-8 w-8" />
  </motion.div>
);

const AnimatedCounter = ({ value, delay }: { value: string; delay: number }) => (
  <motion.div
    className="text-3xl font-bold text-blue-900 dark:text-blue-100 md:text-4xl"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
  >
    {value}
  </motion.div>
);

export default function EnhancedStatsSection() {
  const t = useTranslations("Index");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats: StatItem[] = [
    {
      icon: Building2,
      value: "2,500+",
      label: t("stats.properties", { defaultValue: "Properties" }),
      description: t("stats.propertiesDescription", { defaultValue: "Available listings" }),
      color: "from-blue-500 to-blue-600",
      delay: 0,
    },
    {
      icon: Users,
      value: "10,000+",
      label: t("stats.happyClients", { defaultValue: "Happy Clients" }),
      description: t("stats.happyClientsDescription", { defaultValue: "Satisfied customers" }),
      color: "from-blue-600 to-blue-700",
      delay: 0.1,
    },
    {
      icon: Star,
      value: "4.8",
      label: t("stats.averageRating", { defaultValue: "Average Rating" }),
      description: t("stats.averageRatingDescription", { defaultValue: "Out of 5 stars" }),
      color: "from-blue-700 to-blue-800",
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      value: "150%",
      label: t("stats.growth", { defaultValue: "Growth" }),
      description: t("stats.growthDescription", { defaultValue: "Year over year" }),
      color: "from-blue-800 to-blue-900",
      delay: 0.3,
    },
    {
      icon: MapPin,
      value: "500+",
      label: t("stats.neighborhoods"),
      description: t("stats.neighborhoodsDescription", { defaultValue: "Covered areas" }),
      color: "from-blue-400 to-blue-500",
      delay: 0.4,
    },
    {
      icon: Heart,
      value: "95%",
      label: t("stats.satisfaction", { defaultValue: "Satisfaction" }),
      description: t("stats.satisfactionDescription", { defaultValue: "Client satisfaction" }),
      color: "from-blue-300 to-blue-400",
      delay: 0.5,
    },
  ];

  return (
    <section className="relative py-20 ios-layout android-layout overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200/30 to-blue-300/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-300/30 to-blue-400/30 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            {t("stats.whyChoose", { defaultValue: "Why Choose" })}
            <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Reservatior
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {t("stats.trustedBy", { defaultValue: "Trusted by thousands of users worldwide for finding their perfect homes" })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : {}
              }
              transition={{
                duration: 0.6,
                delay: stat.delay,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
            >
              <FloatingCard delay={stat.delay}>
                <div className="flex items-start gap-4">
                  <AnimatedIcon icon={stat.icon} color={stat.color} delay={stat.delay} />
                  <div className="flex-1">
                    <AnimatedCounter value={stat.value} delay={stat.delay + 0.3} />
                    <div className="mt-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                      {stat.label}
                    </div>
                    <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      {stat.description}
                    </div>
                  </div>
                </div>

                {/* Enhanced Animated Progress Bar */}
                <motion.div
                  className="mt-4 h-2 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{
                    delay: stat.delay + 0.5,
                    duration: 1,
                    ease: "easeOut",
                  }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full shadow-lg`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "85%" } : {}}
                    transition={{
                      delay: stat.delay + 0.7,
                      duration: 1.2,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>
              </FloatingCard>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {[
            {
              icon: Zap,
              title: t("features.lightningFast", { defaultValue: "Lightning Fast" }),
              description: t("features.lightningFastDescription", { defaultValue: "Find properties in seconds with our optimized search" }),
              color: "from-blue-400 to-blue-500",
            },
            {
              icon: Heart,
              title: t("features.trustedPlatform", { defaultValue: "Trusted Platform" }),
              description: t("features.trustedPlatformDescription", { defaultValue: "Verified properties and trusted agents only" }),
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: DollarSign,
              title: t("features.bestPrices", { defaultValue: "Best Prices" }),
              description: t("features.bestPricesDescription", { defaultValue: "Competitive pricing and transparent fees" }),
              color: "from-blue-600 to-blue-700",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon className="h-8 w-8" />
              </motion.div>
              <h3 className="mb-2 text-xl font-semibold text-blue-900 dark:text-blue-100">
                {feature.title}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 