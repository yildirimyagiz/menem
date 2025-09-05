"use client";

import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";

import { useLanguage } from "~/context/LanguageContext";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";


import type { PropertyAmenities, PropertyFeatures } from "@prisma/client";
import { PropertyCondition, PropertyStatus, PropertyType } from "@prisma/client";
import type { CreatePropertyInput } from "@reservatior/validators";

// Local input type for update: backend likely expects id + fields
type UpdatePropertyInputLocal = CreatePropertyInput & { id: string };

// Safe wrappers (typed unknown-casts) similar to AddProperty.tsx
function useTRPCUtilsSafe() {
  const client = api as unknown as {
    useUtils: () => { property: { all: { invalidate: () => Promise<void> } } };
  };
  return client.useUtils();
}

function usePropertyUpdateMutationSafe(handlers: {
  onSuccess: () => void | Promise<void>;
  onError: (err: unknown) => void;
}) {
  const client = api as unknown as {
    property: {
      update: {
        useMutation: (
          h: { onSuccess: () => void | Promise<void>; onError: (err: unknown) => void },
        ) => { mutate: (input: UpdatePropertyInputLocal) => void; isPending: boolean };
      };
    };
  };
  const m = client.property.update.useMutation(handlers);
  return { mutate: m.mutate, isPending: m.isPending };
}

interface EditPropertyProps {
  open: boolean;
  onClose: () => void;
  property: UpdatePropertyInputLocal;
  onPropertyUpdated: () => void;
}

export default function EditProperty({ open, onClose, property, onPropertyUpdated }: EditPropertyProps) {
  const { t } = useLanguage();

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Focus trap on dialog
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open && modalRef.current) modalRef.current.focus();
  }, [open]);

  const utils = useTRPCUtilsSafe();
  const updateProperty = usePropertyUpdateMutationSafe({
    onSuccess: async () => {
      await utils.property.all.invalidate();
      toast.success(t("Property.success.updated"));
      onPropertyUpdated();
      setTimeout(onClose, 1500);
    },
    onError: (err: unknown) => {
      console.error("Error updating property:", err);
      toast.error(t("Property.error.update"));
    },
  });

  // Initialize form state from incoming property
  const [formData, setFormData] = useState<UpdatePropertyInputLocal>(() => ({
    ...property,
    // If any of these are actually optional in your validator, re-introduce safe fallbacks.
    category: property.category,
    propertyStatus: property.propertyStatus,
    propertyType: property.propertyType,
    condition: property.condition,
    features: (property.features) as PropertyFeatures[],
    amenities: (property.amenities) as PropertyAmenities[],
  }));

  useEffect(() => {
    // Sync when incoming property changes
    setFormData((prev) => ({
      ...prev,
      ...property,
      category: property.category,
      propertyStatus: property.propertyStatus,
      propertyType: property.propertyType,
      condition: property.condition,
      features: (property.features) as PropertyFeatures[],
      amenities: (property.amenities) as PropertyAmenities[],
    }));
  }, [property]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "size" || name === "yearBuilt" ? Number(value) : value,
    }));
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t("Property.editProperty")}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-8 shadow-2xl focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-800" id="edit-property-title-heading">
              {t("Property.editProperty")}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{t("Property.editPropertyDescription")}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label={t("common.close")} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prop-title">
              {t("Property.fields.title")} <span className="text-red-500">*</span>
            </label>
            <Input id="prop-title" name="title" value={formData.title} onChange={handleChange} required className="rounded-md border p-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prop-description">
              {t("Property.fields.description")}
            </label>
            <textarea
              id="prop-description"
              name="description"
              className="h-24 w-full rounded-md border p-2"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prop-size">
                {t("Property.fields.size")}
              </label>
              <Input id="prop-size" name="size" type="number" value={Number(formData.size)} onChange={handleChange} className="rounded-md border p-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prop-year">
                {t("Property.fields.yearBuilt")}
              </label>
              <Input id="prop-year" name="yearBuilt" type="number" value={Number(formData.yearBuilt)} onChange={handleChange} className="rounded-md border p-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prop-status">
                {t("Property.fields.propertyStatus")}
              </label>
              <select id="prop-status" name="propertyStatus" value={formData.propertyStatus} onChange={handleChange} className="w-full rounded-md border p-2">
                {Object.values(PropertyStatus).map((s) => (
                  <option key={s} value={s}>
                    {t(`Property.status.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prop-type">
                {t("Property.fields.propertyType")}
              </label>
              <select id="prop-type" name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full rounded-md border p-2">
                {Object.values(PropertyType).map((s) => (
                  <option key={s} value={s}>
                    {t(`Property.type.${s}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="prop-condition">
              {t("Property.fields.condition")}
            </label>
            <select id="prop-condition" name="condition" value={formData.condition} onChange={handleChange} className="w-full rounded-md border p-2">
              {Object.values(PropertyCondition).map((s) => (
                <option key={s} value={s}>
                  {t(`Property.condition.${s}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} aria-label={t("common.cancel")}>{t("common.cancel")}</Button>
          <Button
            onClick={() => updateProperty.mutate(formData)}
            disabled={updateProperty.isPending || !formData.title}
            aria-label={t("common.save")}
          >
            {updateProperty.isPending ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </div>
    </>
  );
}

