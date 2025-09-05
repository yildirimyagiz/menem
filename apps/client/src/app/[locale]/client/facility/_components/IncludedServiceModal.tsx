import React, { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";

import type {
  CreateIncludedServiceInput,
  IncludedService,
  UpdateIncludedServiceInput,
} from "../types";
import { api } from "~/trpc/react";

interface IncludedServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: IncludedService | null;
  facilityId?: string;
}

const IncludedServiceModal: React.FC<IncludedServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  facilityId,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description ?? "");
    } else {
      setName("");
      setDescription("");
    }
    setError(null);
  }, [initialData, isOpen]);

  const createMutation = api.includedService.create.useMutation();
  const updateMutation = api.includedService.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          name,
          description,
          facilityId: facilityId || initialData.facilityId,
        } as UpdateIncludedServiceInput);
      } else {
        await createMutation.mutateAsync({
          name,
          description,
          facilityId,
        } as CreateIncludedServiceInput);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save included service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Included Service" : "Add Included Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncludedServiceModal;
