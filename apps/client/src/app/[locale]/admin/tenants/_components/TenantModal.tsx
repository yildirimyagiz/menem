"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";

import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { Tenant } from "@reservatior/validators";

// Align with backend enum to accept values coming from validators (e.g., REFUNDED, CANCELLED, PENDING)
type PaymentStatus = Tenant["paymentStatus"];

interface TenantEditable {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  property?: { id: string } | null;
  leaseStartDate: string | Date;
  leaseEndDate: string | Date;
  paymentStatus: PaymentStatus;
}

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenant?: TenantEditable | null;
}

// Safe tRPC wrappers to avoid error-typed API collisions
function usePropertyAllQuerySafe(params: { page: number; pageSize: number }, opts: { enabled: boolean }) {
  const client = api as unknown as {
    property: {
      all: {
        useQuery: (
          p: { page: number; pageSize: number },
          o: { enabled: boolean },
        ) => { data?: { data?: { id: string; title?: string | null; address?: string | null }[] } };
      };
    };
  };
  return client.property.all.useQuery(params, opts);
}

function useTenantCreateMutationSafe(handlers: {
  onSuccess: () => void;
  onError: (err: unknown) => void;
}) {
  const client = api as unknown as {
    tenant: {
      create: {
        useMutation: (
          h: { onSuccess: () => void; onError: (e: unknown) => void },
        ) => { mutateAsync: (input: Record<string, unknown>) => Promise<unknown> };
      };
    };
  };
  return client.tenant.create.useMutation(handlers);
}

function useTenantUpdateMutationSafe(handlers: {
  onSuccess: () => void;
  onError: (err: unknown) => void;
}) {
  const client = api as unknown as {
    tenant: {
      update: {
        useMutation: (
          h: { onSuccess: () => void; onError: (e: unknown) => void },
        ) => { mutateAsync: (input: Record<string, unknown>) => Promise<unknown> };
      };
    };
  };
  return client.tenant.update.useMutation(handlers);
}

const TenantModal: React.FC<TenantModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  tenant,
}) => {
  const { toast } = useToast();

  interface FormDataState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    propertyId: string;
    leaseStartDate: Date;
    leaseEndDate: Date;
    paymentStatus: PaymentStatus;
  }
  const [formData, setFormData] = useState<FormDataState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    propertyId: "",
    leaseStartDate: new Date(),
    leaseEndDate: new Date(),
    paymentStatus: "PAID",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get properties for the property selector
  const { data: properties } = usePropertyAllQuerySafe(
    { page: 1, pageSize: 100 },
    { enabled: isOpen },
  );

  const createTenantMutation = useTenantCreateMutationSafe({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tenant created successfully.",
      });
      onSuccess();
      onClose();
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      toast({
        title: "Error",
        description: msg ?? "Failed to create tenant.",
        variant: "destructive",
      });
    },
  });

  const updateTenantMutation = useTenantUpdateMutationSafe({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tenant updated successfully.",
      });
      onSuccess();
      onClose();
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error);
      toast({
        title: "Error",
        description: msg ?? "Failed to update tenant.",
        variant: "destructive",
      });
    },
  });

  function getErrorMessage(err: unknown): string | undefined {
    if (typeof err === "string") return err;
    if (err && typeof err === "object") {
      const maybe = (err as { message?: unknown }).message;
      if (typeof maybe === "string") return maybe;
    }
    return undefined;
  }

  useEffect(() => {
    if (tenant) {
      setFormData({
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email,
        phoneNumber: tenant.phoneNumber ?? "",
        propertyId: tenant.property?.id ?? "",
        leaseStartDate: new Date(tenant.leaseStartDate),
        leaseEndDate: new Date(tenant.leaseEndDate),
        paymentStatus: tenant.paymentStatus,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        propertyId: "",
        leaseStartDate: new Date(),
        leaseEndDate: new Date(),
        paymentStatus: "PAID",
      });
    }
  }, [tenant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (tenant) {
        // Update existing tenant
        if (!tenant.id) {
          toast({ title: "Error", description: "Missing tenant id", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        await updateTenantMutation.mutateAsync({ id: tenant.id, ...formData });
      } else {
        // Create new tenant
        await createTenantMutation.mutateAsync({ ...formData, userId: "temp-user-id" });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = <K extends keyof FormDataState>(
    field: K,
    value: FormDataState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.propertyId &&
      formData.leaseStartDate &&
      formData.leaseEndDate &&
      formData.leaseEndDate > formData.leaseStartDate
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {tenant ? "Edit Tenant" : "Add New Tenant"}
              </DialogTitle>
              <DialogDescription>
                {tenant
                  ? "Update tenant information and lease details"
                  : "Create a new tenant with their information and lease details"}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter phone number"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Property */}
            <div className="space-y-2">
              <Label htmlFor="propertyId" className="text-sm font-medium">
                Property *
              </Label>
              <Select
                value={formData.propertyId}
                onValueChange={(value) =>
                  handleInputChange("propertyId", value)
                }
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.data?.map((property) => (
                    <SelectItem key={`property-${property.id}`} value={property.id}>
                      {property.title ?? property.address ?? property.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-sm font-medium">
                Payment Status
              </Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange("paymentStatus", value as PaymentStatus)}
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lease Start Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Lease Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-blue-500",
                      !formData.leaseStartDate && "text-muted-foreground",
                    )}
                  >
                    {formData.leaseStartDate ? (
                      format(formData.leaseStartDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.leaseStartDate}
                    onSelect={(date) =>
                      date && handleInputChange("leaseStartDate", date)
                    }
                    disabled={(date) =>
                      date < new Date("1900-01-01") ||
                      (formData.leaseEndDate && date > formData.leaseEndDate)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Lease End Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Lease End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-blue-500",
                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                      !formData.leaseEndDate && "text-muted-foreground",
                    )}
                  >
                    {formData.leaseEndDate ? (
                      format(formData.leaseEndDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.leaseEndDate}
                    onSelect={(date) =>
                      date && handleInputChange("leaseEndDate", date)
                    }
                    disabled={(date) =>
                      date < new Date("1900-01-01") ||
                      date <= formData.leaseStartDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isSubmitting
                ? "Saving..."
                : tenant
                  ? "Update Tenant"
                  : "Create Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantModal;
