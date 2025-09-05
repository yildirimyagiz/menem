"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { FacilityType, UpdateFacilitySchema } from "@reservatior/validators";

import type { FacilityFormValues } from "../types";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const FacilityEditModal = ({
  isOpen,
  onClose,
  onSuccess,
  facilityId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  facilityId: string;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const facility = api.facility.byId.useQuery({ id: facilityId });
  const updateFacility = api.facility.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Facility updated successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(UpdateFacilitySchema),
    defaultValues: {
      name: "",
      description: "",
      type: "RESIDENTIAL",
      status: "ACTIVE",
      facilityAmenities: [],
      locationAmenities: [],
    },
  });

  useEffect(() => {
    if (facility.data) {
      form.reset({
        ...facility.data,
        description: facility.data.description ?? undefined,
        icon: facility.data.icon ?? undefined,
        logo: facility.data.logo ?? undefined,
        locationId: facility.data.locationId ?? undefined,
        type: facility.data.type,
        status: facility.data.status,
      });
    }
  }, [facility.data, form]);

  const onSubmit = async (data: FacilityFormValues) => {
    try {
      setIsLoading(true);
      await updateFacility.mutateAsync({
        id: facilityId,
        ...data,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update facility",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (facility.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Facility</DialogTitle>
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    >
                      {Object.values(FacilityType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityEditModal;
