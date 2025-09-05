"use client";

import { ArrowRight, Building2, Check, CheckCircle, Loader2, Star, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Textarea } from "@reservatior/ui/textarea";

import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";

interface AgentFormData {
  name: string;
  email: string;
  phone: string;
  agency?: string;
  message?: string;
}

export default function BecomeAgentPage() {
  const router = useRouter();
  const t = useTranslations("becomeAgent");
  const [submitted, setSubmitted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [packageError, setPackageError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgentFormData>();

  const onSubmit = async (data: AgentFormData) => {
    if (!selectedPackage) {
      setPackageError(t("validation.selectPackage"));
      return;
    }
    setPackageError(null);
    setSubmitted(true);
    setTimeout(() => {
      router.push(
        `/client/subscription?from=become-agent&package=${selectedPackage}`,
      );
    }, 1200);
  };

  // Fetch subscription packages
  const {
    data: packages,
    isLoading,
    error,
  } = api.subscription.listPackages.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <User className="h-10 w-10" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                  <Star className="h-3 w-3" />
                </div>
              </div>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              {t("joinDescription")}
            </p>
          </div>

          {/* Main Content - Single Column */}
          <div className="space-y-8">
            {/* Agent Information Form */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl dark:bg-gray-800/90">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <User className="h-4 w-4" />
                  </div>
                  {t("form.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t("form.name.label")}
                      </label>
                      <Input
                        {...register("name", { required: t("form.name.required") })}
                        placeholder={t("form.name.placeholder")}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message as string}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t("form.email.label")}
                      </label>
                      <Input
                        type="email"
                        {...register("email", { required: t("form.email.required") })}
                        placeholder={t("form.email.placeholder")}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("form.phone.label")}
                    </label>
                    <Input
                      type="tel"
                      {...register("phone", { required: t("form.phone.required") })}
                      placeholder={t("form.phone.placeholder")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("form.agency.label")}
                    </label>
                    <Input
                      {...register("agency")}
                      placeholder={t("form.agency.placeholder")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("form.bio.label")}
                    </label>
                    <Textarea
                      rows={4}
                      {...register("message")}
                      placeholder={t("form.bio.placeholder")}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Subscription Packages */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl dark:bg-gray-800/90">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Star className="h-4 w-4" />
                  </div>
                  {t("packages.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {t("packages.title")}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("packages.subtitle")}
                  </p>
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                      <p className="mt-2 text-gray-500">{t("loading.loading")}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20">
                    {t("errors.formError")}
                  </div>
                )}

                {packages && Array.isArray(packages) && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg: any) => (
                      <Card
                        key={pkg.id}
                        className={`group cursor-pointer border-2 transition-all duration-300 hover:shadow-xl dark:bg-gray-800 ${
                          selectedPackage === pkg.id 
                            ? "border-blue-500 ring-2 ring-blue-400 shadow-lg" 
                            : "border-gray-200 hover:border-blue-300"
                        } ${
                          pkg.recommended 
                            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" 
                            : ""
                        }`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                {pkg.name}
                                {pkg.recommended && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                    <Star className="mr-1 h-3 w-3" />
                                    Popular
                                  </Badge>
                                )}
                              </CardTitle>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                {pkg.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-blue-600">
                                {pkg.price ? `$${pkg.price}` : t("packages.free")}
                              </div>
                              <div className="text-sm text-gray-500">
                                /month
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {pkg.features && Array.isArray(pkg.features) && (
                            <ul className="space-y-2">
                              {pkg.features.map((feature: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                  <Check className="h-4 w-4 text-blue-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {packageError && (
                  <div className="mt-4 rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20">
                    {packageError}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl dark:bg-gray-800/90">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  {t("benefits.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="group text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white transition-transform group-hover:scale-110">
                        <User className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-3 text-xl font-semibold">{t("benefits.professionalGrowth.title")}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t("benefits.professionalGrowth.description")}
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-transform group-hover:scale-110">
                        <Building2 className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-3 text-xl font-semibold">{t("benefits.networkAccess.title")}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t("benefits.networkAccess.description")}
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white transition-transform group-hover:scale-110">
                        <Star className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-3 text-xl font-semibold">{t("benefits.flexibleWork.title")}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t("benefits.flexibleWork.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit(onSubmit)}
                className="group h-16 bg-gradient-to-r from-blue-500 to-indigo-600 px-8 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                disabled={isSubmitting || !selectedPackage}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("form.submitting")}
                  </>
                ) : (
                  <>
                    {t("form.submit")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                <span className="text-green-600">{t("notifications.applicationSubmitted")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
