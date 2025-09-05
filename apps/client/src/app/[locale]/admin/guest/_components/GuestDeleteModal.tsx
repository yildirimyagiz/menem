import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

import type { Guest } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";

import { api } from "~/trpc/react";

interface GuestDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onGuestDeleted: () => void;
}

const GuestDeleteModal: React.FC<GuestDeleteModalProps> = ({
  isOpen,
  onClose,
  guest,
  onGuestDeleted,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mutation hook for deleting a guest
  const deleteGuestMutation = api.guest.delete.useMutation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Tab") {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            event.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            event.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!guest?.id) return;

    setError(null);
    setLoading(true);

    try {
      const result = await deleteGuestMutation.mutateAsync(guest.id);

      if (result) {
        onGuestDeleted();
        onClose();
      } else {
        setError("Failed to delete guest");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !guest) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900"
        tabIndex={0}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-guest-modal-title"
      >
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center">
            <h2
              id="delete-guest-modal-title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Delete Guest
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this guest? This action cannot be
              undone.
            </p>
          </div>

          {/* Guest Details */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {guest.name}
            </h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>Email: {guest.email}</p>
              <p>Phone: {guest.phone}</p>
              <p>Nationality: {guest.nationality}</p>
              <p>Passport: {guest.passportNumber}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Guest
                </>
              )}
            </Button>
          </div>
        </motion.div>
        <button ref={lastFocusableRef} className="hidden">
          Last Focusable Element
        </button>
      </div>
    </div>
  );
};

export default GuestDeleteModal;
