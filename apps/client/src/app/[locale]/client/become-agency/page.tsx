"use client";

import { ArrowRight, Building2, Check, CheckCircle, CreditCard, Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Textarea } from "@reservatior/ui/textarea";

import { useTranslations } from "next-intl";
import { useAuth } from "~/hooks/use-auth";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface AgencyFormData {
  name: string;
  email: string;
  phone: string;
  website?: string;
  description?: string;
}

export default function BecomeAgencyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const t = useTranslations("becomeAgency");
  const [submitted, setSubmitted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [packageError, setPackageError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "form" | "payment" | "success"
  >("form");
  const [formValues, setFormValues] = useState<AgencyFormData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AgencyFormData>();

  // Watch form values for display in modal
  const watchedValues = watch();

  // Agency creation mutation
  const createAgencyMutation = api.agency.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: t("agencyCreated", { defaultValue: "Agency Created" }),
        description: t("agencyCreatedDesc", { defaultValue: "Your agency has been created successfully!" }),
      });
      setCurrentStep("payment");
    },
    onError: (error) => {
      toast({
        title: t("error", { defaultValue: "Error" }),
        description: error.message || t("agencyCreateFailed", { defaultValue: "Failed to create agency" }),
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  // Payment intent creation mutation
  const createPaymentIntentMutation =
    api.payment.createPaymentIntent.useMutation({
      onSuccess: (data) => {
        toast({
          title: t("paymentIntentCreated", { defaultValue: "Payment Intent Created" }),
          description: t("paymentIntentCreatedDesc", { defaultValue: "Payment intent created successfully" }),
        });
        setCurrentStep("success");
        setIsProcessing(false);
      },
      onError: (error) => {
        toast({
          title: "Payment Error",
          description: error.message || "Failed to create payment intent",
          variant: "destructive",
        });
        setIsProcessing(false);
      },
    });

  // Fetch subscription packages
  const {
    data: packages,
    isLoading,
    error,
  } = api.subscription.listPackages.useQuery();

  const onSubmit = async (data: AgencyFormData) => {
    if (!selectedPackage) {
      setPackageError("Please select a subscription package.");
      return;
    }
    setPackageError(null);
    setFormValues(data);
    setShowModal(true);
  };

  const handleAgencyCreation = async (formData: AgencyFormData) => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create an agency",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create agency
      const agencyData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        website: formData.website,
        description: formData.description,
        ownerId: user.id,
        status: "PENDING" as const,
        isActive: true,
      };

      await createAgencyMutation.mutateAsync(agencyData);
    } catch (error) {
      console.error("Agency creation error:", error);
      setIsProcessing(false);
    }
  };

  const handlePaymentProcessing = async () => {
    if (!selectedPackage) return;

    const selectedPkg = packages?.find((pkg: any) => pkg.tier === selectedPackage);
    if (!selectedPkg) return;

    try {
      await createPaymentIntentMutation.mutateAsync({
        amount: selectedPkg.price,
        currency: selectedPkg.currency.toLowerCase(),
        paymentMethod: "card",
        description: `Agency subscription: ${selectedPkg.name}`,
      });
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentStep("form");
    setIsProcessing(false);
    reset();
    setSelectedPackage(null);
    setPackageError(null);
  };

  const getSelectedPackage = () => {
    return packages?.find((pkg: any) => pkg.tier === selectedPackage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Building2 className="h-10 w-10" />
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
              Transform your property management business with our comprehensive platform
            </p>
          </div>

          {/* Main Content - Single Column */}
          <div className="space-y-8">
            {/* Agency Information Form */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl dark:bg-gray-800/90">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Building2 className="h-4 w-4" />
                  </div>
                  Agency Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t("agencyName", { defaultValue: "Agency Name" })}
                      </label>
                      <Input
                        {...register("name", { required: t("agencyNameRequired", { defaultValue: "Agency name is required" }) })}
                        placeholder={t("agencyNamePlaceholder", { defaultValue: "Agency name" })}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t("email", { defaultValue: "Email" })}
                      </label>
                      <Input
                        type="email"
                        {...register("email", { required: t("emailRequired", { defaultValue: "Email is required" }) })}
                        placeholder="agency@email.com"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
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
                        {errors.phone.message!}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("form.website.label")}
                    </label>
                    <Input
                      type="url"
                      {...register("website")}
                      placeholder={t("form.website.placeholder")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("form.description.label")}
                    </label>
                    <Textarea
                      rows={4}
                      {...register("description")}
                      placeholder={t("form.description.placeholder")}
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
                  Choose Your Plan
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
                    {t("errors.serverError")}
                  </div>
                )}

                {packages && Array.isArray(packages) && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg: any) => (
                      <Card
                        key={pkg.tier}
                        className={`group cursor-pointer border-2 transition-all duration-300 hover:shadow-xl dark:bg-gray-800 ${
                          selectedPackage === pkg.tier 
                            ? "border-blue-500 ring-2 ring-blue-400 shadow-lg" 
                            : "border-gray-200 hover:border-blue-300"
                        } ${
                          pkg.recommended 
                            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" 
                            : ""
                        }`}
                        onClick={() => setSelectedPackage(pkg.tier)}
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
                                ${pkg.price}
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
                  Why Choose Our Platform?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="group text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white transition-transform group-hover:scale-110">
                        <Building2 className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-3 text-xl font-semibold">Professional Tools</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Access to enterprise-grade property management tools and analytics
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-transform group-hover:scale-110">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-3 text-xl font-semibold">Easy Integration</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Seamless integration with your existing workflows and systems
                    </p>
                  </div>

                  <div className="group text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white transition-transform group-hover:scale-110">
                        <Star className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-3 text-xl font-semibold">Premium Support</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      24/7 dedicated support team to help you grow your business
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
        </div>
      </div>

      {/* Agency Creation Modal */}
      <Dialog open={showModal} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {currentStep === "form" && "Create Your Agency"}
              {currentStep === "payment" && "Payment Processing"}
              {currentStep === "success" && "Success!"}
            </DialogTitle>
            <DialogDescription>
              {currentStep === "form" &&
                "Complete your agency registration and subscription setup."}
              {currentStep === "payment" &&
                "Processing your payment and setting up your subscription."}
              {currentStep === "success" &&
                "Your agency has been created successfully!"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {currentStep === "form" && (
              <div className="space-y-6">
                <Card className="border-0 bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                      Agency Details
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>{watchedValues.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>{watchedValues.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Phone:</span>
                        <span>{watchedValues.phone}</span>
                      </div>
                      {watchedValues.website && (
                        <div className="flex justify-between">
                          <span className="font-medium">Website:</span>
                          <span>{watchedValues.website}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {getSelectedPackage() && (
                  <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                      <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        Selected Package
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{getSelectedPackage()?.name}</span>
                          <span className="text-2xl font-bold text-blue-600">
                            ${getSelectedPackage()?.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {getSelectedPackage()?.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-0 bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CreditCard className="mt-0.5 h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-900 dark:text-green-100">
                          Secure Payment
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-200">
                          Your payment will be processed securely using industry-standard encryption.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                    <p className="mt-4 text-lg font-medium">
                      Creating your agency...
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Please wait while we set up your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "success" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                    <p className="mt-4 text-lg font-medium">
                      Agency Created Successfully!
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Your agency has been created and your subscription is active.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {currentStep === "form" && (
              <>
                <Button variant="outline" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(handleAgencyCreation)}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Agency & Continue"
                  )}
                </Button>
              </>
            )}

            {currentStep === "payment" && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            )}

            {currentStep === "success" && (
              <Button
                onClick={() => {
                  handleModalClose();
                  router.push("/client/dashboard");
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Go to Dashboard
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
