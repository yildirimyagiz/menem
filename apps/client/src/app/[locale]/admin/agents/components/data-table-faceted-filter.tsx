"use client";

import type { Column } from "@tanstack/react-table";
import { Check, PlusCircle, X } from "lucide-react";
import * as React from "react";

import { cn } from "@reservatior/ui";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@reservatior/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";
import { Separator } from "@reservatior/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@reservatior/ui/tooltip";
import { useTranslations } from "next-intl";

interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  tooltip?: string;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  className?: string;
}

const DataTableFacetedFilter = <TData, TValue>({
  column,
  title,
  options,
  className,
}: DataTableFacetedFilterProps<TData, TValue>) => {
  const t = useTranslations();
  const facets = column?.getFacetedUniqueValues();
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(
    new Set(column?.getFilterValue() as string[]),
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (optionValue: string, isSelected: boolean) => {
      setSelectedValues((prev) => {
        const next = new Set(prev);
        if (isSelected) {
          next.delete(optionValue);
        } else {
          next.add(optionValue);
        }
        return next;
      });
    },
    [],
  );

  React.useEffect(() => {
    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  }, [selectedValues, column]);

  const clearFilters = React.useCallback(() => {
    setSelectedValues(new Set());
    column?.setFilterValue(undefined);
    setIsOpen(false);
  }, [column]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed",
            selectedValues.size > 0 && "border-primary",
            className,
          )}
          aria-label={t('Admin.agents.table.filterBy', { defaultValue: `Filter by ${title}` })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-4 w-4 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(option.value, true);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t('Admin.agents.table.filterPlaceholder', { defaultValue: `Search ${title}...` })} />
          <CommandList>
            <CommandEmpty>{t('Admin.agents.table.noResults', { defaultValue: 'No results found.' })}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const OptionContent = (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value, isSelected)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );

                return option.tooltip ? (
                  <Tooltip key={option.value}>
                    <TooltipTrigger asChild>{OptionContent}</TooltipTrigger>
                    <TooltipContent>{option.tooltip}</TooltipContent>
                  </Tooltip>
                ) : (
                  OptionContent
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearFilters}
                    className="justify-center text-center text-muted-foreground"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DataTableFacetedFilter;
