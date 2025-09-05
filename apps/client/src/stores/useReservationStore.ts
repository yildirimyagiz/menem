import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import type {
  BookingSource,
  Document,
  Message,
  Notification,
  Payment,
  PaymentStatus,
  PaymentType,
  Photo,
  Price,
  Reservation,
  ReservationStatus,
  Review,
  TaxType,
} from "~/utils/types";

interface ReservationState {
  reservation: Reservation | null;
  reservations: Reservation[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  filters: {
    status?: ReservationStatus;
    paymentStatus?: PaymentStatus;
    dateRange?: { start: Date; end: Date };
    propertyId?: string;
    carId?: string;
    hotelId?: string;
    experienceId?: string;
    userId?: string;
    guestId?: string;
  };
}

interface ReservationActions {
  // Basic CRUD
  setReservation: (reservation: Reservation) => void;
  updateReservation: (
    reservationId: string,
    updates: Partial<Reservation>,
  ) => void;
  clearReservation: () => void;
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  removeReservation: (reservationId: string) => void;

  // Status Management
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  resetState: () => void;

  // Filters
  setFilters: (filters: Partial<ReservationState["filters"]>) => void;
  clearFilters: () => void;

  // Status Updates
  updateReservationStatus: (
    reservationId: string,
    status: ReservationStatus,
  ) => void;
  updatePaymentStatus: (reservationId: string, status: PaymentStatus) => void;

  // Relations Management
  addPayment: (reservationId: string, payment: Payment) => void;
  addDocument: (reservationId: string, document: Document) => void;
  addPhoto: (reservationId: string, photo: Photo) => void;
  addReview: (reservationId: string, review: Review) => void;

  // Queries
  getFilteredReservations: () => Reservation[];
  getActiveReservations: () => Reservation[];
  getCompletedReservations: () => Reservation[];
  getCancelledReservations: () => Reservation[];
  getReservationsByUser: (userId: string) => Reservation[];
  getReservationsByProperty: (propertyId: string) => Reservation[];
  getReservationsByDateRange: (startDate: Date, endDate: Date) => Reservation[];

  // Statistics
  getReservationStats: () => {
    totalReservations: number;
    activeReservations: number;
    completedReservations: number;
    cancelledReservations: number;
    totalRevenue: number;
    averageRating: number;
  };

  batchUpdateReservations: (
    updates: { id: string; updates: Partial<Reservation> }[],
  ) => void;
}

interface ReservationStore extends ReservationState, ReservationActions {}

const initialState: ReservationState = {
  reservation: null,
  reservations: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  filters: {},
};

export const useReservationStore = create<ReservationStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      ...initialState,

      // Basic CRUD
      setReservation: (reservation) =>
        set({
          reservation,
          lastUpdated: new Date(),
        }),

