"use client";

import type { Table } from "@tanstack/react-table";
import React, { useState } from "react";
import { Settings2 } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

import GuestModal from "./GuestModal";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [isNewGuestModalOpen, setNewGuestModalOpen] = useState(false);

  const handleOpenNewGuestModal = () => {
    setNewGuestModalOpen(true);
  };

  const handleCloseNewGuestModal = () => {
    setNewGuestModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 className="h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New Guest Button */}
      <Button
        variant="outline"
        size="sm"
        className="ml-2 lg:flex"
        onClick={handleOpenNewGuestModal}
      >
        New Guest
      </Button>

      {/* New Guest Modal */}
      <GuestModal
        isOpen={isNewGuestModalOpen}
        onClose={handleCloseNewGuestModal}
        mode="create"
      />
    </>
  );
}
