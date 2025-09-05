"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";

import type {
  CreateGuestInput,
  Gender,
  Guest,
  UpdateGuestInput,
} from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

import { api } from "~/trpc/react";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  guest?: Guest | null;
  onGuestSaved?: () => void;
}

const genderOptions: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  mode,
  guest,
  onGuestSaved,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState<Partial<CreateGuestInput>>({
    name: "",
    phone: "",
    email: "",
    nationality: "",
    passportNumber: "",
    gender: "MALE",
    birthDate: new Date(),
    address: "",
    city: "",
    country: "",
    zipCode: "",
    image: null,
    agencyId: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mutation hooks
  const createGuestMutation = api.guest.create.useMutation();
  const updateGuestMutation = api.guest.update.useMutation();

  // Populate form when guest changes (edit mode)
  useEffect(() => {
    if (guest && mode === "edit") {
      setFormData({
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        nationality: guest.nationality,
        passportNumber: guest.passportNumber,
        gender: guest.gender,
        birthDate: guest.birthDate,
        address: guest.address,
        city: guest.city,
        country: guest.country,
        zipCode: guest.zipCode,
        image: guest.image,
        agencyId: guest.agencyId,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        phone: "",
        email: "",
        nationality: "",
        passportNumber: "",
        gender: "MALE",
        birthDate: new Date(),
        address: "",
        city: "",
        country: "",
        zipCode: "",
        image: null,
        agencyId: null,
      });
    }
  }, [guest, mode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "create") {
        const result = await createGuestMutation.mutateAsync(
          formData as CreateGuestInput,
        );
        setSuccessMessage("Guest created successfully!");
        if (onGuestSaved) onGuestSaved();
      } else if (mode === "edit" && guest) {
        const updateData: UpdateGuestInput = {
          id: guest.id,
          ...formData,
        };
        const result = await updateGuestMutation.mutateAsync(updateData);
        setSuccessMessage("Guest updated successfully!");
        if (onGuestSaved) onGuestSaved();
      }

      setTimeout(onClose, 2000);
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

  const handleInputChange = (field: keyof CreateGuestInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900"
        tabIndex={0}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-modal-title"
      >
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <h2
          id="guest-modal-title"
          className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
        >
          {mode === "create" ? "Add New Guest" : "Edit Guest"}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Status Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{successMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  <User className="mr-1 inline h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter guest's full name..."
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    <Mail className="mr-1 inline h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address..."
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    <Phone className="mr-1 inline h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number..."
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="nationality" className="text-sm font-medium">
                  <Globe className="mr-1 inline h-4 w-4" />
                  Nationality *
                </Label>
                <Input
                  id="nationality"
                  placeholder="Enter nationality..."
                  value={formData.nationality || ""}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="passportNumber" className="text-sm font-medium">
                  Passport Number *
                </Label>
                <Input
                  id="passportNumber"
                  placeholder="Enter passport number..."
                  value={formData.passportNumber || ""}
                  onChange={(e) =>
                    handleInputChange("passportNumber", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender *
                </Label>
                <Select
                  value={formData.gender || "MALE"}
                  onValueChange={(value) =>
                    handleInputChange("gender", value as Gender)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <Label htmlFor="birthDate" className="text-sm font-medium">
                <Calendar className="mr-1 inline h-4 w-4" />
                Birth Date *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={
                  formData.birthDate
                    ? new Date(formData.birthDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("birthDate", new Date(e.target.value))
                }
                required
                className="mt-1"
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  <MapPin className="mr-1 inline h-4 w-4" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address..."
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={2}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    City *
                  </Label>
                  <Input
                    id="city"
                    placeholder="Enter city..."
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    placeholder="Enter country..."
                    value={formData.country || ""}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode" className="text-sm font-medium">
                    ZIP Code *
                  </Label>
                  <Input
                    id="zipCode"
                    placeholder="Enter ZIP code..."
                    value={formData.zipCode || ""}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="image" className="text-sm font-medium">
                  Profile Image URL
                </Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="Enter image URL..."
                  value={formData.image || ""}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="agencyId" className="text-sm font-medium">
                  Agency ID
                </Label>
                <Input
                  id="agencyId"
                  placeholder="Enter agency ID (optional)..."
                  value={formData.agencyId || ""}
                  onChange={(e) =>
                    handleInputChange("agencyId", e.target.value || null)
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.name?.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "create" ? "Create Guest" : "Update Guest"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
        <button ref={lastFocusableRef} className="hidden">
          Last Focusable Element
        </button>
      </div>
    </div>
  );
};

export default GuestModal;
