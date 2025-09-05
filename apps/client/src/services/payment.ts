export async function getStripeInstance() {
  const { loadStripe } = await import("@stripe/stripe-js");
  // import env to satisfy lint rules
  const { env } = await import("~/env");
  return loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

// Local types to avoid depending on RouterInputs/Outputs here
export interface CreatePaymentIntentInput {
  amount: number;
  currency: string; // lowercase currency code
  paymentMethod: "card";
  description?: string;
}

export type PaymentIntentLike = { id?: string; status?: string } | null | undefined;

export type PaymentRecordLike = Record<string, unknown> | null | undefined;

export interface PaymentMutationResponse {
  paymentIntent: PaymentIntentLike;
  payment: PaymentRecordLike;
}

import { api } from "~/trpc/react";

export async function createPaymentIntent(
  data: CreatePaymentIntentInput,
): Promise<PaymentMutationResponse> {
  try {
    const result = await (
      (api as unknown as {
        payment: {
          createPaymentIntent: {
            useMutation: () => { mutateAsync: (d: CreatePaymentIntentInput) => Promise<unknown> };
          };
        };
      }).payment.createPaymentIntent
    )
      .useMutation()
      .mutateAsync(data);

    return result as PaymentMutationResponse;
  } catch (error) {
    // propagate as Error
    if (error instanceof Error) throw error;
    throw new Error("createPaymentIntent failed");
  }
}

export async function confirmPayment(paymentIntentId: string): Promise<PaymentMutationResponse> {
  try {
    const result = await (
      (api as unknown as {
        payment: {
          confirmPayment: {
            useMutation: () => { mutateAsync: (d: { paymentIntentId: string }) => Promise<unknown> };
          };
        };
      }).payment.confirmPayment
    )
      .useMutation()
      .mutateAsync({ paymentIntentId });

    return result as PaymentMutationResponse;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("confirmPayment failed");
  }
}
