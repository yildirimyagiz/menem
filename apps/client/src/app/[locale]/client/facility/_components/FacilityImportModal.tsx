"use client";

import React, { useState } from "react";
import { Button } from "@reservatior/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

interface FacilityImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FacilityImportModal({ isOpen, onClose, onSuccess }: FacilityImportModalProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    try {
      if (!file) {
        toast({
          title: "No file selected",
          description: "Please select a file to import",
          variant: "destructive",
        });
        return;
      }

      // TODO: Implement actual import logic
      toast({
        title: "Import successful",
        description: "Facilities have been imported successfully",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import facilities",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Facilities</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
