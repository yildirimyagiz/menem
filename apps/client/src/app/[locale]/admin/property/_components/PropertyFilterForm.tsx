"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
import { Card, CardContent } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@reservatior/ui/select";

import { cn } from "~/lib/utils";

// Local minimal filter shape for this form
interface AdminPropertyFilterInput {
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "price";
  sortOrder?: "asc" | "desc";
  listedAtFrom?: Date;
  listedAtTo?: Date;
  page?: number;
  pageSize?: number;
}

interface PropertyFilterFormProps {
  currentFilter: AdminPropertyFilterInput;
  onFilter: (filter: AdminPropertyFilterInput) => void;
}

const PropertyFilterForm: React.FC<PropertyFilterFormProps> = ({ currentFilter, onFilter }) => {
  const [localFilter, setLocalFilter] = useState<AdminPropertyFilterInput>(currentFilter);

  useEffect(() => setLocalFilter(currentFilter), [currentFilter]);

  const handleChange = <K extends keyof AdminPropertyFilterInput>(key: K, value: AdminPropertyFilterInput[K]) => {
    const f = { ...localFilter, [key]: value, page: 1 };
    setLocalFilter(f);
    onFilter(f);
  };

  const clear = () => {
    const cleared: AdminPropertyFilterInput = { page: 1, pageSize: 10, sortBy: "createdAt", sortOrder: "desc" };
    setLocalFilter(cleared);
    onFilter(cleared);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="grid grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by title..."
            value={localFilter.search ?? ""}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select
            value={localFilter.sortBy ?? "createdAt"}
            onValueChange={(v) => handleChange("sortBy", v as "createdAt" | "updatedAt" | "price")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="updatedAt">Updated</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Select
            value={localFilter.sortOrder ?? "desc"}
            onValueChange={(v) => handleChange("sortOrder", v as "asc" | "desc")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Listed From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start", !localFilter.listedAtFrom && "text-muted-foreground")}> 
                {localFilter.listedAtFrom ? format(localFilter.listedAtFrom, "PPP") : (
                  <span className="inline-flex items-center"><CalendarIcon className="mr-2 h-4 w-4" />Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localFilter.listedAtFrom}
                onSelect={(d) => handleChange("listedAtFrom", d ?? undefined)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Listed To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start", !localFilter.listedAtTo && "text-muted-foreground")}> 
                {localFilter.listedAtTo ? format(localFilter.listedAtTo, "PPP") : (
                  <span className="inline-flex items-center"><CalendarIcon className="mr-2 h-4 w-4" />Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localFilter.listedAtTo}
                onSelect={(d) => handleChange("listedAtTo", d ?? undefined)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-span-full flex items-center gap-2 pt-2">
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFilterForm;
