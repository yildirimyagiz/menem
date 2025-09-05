"use client";

import { format } from "date-fns";
import React, { useEffect, useState } from "react";

// Local minimal form shape for this modal
interface AdminPropertyCreateInput {
  title: string;
  description?: string;
  price?: number;
  listedAt?: Date;
}

import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";

import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

function usePropertyCreateMutationSafe(config?: unknown) {
  const client = api as unknown as {
    property: {
      create: {
        useMutation: (c?: unknown) => {
          mutateAsync: (input: AdminPropertyCreateInput) => Promise<unknown>;
        };
      };
    };
  };
  return client.property.create.useMutation(config);
}

function usePropertyUpdateMutationSafe(config?: unknown) {
  const client = api as unknown as {
    property: {
      update: {
        useMutation: (c?: unknown) => {
          mutateAsync: (input: Partial<AdminPropertyCreateInput> & { id: string }) => Promise<unknown>;
        };
      };
    };
  };
  return client.property.update.useMutation(config);
}

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property: (AdminPropertyCreateInput & { id?: string }) | null;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ isOpen, onClose, onSuccess, property }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdminPropertyCreateInput>({ title: "", description: "", price: undefined, listedAt: undefined });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (property) setFormData(property);
  }, [property]);

  const createMutation = usePropertyCreateMutationSafe({
    onSuccess: () => {
      toast({ title: "Success", description: "Property saved." });
      onSuccess();
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save property.", variant: "destructive" });
    },
  });

  const updateMutation = usePropertyUpdateMutationSafe({
    onSuccess: () => {
      toast({ title: "Success", description: "Property updated." });
      onSuccess();
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update property.", variant: "destructive" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (property?.id) {
        await updateMutation.mutateAsync({ ...formData, id: property.id });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{property?.id ? "Edit Property" : "New Property"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData((f: AdminPropertyCreateInput) => ({ ...f, title: e.target.value }))} required />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={formData.description ?? ""} onChange={(e) => setFormData((f: AdminPropertyCreateInput) => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input type="number" value={formData.price?.toString() ?? ""} onChange={(e) => setFormData((f: AdminPropertyCreateInput) => ({ ...f, price: e.target.value ? Number(e.target.value) : undefined }))} />
          </div>

          <div className="space-y-2">
            <Label>Listed At</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.listedAt && "text-muted-foreground")}> 
                  {formData.listedAt ? format(formData.listedAt, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={formData.listedAt} onSelect={(d) => setFormData((f: AdminPropertyCreateInput) => ({ ...f, listedAt: d }))} />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal;
