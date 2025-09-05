"use client";

import { useTranslations } from 'next-intl';
import Image from "next/image";
import type { FC } from "react";
import { useMemo, useState } from "react";

import StartRating from "~/app/_components/StartRating";
import { useToast } from "~/hooks/use-toast";
import ButtonPrimary from "~/shared/ButtonPrimary";
import { api } from "~/trpc/react";

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

interface TaxBreakdown {
  propertyTax: number;
  occupancyTax: number;
  salesTax: number;
  cityTax: number;
  stateTax: number;
  federalTax: number;
  totalTax: number;
}

interface CheckoutSidebarProps {
  pricePerNight: number;
  numberOfNights: number;
  serviceCharge: number;
  averageRating: number;
  location: string;
  hotelName: string;
  roomDetails: string;
  propertyId?: string;
  selectedCurrency?: Currency;
  taxBreakdown?: TaxBreakdown;
}

interface TaxRecord {
  id: string;
  year: number;
  amount: number;
  percentage: number;
  paid: boolean;
  dueDate: Date | null;
  paidDate: Date | null;
  notes: string | null;
}

const CheckoutSidebar: FC<CheckoutSidebarProps> = ({
  pricePerNight,
  numberOfNights,
  serviceCharge,
  averageRating,
  location,
  hotelName,
  roomDetails,
  propertyId,
  selectedCurrency = { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  taxBreakdown,
}) => {
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  const t = useTranslations('checkout.sidebar');

  // Calculate totals with currency conversion
  const subtotal = pricePerNight * numberOfNights;
  const totalPrice = subtotal + serviceCharge;
  const convertedSubtotal = subtotal * selectedCurrency.rate;
  const convertedTotalPrice = totalPrice * selectedCurrency.rate;

  // Fetch tax records if propertyId is provided
  const {
    data: taxRecords,
    isLoading: isLoadingTaxRecords,
    error: taxRecordsError,
  } = api.taxRecord.all.useQuery(
    {
      propertyId,
      page: 1,
      pageSize: 10,
      sortBy: "dueDate",
      sortOrder: "asc",
    },
    {
      enabled: !!propertyId,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  // Calculate total tax amount
  const totalTaxAmount = useMemo(() => {
    if (!taxRecords?.data) return 0;
    return taxRecords.data.reduce(
      (sum, record) => sum + (record.paid ? 0 : record.amount),
      0,
    );
  }, [taxRecords]);

  // Use advanced tax breakdown if available, otherwise use tax records
  const effectiveTaxAmount = taxBreakdown ? taxBreakdown.totalTax : totalTaxAmount;
  const convertedTaxAmount = effectiveTaxAmount * selectedCurrency.rate;
  const finalTotal = totalPrice + effectiveTaxAmount;
  const convertedFinalTotal = finalTotal * selectedCurrency.rate;

  const handleConfirmReservation = async () => {
    if (isConfirming) return;

    try {
      setIsConfirming(true);

      // Here you would typically make an API call to confirm the reservation
      console.log("Reservation confirmed", {
        totalPrice,
        totalTaxAmount,
        finalTotal,
        propertyId,
        numberOfNights,
        pricePerNight,
        serviceCharge,
      });

      toast({
        title: t('reservationConfirmedTitle'),
        description: t('reservationConfirmedDescription'),
      });
    } catch (error) {
      console.error("Reservation confirmation error:", error);
      toast({
        title: t('errorTitle'),
        description: t('reservationConfirmationFailed'),
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex w-full flex-col space-y-6 border-neutral-200 px-0 dark:border-neutral-700 sm:space-y-8 sm:rounded-2xl sm:p-6 lg:border xl:p-8">
      {/* Property Details */}
      <div className="flex flex-col sm:flex-row sm:items-center">
        <div className="w-full flex-shrink-0 sm:w-40">
          <div className="aspect-w-4 aspect-h-3 sm:aspect-h-4 overflow-hidden rounded-2xl">
            <Image
              alt={`Hotel room in ${location}`}
              fill
              sizes="200px"
              src="https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              className="object-cover"
            />
          </div>
        </div>
        <div className="space-y-3 py-5 sm:px-5">
          <div>
            <span className="line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
              {`Hotel room in ${location}`}
            </span>
            <span className="mt-1 block text-base font-medium">
              {hotelName}
            </span>
          </div>
          <span className="block text-sm text-neutral-500 dark:text-neutral-400">
            {roomDetails}
          </span>
          <div className="w-10 border-b border-neutral-200 dark:border-neutral-700"></div>
          <StartRating rating={averageRating} />
        </div>
      </div>

      {/* Tax Records Section */}
      {propertyId && (
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">{t('taxRecordsTitle')}</h3>

          {isLoadingTaxRecords && (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('loadingTaxRecords')}
            </div>
          )}

          {taxRecordsError && (
            <div className="text-sm text-red-500 dark:text-red-400">
              {t('failedToLoadTaxRecords')}
            </div>
          )}

          {!isLoadingTaxRecords && !taxRecordsError && taxRecords && (
            <>
              {taxRecords.data.length > 0 ? (
                <div className="space-y-2">
                  {taxRecords.data.map((record: TaxRecord) => (
                    <div
                      key={record.id}
                      className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300"
                    >
                      <span>
                        {record.year} {record.paid ? "(Paid)" : "(Pending)"}
                      </span>
                      <span>{selectedCurrency.symbol}{record.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
                  <div className="flex justify-between font-medium">
                    <span>{t('totalTaxDue')}</span>
                    <span>{selectedCurrency.symbol}{convertedTaxAmount.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('noTaxRecordsFound')}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Advanced Tax Breakdown */}
      {taxBreakdown && (
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">{t('taxBreakdownTitle')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>{t('propertyTax')}</span>
              <span>{selectedCurrency.symbol}{(taxBreakdown.propertyTax * selectedCurrency.rate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>{t('occupancyTax')}</span>
              <span>{selectedCurrency.symbol}{(taxBreakdown.occupancyTax * selectedCurrency.rate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>{t('salesTax')}</span>
              <span>{selectedCurrency.symbol}{(taxBreakdown.salesTax * selectedCurrency.rate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>{t('cityTax')}</span>
              <span>{selectedCurrency.symbol}{(taxBreakdown.cityTax * selectedCurrency.rate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>{t('stateTax')}</span>
              <span>{selectedCurrency.symbol}{(taxBreakdown.stateTax * selectedCurrency.rate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>{t('federalTax')}</span>
              <span>{selectedCurrency.symbol}{(taxBreakdown.federalTax * selectedCurrency.rate).toFixed(2)}</span>
            </div>
            <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex justify-between font-medium">
              <span>{t('totalTax')}</span>
              <span>{selectedCurrency.symbol}{convertedTaxAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-semibold">{t('priceDetailTitle')}</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>{`${selectedCurrency.symbol}${pricePerNight.toFixed(2)} ${t('x')} ${numberOfNights} ${t('night')}${
              numberOfNights > 1 ? t('s') : ""
            }`}</span>
            <span>{selectedCurrency.symbol}{convertedSubtotal.toFixed(2)}</span>
          </div>

          {serviceCharge > 0 && (
            <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
              <span>{t('serviceCharge')}</span>
              <span>{selectedCurrency.symbol}{(serviceCharge * selectedCurrency.rate).toFixed(2)}</span>
            </div>
          )}

          {effectiveTaxAmount > 0 && (
            <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
              <span>{t('taxDue')}</span>
              <span>{selectedCurrency.symbol}{convertedTaxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

          <div className="flex justify-between text-lg font-semibold">
            <span>{t('total')}</span>
            <span aria-label={`${t('totalPrice')}: ${selectedCurrency.symbol}${convertedFinalTotal.toFixed(2)}`}>
              {selectedCurrency.symbol}{convertedFinalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <ButtonPrimary
        onClick={handleConfirmReservation}
        loading={isConfirming}
        disabled={isConfirming}
        className="w-full"
        type="button"
      >
        {isConfirming ? t('confirming') : t('confirmReservation')}
      </ButtonPrimary>
    </div>
  );
};

export default CheckoutSidebar;
