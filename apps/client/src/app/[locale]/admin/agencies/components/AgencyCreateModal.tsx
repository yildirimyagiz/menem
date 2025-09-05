"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "~/hooks/use-toast";

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

interface AgencyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
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

export default function AgencyCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: AgencyCreateModalProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const validate = useCallback((): Record<string, string> => {
    const errs: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errs.name = t("Admin.agencies.createModal.errors.nameRequired", { defaultValue: "Name is required." });
    }
    
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      errs.email = t("Admin.agencies.createModal.errors.invalidEmail", { defaultValue: "Invalid email address." });
    }
    
    return errs;
  }, [formData.name, formData.email, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length > 0) return;
    
    createMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError(null);
  };

  const createMutation = api.agency.create.useMutation({
    onSuccess: () => {
      toast({
        title: t("Admin.agencies.createModal.success.title", { defaultValue: "Agency Created" }),
        description: t("Admin.agencies.createModal.success.description", { defaultValue: "The agency was created successfully." }),
      });
      onSuccess();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: t("Admin.agencies.createModal.error.title", { defaultValue: "Error" }),
        description: error.message || t("Admin.agencies.createModal.error.description", { defaultValue: "Failed to create agency." }),
        variant: "destructive",
      });
      setSubmitError(error.message);
    },
  });

  const isFormValid = Object.keys(validate()).length === 0;

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
                  {t("Admin.agencies.createModal.title", { defaultValue: "Create New Agency" })}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  {t("Admin.agencies.createModal.description", { defaultValue: "Add a new agency to the system. Fill in the required information below." })}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.createModal.fields.name", { defaultValue: "Name" })} *
                    </Label>
                    <Input
                      id="name"
                      ref={nameInputRef}
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.createModal.fields.namePlaceholder", { defaultValue: "Enter agency name" })}
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
                      {t("Admin.agencies.createModal.fields.description", { defaultValue: "Description" })}
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.createModal.fields.descriptionPlaceholder", { defaultValue: "Enter agency description" })}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.createModal.fields.email", { defaultValue: "Email" })}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.createModal.fields.emailPlaceholder", { defaultValue: "Enter email address" })}
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
                      {t("Admin.agencies.createModal.fields.phone", { defaultValue: "Phone" })}
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.createModal.fields.phonePlaceholder", { defaultValue: "Enter phone number" })}
                    />
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.createModal.fields.address", { defaultValue: "Address" })}
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.createModal.fields.addressPlaceholder", { defaultValue: "Enter address" })}
                    />
                  </div>

                  {/* Website Field */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.createModal.fields.website", { defaultValue: "Website" })}
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.createModal.fields.websitePlaceholder", { defaultValue: "Enter website URL" })}
                    />
                  </div>

                  {/* Logo URL Field */}
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.createModal.fields.logoUrl", { defaultValue: "Logo URL" })}
                    </Label>
                    <Input
                      id="logoUrl"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder={t("Admin.agencies.createModal.fields.logoUrlPlaceholder", { defaultValue: "Enter logo URL" })}
                    />
                  </div>

                  {/* Status Field */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.createModal.fields.status", { defaultValue: "Status" })}
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
                            {t(`Admin.agencies.createModal.fields.statusOptions.${status}`, { defaultValue: status })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Status Field */}
                  <div className="space-y-2">
                    <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("Admin.agencies.createModal.fields.isActive", { defaultValue: "Active Status" })}
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
                          {t("Admin.agencies.createModal.fields.active", { defaultValue: "Active" })}
                        </SelectItem>
                        <SelectItem value="false">
                          {t("Admin.agencies.createModal.fields.inactive", { defaultValue: "Inactive" })}
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
                    {t("Admin.agencies.createModal.cancel", { defaultValue: "Cancel" })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || !isFormValid}
                    className="h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {createMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {t("Admin.agencies.createModal.creating", { defaultValue: "Creating..." })}
                      </div>
                    ) : (
                      t("Admin.agencies.createModal.create", { defaultValue: "Create Agency" })
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
