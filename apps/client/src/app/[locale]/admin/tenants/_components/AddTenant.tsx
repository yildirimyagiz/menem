"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import type { CreateTenantInput } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";

import { useLanguage } from "~/context/LanguageContext";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

// Due to backend router name collisions (see `apps/client/src/trpc/react.tsx`),
// some typed helpers on `api` become unusable at the type level (union of error strings).
// Wrap the needed hooks with minimal any-casts while preserving correct runtime behavior.
function useTRPCUtilsSafe() {
  const client = api as unknown as {
    useUtils: () => { tenant: { all: { invalidate: () => Promise<void> } } };
  };
  return client.useUtils();
}

function useTenantCreateMutationSafe(handlers: {
  onSuccess: () => void | Promise<void>;
  onError: (err: unknown) => void;
}) {
  const client = api as unknown as {
    tenant: {
      create: {
        useMutation: (
          h: { onSuccess: () => void | Promise<void>; onError: (err: unknown) => void },
        ) => { mutate: (input: CreateTenantInput) => void; isPending: boolean };
      };
    };
  };
  const m = client.tenant.create.useMutation(handlers);
  return { mutate: m.mutate, isPending: m.isPending };
}

interface AddTenantProps {
  onClose: () => void;
  onTenantAdded: () => void;
}

const AddTenant: React.FC<AddTenantProps> = ({ onClose, onTenantAdded }) => {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Trap focus within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableEls = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusableEls.length === 0) return;
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus modal on mount
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const [formData, setFormData] = useState<CreateTenantInput>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    propertyId: "",
    leaseStartDate: new Date(),
    leaseEndDate: new Date(),
    paymentStatus: "PAID",
  });

  const utils = useTRPCUtilsSafe();

  const createTenant = useTenantCreateMutationSafe({
    onSuccess: async () => {
      await utils.tenant.all.invalidate();
      toast.success(t("Tenant.success.created"));
      onTenantAdded();
      resetForm();
      setTimeout(onClose, 2000);
    },
    onError: (err: unknown) => {
      console.error("Error creating tenant:", err);
      toast.error(t("Tenant.error.create"));
    },
  });

  const resetForm = () => {
    setFormData({
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      propertyId: "",
      leaseStartDate: new Date(),
      leaseEndDate: new Date(),
      paymentStatus: "PAID",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const key = name as keyof CreateTenantInput;

    setFormData((prev) => {
      let processedValue: string | Date = value;

      if (type === "date") {
        processedValue = value === "" ? new Date() : new Date(value);
      } else if (
        value === "" &&
        (key === "phoneNumber" || key === "userId" || key === "propertyId")
      ) {
        processedValue = "";
      }

      return { ...prev, [key]: processedValue };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // basic date validation
    if (
      new Date(formData.leaseEndDate).getTime() <
      new Date(formData.leaseStartDate).getTime()
    ) {
      toast.error(t("Tenant.error.invalidLeaseDates"));
      return;
    }
    createTenant.mutate(formData);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-tenant-title-heading"
        aria-describedby="add-tenant-desc"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-8 shadow-2xl focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold text-blue-800"
              id="add-tenant-title-heading"
            >
              {t("Tenant.addTenant")}
            </h2>
            <p className="mt-1 text-sm text-gray-600" id="add-tenant-desc">
              {t("Tenant.addTenantDescription")} {" "}
              <span className="text-red-500">*</span>.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={t("common.close")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-tenant-firstName"
              >
                {t("Tenant.fields.firstName")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-tenant-firstName"
                name="firstName"
                placeholder={t("Tenant.placeholders.firstName")}
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-tenant-lastName"
              >
                {t("Tenant.fields.lastName")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-tenant-lastName"
                name="lastName"
                placeholder={t("Tenant.placeholders.lastName")}
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-tenant-email"
            >
              {t("Tenant.fields.email")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="add-tenant-email"
              name="email"
              type="email"
              placeholder={t("Tenant.placeholders.email")}
              value={formData.email}
              onChange={handleInputChange}
              required
              className="rounded-md border p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-tenant-phoneNumber"
              >
                {t("Tenant.fields.phoneNumber")}
              </label>
              <Input
                id="add-tenant-phoneNumber"
                name="phoneNumber"
                placeholder={t("Tenant.placeholders.phoneNumber")}
                value={formData.phoneNumber ?? ""}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-tenant-userId"
              >
                {t("Tenant.fields.userId")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-tenant-userId"
                name="userId"
                placeholder={t("Tenant.placeholders.userId")}
                value={formData.userId}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-tenant-propertyId"
            >
              {t("Tenant.fields.propertyId")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="add-tenant-propertyId"
              name="propertyId"
              placeholder={t("Tenant.placeholders.propertyId")}
              value={formData.propertyId}
              onChange={handleInputChange}
              required
              className="rounded-md border p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-tenant-leaseStartDate"
              >
                {t("Tenant.fields.leaseStartDate")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-tenant-leaseStartDate"
                name="leaseStartDate"
                type="date"
                value={formData.leaseStartDate.toISOString().split("T")[0]}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-tenant-leaseEndDate"
              >
                {t("Tenant.fields.leaseEndDate")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-tenant-leaseEndDate"
                name="leaseEndDate"
                type="date"
                value={formData.leaseEndDate.toISOString().split("T")[0]}
                onChange={handleInputChange}
                required
                min={formData.leaseStartDate.toISOString().split("T")[0]}
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-tenant-paymentStatus"
            >
              {t("Tenant.fields.paymentStatus")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="add-tenant-paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleInputChange}
              className="w-full rounded-md border p-2"
              required
              title={t("Tenant.fields.paymentStatus")}
            >
              <option value="PAID">{t("Tenant.paymentStatus.PAID")}</option>
              <option value="UNPAID">{t("Tenant.paymentStatus.UNPAID")}</option>
              <option value="PARTIALLY_PAID">
                {t("Tenant.paymentStatus.PARTIALLY_PAID")}
              </option>
              <option value="OVERDUE">
                {t("Tenant.paymentStatus.OVERDUE")}
              </option>
              <option value="REFUNDED">
                {t("Tenant.paymentStatus.REFUNDED")}
              </option>
              <option value="CANCELLED">
                {t("Tenant.paymentStatus.CANCELLED")}
              </option>
            </select>
          </div>

          <Button
            type="submit"
            variant="link"
            size="sm"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={createTenant.isPending}
            aria-busy={createTenant.isPending}
          >
            {createTenant.isPending
              ? t("Tenant.addingTenant")
              : t("Tenant.addTenant")}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddTenant;
