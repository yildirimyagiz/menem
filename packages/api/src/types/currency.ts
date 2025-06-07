import type { Payment, Currency as PrismaCurrency } from "@prisma/client";

export interface SanitizedPayment {
  id: string;
  amount: number;
  status: string;
}

export interface SanitizedCurrency extends Omit<PrismaCurrency, 'Payment'> {
  payments: SanitizedPayment[];
}

export type CurrencyWithPayments = PrismaCurrency & {
  Payment: Payment[];
};
