"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import type { Guest } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { GuestSchema } from "@reservatior/validators";

import { api } from "~/trpc/react";

interface DataTableRowActionsProps {
  row: Row<Guest>;
  labels: { value: string; label: string }[];
}

// Helper to safely convert to Date or null
function safeDate(val: any): Date | null {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

export function DataTableRowActions({ row, labels }: DataTableRowActionsProps) {
  const guestData = row.original;

  // Ensure guestData is defined and has the expected structure
  if (!guestData || typeof guestData !== "object") {
    console.error("Invalid guest data:", guestData);
    return null;
  }

  // Convert string dates to Date objects
  const formattedGuestData = {
    ...guestData,
    createdAt: safeDate(guestData.createdAt),
    updatedAt: safeDate(guestData.updatedAt),
    deletedAt: safeDate(guestData.deletedAt),
    birthDate: safeDate(guestData.birthDate),
  };

  // Validate the guest object
  const guestValidation = GuestSchema.safeParse(formattedGuestData);
  if (!guestValidation.success) {
    console.error("Guest validation failed:", guestValidation.error);
    console.error("Guest data for validation:", guestData);
    console.error("Formatted guest data:", formattedGuestData);
    return null;
  }

  const guestObject = guestValidation.data;

  // TRPC mutations
  const deleteGuestMutation = api.guest.delete.useMutation({
    onSuccess: () => {
      console.log("Guest deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting guest:", error);
    },
  });

  const handleDelete = async () => {
    try {
      if (guestObject.id) {
        await deleteGuestMutation.mutateAsync(guestObject.id);
      } else {
        console.error("Guest ID is undefined");
      }
    } catch (error) {
      console.error("Failed to delete guest:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => console.log("View guest:", guestObject.id)}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => console.log("Edit guest:", guestObject.id)}
        >
          Edit Guest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
