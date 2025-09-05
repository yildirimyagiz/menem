"use client";

import React, { useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface FacilityExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: any[]; // Replace with proper facility type
  onSuccess?: () => void;
}

export default function FacilityExportModal({
  isOpen,
  onClose,
  facilities,
  onSuccess,
}: FacilityExportModalProps) {
  const { toast } = useToast();
  const [fileName, setFileName] = useState("facilities-export");

  const handleExport = async () => {
    try {
      // TODO: Implement actual export logic
      toast({
        title: "Export successful",
        description: "Facilities have been exported successfully",
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export facilities",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Facilities</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="facilities-export"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
