import type { JsonValue } from "@prisma/client/runtime/library";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { PropertyAmenity, PropertyFeature } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { PropertyAmenities, PropertyFeatures } from "@reservatior/validators";

import type { Photo, Property } from "~/utils/interfaces";
import { useLanguage } from "~/context/LanguageContext";
import { toast } from "~/hooks/use-toast";
import { usePropertyStore } from "~/stores/usePropertyStore";
import { api } from "~/trpc/react";
import { toBackendLocation } from "~/utils/locationUtils";

// Remove unused code

interface PropertySidebarProps {
  selectedProperty: Property | null;
  editMode: boolean;
  editedProperty: Property | null;
  handleEdit: () => void;
  handleCancel: () => void;
  handleInputChange: <K extends keyof Property>(
    field: K,
    value: Property[K],
  ) => Promise<void>;
  closeSidebar: () => void;
  handleCloseSidebar: () => void;
  handleUpdateProperty: (updatedProperty: Partial<Property>) => Promise<void>;
}

const PropertySidebar: React.FC<PropertySidebarProps> = ({
  selectedProperty,
  editMode,
  editedProperty,
  handleEdit,
  handleCancel,
  handleInputChange,
}) => {
  const { t } = useLanguage();
  const utils = api.useUtils();
  const { updateProperty } = usePropertyStore();

  const updatePropertyMutation = api.property.update.useMutation({
    onSuccess: async (data) => {
      if (!data) return;

      // Filter features to ensure they match the PropertyFeatures enum
      const validFeatures = (data.features ?? []).filter(
        (f): f is PropertyFeatures =>
          typeof f === "string" && Object.values(PropertyFeatures).includes(f),
      );

      // Filter amenities to ensure they match the PropertyAmenities enum
      const validAmenities = (data.amenities ?? []).filter(
        (a): a is PropertyAmenity =>
          typeof a === "string" && Object.values(PropertyAmenities).includes(a),
      );

      // The API response doesn't include Location or Photo, so we need to preserve the existing data
      const partialProperty: Partial<Property> = {
        ...data,
        features: validFeatures,
        amenities: validAmenities,
        ownershipType: data.ownershipType,
        ownershipCategory: data.ownershipCategory,
        buildingClass: data.buildingClass,
        energyRating: data.energyRating,
        locationId: data.locationId,
        deletedAt: data.deletedAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      if (!partialProperty.id) {
        throw new Error("partialProperty.id is undefined");
      }

      await updateProperty(partialProperty.id, partialProperty);
      await utils.property.byId.invalidate({ id: data.id });
      toast.success(t("Property.toast.updateSuccess"));
      handleCancel();
    },
    onError: (error) => {
      console.error("Error updating property:", error);
      toast.error(t("Property.toast.updateError"));
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedProperty?.id) {
      toast.error(t("Property.sidebar.noSelected"));
      return;
    }

    if (!editedProperty?.size || editedProperty.bathrooms == null) {
      toast.error(t("Property.sidebar.sizeBathroomsRequired"));
      return;
    }

    setIsLoading(true);

    // Filter features to ensure they match the PropertyFeatures enum
    const validFeatures = (editedProperty.features ?? []).filter(
      (f): f is PropertyFeatures =>
        typeof f === "string" && Object.values(PropertyFeatures).includes(f),
    );

    // Filter amenities to ensure they match the PropertyAmenities enum
    const validAmenities = (editedProperty.amenities ?? []).filter(
      (a): a is PropertyAmenity =>
        typeof a === "string" && Object.values(PropertyAmenities).includes(a),
    );

    // Create a safe location object with proper typing
    const validLocation = editedProperty.Location
      ? {
          id: editedProperty.Location.id,
          address: editedProperty.Location.address,
          city: editedProperty.Location.city,
          country: editedProperty.Location.country,
          district: editedProperty.Location.district ?? undefined,
          postalCode: editedProperty.Location.postalCode ?? undefined,
          coordinates: (() => {
            if (!editedProperty.Location.coordinates) return undefined;
            try {
              const coords = editedProperty.Location.coordinates as {
                lat: number;
                lng: number;
              };
              return JSON.parse(
                JSON.stringify({ lat: coords.lat, lng: coords.lng }),
              );
            } catch {
              return undefined;
            }
          })(),
          createdAt: editedProperty.Location.createdAt,
          updatedAt: editedProperty.Location.updatedAt,
          deletedAt: editedProperty.Location.deletedAt ?? undefined,
        }
      : undefined;

    // Construct payload according to UpdatePropertyInput
    const mutationPayload: Parameters<
      typeof updatePropertyMutation.mutateAsync
    >[0] = {
      id: selectedProperty.id,
      title: editedProperty.title ?? undefined,
      description: editedProperty.description ?? undefined,
      locationId: editedProperty.locationId ?? undefined,
      Location: validLocation,

      size: editedProperty.size,
      yearBuilt: editedProperty.yearBuilt ?? undefined,
      category: editedProperty.category as any as
        | "APARTMENT"
        | "WAREHOUSE"
        | "FARM"
        | "HOUSE"
        | "VILLA"
        | "OFFICE"
        | "RETAIL"
        | "FACTORY"
        | "LAND_PLOT"
        | "SHOP"
        | "BUILDING"
        | undefined,
      propertyStatus: editedProperty.propertyStatus,
      propertyType: editedProperty.propertyType,
      condition: editedProperty.condition, // Property.condition is required, UpdatePropertyInput.condition is optional
      features: validFeatures,
      amenities: validAmenities,
      // listedAt is not on Property (editedProperty type) and not editable in this sidebar.
      // ownershipType and ownershipCategory are not in UpdatePropertySchema.
      ownerId: editedProperty.ownerId ?? undefined,
      agencyId: editedProperty.agencyId ?? undefined,
      buildingClass: (() => {
        const bc = editedProperty.buildingClass;
        if (!bc) return undefined;

        // Handle known building class values
        if (bc.startsWith("CLASS_")) {
          // Return the full class name as expected by the API
          if (
            bc === "CLASS_A" ||
            bc === "CLASS_B" ||
            bc === "CLASS_C" ||
            bc === "CLASS_D"
          ) {
            return bc;
          }
        } else if (bc === "LUXURY" || bc === "HISTORIC") {
          return bc;
        }

        return undefined;
      })(),
      deletedAt: editedProperty.deletedAt ?? undefined,
    };

    try {
      await updatePropertyMutation.mutateAsync(mutationPayload);
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error(
        t("Property.toast.saveError", {
          message:
            error instanceof Error ? error.message : t("Property.unknownError"),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProperty) return null;

  return (
    <aside
      className="w-96 overflow-y-auto rounded-l-3xl border-l bg-white p-6 shadow-lg"
      aria-label={t("Property.sidebar.details")}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">{t("Property.sidebar.details")}</h2>
        <div className="flex space-x-2">
          <Button onClick={handleEdit}>
            <Pencil size={16} />
            {t("Property.sidebar.edit")}
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            <X size={16} />
            {t("Property.sidebar.cancel")}
          </Button>
        </div>
      </div>

      <EditableField
        label={t("Property.sidebar.title")}
        value={editedProperty?.title ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("title", value)}
      />

      <EditableField
        label={t("Property.sidebar.description")}
        value={editedProperty?.description ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("description", value)}
      />

      <EditableField
        label={t("Property.sidebar.size")}
        value={editedProperty?.size?.toString() ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("size", parseFloat(value))}
      />

      <EditableField
        label={t("Property.sidebar.bathrooms")}
        value={
          editedProperty?.bathrooms != null
            ? editedProperty.bathrooms.toString()
            : ""
        }
        editMode={editMode}
        onChange={(value) => handleInputChange("bathrooms", parseInt(value))}
      />

      <Button
        onClick={handleSave}
        disabled={isLoading || !editMode}
        className="mt-4"
        aria-label={t("Property.sidebar.saveChanges")}
      >
        {isLoading
          ? t("Property.sidebar.saving")
          : t("Property.sidebar.saveChanges")}
      </Button>
    </aside>
  );
};

interface EditableFieldProps {
  label: string;
  value: string;
  editMode: boolean;
  onChange: (value: string) => void;
}

function EditableField({
  label,
  value,
  editMode,
  onChange,
}: EditableFieldProps) {
  return (
    <div className="mb-4">
      <h3 className="mb-1 font-medium text-gray-700">{label}</h3>
      {editMode ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 h-10 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm text-gray-900">{value || "N/A"}</p>
      )}
    </div>
  );
}

export default PropertySidebar;
