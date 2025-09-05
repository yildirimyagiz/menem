"use client";

import {
  PropertyAmenities,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@prisma/client";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import type {
  CreatePricingRuleInput,
  CreatePropertyInput,
} from "@reservatior/validators";

import { useLanguage } from "~/context/LanguageContext";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

// Narrowed helper types to bridge tRPC typing collisions
type CategoryValue = CreatePropertyInput["category"];

function useTRPCUtilsSafe() {
  const client = api as unknown as {
    useUtils: () => { property: { all: { invalidate: () => Promise<void> } } };
  };
  return client.useUtils();
}

function usePropertyCreateMutationSafe(handlers: {
  onSuccess: () => void | Promise<void>;
  onError: (err: unknown) => void;
}) {
  const client = api as unknown as {
    property: {
      create: {
        useMutation: (
          h: { onSuccess: () => void | Promise<void>; onError: (err: unknown) => void },
        ) => { mutate: (input: CreatePropertyInput) => void; isPending: boolean };
      };
    };
  };
  const m = client.property.create.useMutation(handlers);
  return { mutate: m.mutate, isPending: m.isPending };
}

// Enum value arrays for dropdowns/checkboxes
// Use validator-backed categories expected by CreatePropertyInput
const propertyCategoryOptions: CategoryValue[] = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "LAND",
  "INDUSTRIAL",
  "OTHER",
];
const propertyStatusOptions = Object.values(PropertyStatus) as PropertyStatus[];
const propertyTypeOptions = Object.values(PropertyType) as PropertyType[];
const propertyConditionOptions = Object.values(
  PropertyCondition,
) as PropertyCondition[];
const propertyFeaturesOptions = Object.values(
  PropertyFeatures,
) as PropertyFeatures[];
const propertyAmenitiesOptions = Object.values(
  PropertyAmenities,
) as PropertyAmenities[];

