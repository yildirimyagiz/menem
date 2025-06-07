"use client";

import type { z } from "zod";
import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { X } from "lucide-react";

import type {
  CreatePricingRuleInput,
  CreatePropertyInput,
} from "@acme/validators";
// adjust path if needed
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import {
  PropertyAmenities,
  PropertyCategory,
  PropertyCondition,
  PropertyFeatures,
  PropertyStatus,
  PropertyType,
} from "@acme/validators";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const AddProperty: React.FC<{
  onClose: () => void;
  onPropertyAdded: () => void;
}> = ({ onClose, onPropertyAdded }) => {
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
    pricingRules: [],

    size: 100,
    yearBuilt: 2000,
    category: PropertyCategory.options[0],
    propertyStatus: PropertyStatus.options[0],
    propertyType: PropertyType.options[0],
    condition: undefined,
    features: [] as z.infer<typeof PropertyFeatures>[],
    amenities: [] as z.infer<typeof PropertyAmenities>[],
    createdAt: new Date(),
    updatedAt: new Date(),

    ownerId: undefined,
    agencyId: undefined,
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

  const utils = api.useUtils();

  const createProperty = api.property.create.useMutation({
    onSuccess: async () => {
      await utils.property.all.invalidate();
      toast.success("Property created successfully!");
      onPropertyAdded();
      resetForm();
      setTimeout(onClose, 2000);
    },
    onError: (err) => {
      console.error("Error creating property:", err);
      toast.error("Failed to create property");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      locationId: "",

      size: 100,
      yearBuilt: 2000,
      category: PropertyCategory.options[0],
      propertyStatus: PropertyStatus.options[0],
      propertyType: PropertyType.options[0],
      condition: undefined,
      features: [],
      amenities: [],
      createdAt: new Date(),
      updatedAt: new Date(),

      ownerId: undefined,
      agencyId: undefined,
      pricingRules: [],
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
        return { ...prev, [field]: [...arr, value] };
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
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
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
          key === "agencyId" ||
          key === "condition") // Handle optional strings and enums
      ) {
        processedValue = undefined;
      }

      return { ...prev, [key]: processedValue };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createProperty.mutate({
      ...formData,
      features: Array.isArray(formData.features)
        ? formData.features.filter((f) =>
            (PropertyFeatures.options as readonly string[]).includes(
              f as string,
            ),
          )
        : [],
      amenities: Array.isArray(formData.amenities)
        ? formData.amenities.filter((a) =>
            (PropertyAmenities.options as readonly string[]).includes(
              a as string,
            ),
          )
        : [],
      // Assuming formData.pricingRules now correctly holds CreatePricingRuleInput[]
      // with basePrice as number due to changes in how pricingRuleDraft is handled.
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-8 shadow-2xl focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">
              Add a New Property
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Fill out the form below to add a new property to your listings.
              All required fields are marked with{" "}
              <span className="text-red-500">*</span>.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close add property form"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="add-property-title"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="add-property-title"
            name="title"
            placeholder="e.g. Modern Family Home"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="rounded-md border p-2"
          />

          <textarea
            name="description"
            placeholder="Describe the property, its unique features, location, and any other details buyers should know."
            value={formData.description ?? ""}
            onChange={handleInputChange}
            className="w-full rounded-md border p-2"
            rows={4}
          />

          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="add-property-locationId"
          >
            Location ID
          </label>
          <Input
            id="add-property-locationId"
            name="locationId"
            placeholder="Location ID (if known)"
            value={formData.locationId ?? ""}
            onChange={handleInputChange}
            className="rounded-md border p-2"
          />

          <div className="grid grid-cols-3 gap-4">
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-property-price"
            >
              Price
            </label>
            <Input
              id="add-property-price"
              name="price"
              type="number"
              placeholder="Price (USD)"
              value={formData.pricingRules?.[0]?.basePrice ?? ""}
              onChange={handleInputChange}
              className="rounded-md border p-2"
              min={0}
            />

            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-property-size"
            >
              Size
            </label>
            <Input
              id="add-property-size"
              name="size"
              type="number"
              placeholder="Size (sq ft)"
              value={formData.size ?? ""}
              onChange={handleInputChange}
              className="rounded-md border p-2"
              min={0}
            />

            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-property-yearBuilt"
            >
              Year Built
            </label>
            <Input
              id="add-property-yearBuilt"
              name="yearBuilt"
              type="number"
              placeholder="Year Built"
              value={formData.yearBuilt ?? ""}
              onChange={handleInputChange}
              className="rounded-md border p-2"
              min={1800}
              max={new Date().getFullYear()}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {PropertyCategory.options.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.propertyStatus}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
              >
                <option value="" disabled>
                  Select status
                </option>
                {PropertyStatus.options.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
              >
                <option value="" disabled>
                  Select property type
                </option>
                {PropertyType.options.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition ?? ""}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
              >
                <option value="">Select condition (optional)</option>
                {PropertyCondition.options.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-property-listedAt"
            >
              Listed At
            </label>
            <Input
              id="add-property-listedAt"
              name="listedAt"
              type="date"
              value={
                formData.createdAt instanceof Date
                  ? formData.createdAt.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
              className="rounded-md border p-2"
            />
          </div>

          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="add-property-ownerId"
          >
            Owner ID
          </label>
          <Input
            id="add-property-ownerId"
            name="ownerId"
            placeholder="Owner ID (if known)"
            value={formData.ownerId ?? ""}
            onChange={handleInputChange}
            className="rounded-md border p-2"
          />

          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="add-property-agencyId"
          >
            Agency ID
          </label>
          <Input
            id="add-property-agencyId"
            name="agencyId"
            placeholder="Agency ID (if known)"
            value={formData.agencyId ?? ""}
            onChange={handleInputChange}
            className="rounded-md border p-2"
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Features{" "}
              <span className="text-gray-400">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PropertyFeatures.options.map((feature) => (
                <label key={feature} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="features"
                    value={feature}
                    checked={formData.features?.includes(feature)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCheckboxArray(e, "features")
                    }
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Amenities{" "}
              <span className="text-gray-400">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PropertyAmenities.options.map((amenity) => (
                <label key={amenity} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities?.includes(amenity)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCheckboxArray(e, "amenities")
                    }
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Pricing Rules Section */}
          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 text-lg font-semibold text-blue-700">
              Pricing Rules
            </h3>
            {formData.pricingRules && formData.pricingRules.length > 0 && (
              <ul className="mb-2">
                {formData.pricingRules.map(
                  (rule: CreatePricingRuleInput, idx) => (
                    <li key={idx} className="mb-1 flex items-center gap-2">
                      <span className="font-medium">{rule.name}</span>
                      <span className="text-gray-500">${rule.basePrice}</span>
                      <span className="text-gray-500">{rule.currencyId}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            pricingRules: prev.pricingRules?.filter(
                              (_, i) => i !== idx,
                            ),
                          }));
                        }}
                        aria-label="Remove pricing rule"
                      >
                        Remove
                      </button>
                    </li>
                  ),
                )}
              </ul>
            )}
            <div className="mb-2 flex gap-2">
              <Input
                name="pricingRuleName"
                placeholder="Rule name"
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
                placeholder="Base price"
                value={pricingRuleDraft.basePrice} // This is now a string
                onChange={(e) =>
                  setPricingRuleDraft((draft) => ({
                    ...draft,
                    basePrice: e.target.value, // Store as string
                  }))
                }
                className="w-32"
                min={0}
              />
              <Input
                name="pricingRuleCurrencyId"
                placeholder="Currency ID"
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
                    pricingRuleDraft.basePrice !== "" && // Check string is not empty
                    pricingRuleDraft.currencyId
                  ) {
                    // Ensure newRule conforms to CreatePricingRuleInput.
                    // All fields of CreatePricingRuleInput must be satisfied.
                    const newRule: CreatePricingRuleInput = {
                      name: pricingRuleDraft.name,
                      basePrice: Number(pricingRuleDraft.basePrice), // Convert to number
                      currencyId: pricingRuleDraft.currencyId,
                      isActive: false,
                      propertyId: "",
                      strategy: "FIXED",
                      minNights: 0,
                      maxNights: 0,
                    };
                    setFormData((prev) => ({
                      ...prev,
                      pricingRules: [
                        ...((prev.pricingRules ?? []) as CreatePricingRuleInput[]),
                        _.cloneDeep(newRule),
                      ],
                    }));
                    setPricingRuleDraft({
                      name: "",
                      basePrice: "",
                      currencyId: "",
                    }); // Reset with string basePrice
                  }
                }}
                disabled={
                  !pricingRuleDraft.name ||
                  pricingRuleDraft.basePrice === "" || // Check string is not empty for disable
                  !pricingRuleDraft.currencyId
                }
              >
                Add Rule
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            variant="link"
            size="sm"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={createProperty.isPending}
            aria-busy={createProperty.isPending}
          >
            {createProperty.isPending ? "Adding Property..." : "Add Property"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddProperty;
