"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import {
  BuildingOfficeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  GlobeAltIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";

import type { Gender, Guest } from "@reservatior/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Checkbox } from "@reservatior/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@reservatior/ui/tooltip";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

// Gender mapping
const genderMapping: Record<
  Gender,
  { label: string; icon: any; color: string }
> = {
  MALE: {
    label: "Male",
    icon: UserIcon,
    color: "text-blue-600 bg-blue-100",
  },
  FEMALE: {
    label: "Female",
    icon: UserIcon,
    color: "text-pink-600 bg-pink-100",
  },
};

// Type guard functions
const isGender = (value: unknown): value is Gender => {
  return typeof value === "string" && ["MALE", "FEMALE"].includes(value);
};

const isDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

// Columns definition for Guest table. Memoize in parent with React.useMemo for performance.
// To add a new column, add to this array. Use meta: { hidden: true } for hidden columns (e.g., for filtering only).
// Example usage in parent: const columns = React.useMemo(() => guestColumns, []);

export const columns: ColumnDef<Guest>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 dark:text-white">
        {row.getValue("name")}
      </span>
    ),
    enableHiding: true,
    enableSorting: true,
    meta: { hidden: true },
  },
  {
    id: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Guest" />
    ),
    cell: ({ row }) => {
      const guest = row.original;
      return (
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
            {guest.image ? (
              <AvatarImage src={guest.image} alt={guest.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {guest.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {guest.name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {guest.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <PhoneIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nationality" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <GlobeAltIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <Badge variant="outline" className="text-xs">
          {row.getValue("nationality")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "passportNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Passport" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <IdentificationIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">
          {row.getValue("passportNumber")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const genderValue = row.getValue("gender");
      if (!isGender(genderValue)) return null;

      const gender = genderMapping[genderValue];
      if (!gender) return null;

      const IconComponent = gender.icon;
      return (
        <Badge className={gender.color}>
          <IconComponent className="mr-1 h-3 w-3" />
          {gender.label}
        </Badge>
      );
    },
    filterFn: (row, id, value: Gender[]) => {
      const genderValue = row.getValue(id);
      return Boolean(isGender(genderValue) && value.includes(genderValue));
    },
  },
  {
    accessorKey: "birthDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Birth Date" />
    ),
    cell: ({ row }) => {
      const birthDate = row.getValue("birthDate");

      if (!isDate(birthDate)) {
        return (
          <span className="text-sm text-muted-foreground">Invalid date</span>
        );
      }

      const age = Math.floor(
        (new Date().getTime() - birthDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25),
      );

      return (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm">{birthDate.toLocaleDateString()}</span>
            <span className="text-xs text-muted-foreground">({age} years)</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const guest = row.original;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex max-w-[200px] flex-col">
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate text-sm">{guest.city}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {guest.country}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              {guest.address}, {guest.city}, {guest.country} {guest.zipCode}
            </p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "agencyId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agency" />
    ),
    cell: ({ row }) => {
      const guest = row.original;
      const agency = guest.Agency;

      return (
        <div className="flex items-center">
          <BuildingOfficeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{agency ? agency.name : "No Agency"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "reservations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reservations" />
    ),
    cell: ({ row }) => {
      const guest = row.original;
      const reservations = guest.Reservation || [];

      return (
        <div className="flex items-center">
          <CheckCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary" className="text-xs">
            {reservations.length} reservation
            {reservations.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");

      if (!isDate(createdAt)) {
        return (
          <span className="text-sm text-muted-foreground">Invalid date</span>
        );
      }

      return (
        <div className="flex items-center">
          <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {createdAt.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        labels={[
          { value: "view", label: "View Details" },
          { value: "edit", label: "Edit Guest" },
          { value: "delete", label: "Delete Guest" },
        ]}
      />
    ),
  },
];
