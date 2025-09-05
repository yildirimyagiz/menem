"use client";

import React, { useState } from "react";
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";

import { useToast } from "~/hooks/use-toast";
import { cancelReservation } from "~/services/reservation";
import { api } from "~/trpc/react";

interface ReservationListProps {
  userId?: string;
}

const ReservationList: React.FC<ReservationListProps> = ({ userId }) => {
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch user's reservations
  const {
    data: reservations,
    isLoading,
    refetch,
  } = api.reservation.all.useQuery(
    {
      userId,
      page: 1,
      pageSize: 50,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    {
      enabled: !!userId,
    },
  );

  const cancelReservationMutation = api.reservation.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been successfully cancelled.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel reservation.",
        variant: "destructive",
      });
    },
  });

  const handleCancelReservation = async (reservationId: string) => {
    setCancellingId(reservationId);
    try {
      await cancelReservationMutation.mutateAsync({
        id: reservationId,
        status: "CANCELLED",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "UNPAID":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reservations?.data?.items || reservations.data.items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CalendarIcon className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No reservations found
          </h3>
          <p className="text-center text-gray-500 dark:text-gray-400">
            You haven't made any reservations yet. Start by exploring our
            properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        My Reservations
      </h2>

      <div className="grid gap-4">
        {reservations.data.items.map((reservation: any) => (
          <Card
            key={reservation.id}
            className="transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {reservation.Property?.title ?? "Property"}
                  </CardTitle>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Reservation ID: {reservation.id}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                  <Badge
                    className={getPaymentStatusColor(reservation.paymentStatus)}
                  >
                    {reservation.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Check-in</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(reservation.startDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Check-out</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(reservation.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Guests</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {reservation.guests}{" "}
                      {reservation.guests === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${reservation.totalPrice.toFixed(2)}{" "}
                      {reservation.Currency?.code || "USD"}
                    </p>
                  </div>
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Special Requests:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reservation.specialRequests}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reservation Details</DialogTitle>
                      <DialogDescription>
                        Detailed information about your reservation.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Property</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {reservation.Property?.title ?? "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Dates</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(
                            new Date(reservation.startDate),
                            "EEEE, MMMM dd, yyyy",
                          )}{" "}
                          -{" "}
                          {format(
                            new Date(reservation.endDate),
                            "EEEE, MMMM dd, yyyy",
                          )}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Payment Information</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status: {reservation.paymentStatus} | Amount: $
                          {reservation.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      {reservation.Agency && (
                        <div>
                          <h4 className="font-medium">Agency</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {reservation.Agency.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {reservation.status === "CONFIRMED" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelReservation(reservation.id)}
                    disabled={cancellingId === reservation.id}
                  >
                    {cancellingId === reservation.id
                      ? "Cancelling..."
                      : "Cancel"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
