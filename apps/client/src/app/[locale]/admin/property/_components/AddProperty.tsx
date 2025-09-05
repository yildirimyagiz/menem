"use client";

import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
interface AdminPropertyCreateInput {
  title: string;
  description?: string;
}

import { api } from "~/trpc/react";

function useTRPCUtilsSafe() {
  const client = api as unknown as { useUtils: () => { property: { all: { invalidate: () => Promise<void> } } } };
  return client.useUtils();
}

function usePropertyCreateMutationSafe(handlers: { onSuccess: () => void | Promise<void>; onError: (err: unknown) => void }) {
  const client = api as unknown as { property: { create: { useMutation: (h: { onSuccess: () => void | Promise<void>; onError: (e: unknown) => void }) => { mutate: (input: AdminPropertyCreateInput) => void; isPending: boolean } } } };
  const m = client.property.create.useMutation(handlers);
  return { mutate: m.mutate, isPending: m.isPending };
}

interface AddPropertyProps { onClose: () => void; onAdded: () => void; }

const AddProperty: React.FC<AddPropertyProps> = ({ onClose, onAdded }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<AdminPropertyCreateInput>({ title: "", description: "" });
  const utils = useTRPCUtilsSafe();
  const createProperty = usePropertyCreateMutationSafe({
    onSuccess: async () => { await utils.property.all.invalidate(); onAdded(); onClose(); },
    onError: () => { /* toast can be wired if needed */ },
  });

  useEffect(() => { modalRef.current?.focus(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof AdminPropertyCreateInput;
    setFormData((prev: AdminPropertyCreateInput) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); createProperty.mutate(formData); };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true" className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Property</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="add-property-title">Title *</label>
            <Input id="add-property-title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="add-property-description">Description</label>
            <Input id="add-property-description" name="description" value={formData.description ?? ""} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </div>
    </>
  );
};

export default AddProperty;
