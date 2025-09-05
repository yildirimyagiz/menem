"use client";

import { Tab } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  Calculator,
  CreditCard,
  Globe,
  Mail,
  Plus,
  Wallet
} from "lucide-react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import React, { useCallback, useState } from "react";

import Label from "~/components/Label";
import ModalSelectDate from "~/components/ModalSelectDate";
import ModalSelectGuests from "~/components/ModalSelectGuests";
import StripePaymentForm from "~/components/StripePaymentForm";
import StripeProvider from "~/components/StripeProvider";
import { useToast } from "~/hooks/use-toast";
import mastercardPng from "~/images/mastercard.svg";
import visaPng from "~/images/vis.png";
import ButtonPrimary from "~/shared/ButtonPrimary";
import Input from "~/shared/Input";
import NcModal from "~/shared/NcModal";
import Textarea from "~/shared/Textarea";
import convertSelectedDateToString from "~/utils/convertSelectedDateToString";
import CheckoutSidebar from "./CheckoutSidebar";

interface GuestData {
  guestAdults: number;
  guestChildren: number;
  guestInfants: number;
}

interface PaymentData {
  cardNumber?: string;
  cardHolder?: string;
  expirationDate?: string;
  cvc?: string;
  email?: string;
}

interface ReservationData {
  message?: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate to USD
}

interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
  expiryDate?: string;
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

interface CheckoutMainProps {
  startDate: Date | null;
  endDate: Date | null;
  guests: GuestData;
  onSubmit: () => void;
  onPaymentDataChange: (data: PaymentData) => void;
  onReservationDataChange: (data: ReservationData) => void;
  pricePerNight?: number;
  numberOfNights?: number;
  serviceCharge?: number;
  location?: string;
  hotelName?: string;
  roomDetails?: string;
  averageRating?: number;
}

const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.73 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 110.5 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.25 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.35 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.92 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 6.45 },
];

