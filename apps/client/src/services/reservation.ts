import type { RouterInputs, RouterOutputs } from "@reservatior/api";

import { api } from "~/trpc/react";

type CreateReservationData = RouterInputs["reservation"]["create"];
type ReservationResponse = RouterOutputs["reservation"]["create"];

export interface ReservationPaymentData {
  amount: number;
  currency: string;
  paymentMethod: string;
  description?: string;
}

export interface ReservationData {
  propertyId: string;
  guestId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalPrice: number;
  currencyId: string;
  paymentStatus: "UNPAID" | "PAID" | "PENDING" | "FAILED";
  specialRequests?: string;
  pricingRuleId?: string;
  agencyId?: string;
}

export interface ReservationValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation functions
export function validateReservationData(
  data: ReservationData,
): ReservationValidationResult {
  const errors: string[] = [];

  if (!data.propertyId) {
    errors.push("Property ID is required");
  }

  if (!data.guestId) {
    errors.push("Guest ID is required");
  }

  if (!data.userId) {
    errors.push("User ID is required");
  }

  if (!data.startDate) {
    errors.push("Start date is required");
  }

  if (!data.endDate) {
    errors.push("End date is required");
  }

  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    errors.push("End date must be after start date");
  }

  if (data.guests <= 0) {
    errors.push("Number of guests must be greater than 0");
  }

  if (data.totalPrice <= 0) {
    errors.push("Total price must be greater than 0");
  }

  if (!data.currencyId) {
    errors.push("Currency ID is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePaymentData(
  data: ReservationPaymentData,
): ReservationValidationResult {
  const errors: string[] = [];

  if (data.amount <= 0) {
    errors.push("Payment amount must be greater than 0");
  }

  if (!data.currency) {
    errors.push("Currency is required");
  }

  if (!data.paymentMethod) {
    errors.push("Payment method is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Utility functions
export function calculateNumberOfNights(
  startDate: Date,
  endDate: Date,
): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 1);
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function isDateRangeValid(
  startDate: Date,
  endDate: Date,
  minNights = 1,
  maxNights = 365,
): boolean {
  const nights = calculateNumberOfNights(startDate, endDate);
  return nights >= minNights && nights <= maxNights;
}

// API functions
export async function createReservation(
  data: CreateReservationData,
): Promise<ReservationResponse> {
  try {
    // Validate data before sending
    const validation = validateReservationData(data as ReservationData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const result = await api.reservation.create.useMutation().mutateAsync(data);
    return result;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
}

export async function getReservation(id: string) {
  try {
    const result = await api.reservation.byId.useQuery({ id }).data;
    return result;
  } catch (error) {
    console.error("Error fetching reservation:", error);
    throw error;
  }
}

export async function updateReservation(
  id: string,
  data: Partial<CreateReservationData>,
) {
  try {
    const result = await api.reservation.update
      .useMutation()
      .mutateAsync({ id, ...data });
    return result;
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
}

export async function cancelReservation(id: string) {
  try {
    const result = await api.reservation.update.useMutation().mutateAsync({
      id,
      status: "CANCELLED" as const,
    });
    return result;
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    throw error;
  }
}

export async function createReservationPayment(data: ReservationPaymentData) {
  try {
    // Validate payment data
    const validation = validatePaymentData(data);
    if (!validation.isValid) {
      throw new Error(
        `Payment validation failed: ${validation.errors.join(", ")}`,
      );
    }

    const result = await api.payment.createPaymentIntent
      .useMutation()
      .mutateAsync(data);
    return result;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

export async function confirmReservationPayment(paymentIntentId: string) {
  try {
    const result = await api.payment.confirmPayment
      .useMutation()
      .mutateAsync({ paymentIntentId });
    return result;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
}

export async function processReservationWithPayment(
  reservationData: ReservationData,
  paymentData: ReservationPaymentData,
) {
  try {
    // Validate both reservation and payment data
    const reservationValidation = validateReservationData(reservationData);
    const paymentValidation = validatePaymentData(paymentData);

    if (!reservationValidation.isValid) {
      throw new Error(
        `Reservation validation failed: ${reservationValidation.errors.join(", ")}`,
      );
    }

    if (!paymentValidation.isValid) {
      throw new Error(
        `Payment validation failed: ${paymentValidation.errors.join(", ")}`,
      );
    }

    // Step 1: Create payment intent
    const { paymentIntent, payment } =
      await createReservationPayment(paymentData);

    // Step 2: Create reservation
    const reservation = await createReservation({
      ...reservationData,
      paymentStatus: "PENDING" as const,
    });

    if (!reservation) {
      throw new Error("Failed to create reservation");
    }

    // Step 3: Confirm payment
    const { paymentIntent: confirmedIntent } = await confirmReservationPayment(
      paymentIntent.id,
    );

    if (confirmedIntent.status === "succeeded") {
      // Step 4: Update reservation to PAID
      const updatedReservation = await updateReservation(reservation.id, {
        paymentStatus: "PAID" as const,
      });

      return {
        reservation: updatedReservation,
        payment: confirmedIntent,
        success: true,
      };
    } else {
      // Payment failed, update reservation status
      await updateReservation(reservation.id, {
        paymentStatus: "UNPAID" as const,
      });

      throw new Error(`Payment confirmation failed: ${confirmedIntent.status}`);
    }
  } catch (error) {
    console.error("Error processing reservation with payment:", error);
    throw error;
  }
}

// Additional utility functions for reservation management
export async function getReservationsByUser(
  userId: string,
  filters?: {
    status?: "PENDING" | "CANCELLED" | "CONFIRMED";
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
  },
) {
  try {
    const result = await api.reservation.all.useQuery({
      userId,
      status: filters?.status,
      startDateFrom: filters?.startDate,
      endDateTo: filters?.endDate,
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
    }).data;
    return result;
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    throw error;
  }
}

export async function refundReservationPayment(
  paymentId: string,
  reason?: string,
) {
  try {
    const result = await api.payment.refund
      .useMutation()
      .mutateAsync({ id: paymentId, reason });
    return result;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
}

// Reservation status management
export const RESERVATION_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUSES = {
  UNPAID: "UNPAID",
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export function getReservationStatusColor(status: string): string {
  switch (status) {
    case RESERVATION_STATUSES.CONFIRMED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case RESERVATION_STATUSES.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case RESERVATION_STATUSES.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case PAYMENT_STATUSES.PAID:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case PAYMENT_STATUSES.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case PAYMENT_STATUSES.UNPAID:
    case PAYMENT_STATUSES.FAILED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case PAYMENT_STATUSES.REFUNDED:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}
