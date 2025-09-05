"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@reservatior/ui/form";
import { Input } from "@reservatior/ui/input";
import { Textarea } from "@reservatior/ui/textarea";

import type {
  CreateExtraChargeInput,
  ExtraCharge,
  UpdateExtraChargeInput,
} from "../types";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface ExtraChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ExtraCharge | null;
  facilityId?: string;
}

const ExtraChargeModal: React.FC<ExtraChargeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  facilityId,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form setup
  const form = useForm<CreateExtraChargeInput>({
    defaultValues: {
      name: "",
      description: "",
      facilityId: facilityId ?? "",
    },
  });

  // Mutations
  const createMutation = api.extraCharge.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Extra charge created successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = api.extraCharge.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Extra charge updated successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          description: initialData.description ?? "",
          facilityId: facilityId ?? initialData.facilityId ?? "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
          facilityId: facilityId ?? "",
        });
      }
    }
  }, [isOpen, initialData, facilityId, form]);

  const onSubmit = async (data: CreateExtraChargeInput) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          ...data,
          id: initialData.id,
        } as UpdateExtraChargeInput);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error saving extra charge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Extra Charge" : "Add New Extra Charge"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter charge name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter charge description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExtraChargeModal;
