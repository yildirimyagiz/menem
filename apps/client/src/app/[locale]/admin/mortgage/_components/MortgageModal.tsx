"use client";

import type { ChangeEvent, FormEvent } from "react";
import React, { useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Textarea } from "@reservatior/ui/textarea";

import { api } from "~/trpc/react";

interface MortgageModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  mortgage?: any;
  onSaved?: () => void;
  properties: { id: string; name: string }[];
}

export function MortgageModal({
  isOpen,
  onClose,
  mode,
  mortgage,
  onSaved,
  properties,
}: MortgageModalProps) {
  const [form, setForm] = useState(
    () =>
      mortgage ?? {
        lender: "",
        principal: 0,
        interestRate: 0,
        startDate: "",
        endDate: "",
        status: "ACTIVE",
        notes: "",
        propertyId: properties?.[0]?.id || "",
      },
  );
  const [error, setError] = useState("");

  const createMutation = api.mortgage.create.useMutation();
  const updateMutation = api.mortgage.update.useMutation();

  const isLoading =
    createMutation.status === "pending" || updateMutation.status === "pending";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "edit") {
        await updateMutation.mutateAsync({ ...form, id: mortgage.id });
      } else {
        await createMutation.mutateAsync(form);
      }
      onSaved?.();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to save mortgage");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Mortgage" : "Add Mortgage"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Lender</label>
            <Input
              name="lender"
              value={form.lender}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Principal</label>
            <Input
              name="principal"
              type="number"
              value={form.principal}
              onChange={handleChange}
              required
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Interest Rate (%)
            </label>
            <Input
              name="interestRate"
              type="number"
              value={form.interestRate}
              onChange={handleChange}
              required
              min={0}
              step={0.01}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <Input
              name="startDate"
              type="date"
              value={form.startDate?.slice(0, 10) ?? ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <Input
              name="endDate"
              type="date"
              value={form.endDate?.slice(0, 10) ?? ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded border px-2 py-1"
              title="Status"
            >
              <option value="ACTIVE">Active</option>
              <option value="PAID">Paid</option>
              <option value="DEFAULTED">Defaulted</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Property</label>
            <select
              name="propertyId"
              value={form.propertyId}
              onChange={handleChange}
              className="w-full rounded border px-2 py-1"
              title="Property"
            >
              {properties?.map((p: { id: string; name: string }) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <Textarea name="notes" value={form.notes} onChange={handleChange} />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <span className="mr-2 animate-spin">⏳</span>}
              {mode === "edit" ? "Save Changes" : "Add Mortgage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
