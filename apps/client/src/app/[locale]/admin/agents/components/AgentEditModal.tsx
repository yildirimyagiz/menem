"use client";

import type { z } from "zod";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";
import { AgentStatusEnum } from "@reservatior/validators";

import { api } from "~/trpc/react";

// Type for status
type AgentStatusType = z.infer<typeof AgentStatusEnum>;

interface AgentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onSuccess: () => void;
}

export default function AgentEditModal({
  isOpen,
  onClose,
  agentId,
  onSuccess,
}: AgentEditModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    website: string;
    logoUrl: string;
    status: AgentStatusType;
    agencyId: string;
    isActive: boolean;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    website: "",
    logoUrl: "",
    status: "PENDING",
    agencyId: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch agent data
  const { data: agentResponse, isLoading: isLoadingAgent } =
    api.agent.byId.useQuery({ id: agentId }, { enabled: isOpen && !!agentId });

  const updateMutation = api.agent.update.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      setSubmitError(error.message);
    },
  });

  useEffect(() => {
    if (agentResponse?.data) {
      const agent = agentResponse.data;
      setFormData({
        name: agent.name || "",
        email: agent.email ?? "",
        phoneNumber: agent.phoneNumber ?? "",
        address: agent.address ?? "",
        website: agent.website ?? "",
        logoUrl: agent.logoUrl ?? "",
        status: agent.status || "PENDING",
        agencyId: agent.agencyId ?? "",
        isActive: agent.status === "ACTIVE",
      });
    }
  }, [agentResponse]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      errs.email = "Invalid email address.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    updateMutation.mutate({
      id: agentId,
      ...formData,
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const isFormValid = !Object.keys(validate()).length;

  if (isLoadingAgent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>Loading agent data...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Update the agent information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} aria-label="Edit Agent Form">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                ref={nameInputRef}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                required
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </div>
            {errors.name && (
              <div className="col-span-4 text-xs text-red-500" id="name-error">
                {errors.name}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="col-span-3"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <div className="col-span-4 text-xs text-red-500" id="email-error">
                {errors.email}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logoUrl" className="text-right">
                Logo URL
              </Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AgentStatusEnum.options.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agencyId" className="text-right">
                Agency ID
              </Label>
              <Input
                id="agencyId"
                value={formData.agencyId}
                onChange={(e) => handleInputChange("agencyId", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <Select
                value={formData.isActive ? "true" : "false"}
                onValueChange={(value) =>
                  handleInputChange("isActive", value === "true")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {submitError && (
            <div className="mb-2 text-xs text-red-500">{submitError}</div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isFormValid}
              aria-label="Update Agent"
            >
              {updateMutation.isPending ? "Updating..." : "Update Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
