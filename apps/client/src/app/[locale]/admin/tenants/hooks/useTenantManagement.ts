import { useCallback, useState } from "react";

import type { Tenant, UpdateTenantInput } from "@reservatior/validators";

import { useLanguage } from "~/context/LanguageContext";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

// Narrow, safe wrappers to avoid TRPC error-typed collisions when accessing router properties
function useUtilsSafe() {
  const client = api as unknown as {
    useUtils: () => { tenant: { all: { invalidate: () => void | Promise<unknown> } } };
  };
  return client.useUtils();
}

function useTenantDeleteMutationSafe(config?: unknown) {
  const client = api as unknown as {
    tenant: { delete: { useMutation: (c?: unknown) => { mutateAsync: (input: { id: string }) => Promise<unknown> } } };
  };
  return client.tenant.delete.useMutation(config);
}

function useTenantUpdateMutationSafe(config?: unknown) {
  const client = api as unknown as {
    tenant: { update: { useMutation: (c?: unknown) => { mutateAsync: (input: Record<string, unknown>) => Promise<unknown> } } };
  };
  return client.tenant.update.useMutation(config);
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
}

export function useTenantManagement() {
  const { t } = useLanguage();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTenant, setEditedTenant] = useState<Tenant | null>(null);
  const [error, setError] = useState<string | null>(null);

  const utils = useUtilsSafe();

  const deleteMutation = useTenantDeleteMutationSafe({
    onSuccess: () => {
      toast({ title: t("Tenant.toast.deleteSuccess") });
      void utils.tenant.all.invalidate();
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, t("Tenant.toast.deleteError"));
      setError(message);
      toast({ title: message, variant: "destructive" });
    },
  });

  const updateMutation = useTenantUpdateMutationSafe({
    onSuccess: () => {
      void utils.tenant.all.invalidate();
      toast({ title: t("Tenant.toast.updateSuccess") });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error, t("Tenant.toast.updateError"));
      setError(message);
      toast({ title: message, variant: "destructive" });
    },
  });

  const handleViewDetails = useCallback((tenant: Tenant) => {
    setSelectedTenant(tenant);
    setEditedTenant(tenant);
    setEditMode(false);
  }, []);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm(t("Tenant.confirm.delete"))) {
        try {
          await deleteMutation.mutateAsync({ id });
        } catch {
          // Error handling is done in mutation callbacks
        }
      }
    },
    [deleteMutation, t],
  );

  const handleCloseSidebar = useCallback(() => {
    setSelectedTenant(null);
    setEditMode(false);
    setEditedTenant(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setEditedTenant(null);
  }, []);

  const handleTenantAdded = useCallback(() => {
    void utils.tenant.all.invalidate();
    toast({ title: t("Tenant.toast.addSuccess") });
  }, [t, utils.tenant.all]);

  const handleInputChange = useCallback(
    async <K extends keyof Tenant>(field: K, value: Tenant[K]) => {
      setEditedTenant((prev) => {
        if (!prev) return null;
        return { ...prev, [field]: value };
      });
      return Promise.resolve();
    },
    [],
  );

  const handleUpdateTenant = useCallback(
    async (updatedTenant: Partial<Tenant>) => {
      if (!selectedTenant?.id) {
        toast({
          title: t("Tenant.toast.noSelected"),
          variant: "destructive",
        });
        return;
      }

      // Convert the updated tenant to match UpdateTenantInput type
      const updateInput: UpdateTenantInput = {
        id: selectedTenant.id,
        paymentStatus: selectedTenant.paymentStatus,
        ...Object.fromEntries(
          Object.entries(updatedTenant).map(([key, value]) => [
            key,
            value === null ? undefined : value,
          ]),
        ),
      };

      try {
        await updateMutation.mutateAsync(updateInput);
      } catch {
        // Error handling is done in mutation callbacks
      }
    },
    [selectedTenant?.id, selectedTenant?.paymentStatus, updateMutation, t],
  );

  return {
    selectedTenant,
    setSelectedTenant,
    editMode,
    editedTenant,
    error,
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleCloseSidebar,
    handleCancel,
    handleTenantAdded,
    handleInputChange,
    handleUpdateTenant,
  };
}
