import React, { useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@reservatior/ui/dialog";

import { api } from "~/trpc/react";

interface ProviderDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string;
}

const ProviderDeleteModal: React.FC<ProviderDeleteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  providerId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deleteMutation = api.providerService.delete.useMutation();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteMutation.mutateAsync(providerId);
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as { message?: string })?.message ?? "Failed to delete provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Provider</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Are you sure you want to delete this provider? This action cannot be
          undone.
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderDeleteModal;
