"use client";

import React from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const FacilityDeleteModal = ({
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
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteFacility = api.facility.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Facility deleted successfully",
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

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteFacility.mutateAsync({ id: facilityId });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete facility",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Facility</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this facility? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityDeleteModal;
