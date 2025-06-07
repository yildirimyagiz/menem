import type { z } from "zod";
import React, { useState } from "react";
import { Pencil, X } from "lucide-react";

import type { BuildingClass, Location, Property } from "@acme/validators";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { PropertyAmenities, PropertyFeatures } from "@acme/validators";

import { toast } from "~/hooks/use-toast";
import { usePropertyStore } from "~/stores/usePropertyStore";
import { api } from "~/trpc/react";

interface LatLng {
  lat: number;
  lng: number;
}
function isLatLng(val: unknown): val is LatLng {
  return (
    typeof val === "object" &&
    val !== null &&
    typeof (val as any).lat === "number" &&
    typeof (val as any).lng === "number"
  );
}

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

// Helper to normalize Location object
function normalizeLocation(
  loc: Location | null | undefined,
): Location | undefined {
  if (!loc || typeof loc.id !== "string" || !loc.id) return undefined;
  // Ensure the returned object conforms to the Location type,
  // especially handling potential nulls from DB if schema expects undefined.
  return {
    ...loc,
    id: loc.id, // guaranteed string
    deletedAt: loc.deletedAt === null ? undefined : loc.deletedAt,
    district: loc.district === null ? undefined : loc.district,
    postalCode: loc.postalCode === null ? undefined : loc.postalCode,
    // Handle potentially malformed coordinates data
    coordinates:
      typeof loc.coordinates === "object" &&
      loc.coordinates !== null &&
      typeof (loc.coordinates as any).lat === "number" &&
      typeof (loc.coordinates as any).lng === "number"
        ? loc.coordinates
        : undefined,
  };
}

