/**
 * useBookingUpdates Hook
 * 
 * Centralized hook for updating booking data with optimistic updates.
 * This decouples child components from the parent's SWR fetching logic.
 * 
 * Features:
 * - Optimistic updates (UI updates immediately)
 * - Automatic revalidation via SWR mutate
 * - Error handling with rollback
 * - Loading states
 */

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SanitizedBooking } from "@/lib/transformers/booking-transformer";
import type { KeyedMutator } from "swr";

interface UpdateBookingOptions {
  optimistic?: boolean; // Whether to apply optimistic update (default: true)
  showToast?: boolean; // Whether to show success/error toasts (default: true)
}

interface UseBookingUpdatesReturn {
  updateBooking: (
    updates: Record<string, unknown>,
    options?: UpdateBookingOptions
  ) => Promise<SanitizedBooking | null>;
  isUpdating: boolean;
  error: Error | null;
}

/**
 * Hook for updating booking data with optimistic updates and SWR revalidation
 * 
 * @param bookingId - The ID of the booking to update
 * @param currentBooking - Current booking data from SWR (for optimistic updates)
 * @param mutate - SWR mutate function to trigger revalidation
 * @returns Object with updateBooking function, loading state, and error state
 */
export function useBookingUpdates(
  bookingId: string | null | undefined,
  currentBooking: SanitizedBooking | null,
  mutate: KeyedMutator<{ booking: SanitizedBooking; fallback?: boolean }>
): UseBookingUpdatesReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const updateBooking = useCallback(
    async (
      updates: Record<string, unknown>,
      options: UpdateBookingOptions = {}
    ): Promise<SanitizedBooking | null> => {
      const {
        optimistic = true,
        showToast = true,
      } = options;

      if (!bookingId) {
        const err = new Error("Booking ID is required");
        setError(err);
        if (showToast) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        }
        return null;
      }

      setIsUpdating(true);
      setError(null);

      // Store original data for rollback
      const originalData = currentBooking;

      // Optimistic update: Update UI immediately
      if (optimistic && currentBooking) {
        mutate(
          (current) => {
            if (!current) return current;
            return {
              ...current,
              booking: {
                ...current.booking,
                ...updates,
              } as SanitizedBooking,
            };
          },
          false // Don't revalidate immediately
        );
      }

      try {
        // Make PATCH request to API
        // Note: We only send the 'updates' object (partial update), not the entire booking
        // The API endpoint only processes keys in PATCH_ALLOWED_KEYS, preventing data overwrites
        const response = await fetch(`/api/admin/bookings/${bookingId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates), // Only changed keys are sent
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              errorData.message ||
              `Failed to update booking: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        const updatedBooking = data.booking as SanitizedBooking;

        // Revalidate SWR cache with server response
        // mutate() without arguments revalidates the current key (bound to this hook's bookingId)
        // This triggers a global revalidation so all components using this booking data see fresh data
        await mutate();

        if (showToast) {
          toast({
            title: "Success",
            description: "Booking updated successfully",
            variant: "default",
          });
        }

        setIsUpdating(false);
        return updatedBooking;
      } catch (err: any) {
        setError(err);

        // Rollback optimistic update on error
        if (optimistic && originalData) {
          mutate(
            (current) => {
              if (!current) return current;
              return {
                ...current,
                booking: originalData,
              };
            },
            false
          );
        }

        if (showToast) {
          toast({
            title: "Error",
            description: err.message || "Failed to update booking",
            variant: "destructive",
          });
        }

        setIsUpdating(false);
        return null;
      }
    },
    [bookingId, currentBooking, mutate, toast]
  );

  return {
    updateBooking,
    isUpdating,
    error,
  };
}
