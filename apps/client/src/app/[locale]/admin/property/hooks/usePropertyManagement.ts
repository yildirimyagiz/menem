"use client";

import { useCallback, useState } from "react";

import type { AdminPropertyCreateInput } from "@reservatior/validators";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

function usePropertyDeleteMutationSafe(config?: unknown) {
  const client = api as unknown as { property: { delete: { useMutation: (c?: unknown) => { mutateAsync: (input: { id: string }) => Promise<unknown> } } } };
  return client.property.delete.useMutation(config);
}

function usePropertyUpdateMutationSafe(config?: unknown) {
  const client = api as unknown as { property: { update: { useMutation: (c?: unknown) => { mutateAsync: (input: Partial<AdminPropertyCreateInput> & { id: string }) => Promise<unknown> } } } };
  return client.property.update.useMutation(config);
}

export function usePropertyManagement() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<AdminPropertyCreateInput | null>(null);
  const deleteMutation = usePropertyDeleteMutationSafe({
    onSuccess: () => toast({ title: "Deleted", description: "Property deleted." }),
    onError: () => toast({ title: "Error", description: "Delete failed.", variant: "destructive" }),
  });
  const updateMutation = usePropertyUpdateMutationSafe({
    onSuccess: () => toast({ title: "Updated", description: "Property updated." }),
    onError: () => toast({ title: "Error", description: "Update failed.", variant: "destructive" }),
  });

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
    } catch {}
  }, [deleteMutation]);

  const handleUpdate = useCallback(async (p: Partial<AdminPropertyCreateInput> & { id: string }) => {
    try {
      await updateMutation.mutateAsync(p);
    } catch {}
  }, [updateMutation]);

  return { selected, setSelected, handleDelete, handleUpdate };
}