const CheckoutMain: React.FC<CheckoutMainProps> = ({
  startDate,
  endDate,
  guests,
  onSubmit,
  onPaymentDataChange,
  onReservationDataChange,
  pricePerNight = 0,
  numberOfNights = 0,
  serviceCharge = 0,
  location = "",
  hotelName = "",
  roomDetails = "",
  averageRating = 0,
}) => {
  const t = useTranslations('checkout');
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "paypal" | "stripe"
  >("stripe");
  const [reservationData, setReservationData] = useState<ReservationData>({});
  const [paymentData, setPaymentData] = useState<PaymentData>({});
  
  // Multi-currency support
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  
  // Saved payment methods
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true,
      expiryDate: '12/25'
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      isDefault: false,
      expiryDate: '08/24'
    },
    {
      id: '3',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ]);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string | null>(null);
  const [showSavedMethods, setShowSavedMethods] = useState(false);
  
  // Advanced tax features
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown>({
    propertyTax: 45.00,
    occupancyTax: 12.50,
    salesTax: 8.75,
    cityTax: 3.25,
    stateTax: 6.50,
    federalTax: 2.00,
    totalTax: 78.00
  });
  
  // Email confirmation
  const [emailConfirmation, setEmailConfirmation] = useState(true);
  const [emailAddress, setEmailAddress] = useState('user@example.com');
  const [showEmailSettings, setShowEmailSettings] = useState(false);

  const totalAmount = pricePerNight * numberOfNights + serviceCharge;
  const convertedAmount = totalAmount * selectedCurrency.rate;

  const handleSubmit = useCallback(async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (guests.guestAdults === 0 && guests.guestChildren === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one guest.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Send email confirmation if enabled
      if (emailConfirmation) {
        await sendEmailConfirmation();
      }
      
      onSubmit();
    } catch (error) {
      console.error("Error during submission:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [startDate, endDate, guests, onSubmit, toast, emailConfirmation]);

  const sendEmailConfirmation = async () => {
    // Simulate email sending
    console.log('Sending email confirmation to:', emailAddress);
    toast({
      title: "Email Confirmation Sent",
      description: `Confirmation sent to ${emailAddress}`,
    });
  };

  const handlePaymentDataChange = useCallback(
    (data: Partial<PaymentData>) => {
      const newPaymentData = { ...paymentData, ...data };
      setPaymentData(newPaymentData);
      onPaymentDataChange(newPaymentData);
    },
    [paymentData, onPaymentDataChange],
  );

  const handleReservationDataChange = useCallback(
    (data: Partial<ReservationData>) => {
      const newReservationData = { ...reservationData, ...data };
      setReservationData(newReservationData);
      onReservationDataChange(newReservationData);
    },
    [reservationData, onReservationDataChange],
  );

  const handlePaymentSuccess = useCallback(() => {
    setIsProcessing(false);
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
    });
    onSubmit();
  }, [onSubmit, toast]);

  const handlePaymentError = useCallback(
    (error: Error) => {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    [toast],
  );

  const handlePayPalPayment = useCallback(() => {
    // TODO: Implement actual PayPal integration
    toast({
      title: "PayPal Integration",
      description: "PayPal integration is not yet implemented.",
      variant: "destructive",
    });
  }, [toast]);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowCurrencySelector(false);
    toast({
      title: "Currency Changed",
      description: `Prices now displayed in ${currency.name}`,
    });
  };

  const handleSavedMethodSelect = (methodId: string) => {
    setSelectedSavedMethod(methodId);
    setShowSavedMethods(false);
    toast({
      title: "Payment Method Selected",
      description: "Saved payment method selected",
    });
  };

  const handleSavePaymentMethod = () => {
    // Simulate saving payment method
    const newMethod: SavedPaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: '1234',
      brand: 'Visa',
      isDefault: false,
      expiryDate: '12/25'
    };
    setSavedPaymentMethods([...savedPaymentMethods, newMethod]);
    toast({
      title: t('actions.paymentMethodSaved'),
      description: t('actions.paymentMethodSavedDescription'),
    });
  };

  return (
    <div className="flex w-full flex-col space-y-8 border-neutral-200 px-0 dark:border-neutral-700 sm:rounded-2xl sm:border sm:p-6 xl:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold lg:text-4xl">
          {t('actions.confirmPayment')}
        </h2>
        
        {/* Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencySelector(!showCurrencySelector)}
            className="flex items-center space-x-2 rounded-lg border border-neutral-200 px-3 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <Globe className="h-4 w-4" />
            <span>{selectedCurrency.code}</span>
            <span className="text-sm text-neutral-500">({selectedCurrency.symbol})</span>
          </button>
          
          {showCurrencySelector && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
              <h4 className="mb-3 font-medium">{t('currency.selectCurrency')}</h4>
              <div className="space-y-2">
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                      selectedCurrency.code === currency.code ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                  >
                    <div>
                      <span className="font-medium">{currency.code}</span>
                      <span className="ml-2 text-sm text-neutral-500">{currency.name}</span>
                    </div>
                    <span className="text-sm">{currency.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

      {/* Trip Details Section */}
      <div>
        <div>
          <h3 className="text-2xl font-semibold">{t('actions.yourTrip')}</h3>
          <NcModal
            renderTrigger={(openModal) => (
              <span
                onClick={() => openModal()}
                className="mt-1 block cursor-pointer underline lg:hidden"
              >
                {t('actions.viewBookingDetails')}
              </span>
            )}
            renderContent={() => (
              <CheckoutSidebar
                pricePerNight={pricePerNight}
                numberOfNights={numberOfNights}
                serviceCharge={serviceCharge}
                location={location}
                hotelName={hotelName}
                roomDetails={roomDetails}
                averageRating={averageRating}
                selectedCurrency={selectedCurrency}
                taxBreakdown={taxBreakdown}
              />
            )}
            modalTitle={t('actions.bookingDetails')}
          />
        </div>

        {/* Date and Guest Selection */}
        <div className="z-10 mt-6 flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700 sm:flex-row sm:divide-x sm:divide-y-0">
          <ModalSelectDate
            renderChildren={({ openModal }) => (
              <button
                onClick={openModal}
                className="flex flex-1 justify-between space-x-5 p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
                type="button"
                aria-label="Select dates"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">{t('actions.date')}</span>
                  <span className="mt-1.5 text-lg font-semibold">
                    {convertSelectedDateToString([startDate, endDate])}
                  </span>
                </div>
                <PencilSquareIcon className="text-neutral-6000 h-6 w-6 dark:text-neutral-400" />
              </button>
            )}
          />
          <ModalSelectGuests
            renderChildren={({ openModal }) => (
              <button
                type="button"
                onClick={openModal}
                className="flex flex-1 justify-between space-x-5 p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
                aria-label="Select guests"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">{t('actions.guests')}</span>
                  <span className="mt-1.5 text-lg font-semibold">
                    <span className="line-clamp-1">
                      {t('labels.guestsAndInfants', { 
                        guests: (guests.guestAdults || 0) + (guests.guestChildren || 0),
                        infants: guests.guestInfants || 0
                      })}
                    </span>
                  </span>
                </div>
                <PencilSquareIcon className="text-neutral-6000 h-6 w-6 dark:text-neutral-400" />
              </button>
            )}
          />
        </div>
      </div>

      {/* Advanced Tax Features */}
      <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t('pricing.taxBreakdown.title')}</h3>
          <button
            onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Calculator className="h-4 w-4" />
            <span>{showTaxBreakdown ? t('pricing.taxBreakdown.hideDetails') : t('pricing.taxBreakdown.showDetails')}</span>
          </button>
        </div>
        
        {showTaxBreakdown && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('pricing.taxBreakdown.propertyTax')}</span>
              <span>{selectedCurrency.symbol}{taxBreakdown.propertyTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('pricing.taxBreakdown.occupancyTax')}</span>
              <span>{selectedCurrency.symbol}{taxBreakdown.occupancyTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('pricing.taxBreakdown.salesTax')}</span>
              <span>{selectedCurrency.symbol}{taxBreakdown.salesTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('pricing.taxBreakdown.cityTax')}</span>
              <span>{selectedCurrency.symbol}{taxBreakdown.cityTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('pricing.taxBreakdown.stateTax')}</span>
              <span>{selectedCurrency.symbol}{taxBreakdown.stateTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('pricing.taxBreakdown.federalTax')}</span>
              <span>{selectedCurrency.symbol}{taxBreakdown.federalTax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-medium">
                <span>{t('pricing.taxBreakdown.totalTax')}</span>
                <span>{selectedCurrency.symbol}{taxBreakdown.totalTax.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div>
        <h3 className="text-2xl font-semibold">{t('actions.payWith')}</h3>
        <div className="my-5 w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        
        {/* Saved Payment Methods */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">{t('actions.savedPaymentMethods')}</h4>
            <button
              onClick={() => setShowSavedMethods(!showSavedMethods)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Wallet className="h-4 w-4" />
              <span>{showSavedMethods ? t('actions.hideSaved') : t('actions.showSaved')}</span>
            </button>
          </div>
          
          {showSavedMethods && (
            <div className="mt-4 space-y-3">
              {savedPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleSavedMethodSelect(method.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                    selectedSavedMethod === method.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-medium">
                        {method.type === 'card' 
                          ? `${method.brand} •••• ${method.last4}`
                          : `PayPal (${method.email})`
                        }
                      </div>
                      {method.type === 'card' && (
                        <div className="text-sm text-neutral-500">
                          Expires {method.expiryDate}
                        </div>
                      )}
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
                      Default
                    </span>
                  )}
                </div>
              ))}
              
              <button
                onClick={handleSavePaymentMethod}
                className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-neutral-300 p-4 text-neutral-500 hover:border-neutral-400 hover:text-neutral-600 dark:border-neutral-600 dark:hover:border-neutral-500"
              >
                <Plus className="h-4 w-4" />
                <span>Save New Payment Method</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <Tab.Group
            onChange={(index) =>
              setSelectedPaymentMethod(index === 0 ? "paypal" : "stripe")
            }
          >
            <Tab.List className="my-5 flex gap-1">
              <Tab as={React.Fragment}>
                {({ selected }) => (
                  <button
                    className={`rounded-full px-4 py-1.5 focus:outline-none sm:px-6 sm:py-2.5 ${
                      selected
                        ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
                        : "text-neutral-6000 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    }`}
                  >
                    PayPal
                  </button>
                )}
              </Tab>
              <Tab as={React.Fragment}>
                {({ selected }) => (
                  <button
                    className={`flex items-center justify-center rounded-full px-4 py-1.5 focus:outline-none sm:px-6 sm:py-2.5 ${
                      selected
                        ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
                        : "text-neutral-6000 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className="mr-2.5">Credit card</span>
                    <Image className="w-8" src={visaPng} alt="Visa" />
                    <Image
                      className="w-8"
                      src={mastercardPng}
                      alt="Mastercard"
                    />
                  </button>
                )}
              </Tab>
            </Tab.List>

            <Tab.Panels>
              {/* PayPal Panel */}
              <Tab.Panel className="space-y-5">
                <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
                  <p className="text-center text-neutral-600 dark:text-neutral-400">
                    PayPal integration is coming soon. Please use credit card
                    payment for now.
                  </p>
                  <button
                    onClick={handlePayPalPayment}
                    className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                    disabled
                  >
                    PayPal (Coming Soon)
                  </button>
                </div>
              </Tab.Panel>

              {/* Stripe Panel */}
              <Tab.Panel className="space-y-5">
                <StripeProvider>
                  <StripePaymentForm
                    amount={totalAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </StripeProvider>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          {/* Email Confirmation Settings */}
          <div className="mt-6 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-neutral-500" />
                <div>
                  <h4 className="font-medium">Email Confirmation</h4>
                  <p className="text-sm text-neutral-500">
                    Receive booking confirmation and updates via email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailSettings(!showEmailSettings)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showEmailSettings ? 'Hide' : 'Settings'}
              </button>
            </div>
            
            {showEmailSettings && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="emailConfirmation"
                    checked={emailConfirmation}
                    onChange={(e) => setEmailConfirmation(e.target.checked)}
                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="emailConfirmation" className="text-sm">
                    Send email confirmation
                  </label>
                </div>
                
                {emailConfirmation && (
                  <div>
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Section - Shared between payment methods */}
          <div className="mt-6 space-y-1">
            <Label htmlFor="message">Message for host</Label>
            <Textarea
              id="message"
              placeholder="Write a few sentences about yourself or any special requests..."
              onChange={(e) =>
                handleReservationDataChange({ message: e.target.value })
              }
              maxLength={500}
            />
            <span className="block text-sm text-neutral-500">
              Optional: Let your host know about any special requests or
              requirements.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <ButtonPrimary
              onClick={handleSubmit}
              type="button"
              className="w-full"
              loading={isProcessing}
              disabled={isProcessing || !startDate || !endDate}
            >
              {isProcessing
                ? "Processing..."
                : `Confirm and pay ${selectedCurrency.symbol}${convertedAmount.toFixed(2)}`}
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMain;