      updateReservation: (reservationId, updates) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId ? { ...r, ...updates } : r,
          ),
          reservation:
            state.reservation?.id === reservationId
              ? { ...state.reservation, ...updates }
              : state.reservation,
          lastUpdated: new Date(),
        })),

      clearReservation: () => set({ reservation: null }),

      setReservations: (reservations) =>
        set({
          reservations,
          lastUpdated: new Date(),
        }),

      addReservation: (reservation) =>
        set((state) => ({
          reservations: [...state.reservations, reservation],
          lastUpdated: new Date(),
        })),

      removeReservation: (reservationId) =>
        set((state) => ({
          reservations: state.reservations.filter(
            (r) => r.id !== reservationId,
          ),
          reservation:
            state.reservation?.id === reservationId ? null : state.reservation,
          lastUpdated: new Date(),
        })),

      // Status Management
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      resetState: () => set(initialState),

      // Filters
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      clearFilters: () => set({ filters: {} }),

      // Status Updates
      updateReservationStatus: (reservationId, status) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId ? { ...r, status } : r,
          ),
          lastUpdated: new Date(),
        })),

      updatePaymentStatus: (reservationId, status) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId ? { ...r, paymentStatus: status } : r,
          ),
          lastUpdated: new Date(),
        })),

      // Relations Management
      addPayment: (reservationId, payment) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId
              ? { ...r, payments: [...r.payments, payment] }
              : r,
          ),
          lastUpdated: new Date(),
        })),

      addDocument: (reservationId, document) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId
              ? { ...r, documents: [...r.documents, document] }
              : r,
          ),
          lastUpdated: new Date(),
        })),

      addPhoto: (reservationId, photo) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId ? { ...r, photos: [...r.photos, photo] } : r,
          ),
          lastUpdated: new Date(),
        })),

      addReview: (reservationId, review) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId
              ? {
                  ...r,
                  reviews: [...r.reviews, review],
                  reviewCount: (r.reviewCount ?? 0) + 1,
                  averageRating: calculateNewAverageRating(r.reviews, review),
                }
              : r,
          ),
          lastUpdated: new Date(),
        })),

      // Queries
      getFilteredReservations: () => {
        const { reservations, filters } = get();
        return reservations.filter((r) => {
          if (filters.status && r.status !== filters.status) return false;
          if (
            filters.paymentStatus &&
            r.paymentStatus !== filters.paymentStatus
          )
            return false;
          if (filters.propertyId && r.propertyId !== filters.propertyId)
            return false;
          if (filters.userId && r.userId !== filters.userId) return false;
          if (filters.guestId && r.guestId !== filters.guestId) return false;

          if (filters.dateRange) {
            const checkIn = new Date(r.checkInDate);
            const checkOut = new Date(r.checkOutDate);
            if (
              checkIn < filters.dateRange.start ||
              checkOut > filters.dateRange.end
            ) {
              return false;
            }
          }

          return true;
        });
      },

      getActiveReservations: () => {
        const { reservations } = get();
        const now = new Date();
        return reservations.filter(
          (r) => new Date(r.checkOutDate) > now && r.status !== "Cancelled",
        );
      },

      getCompletedReservations: () => {
        const { reservations } = get();
        const now = new Date();
        return reservations.filter(
          (r) => new Date(r.checkOutDate) <= now && r.status === "Completed",
        );
      },

      getCancelledReservations: () => {
        const { reservations } = get();
        return reservations.filter((r) => r.status === "Cancelled");
      },

      getReservationsByUser: (userId) => {
        const { reservations } = get();
        return reservations.filter((r) => r.userId === userId);
      },

      getReservationsByProperty: (propertyId) => {
        const { reservations } = get();
        return reservations.filter((r) => r.propertyId === propertyId);
      },

      getReservationsByDateRange: (startDate, endDate) => {
        const { reservations } = get();
        return reservations.filter(
          (r) =>
            new Date(r.checkInDate) >= startDate &&
            new Date(r.checkOutDate) <= endDate,
        );
      },

      // Statistics
      getReservationStats: () => {
        const { reservations } = get();
        const activeReservations = get().getActiveReservations();
        const completedReservations = get().getCompletedReservations();
        const cancelledReservations = get().getCancelledReservations();

        const totalRevenue = reservations.reduce((sum, r) => sum + r.amount, 0);
        const totalRatings = reservations.reduce(
          (sum, r) => sum + (r.averageRating ?? 0),
          0,
        );
        const ratedReservations = reservations.filter(
          (r) => r.averageRating != null,
        ).length;

        return {
          totalReservations: reservations.length,
          activeReservations: activeReservations.length,
          completedReservations: completedReservations.length,
          cancelledReservations: cancelledReservations.length,
          totalRevenue,
          averageRating: ratedReservations
            ? totalRatings / ratedReservations
            : 0,
        };
      },

      batchUpdateReservations: (updates) =>
        set((state) => ({
          reservations: state.reservations.map((r) => {
            const update = updates.find((u) => u.id === r.id);
            return update ? { ...r, ...update.updates } : r;
          }),
          lastUpdated: new Date(),
        })),
    })),
  ),
);

// Helper function for calculating new average rating
const calculateNewAverageRating = (
  existingReviews: Review[],
  newReview: Review,
): number => {
  const totalRating =
    existingReviews.reduce(
      (sum, review) => sum + (review.averageRating ?? 0),
      0,
    ) + (newReview.averageRating ?? 0);
  return totalRating / (existingReviews.length + 1);
};

// Optional: Add subscriptions for side effects
useReservationStore.subscribe(
  (state) => state.reservations,
  (reservations) => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  },
);
