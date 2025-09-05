"uset  client";

import { useState } from "react";
import { CardStackIcon, FileIcon, PersonIcon } from "@radix-ui/react-icons";
import { Building2, CheckCircle, CreditCard, Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent } from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

import { useAuth } from "~/hooks/use-auth";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const paymentMethods = [
  {
    id: "card",
    name: "Credit Card",
    description: "Pay with your credit card",
    icon: CardStackIcon,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Pay directly from your bank account",
    icon: FileIcon,
  },
  {
    id: "digital_wallet",
    name: "Digital Wallet",
    description: "Pay with your digital wallet",
    icon: PersonIcon,
  },
];

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currencyId: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

const agencyFormSchema = z.object({
  name: z.string().min(1, "Agency name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;
type AgencyFormData = z.infer<typeof agencyFormSchema>;

export function PaymentActions() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [currencyId, setCurrencyId] = useState("USD");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Agency creation modal state
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [agencyFormData, setAgencyFormData] = useState<AgencyFormData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "form" | "payment" | "success"
  >("form");

  // Payment creation mutation
  const createPaymentMutation = api.payment.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment created successfully",
      });
      // Reset form
      setAmount("");
      setReference("");
      setNotes("");
      setSelectedMethod(null);
      setErrors({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment",
        variant: "destructive",
      });
    },
  });

  // Payment intent creation mutation
  const createPaymentIntentMutation =
    api.payment.createPaymentIntent.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Payment Intent Created",
          description: `Payment intent created with ID: ${data.paymentIntent.id}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create payment intent",
          variant: "destructive",
        });
      },
    });

  // Agency creation mutation
  const createAgencyMutation = api.agency.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Agency Created",
        description: "Your agency has been created successfully!",
      });
      setCurrentStep("payment");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create agency",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  // Fetch subscription packages
  const { data: packages } = api.subscription.listPackages.useQuery();

  const validateForm = (): boolean => {
    const formData: PaymentFormData = {
      amount: parseFloat(amount) || 0,
      currencyId,
      paymentMethod: selectedMethod ?? "",
      reference: reference || undefined,
      notes: notes || undefined,
    };

    try {
      paymentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handlePayment = async (methodId: string) => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to make a payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const paymentData = {
        amount: parseFloat(amount),
        currencyId,
        paymentMethod: methodId,
        reference: reference || undefined,
        notes: notes || undefined,
        paymentDate: new Date(),
        dueDate: new Date(),
        status: "PENDING" as const,
        // tenantId will be automatically set by the server from the session
      };

      // Create payment record
      const payment = await createPaymentMutation.mutateAsync(paymentData);

      // Create payment intent for processing
      await createPaymentIntentMutation.mutateAsync({
        amount: paymentData.amount,
        currency: paymentData.currencyId,
        paymentMethod: paymentData.paymentMethod,
        description: `Payment: ${paymentData.reference ?? payment.id}`,
      });

      toast({
        title: "Payment Initiated",
        description: "Your payment has been initiated successfully",
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAgencyCreation = async () => {
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
        name: agencyFormData.name,
        email: agencyFormData.email,
        phoneNumber: agencyFormData.phone,
        website: agencyFormData.website || undefined,
        description: agencyFormData.description,
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

  const handleAgencyPaymentProcessing = async () => {
    if (!selectedPackage) return;

    const selectedPkg = packages?.find((pkg) => pkg.tier === selectedPackage);
    if (!selectedPkg) return;

    try {
      await createPaymentIntentMutation.mutateAsync({
        amount: selectedPkg.price,
        currency: selectedPkg.currency.toLowerCase(),
        paymentMethod: "card",
        description: `Agency subscription: ${selectedPkg.name}`,
      });
      setCurrentStep("success");
      setIsProcessing(false);
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessing(false);
    }
  };

  const handleAgencyModalClose = () => {
    setShowAgencyModal(false);
    setCurrentStep("form");
    setIsProcessing(false);
    setAgencyFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      description: "",
    });
    setSelectedPackage(null);
  };

  const getSelectedPackage = () => {
    return packages?.find((pkg) => pkg.tier === selectedPackage);
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleCurrencyChange = (value: string) => {
    setCurrencyId(value);
    if (errors.currencyId) {
      setErrors((prev) => ({ ...prev, currencyId: "" }));
    }
  };

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    if (errors.paymentMethod) {
      setErrors((prev) => ({ ...prev, paymentMethod: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Agency Creation Section */}
      <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="mb-4 flex items-center gap-3">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Create Agency with Payment</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Create a new agency account with automatic subscription setup and
          payment processing.
        </p>
        <Button
          onClick={() => setShowAgencyModal(true)}
          className="w-full"
          variant="outline"
        >
          Create New Agency
        </Button>
      </div>

      {/* Payment Method Selection */}
      <div>
        <h3 className="mb-4 text-lg font-medium">Select Payment Method</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? "border-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleMethodChange(method.id)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant={selectedMethod === method.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMethodChange(method.id);
                  }}
                >
                  {selectedMethod === method.id ? "Selected" : "Select"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {errors.paymentMethod && (
          <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Payment Form */}
      {selectedMethod && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Payment Details</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">{errors.amount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currencyId} onValueChange={handleCurrencyChange}>
                  <SelectTrigger
                    className={errors.currencyId ? "border-red-500" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currencyId && (
                  <p className="text-sm text-red-600">{errors.currencyId}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="Enter reference number"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Amount Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(parseFloat(amount), currencyId)}
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => handlePayment(selectedMethod)}
              disabled={isProcessing || !amount || parseFloat(amount) <= 0}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                `Process Payment - ${amount ? formatCurrency(parseFloat(amount), currencyId) : "Enter Amount"}`
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Security Notice */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 text-lg">🔒</div>
          <div>
            <h4 className="text-sm font-medium">Secure Payment Processing</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              All payments are processed securely using industry-standard
              encryption. Your payment information is never stored on our
              servers.
            </p>
          </div>
        </div>
      </div>

      {/* Agency Creation Modal */}
      <Dialog open={showAgencyModal} onOpenChange={handleAgencyModalClose}>
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
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="agency-name">Agency Name *</Label>
                    <Input
                      id="agency-name"
                      value={agencyFormData.name}
                      onChange={(e) =>
                        setAgencyFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter agency name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency-email">Email *</Label>
                    <Input
                      id="agency-email"
                      type="email"
                      value={agencyFormData.email}
                      onChange={(e) =>
                        setAgencyFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="agency@email.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="agency-phone">Phone *</Label>
                    <Input
                      id="agency-phone"
                      type="tel"
                      value={agencyFormData.phone}
                      onChange={(e) =>
                        setAgencyFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency-website">Website (Optional)</Label>
                    <Input
                      id="agency-website"
                      type="url"
                      value={agencyFormData.website}
                      onChange={(e) =>
                        setAgencyFormData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://youragency.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agency-description">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="agency-description"
                    value={agencyFormData.description}
                    onChange={(e) =>
                      setAgencyFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Tell us about your agency"
                    rows={3}
                  />
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-semibold">Subscription Packages</h3>
                  <div className="grid gap-3">
                    {packages?.map((pkg: any) => (
                      <Card
                        key={pkg.tier}
                        className={`cursor-pointer border-2 transition-all ${
                          selectedPackage === pkg.tier
                            ? "border-blue-600 ring-2 ring-blue-400"
                            : ""
                        }`}
                        onClick={() => setSelectedPackage(pkg.tier)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{pkg.name}</h4>
                              <p className="text-sm text-gray-600">
                                {pkg.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                ${pkg.price}
                                <span className="text-sm font-normal text-gray-500">
                                  /month
                                </span>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Secure Payment
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        Your payment will be processed securely using
                        industry-standard encryption.
                      </p>
                    </div>
                  </div>
                </div>
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
                      Your agency has been created and your subscription is
                      active.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {currentStep === "form" && (
              <>
                <Button variant="outline" onClick={handleAgencyModalClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAgencyCreation}
                  disabled={
                    isProcessing ||
                    !selectedPackage ||
                    !agencyFormData.name ||
                    !agencyFormData.email ||
                    !agencyFormData.phone
                  }
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
              <Button onClick={handleAgencyModalClose}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
