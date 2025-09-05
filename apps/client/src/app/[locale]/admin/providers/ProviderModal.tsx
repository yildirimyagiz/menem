import React, { useEffect, useState } from "react";

import type { Provider } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { BookingSourceEnum } from "@reservatior/validators";

import { api } from "~/trpc/react";

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Provider | null;
}

const ProviderModal: React.FC<ProviderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [name, setName] = useState("");
  const enumValues = (BookingSourceEnum.options ??
    BookingSourceEnum._def.values) as string[];
  const [source, setSource] = useState<
    (typeof BookingSourceEnum.Enum)[keyof typeof BookingSourceEnum.Enum]
  >(
    enumValues[0] as (typeof BookingSourceEnum.Enum)[keyof typeof BookingSourceEnum.Enum],
  );
  const [commission, setCommission] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSource(
        initialData.source ||
          (enumValues[0] as (typeof BookingSourceEnum.Enum)[keyof typeof BookingSourceEnum.Enum]),
      );
      setCommission(initialData.commission?.toString() || "");
      setIsActive(initialData.isActive ?? true);
      setApiKey(initialData.apiKey || "");
      setApiSecret(initialData.apiSecret || "");
      setBaseUrl(initialData.baseUrl || "");
    } else {
      setName("");
      setSource(
        enumValues[0] as (typeof BookingSourceEnum.Enum)[keyof typeof BookingSourceEnum.Enum],
      );
      setCommission("");
      setIsActive(true);
      setApiKey("");
      setApiSecret("");
      setBaseUrl("");
    }
    setError(null);
  }, [initialData, isOpen]);

  const createMutation = api.providerService.create.useMutation();
const updateMutation = api.providerService.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          name,
          source,
          commission: parseFloat(commission),
          isActive,
          apiKey,
          apiSecret,
          baseUrl,
        });
      } else {
        await createMutation.mutateAsync({
          name,
          source,
          commission: parseFloat(commission),
          isActive,
          apiKey,
          apiSecret,
          baseUrl,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Provider" : "Add Provider"}
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
            <label className="mb-1 block text-sm font-medium">Source</label>
            <select
              className="w-full rounded border px-2 py-1"
              value={source}
              onChange={(e) =>
                setSource(
                  e.target
                    .value as (typeof BookingSourceEnum.Enum)[keyof typeof BookingSourceEnum.Enum],
                )
              }
              required
              title="Provider source"
            >
              {enumValues.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Commission (%)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              id="isActive"
            />
            <label htmlFor="isActive">Active</label>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">API Key</label>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">API Secret</label>
            <Input
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Base URL</label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
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

export default ProviderModal;
