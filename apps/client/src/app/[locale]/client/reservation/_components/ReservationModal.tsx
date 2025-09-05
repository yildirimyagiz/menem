import React, { useCallback, useMemo, useState } from "react";

import type { Property } from "@reservatior/validators";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";

import ModalSelectDate from "~/components/ModalSelectDate";
import ModalSelectGuests from "~/components/ModalSelectGuests";
import StripePaymentForm from "~/components/StripePaymentForm";
import StripeProvider from "~/components/StripeProvider";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import ExtraChargeList from "../../facility/_components/ExtraChargeList";
import IncludedServiceList from "../../facility/_components/IncludedServiceList";
import PricingBreakdown from "./PricingBreakdown";
import ReservationPaymentForm from "./ReservationPaymentForm";

interface ReservationModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  property,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState({
    guestAdults: 1,
    guestChildren: 0,
    guestInfants: 0,
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current user session
  const { data: session } = api.auth.getSession.useQuery();

  // Fetch all relevant data in parallel
  const { data: availabilities, isLoading: isAvailLoading } =
    api.availability.byProperty.useQuery(
      { propertyId: property?.id ?? "" },
      { enabled: !!property },
    );
  const { data: pricingRules, isLoading: isPricingLoading } =
    api.pricingRule.byProperty.useQuery(
      { propertyId: property?.id ?? "" },
      { enabled: !!property },
    );
  const { data: includedServices, isLoading: isIncludedLoading } =
    api.includedService.byFacility.useQuery(
      { facilityId: property?.facilityId ?? "" },
      { enabled: !!property?.facilityId },
    );
  const { data: extraCharges, isLoading: isExtraLoading } =
    api.extraCharge.byFacility.useQuery(
      { facilityId: property?.facilityId ?? "" },
      { enabled: !!property?.facilityId },
    );

  // Reservation creation mutation
  const createReservationMutation = api.reservation.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Reservation Created",
        description: "Your reservation has been successfully created.",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Reservation Failed",
        description: error.message || "Failed to create reservation.",
        variant: "destructive",
      });
    },
  });

  // Extract min/max nights, maxGuests, etc.
  const minNights = availabilities?.[0]?.minNights ?? 1;
  const maxNights = availabilities?.[0]?.maxNights ?? 30;
  const maxGuests = availabilities?.[0]?.maxGuests ?? 2;

  // Type guard for special pricing (robust)
  function isSpecialPricing(obj: any): obj is {
    startDate: Date | string;
    endDate: Date | string;
    price: number;
  } {
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      obj !== null &&
      "startDate" in obj &&
      "endDate" in obj &&
      "price" in obj &&
      (obj.startDate instanceof Date || typeof obj.startDate === "string") &&
      (obj.endDate instanceof Date || typeof obj.endDate === "string") &&
      typeof obj.price === "number"
    );
  }

  // Type guard for discounts
  function isDiscount(obj: any): obj is { name: string; amount: number } {
    return (
      obj && typeof obj.name === "string" && typeof obj.amount === "number"
    );
  }

  // Safely extract specialPricing as SpecialPricing[]
  const specialPricing =
    availabilities?.flatMap((a) =>
      Array.isArray(a?.specialPricing)
        ? (a.specialPricing as any[]).filter(isSpecialPricing).map((sp) => ({
            startDate:
              sp.startDate instanceof Date
                ? sp.startDate
                : new Date(sp.startDate),
            endDate:
              sp.endDate instanceof Date ? sp.endDate : new Date(sp.endDate),
            price: sp.price,
          }))
        : [],
    ) ?? [];

  // Safely extract discounts as Discount[]
  const discounts =
    pricingRules && Array.isArray(pricingRules[0]?.discountRules)
      ? pricingRules[0].discountRules.filter(isDiscount)
      : [];

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (dates[0] && dates[1]) {
      const diff = Math.ceil((+dates[1] - +dates[0]) / (1000 * 60 * 60 * 24));
      return Math.max(diff, 1);
    }
    return 1;
  }, [dates]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const basePrice = pricingRules?.[0]?.basePrice ?? 100;
    const baseTotal = basePrice * numberOfNights;

    // Apply special pricing if applicable
    const specialPrice = specialPricing.find(
      (sp) =>
        dates[0] &&
        dates[1] &&
        dates[0] >= sp.startDate &&
        dates[1] <= sp.endDate,
    );

    const pricePerNight = specialPrice ? specialPrice.price : basePrice;
    let total = pricePerNight * numberOfNights;

    // Add extra charges
    const extraChargesTotal = (extraCharges ?? []).reduce(
      (sum, charge) => sum + ((charge as any).amount || 0),
      0,
    );
    total += extraChargesTotal;

    // Apply discounts
    const discountTotal = discounts.reduce(
      (sum, discount) => sum + discount.amount,
      0,
    );
    total -= discountTotal;

    return Math.max(total, 0);
  }, [
    pricingRules,
    numberOfNights,
    specialPricing,
    dates,
    extraCharges,
    discounts,
  ]);

  // Get currency from property or default to USD
  const currency = useMemo(() => {
    // Try to get currency from property, fallback to USD
    return (property as any)?.currencyId ?? "USD";
  }, [property]);

  // Map includedServices and extraCharges to ensure type safety and no nulls
  const safeIncludedServices = (includedServices ?? []).map((s: any) => ({
    ...s,
    description: s.description ?? undefined,
    icon: typeof s.icon === "string" ? s.icon : undefined,
    logo: typeof s.logo === "string" ? s.logo : undefined,
  }));
  const safeExtraCharges = (extraCharges ?? []).map((c: any) => ({
    ...c,
    description: c.description ?? undefined,
    icon: typeof c.icon === "string" ? c.icon : undefined,
    logo: typeof c.logo === "string" ? c.logo : undefined,
    amount: typeof c.amount === "number" ? c.amount : 0,
  }));

  // Handle payment success and reservation creation
  const handlePaymentSuccess = useCallback(
    async (paymentData: any) => {
      if (!property || !session?.user?.id || !dates[0] || !dates[1]) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      try {
        // Create reservation
        await createReservationMutation.mutateAsync({
          propertyId: property.id,
          guestId: session.user.id,
          userId: session.user.id,
          startDate: dates[0],
          endDate: dates[1],
          guests:
            guests.guestAdults + guests.guestChildren + guests.guestInfants,
          totalPrice,
          currencyId: currency,
          paymentStatus: "PAID", // Since payment was successful
          specialRequests: specialRequests || undefined,
          pricingRuleId: pricingRules?.[0]?.id,
          agencyId: property.agencyId ?? undefined,
        });

        toast({
          title: "Reservation Successful",
          description:
            "Your reservation has been created and payment processed.",
        });
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Reservation creation error:", error);
        toast({
          title: "Reservation Failed",
          description: "Failed to create reservation. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [
      property,
      session,
      dates,
      guests,
      totalPrice,
      specialRequests,
      pricingRules,
      createReservationMutation,
      toast,
      onSuccess,
      onClose,
      currency,
    ],
  );

  const handlePaymentError = useCallback(
    (error: Error) => {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    [toast],
  );

  // Validation
  const isValid = useMemo(() => {
    if (!property || !session?.user?.id || !dates[0] || !dates[1]) return false;
    if (guests.guestAdults === 0) return false;
    if (numberOfNights < minNights || numberOfNights > maxNights) return false;
    const totalGuests =
      guests.guestAdults + guests.guestChildren + guests.guestInfants;
    if (totalGuests > maxGuests) return false;
    return true;
  }, [
    property,
    session,
    dates,
    guests,
    numberOfNights,
    minNights,
    maxNights,
    maxGuests,
  ]);

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book {property.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Dates
            </label>
            <ModalSelectDate
              renderChildren={({ openModal }) => (
                <button
                  className="mt-1 w-full rounded border px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={openModal}
                >
                  {dates[0] && dates[1]
                    ? `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()} (${numberOfNights} nights)`
                    : "Select check-in and check-out dates"}
                </button>
              )}
            />
          </div>

          {/* Guests Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Guests
            </label>
            <ModalSelectGuests
              renderChildren={({ openModal }) => (
                <button
                  className="mt-1 w-full rounded border px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={openModal}
                >
                  {guests.guestAdults} Adults, {guests.guestChildren} Children,{" "}
                  {guests.guestInfants} Infants
                </button>
              )}
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Special Requests (Optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              placeholder="Any special requests or requirements..."
              rows={3}
            />
          </div>

          {/* Included Services */}
          <IncludedServiceList
            services={safeIncludedServices}
            loading={isIncludedLoading}
          />

          {/* Extra Charges */}
          <ExtraChargeList
            charges={safeExtraCharges}
            loading={isExtraLoading}
          />

          {/* Pricing Breakdown */}
          <PricingBreakdown
            basePrice={pricingRules?.[0]?.basePrice ?? 100}
            specialPricing={specialPricing}
            extraCharges={safeExtraCharges}
            discounts={discounts}
            nights={numberOfNights}
          />

          {/* Payment Form */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment
            </label>
            <ReservationPaymentForm
              amount={totalPrice}
              currency={currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              disabled={!isValid || isProcessing}
              loading={isProcessing}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
