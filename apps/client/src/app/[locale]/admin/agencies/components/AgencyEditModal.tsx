"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "~/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { z } from "zod";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
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
import { AgencyStatus } from "@reservatior/validators";

import { api } from "~/trpc/react";

type AgencyStatusType = z.infer<typeof AgencyStatus>;

interface AgencyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId: string;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  logoUrl: string;
  status: AgencyStatusType;
  isActive: boolean;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  email: "",
  phoneNumber: "",
  address: "",
  website: "",
  logoUrl: "",
  status: "PENDING",
  isActive: true,
};

export default function AgencyEditModal({
  isOpen,
  onClose,
  agencyId,
  onSuccess,
}: AgencyEditModalProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Fetch agency data
  const { data: agencyResponse, isLoading: isLoadingAgency } =
    api.agency.byId.useQuery(
      { id: agencyId },
      { enabled: isOpen && !!agencyId },
    );

  const updateMutation = api.agency.update.useMutation({
    onSuccess: () => {
      toast({
        title: t("Admin.agencies.editModal.success.title", { defaultValue: "Agency Updated" }),
        description: t("Admin.agencies.editModal.success.description", { defaultValue: "The agency was updated successfully." }),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t("Admin.agencies.editModal.error.title", { defaultValue: "Error" }),
        description: error.message || t("Admin.agencies.editModal.error.description", { defaultValue: "Failed to update agency." }),
        variant: "destructive",
      });
      setSubmitError(error.message);
    },
  });

  // Update form data when agency data is loaded
  useEffect(() => {
    if (agencyResponse?.data) {
      const agency = agencyResponse.data;
      setFormData({
        name: agency.name || "",
        description: agency.description ?? "",
        email: agency.email ?? "",
        phoneNumber: agency.phoneNumber ?? "",
        address: agency.address ?? "",
        website: agency.website ?? "",
        logoUrl: agency.logoUrl ?? "",
        status: agency.status || "ACTIVE",
        isActive: agency.isActive ?? true,
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [agencyResponse]);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errs.name = t("Admin.agencies.editModal.errors.nameRequired", { defaultValue: "Name is required." });
    }
    
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      errs.email = t("Admin.agencies.editModal.errors.invalidEmail", { defaultValue: "Invalid email address." });
    }
    
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length > 0) return;
    
    updateMutation.mutate({
      id: agencyId,
      ...formData,
    });
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const isFormValid = Object.keys(validate()).length === 0;

  if (isLoadingAgency) {
    return (
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-gray-200/20 rounded-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("Admin.agencies.editModal.title", { defaultValue: "Edit Agency" })}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    {t("Admin.agencies.editModal.loading", { defaultValue: "Loading agency data..." })}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Admin.agencies.editModal.loading.description", { defaultValue: "Loading agency information..." })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-gray-200/20 rounded-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("Admin.agencies.editModal.title", { defaultValue: "Edit Agency" })}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  {t("Admin.agencies.editModal.description", { defaultValue: "Update the agency information below." })}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.name", { defaultValue: "Name" })} *
                    </Label>
                    <Input
                      id="name"
                      ref={nameInputRef}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.editModal.fields.namePlaceholder", { defaultValue: "Enter agency name" })}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-red-500"
                        id="name-error"
                      >
                        {errors.name}
                      </motion.div>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.description", { defaultValue: "Description" })}
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.editModal.fields.descriptionPlaceholder", { defaultValue: "Enter agency description" })}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.email", { defaultValue: "Email" })}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.editModal.fields.emailPlaceholder", { defaultValue: "Enter email address" })}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-red-500"
                        id="email-error"
                      >
                        {errors.email}
                      </motion.div>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.phone", { defaultValue: "Phone" })}
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.editModal.fields.phonePlaceholder", { defaultValue: "Enter phone number" })}
                    />
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.address", { defaultValue: "Address" })}
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.editModal.fields.addressPlaceholder", { defaultValue: "Enter address" })}
                    />
                  </div>

                  {/* Website Field */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.website", { defaultValue: "Website" })}
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.editModal.fields.websitePlaceholder", { defaultValue: "Enter website URL" })}
                    />
                  </div>

                  {/* Logo URL Field */}
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.logoUrl", { defaultValue: "Logo URL" })}
                    </Label>
                    <Input
                      id="logoUrl"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.editModal.fields.logoUrlPlaceholder", { defaultValue: "Enter logo URL" })}
                    />
                  </div>

                  {/* Status Field */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.status", { defaultValue: "Status" })}
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value as FormData["status"])}
                    >
                      <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AgencyStatus.options.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`Admin.agencies.editModal.fields.statusOptions.${status}`, { defaultValue: status })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Status Field */}
                  <div className="space-y-2">
                    <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.editModal.fields.isActive", { defaultValue: "Active Status" })}
                    </Label>
                    <Select
                      value={formData.isActive ? "true" : "false"}
                      onValueChange={(value) => handleInputChange("isActive", value === "true")}
                    >
                      <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">
                          {t("Admin.agencies.editModal.fields.active", { defaultValue: "Active" })}
                        </SelectItem>
                        <SelectItem value="false">
                          {t("Admin.agencies.editModal.fields.inactive", { defaultValue: "Inactive" })}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-600">{submitError}</p>
                  </motion.div>
                )}

                <DialogFooter className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-10 px-4"
                  >
                    {t("Admin.agencies.editModal.cancel", { defaultValue: "Cancel" })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || !isFormValid}
                    className="h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {updateMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {t("Admin.agencies.editModal.updating", { defaultValue: "Updating..." })}
                      </div>
                    ) : (
                      t("Admin.agencies.editModal.update", { defaultValue: "Update Agency" })
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
