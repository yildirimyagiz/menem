"use client";

import type { Table } from "@tanstack/react-table";
import React, { useState } from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Settings2 } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@reservatior/ui/dropdown-menu";

import NewTaskModal from "./NewTaskModal"; // Adjust the import path as necessary

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false); // State to manage modal visibility

  const handleOpenNewTaskModal = () => {
    setNewTaskModalOpen(true); // Open the New Task modal
  };

  const handleCloseNewTaskModal = () => {
    setNewTaskModalOpen(false); // Close the New Task modal
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
            <Settings2 />
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

      {/* New Task Button */}
      <Button
        variant="outline" // Adjusted the variant to a valid option
        size="sm"
        className="ml-2 lg:flex"
        onClick={handleOpenNewTaskModal} // Open the New Task modal on click
      >
        New Task
      </Button>

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={handleCloseNewTaskModal}
      />
    </>
  );
}