const PropertySidebar: React.FC<PropertySidebarProps> = ({
  selectedProperty,
  editMode,
  editedProperty,
  handleEdit,
  handleCancel,
  handleInputChange,
}) => {
  const utils = api.useUtils();
  const { updateProperty } = usePropertyStore();
  type InferredPropertyFeature = z.infer<typeof PropertyFeatures>;
  type InferredPropertyAmenity = z.infer<typeof PropertyAmenities>;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const updatePropertyMutation = api.property.update.useMutation({
    onSuccess: async (data) => {
      if (!data) return;

      const validFeatures: InferredPropertyFeature[] = Array.isArray(
        data.features,
      )
        ? (data.features.filter((f) =>
            (PropertyFeatures.options as readonly string[]).includes(
              f as string,
            ),
          ) as InferredPropertyFeature[])
        : [];

      const validAmenities: InferredPropertyAmenity[] = Array.isArray(
        data.amenities,
      )
        ? (data.amenities.filter((a) =>
            (PropertyAmenities.options as readonly string[]).includes(
              a as string,
            ),
          ) as InferredPropertyAmenity[])
        : [];
      const validLocation = data.Location
        ? normalizeLocation({
            ...data.Location,
            deletedAt: data.Location.deletedAt ?? undefined,
            district: data.Location.district ?? undefined,
            postalCode: data.Location.postalCode ?? undefined,
            coordinates:
              typeof data.Location.coordinates === "object" &&
              data.Location.coordinates !== null &&
              "lat" in data.Location.coordinates &&
              "lng" in data.Location.coordinates
                ? (data.Location.coordinates as { lat: number; lng: number })
                : undefined,
          })
        : undefined;

      const normalizedPhoto = (data.Photo ?? []).map((photo: any) => ({
        ...photo,
        deletedAt: photo.deletedAt === null ? undefined : photo.deletedAt,
      }));

      const partialProperty: Partial<Property> = {
        ...data,
        features: validFeatures,
        amenities: validAmenities,
        Location: validLocation,
        // PropertySchema.ownershipType is a required enum. If TS infers data.ownershipType as nullable,
        // this handles it, though ideally, the inferred type of `data.ownershipType` should not include null.
        ownershipType:
          data.ownershipType === null ? undefined : data.ownershipType,
        ownershipCategory:
          data.ownershipCategory === null ? undefined : data.ownershipCategory,
        // Map backend buildingClass (e.g., 'CLASS_A') to frontend ('A'), if needed
        buildingClass:
          typeof data.buildingClass === "string" &&
          data.buildingClass.startsWith("CLASS_")
            ? (data.buildingClass.replace("CLASS_", "") as z.infer<
                typeof BuildingClass
              >)
            : (data.buildingClass as z.infer<typeof BuildingClass> | undefined),
        energyRating:
          data.energyRating === null ? undefined : data.energyRating,
        locationId: data.locationId === null ? undefined : data.locationId, // Ensure never null
        deletedAt: data.deletedAt === null ? undefined : data.deletedAt, // Map null to undefined
        Photo: normalizedPhoto,
      };
           if (!partialProperty.id) {
        throw new Error("partialProperty.id is undefined");
      }
      await updateProperty(partialProperty.id, partialProperty);
      await utils.property.byId.invalidate({ id: data.id });
      toast.success("Property updated successfully!");
      handleCancel();
    },
    onError: (error) => {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedProperty?.id) {
      toast.error("Selected property or property ID is undefined");
      return;
    }

    if (!editedProperty?.size || editedProperty.bathrooms == null) {
      toast.error("Size and bathrooms are required fields.");
      return;
    }

    setIsLoading(true);

    const validFeatures: InferredPropertyFeature[] = Array.isArray(
      editedProperty.features,
    )
      ? editedProperty.features.filter((f: any): f is InferredPropertyFeature =>
          (
            PropertyFeatures.options as readonly InferredPropertyFeature[]
          ).includes(f),
        )
      : [];
    const validAmenities: InferredPropertyAmenity[] = Array.isArray(
      editedProperty.amenities,
    )
      ? editedProperty.amenities.filter(
          (a: any): a is InferredPropertyAmenity =>
            (
              PropertyAmenities.options as readonly InferredPropertyAmenity[]
            ).includes(a),
        )
      : [];
    const validLocation = normalizeLocation(editedProperty.Location);

    // Construct payload strictly according to UpdatePropertyInput
    const mutationPayload: import("@acme/validators").UpdatePropertyInput = {
      id: selectedProperty.id,
      title: editedProperty.title ?? undefined,
      description: editedProperty.description ?? undefined,
      locationId:
        editedProperty.locationId === null
          ? undefined
          : editedProperty.locationId,
      Location: validLocation,

      size: editedProperty.size,
      yearBuilt:
        editedProperty.yearBuilt === null
          ? undefined
          : editedProperty.yearBuilt,
      category: editedProperty.category,
      status: editedProperty.propertyStatus,
      propertyType: editedProperty.propertyType,
      condition: editedProperty.condition, // Property.condition is required, UpdatePropertyInput.condition is optional
      features: validFeatures,
      amenities: validAmenities,
      // listedAt is not on Property (editedProperty type) and not editable in this sidebar.
      // ownershipType and ownershipCategory are not in UpdatePropertySchema.
      ownerId:
        editedProperty.ownerId === null ? undefined : editedProperty.ownerId,
      agencyId:
        editedProperty.agencyId === null ? undefined : editedProperty.agencyId,
      buildingClass: editedProperty.buildingClass, // Property.buildingClass is already BuildingClass | undefined
      deletedAt:
        editedProperty.deletedAt === null
          ? undefined
          : editedProperty.deletedAt,
    };

    try {
      await updatePropertyMutation.mutateAsync(mutationPayload);
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error(
        `Failed to save property: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProperty) return null;

  return (
    <aside
      className="w-96 overflow-y-auto rounded-l-3xl border-l bg-white p-6 shadow-lg"
      aria-label="Property details"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Property Details</h2>
        <div className="flex space-x-2">
          <Button onClick={handleEdit}>
            <Pencil size={16} />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            <X size={16} />
            Cancel
          </Button>
        </div>
      </div>

      <EditableField
        label="Title"
        value={editedProperty?.title ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("title", value)}
      />

      <EditableField
        label="Description"
        value={editedProperty?.description ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("description", value)}
      />

      <EditableField
        label="Size"
        value={editedProperty?.size.toString() ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("size", parseFloat(value))}
      />

      <EditableField
        label="Bathrooms"
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
        aria-label="Save Changes"
      >
        {isLoading ? "Saving..." : "Save Changes"}
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
