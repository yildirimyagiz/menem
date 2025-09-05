import { useCallback, useState } from "react";

import type { UpdatePropertyInput } from "@reservatior/validators";

import type { Property } from "~/utils/interfaces";
import { useLanguage } from "~/context/LanguageContext";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export function usePropertyManagement() {
  const { t } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [editMode, setEditMode] = useState(false);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  const utils = api.useUtils();

  const deleteMutation = api.property.delete.useMutation({
    onSuccess: () => {
      toast({ title: t("Property.toast.deleteSuccess") });
      void utils.property.all.invalidate();
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t("Property.toast.deleteError");
      setError(message);
      toast({ title: message, variant: "destructive" });
    },
  });

  const updateMutation = api.property.update.useMutation({
    onSuccess: () => {
      void utils.property.all.invalidate();
      toast({ title: t("Property.toast.updateSuccess") });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t("Property.toast.updateError");
      setError(message);
      toast({ title: message, variant: "destructive" });
    },
  });

  const handleViewDetails = useCallback((property: Property) => {
    setSelectedProperty(property);
    setEditedProperty(property);
    setEditMode(false);
  }, []);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm(t("Property.confirm.delete"))) {
        try {
          await deleteMutation.mutateAsync(id);
        } catch {
          // Error handling is done in mutation callbacks
        }
      }
    },
    [deleteMutation, t],
  );

  const handleCloseSidebar = useCallback(() => {
    setSelectedProperty(null);
    setEditMode(false);
    setEditedProperty(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setEditedProperty(null);
  }, []);

  const handlePropertyAdded = useCallback(() => {
    void utils.property.all.invalidate();
    toast({ title: t("Property.toast.addSuccess") });
  }, [t, utils.property.all]);

  const handleInputChange = useCallback(
    async <K extends keyof Property>(field: K, value: Property[K]) => {
      setEditedProperty((prev) => {
        if (!prev) return null;
        return { ...prev, [field]: value };
      });
      return Promise.resolve();
    },
    [],
  );

  const handleUpdateProperty = useCallback(
    async (updatedProperty: Partial<Property>) => {
      if (!selectedProperty) return;

      const allowedCategories = [
        "APARTMENT",
        "HOUSE",
        "VILLA",
        "OFFICE",
        "RETAIL",
        "WAREHOUSE",
        "FACTORY",
        "LAND_PLOT",
        "FARM",
        "SHOP",
        "BUILDING",
      ];
      const updateInput: UpdatePropertyInput = {
        id: selectedProperty.id,
        ...(typeof updatedProperty.locationId === "string"
          ? { locationId: updatedProperty.locationId }
          : {}),
        ...Object.fromEntries(
          Object.entries(updatedProperty)
            .filter(
              ([key, value]) =>
                (key !== "category" && key !== "locationId") ||
                (key === "category" &&
                  typeof value === "string" &&
                  allowedCategories.includes(value)),
            )
            .map(([key, value]) => [key, value ?? undefined]),
        ),
      };

      try {
        await updateMutation.mutateAsync(updateInput as any);
      } catch {
        // Error handling is done in mutation callbacks
      }
    },
    [selectedProperty?.id, t, updateMutation],
  );

  return {
    selectedProperty,
    setSelectedProperty,
    editMode,
    editedProperty,
    error,
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleCloseSidebar,
    handleCancel,
    handlePropertyAdded,
    handleInputChange,
    handleUpdateProperty,
  };
}
