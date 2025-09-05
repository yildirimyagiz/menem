"use client";

import { Tab } from "@headlessui/react";
import {
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import StripePaymentForm from "~/components/StripePaymentForm";
import StripeProvider from "~/components/StripeProvider";
import { useToast } from "~/hooks/use-toast";
import mastercardPng from "~/images/mastercard.svg";
import visaPng from "~/images/vis.svg";
import { confirmPayment, createPaymentIntent } from "~/services/payment";

interface PaymentSuccessPayload {
  paymentIntent: { id?: string; status?: string } | null | undefined;
  payment: unknown;
  amount: number;
  currency: string;
}

interface ReservationPaymentFormProps {
  amount: number;
  onSuccess: (paymentData: PaymentSuccessPayload) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
  loading?: boolean;
  currency?: string;
}

const ReservationPaymentForm: React.FC<ReservationPaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false,
  loading = false,
  currency = "USD",
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Using service functions to avoid direct TRPC hook access here

  const handleStripePaymentSuccess = useCallback(async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const { paymentIntent, payment: _payment } = await createPaymentIntent({
          amount,
          currency: currency.toLowerCase(),
          paymentMethod: "card",
          description: `Reservation payment - ${currency} ${amount.toFixed(2)}`,
        });

      // Confirm payment (safely read id)
      const intentId = (() => {
        if (paymentIntent && typeof paymentIntent === "object" && "id" in paymentIntent) {
          const v = (paymentIntent as { id?: unknown }).id;
          return typeof v === "string" ? v : undefined;
        }
        return undefined;
      })();

      if (!intentId) {
        const msg = "Failed to initialize payment. Please try again.";
        setPaymentError(msg);
        onError(new Error("Missing payment intent id"));
        return;
      }

      const { paymentIntent: confirmedIntent, payment: confirmedPayment } = await confirmPayment(intentId);

      // Safely read status and id from possibly unknown shapes
      let status: string | undefined;
      let id: string | undefined;
      if (confirmedIntent && typeof confirmedIntent === "object") {
        if ("status" in confirmedIntent) {
          const s = (confirmedIntent as { status?: unknown }).status;
          if (typeof s === "string") status = s;
        }
        if ("id" in confirmedIntent) {
          const i = (confirmedIntent as { id?: unknown }).id;
          if (typeof i === "string") id = i;
        }
      }

      if (status === "succeeded") {
        onSuccess({
          paymentIntent: { id, status },
          payment: confirmedPayment,
          amount,
          currency,
        });
      } else {
        throw new Error(`Payment confirmation failed: ${status ?? "unknown"}`);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      setPaymentError(errorMessage);
      onError(new Error(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  }, [amount, currency, onSuccess, onError]);

  const handleStripePaymentError = useCallback(
    (error: Error) => {
      setPaymentError(error.message);
      onError(error);
    },
    [onError],
  );

  const handlePayPalPayment = useCallback(() => {
    // TODO: Implement actual PayPal integration
    toast({
      title: "PayPal Integration",
      description:
        "PayPal integration is coming soon. Please use credit card payment for now.",
      variant: "destructive",
    });
  }, [toast]);

  const isFormDisabled = disabled || loading || isProcessing;

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Payment Amount Display */}
      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Amount:
          </span>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatAmount(amount, currency)}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Payment Method
        </h4>
        <Tab.Group>
          <Tab.List className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <Tab as={React.Fragment}>
              {({ selected }) => (
                <button
                  className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    selected
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  }`}
                  disabled={isFormDisabled}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-blue-600">💳</span>
                    <span>PayPal</span>
                  </div>
                </button>
              )}
            </Tab>
            <Tab as={React.Fragment}>
              {({ selected }) => (
                <button
                  className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    selected
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  }`}
                  disabled={isFormDisabled}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Credit Card</span>
                    {(() => {
                      const visaSrc = typeof visaPng === "string" ? visaPng : "/visa.svg";
                      const mcSrc =
                        typeof mastercardPng === "string" ? mastercardPng : "/mastercard.svg";
                      return (
                        <div className="flex items-center space-x-1">
                          <Image className="h-4 w-6" src={visaSrc} alt="Visa" />
                          <Image className="h-4 w-6" src={mcSrc} alt="Mastercard" />
                        </div>
                      );
                    })()}
                  </div>
                </button>
              )}
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            {/* PayPal Panel */}
            <Tab.Panel className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <span className="text-2xl">💳</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                    PayPal Coming Soon
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    We're working on PayPal integration. Please use credit card
                    payment for now.
                  </p>
                  <button
                    onClick={handlePayPalPayment}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled
                  >
                    PayPal (Coming Soon)
                  </button>
                </div>
              </div>
            </Tab.Panel>

            {/* Stripe Panel */}
            <Tab.Panel className="space-y-4">
              <StripeProvider>
                <StripePaymentForm
                  amount={amount}
                  onSuccess={handleStripePaymentSuccess}
                  onError={handleStripePaymentError}
                />
              </StripeProvider>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Error Display */}
      {paymentError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-red-400" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                Payment Error
              </h4>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {paymentError}
              </p>
            </div>
            <button
              onClick={() => setPaymentError(null)}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {(loading || isProcessing) && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {isProcessing
                ? "Processing payment..."
                : "Loading payment form..."}
            </span>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        🔒 Your payment information is secure and encrypted. We never store your
        card details.
      </div>
    </div>
  );
};

export default ReservationPaymentForm;