const AddProperty: React.FC<{
  onClose: () => void;
  onPropertyAdded: () => void;
}> = ({ onClose, onPropertyAdded }) => {
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
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
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

  const [formData, setFormData] = useState<CreatePropertyInput>({
    title: "",
    description: "",
    locationId: "",
    PricingRules: [] as CreatePricingRuleInput[],
    size: 100,
    yearBuilt: 2000,
    category: propertyCategoryOptions[0] ?? "OTHER",
    propertyStatus: propertyStatusOptions[0] ?? PropertyStatus.AVAILABLE,
    propertyType: propertyTypeOptions[0] ?? PropertyType.APARTMENT,
    condition: propertyConditionOptions[0] ?? PropertyCondition.EXCELLENT,
    features: [] as PropertyFeatures[],
    amenities: [] as PropertyAmenities[],
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: undefined,
    agencyId: undefined,
  });

  // Location form data
  const [locationData, setLocationData] = useState({
    address: "",
    city: "",
    country: "",
    postalCode: "",
    coordinates: { lat: 0, lng: 0 },
  });

  // Pricing Rule draft state for new rule
  const [pricingRuleDraft, setPricingRuleDraft] = useState<{
    name: string;
    basePrice: string;
    currencyId: string;
  }>({
    name: "",
    basePrice: "",
    currencyId: "",
  });

  const utils = useTRPCUtilsSafe();

  const createProperty = usePropertyCreateMutationSafe({
    onSuccess: async () => {
      await utils.property.all.invalidate();
      toast.success(t("Property.success.created"));
      onPropertyAdded();
      resetForm();
      setTimeout(onClose, 2000);
    },
    onError: (err: unknown) => {
      console.error("Error creating property:", err);
      toast.error(t("Property.error.create"));
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      locationId: "",
      PricingRules: [] as CreatePricingRuleInput[],
      size: 100,
      yearBuilt: 2000,
      category: propertyCategoryOptions[0] ?? "OTHER",
      propertyStatus: propertyStatusOptions[0] ?? PropertyStatus.AVAILABLE,
      propertyType: propertyTypeOptions[0] ?? PropertyType.APARTMENT,
      condition: propertyConditionOptions[0] ?? PropertyCondition.EXCELLENT,
      features: [] as PropertyFeatures[],
      amenities: [] as PropertyAmenities[],
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: undefined,
      agencyId: undefined,
    });
    setLocationData({
      address: "",
      city: "",
      country: "",
      postalCode: "",
      coordinates: { lat: 0, lng: 0 },
    });
    setPricingRuleDraft({ name: "", basePrice: "", currencyId: "" });
  };

  const handleCheckboxArray = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "features" | "amenities",
  ) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const arr = prev[field] ?? [];
      if (checked) {
        return {
          ...prev,
          [field]: [
            ...arr,
            field === "features"
              ? (value as PropertyFeatures)
              : (value as PropertyAmenities),
          ],
        };
      } else {
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      }
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const key = name as keyof CreatePropertyInput;

    setFormData((prev) => {
      let processedValue: string | number | Date | undefined = value;

      if (type === "number") {
        processedValue = value === "" ? undefined : Number(value);
      } else if (type === "date") {
        processedValue = value === "" ? undefined : new Date(value);
      } else if (
        value === "" &&
        (key === "description" ||
          key === "locationId" ||
          key === "ownerId" ||
          key === "agencyId")
      ) {
        processedValue = undefined;
      }

      return { ...prev, [key]: processedValue };
    });
  };

  const handleLocationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const key = name.split(".")[1] as keyof typeof locationData;

    setLocationData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createProperty.mutate({
      ...formData,
      // formData.category is already constrained by our options
      category: formData.category,
      features: Array.isArray(formData.features)
        ? (formData.features.filter((f) =>
            propertyFeaturesOptions.includes(f as PropertyFeatures),
          ) as PropertyFeatures[])
        : [],
      amenities: Array.isArray(formData.amenities)
        ? (formData.amenities.filter((a) =>
            propertyAmenitiesOptions.includes(a as PropertyAmenities),
          ) as PropertyAmenities[])
        : [],
    });
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
        aria-label={t("Property.addProperty")}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-8 shadow-2xl focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold text-blue-800"
              id="add-property-title-heading"
            >
              {t("Property.addProperty")}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t("Property.addPropertyDescription")}{" "}
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

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-title"
              >
                {t("Property.fields.title")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-property-title"
                name="title"
                placeholder={t("Property.placeholders.title")}
                value={formData.title}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-category"
              >
                {t("Property.fields.category")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="add-property-category"
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as CategoryValue,
                  }))
                }
                className="w-full rounded-md border p-2"
                required
                title={t("Property.fields.category")}
              >
                <option value="" disabled>
                  {t("Property.selectCategory")}
                </option>
                {propertyCategoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`Property.category.${cat}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-property-description"
            >
              {t("Property.fields.description")}
            </label>
            <textarea
              id="add-property-description"
              name="description"
              placeholder={t("Property.placeholders.description")}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-md border p-2"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-status"
              >
                {t("Property.fields.status")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="add-property-status"
                name="propertyStatus"
                value={formData.propertyStatus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    propertyStatus: e.target.value as PropertyStatus,
                  }))
                }
                className="w-full rounded-md border p-2"
                required
                title={t("Property.fields.status")}
              >
                <option value="" disabled>
                  {t("Property.selectStatus")}
                </option>
                {propertyStatusOptions.map((stat) => (
                  <option key={stat} value={stat}>
                    {t(`Property.status.${stat}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-type"
              >
                {t("Property.fields.propertyType")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="add-property-type"
                name="propertyType"
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    propertyType: e.target.value as PropertyType,
                  }))
                }
                className="w-full rounded-md border p-2"
                required
                title={t("Property.fields.propertyType")}
              >
                <option value="" disabled>
                  {t("Property.selectType")}
                </option>
                {propertyTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {t(`Property.type.${type}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-condition"
              >
                {t("Property.fields.condition")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="add-property-condition"
                name="condition"
                value={formData.condition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condition: e.target.value as PropertyCondition,
                  }))
                }
                className="w-full rounded-md border p-2"
                required
                title={t("Property.fields.condition")}
              >
                <option value="" disabled>
                  {t("Property.selectCondition")}
                </option>
                {propertyConditionOptions.map((cond) => (
                  <option key={cond} value={cond}>
                    {t(`Property.condition.${cond}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-size"
              >
                {t("Property.fields.size")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-property-size"
                name="size"
                type="number"
                placeholder={t("Property.placeholders.size")}
                value={formData.size}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-yearBuilt"
              >
                {t("Property.fields.yearBuilt")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-property-yearBuilt"
                name="yearBuilt"
                type="number"
                placeholder={t("Property.placeholders.yearBuilt")}
                value={formData.yearBuilt}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
                min={1800}
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-ownerId"
              >
                {t("Property.fields.ownerId")}
              </label>
              <Input
                id="add-property-ownerId"
                name="ownerId"
                placeholder={t("Property.placeholders.ownerId")}
                value={formData.ownerId ?? ""}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-agencyId"
              >
                {t("Property.fields.agencyId")}
              </label>
              <Input
                id="add-property-agencyId"
                name="agencyId"
                placeholder={t("Property.placeholders.agencyId")}
                value={formData.agencyId ?? ""}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-property-locationId"
              >
                {t("Property.fields.locationId")}
              </label>
              <Input
                id="add-property-locationId"
                name="locationId"
                placeholder={t("Property.placeholders.locationId")}
                value={formData.locationId ?? ""}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {t("Property.sections.locationInfo")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="add-property-address"
                >
                  {t("Property.fields.address")}
                </label>
                <Input
                  id="add-property-address"
                  name="location.address"
                  placeholder={t("Property.placeholders.address")}
                  value={locationData.address}
                  onChange={handleLocationChange}
                  className="rounded-md border p-2"
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="add-property-city"
                >
                  {t("Property.fields.city")}
                </label>
                <Input
                  id="add-property-city"
                  name="location.city"
                  placeholder={t("Property.placeholders.city")}
                  value={locationData.city}
                  onChange={handleLocationChange}
                  className="rounded-md border p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="add-property-country"
                >
                  {t("Property.fields.country")}
                </label>
                <Input
                  id="add-property-country"
                  name="location.country"
                  placeholder={t("Property.placeholders.country")}
                  value={locationData.country}
                  onChange={handleLocationChange}
                  className="rounded-md border p-2"
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="add-property-postalCode"
                >
                  {t("Property.fields.postalCode")}
                </label>
                <Input
                  id="add-property-postalCode"
                  name="location.postalCode"
                  placeholder={t("Property.placeholders.postalCode")}
                  value={locationData.postalCode}
                  onChange={handleLocationChange}
                  className="rounded-md border p-2"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t("Property.fields.features")}{" "}
              <span className="text-gray-400">
                ({t("Property.selectAllThatApply")})
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {propertyFeaturesOptions.map((feature) => (
                <label key={feature} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="features"
                    value={feature}
                    checked={formData.features?.includes(feature)}
                    onChange={(e) => handleCheckboxArray(e, "features")}
                  />
                  {t(`Property.features.${feature}`)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t("Property.fields.amenities")}{" "}
              <span className="text-gray-400">
                ({t("Property.selectAllThatApply")})
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {propertyAmenitiesOptions.map((amenity) => (
                <label key={amenity} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities?.includes(amenity)}
                    onChange={(e) => handleCheckboxArray(e, "amenities")}
                  />
                  {t(`Property.amenities.${amenity}`)}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 text-lg font-semibold text-blue-700">
              {t("Property.pricingRules")}
            </h3>
            {formData.PricingRules && formData.PricingRules.length > 0 && (
              <ul className="mb-2">
                {formData.PricingRules.map(
                  (rule: CreatePricingRuleInput, idx) => (
                    <li key={idx} className="mb-1 flex items-center gap-2">
                      <span className="font-medium">{rule.name}</span>
                      <span className="text-gray-500">${rule.basePrice}</span>
                      <span className="text-gray-500">{rule.currencyId}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => {
                          setFormData((prev: CreatePropertyInput) => ({
                            ...prev,
                            PricingRules: prev.PricingRules?.filter(
                              (_, i) => i !== idx,
                            ),
                          }));
                        }}
                        aria-label={t("Property.removePricingRule")}
                      >
                        {t("common.remove")}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            )}
            <div className="mb-2 flex gap-2">
              <Input
                name="pricingRuleName"
                placeholder={t("Property.placeholders.pricingRuleName")}
                value={pricingRuleDraft.name}
                onChange={(e) =>
                  setPricingRuleDraft((draft) => ({
                    ...draft,
                    name: e.target.value,
                  }))
                }
                className="flex-1"
              />
              <Input
                name="pricingRuleBasePrice"
                type="number"
                placeholder={t("Property.placeholders.basePrice")}
                value={pricingRuleDraft.basePrice}
                onChange={(e) =>
                  setPricingRuleDraft((draft) => ({
                    ...draft,
                    basePrice: e.target.value,
                  }))
                }
                className="w-32"
                min={0}
              />
              <Input
                name="pricingRuleCurrencyId"
                placeholder={t("Property.placeholders.currencyId")}
                value={pricingRuleDraft.currencyId}
                onChange={(e) =>
                  setPricingRuleDraft((draft) => ({
                    ...draft,
                    currencyId: e.target.value,
                  }))
                }
                className="w-32"
              />
              <Button
                type="button"
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  if (
                    pricingRuleDraft.name &&
                    pricingRuleDraft.basePrice !== "" &&
                    pricingRuleDraft.currencyId
                  ) {
                    const newRule: CreatePricingRuleInput = {
                      name: pricingRuleDraft.name,
                      basePrice: Number(pricingRuleDraft.basePrice),
                      currencyId: pricingRuleDraft.currencyId,
                      isActive: true,
                      propertyId: "",
                      strategy: "FIXED",
                      minNights: 0,
                      maxNights: 0,
                    };
                    setFormData((prev: CreatePropertyInput) => ({
                      ...prev,
                      PricingRules: [
                        ...((prev.PricingRules ?? []) as CreatePricingRuleInput[]),
                        newRule,
                      ],
                    }));
                    setPricingRuleDraft({ name: "", basePrice: "", currencyId: "" });
                  }
                }}
                disabled={
                  !pricingRuleDraft.name ||
                  pricingRuleDraft.basePrice === "" ||
                  !pricingRuleDraft.currencyId
                }
              >
                {t("Property.addRule")}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <Button
              type="submit"
              variant="link"
              size="sm"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={createProperty.isPending}
              aria-busy={createProperty.isPending}
            >
              {createProperty.isPending
                ? t("Property.addingProperty")
                : t("Property.addProperty")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProperty;
