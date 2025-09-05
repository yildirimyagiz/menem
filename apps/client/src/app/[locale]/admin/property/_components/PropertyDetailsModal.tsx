"use client";

import React from "react";
import { Calendar } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@reservatior/ui/dialog";
import { ScrollArea } from "@reservatior/ui/scroll-area";

interface PropertyDetailsModalProps {
  property: {
    title?: string | null;
    category?: string | null;
    propertyStatus?: string | null;
    price?: number | null;
    listedAt?: Date | string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
  };
  onClose: () => void;
}

export default function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
  const toDate = (v: unknown): string => {
    if (!v) return "-";
    const d = typeof v === "string" ? new Date(v) : (v as Date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Property Details</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4 hover:bg-muted" onClick={onClose}>
            ✕
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Title</div>
              <div className="text-base font-medium">{property.title ?? "-"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="text-base font-medium">{property.category ?? "-"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant="secondary">{property.propertyStatus ?? "-"}</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="text-base font-medium">{property.price ?? "-"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Listed At</div>
              <div className="text-base font-medium flex items-center gap-2"><Calendar className="h-4 w-4" />{toDate(property.listedAt)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="text-base font-medium">{toDate(property.createdAt)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Updated</div>
              <div className="text-base font-medium">{toDate(property.updatedAt)}</div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
