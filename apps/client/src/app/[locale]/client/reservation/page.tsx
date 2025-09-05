"use client";

import React, { useEffect, useState } from "react";

import type {
  Property,
  Reservation,
  ReservationFilterInput,
} from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import ExtraChargeList from "../facility/_components/ExtraChargeList";
import IncludedServiceList from "../facility/_components/IncludedServiceList";
import CommissionRuleByBooking from "./_components/CommissionRuleByBooking";
import PropertyBookingList from "./_components/PropertyBookingList";
import ReservationModal from "./_components/ReservationModal";
import TaxRecordByBooking from "./_components/TaxRecordByBooking";

// TODO: Implement these components
// import PropertyBookingList from "./_components/PropertyBookingList";
// import ReservationModal from "./_components/ReservationModal";
// import ReservationList from "./_components/ReservationList";
// import ReservationFilterForm from "./_components/ReservationFilterForm";

const ClientReservationPage = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<ReservationFilterInput>({
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    pageSize: 20,
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  // Fetch bookable properties (filter by propertyStatus: AVAILABLE, and optionally by category/type)
  const {
    data: propertiesData,
    isPending: isPropertiesLoading,
    error: propertiesError,
  } = api.property.all.useQuery(
    { status: "AVAILABLE", page: 1, pageSize: 20 },
    { refetchOnWindowFocus: false, retry: 2 },
  );

  // Fetch reservations for the user
  const {
    data: reservationsData,
    isPending: isReservationsLoading,
    error: reservationsError,
  } = api.reservation.all.useQuery(filter, {
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    if (propertiesError) {
      toast({
        title: "Error loading properties",
        description: propertiesError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    if (reservationsError) {
      toast({
        title: "Error loading reservations",
        description:
          reservationsError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }, [propertiesError, reservationsError, toast]);

  const propertyArray = Array.isArray(propertiesData?.data)
    ? propertiesData?.data
    : Array.isArray(propertiesData)
      ? propertiesData
      : [];
  const properties: Property[] = propertyArray
    .filter(
      (p: any) =>
        p && typeof p.id === "string" && p.propertyStatus === "AVAILABLE",
    )
    .map((p: any) => ({
      ...p,
      // Ensure all required fields are present, fallback to empty string or default if missing
      id: p.id ?? "",
      isActive: p.isActive ?? true,
      description: p.description ?? "",
      createdAt: p.createdAt ?? new Date(),
      updatedAt: p.updatedAt ?? new Date(),
      size: p.size ?? 0,
      title: p.title ?? "",
      featured: p.featured ?? false,
      propertyNumber: p.propertyNumber ?? "",
      propertyType: p.propertyType ?? "APARTMENT",
      propertyStatus: p.propertyStatus ?? "AVAILABLE",
      category: p.category ?? "APARTMENT",
    })) as Property[];
  const reservations: Reservation[] = (reservationsData?.data?.items ?? [])
    .filter(
      (r: any) =>
        r && typeof r.propertyId === "string" && typeof r.guestId === "string",
    )
    .map((r: any) => ({
      ...r,
      propertyId: r.propertyId ?? "",
      guestId: r.guestId ?? "",
      userId: r.userId ?? "",
      startDate: r.startDate ?? new Date(),
      endDate: r.endDate ?? new Date(),
      updatedAt: r.updatedAt ?? new Date(),
      status: r.status ?? "PENDING",
      totalPrice: r.totalPrice ?? 0,
      currencyId: r.currencyId ?? "",
    })) as Reservation[];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Book a Property</h1>
        {/* TODO: Add a button to open reservation modal for selected property */}
      </div>
      {/* TODO: <ReservationFilterForm onFilter={setFilter} /> */}
      <div className="mt-6">
        <PropertyBookingList
          properties={properties}
          onBook={(property: Property) => {
            setSelectedProperty(property);
            setIsReservationModalOpen(true);
          }}
          isLoading={isPropertiesLoading}
        />
      </div>
      {/* TODO: <ReservationList reservations={reservations} isLoading={isReservationsLoading} /> */}
      {reservations.map((reservation) => (
        <div key={reservation.id} className="my-8 border-b pb-4">
          {/* Render reservation details here */}
          <div className="mb-2 font-semibold">
            Reservation ID: {reservation.id}
          </div>
          <div>Property: {reservation.propertyId}</div>
          <div>Status: {reservation.status}</div>
          <div>Total Price: {reservation.totalPrice}</div>
          {/* Commission rules for this booking */}
          <CommissionRuleByBooking
            propertyId={reservation.propertyId}
            reservationId={reservation.id}
          />
          {/* Tax records for this booking */}
          <TaxRecordByBooking
            propertyId={reservation.propertyId}
            reservationId={reservation.id}
          />
        </div>
      ))}
      <ReservationModal
        isOpen={isReservationModalOpen}
        property={selectedProperty}
        onClose={() => setIsReservationModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default ClientReservationPage;
