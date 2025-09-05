"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Globe,
  MapPin,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

interface GuestStatsProps {
  stats?: {
    total: number;
    byGender: Record<string, number>;
    byNationality: Record<string, number>;
    byCountry: Record<string, number>;
    recentRegistrations: number;
    activeReservations: number;
  };
}

const statCards = [
  {
    title: "Total Guests",
    subtitle: "All guests",
    value: "total",
    icon: Users,
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    shadow: "shadow-blue-200/60",
    border: "border-blue-200/40",
  },
  {
    title: "Recent Registrations",
    subtitle: "This month",
    value: "recent",
    icon: TrendingUp,
    gradient: "from-green-400 via-green-500 to-green-600",
    shadow: "shadow-green-200/60",
    border: "border-green-200/40",
  },
  {
    title: "Active Reservations",
    subtitle: "Current",
    value: "active",
    icon: UserCheck,
    gradient: "from-purple-400 via-purple-500 to-purple-600",
    shadow: "shadow-purple-200/60",
    border: "border-purple-200/40",
  },
  {
    title: "Male Guests",
    subtitle: "Gender",
    value: "male",
    icon: Users,
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    shadow: "shadow-blue-200/60",
    border: "border-blue-200/40",
  },
  {
    title: "Female Guests",
    subtitle: "Gender",
    value: "female",
    icon: Users,
    gradient: "from-pink-400 via-pink-500 to-pink-600",
    shadow: "shadow-pink-200/60",
    border: "border-pink-200/40",
  },
  {
    title: "Countries",
    subtitle: "Represented",
    value: "countries",
    icon: Globe,
    gradient: "from-indigo-400 via-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-200/60",
    border: "border-indigo-200/40",
  },
];

export function GuestStats({ stats }: GuestStatsProps) {
  const defaultStats = {
    total: 0,
    byGender: {} as Record<string, number>,
    byNationality: {} as Record<string, number>,
    byCountry: {} as Record<string, number>,
    recentRegistrations: 0,
    activeReservations: 0,
  };

  const currentStats = stats ?? defaultStats;

  // Calculate derived values
  const derivedStats = {
    total: currentStats.total,
    recent: currentStats.recentRegistrations,
    active: currentStats.activeReservations,
    male: currentStats.byGender.MALE ?? 0,
    female: currentStats.byGender.FEMALE ?? 0,
    countries: Object.keys(currentStats.byCountry).length,
  };

  const getValue = (cardValue: string) => {
    switch (cardValue) {
      case "total":
        return derivedStats.total;
      case "recent":
        return derivedStats.recent;
      case "active":
        return derivedStats.active;
      case "male":
        return derivedStats.male;
      case "female":
        return derivedStats.female;
      case "countries":
        return derivedStats.countries;
      default:
        return 0;
    }
  };

  return (
    <div className="relative z-10 mb-6 flex flex-wrap gap-6 rounded-3xl bg-white/60 p-4 shadow-2xl backdrop-blur-md dark:bg-slate-900/60 md:p-6 lg:mb-10 lg:p-8">
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        const value = getValue(card.value);
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className={`group flex min-w-[170px] flex-1 cursor-pointer flex-col items-center justify-between gap-2 rounded-2xl border ${card.border} bg-white/60 p-5 shadow-lg ${card.shadow} backdrop-blur-md transition-all duration-300 hover:scale-[1.04] hover:bg-white/80 hover:shadow-2xl dark:bg-slate-900/60 dark:hover:bg-slate-900/80`}
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}
          >
            <div className="flex w-full items-center justify-between">
              <div
                className={`rounded-xl bg-gradient-to-br ${card.gradient} p-3 shadow-md transition-all group-hover:scale-110`}
              >
                <IconComponent className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm dark:text-white">
                  {value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {card.subtitle}
                </span>
              </div>
            </div>
            <div className="mt-2 w-full text-left">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {card.title}
              </span>
            </div>
            {/* Progress bar for gender distribution */}
            {(card.value === "male" || card.value === "female") &&
              derivedStats.total > 0 && (
                <div className="mt-4 w-full">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Distribution</span>
                    <span>
                      {Math.round((value / derivedStats.total) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(value / derivedStats.total) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${card.gradient}`}
                    />
                  </div>
                </div>
              )}
          </motion.div>
        );
      })}
    </div>
  );
}
