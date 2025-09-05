"use client";

import { motion, useInView } from "framer-motion";
import {
  Building2,
  Gift,
  Handshake,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

interface MoneyOption {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  earnings: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
  color: string;
  delay: number;
}

export default function EnhancedMakeMoneySection() {
  const t = useTranslations("Index");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const options: MoneyOption[] = [
    {
      icon: Building2,
      title: t("makeMoney.becomeAgent.title", { defaultValue: "Become an Agent" }),
      description: t("makeMoney.becomeAgent.description", { defaultValue: "Start earning by helping others find their perfect home" }),
      features: [
        t("makeMoney.becomeAgent.features.flexible", { defaultValue: "Flexible hours" }),
        t("makeMoney.becomeAgent.features.commission", { defaultValue: "Commission-based" }),
        t("makeMoney.becomeAgent.features.training", { defaultValue: "Training provided" }),
      ],
      earnings: t("makeMoney.becomeAgent.earnings", { defaultValue: "$2,000 - $15,000/month" }),
      difficulty: "Medium",
      link: "/become-agent",
      color: "from-blue-500 to-blue-600",
      delay: 0,
    },
    {
      icon: Users,
      title: t("makeMoney.becomeAgency.title", { defaultValue: "Become an Agency" }),
      description: t("makeMoney.becomeAgency.description", { defaultValue: "Scale your business and manage multiple agents" }),
      features: [
        t("makeMoney.becomeAgency.features.team", { defaultValue: "Team management" }),
        t("makeMoney.becomeAgency.features.commissions", { defaultValue: "Higher commissions" }),
        t("makeMoney.becomeAgency.features.tools", { defaultValue: "Business tools" }),
      ],
      earnings: t("makeMoney.becomeAgency.earnings", { defaultValue: "$10,000 - $50,000/month" }),
      difficulty: "Hard",
      link: "/become-agency",
      color: "from-purple-500 to-purple-600",
      delay: 0.2,
    },
    {
      icon: Gift,
      title: t("makeMoney.referral.title", { defaultValue: "Referral Program" }),
      description: t("makeMoney.referral.description", { defaultValue: "Earn rewards by referring friends and family" }),
      features: [
        t("makeMoney.referral.features.easy", { defaultValue: "Easy to start" }),
        t("makeMoney.referral.features.noExperience", { defaultValue: "No experience needed" }),
        t("makeMoney.referral.features.instant", { defaultValue: "Instant rewards" }),
      ],
      earnings: t("makeMoney.referral.earnings", { defaultValue: "$100 - $1,000/month" }),
      difficulty: "Easy",
      link: "/referral",
      color: "from-green-500 to-green-600",
      delay: 0.4,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <section className="py-20 ios-layout android-layout">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            {t("makeMoney.title", { defaultValue: "Make Money with" })}
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reservatior
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            {t("makeMoney.description", { defaultValue: "Choose your path to financial success in real estate. Multiple opportunities available for different skill levels and time commitments." })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {options.map((option) => (
            <motion.div
              key={option.link}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : {}
              }
              transition={{
                duration: 0.6,
                delay: option.delay,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="mobile-card group h-full overflow-hidden rounded-2xl border border-blue-200/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <motion.div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <option.icon className="h-8 w-8" />
                    </motion.div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(
                        option.difficulty,
                      )}`}
                    >
                      {t(`makeMoney.difficulty.${option.difficulty.toLowerCase()}`, { defaultValue: option.difficulty })}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {option.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {option.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Earnings */}
                  <div className="mb-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        {t("makeMoney.potentialEarnings", { defaultValue: "Potential Earnings" })}:
                      </span>
                    </div>
                    <div className="mt-1 text-lg font-bold text-green-800 dark:text-green-200">
                      {option.earnings}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                      {t("makeMoney.keyBenefits", { defaultValue: "Key Benefits" })}:
                    </h4>
                    <ul className="space-y-2">
                      {option.features.map((feature, featureIndex) => (
                        <motion.li
                          key={`${option.link}-${featureIndex}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            isInView
                              ? { opacity: 1, x: 0 }
                              : {}
                          }
                          transition={{
                            delay: option.delay + 0.3 + featureIndex * 0.1,
                            duration: 0.4,
                          }}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView
                        ? { opacity: 1, y: 0 }
                        : {}
                    }
                    transition={{
                      delay: option.delay + 0.6,
                      duration: 0.4,
                    }}
                  >
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${option.color} text-white transition-all duration-200 hover:shadow-lg hover:scale-105`}
                    >
                      <Link href={option.link}>
                        <Zap className="mr-2 h-4 w-4" />
                        {t("makeMoney.getStarted", { defaultValue: "Get Started" })}
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="mobile-card rounded-2xl border border-blue-200/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/80 ios-mobile-menu android-mobile-menu">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {t("makeMoney.readyToStart", { defaultValue: "Ready to Start Earning?" })}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {t("makeMoney.joinThousands", { defaultValue: "Join thousands of successful agents and agencies who have built their careers with Reservatior." })}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/contact">
                  <Handshake className="mr-2 h-4 w-4" />
                  {t("makeMoney.contactUs", { defaultValue: "Contact Us" })}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/learn-more">
                  {t("makeMoney.learnMore", { defaultValue: "Learn More" })}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 