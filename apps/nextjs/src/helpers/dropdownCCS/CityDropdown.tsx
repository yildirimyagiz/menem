// src/components/ui/CityDropdown.tsx
import React, { useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@acme/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

interface CityDropdownProps {
  state: string | undefined;
  onChange: (city: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const CityDropdown: React.FC<CityDropdownProps> = ({
  state,
  onChange,
  defaultValue,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    defaultValue,
  );
  const [cities, setCities] = useState<string[]>([]); // Replace with actual city data

  useEffect(() => {
    if (state) {
      // Demo: Replace with actual API or utility for real data
      // Example: setCities(fetchCitiesByState(state));
      const stateCities: Record<string, string[]> = {
        California: ["Los Angeles", "San Francisco", "San Diego"],
        Texas: ["Houston", "Dallas", "Austin"],
        Ontario: ["Toronto", "Ottawa", "Mississauga"],
        "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
        Maharashtra: ["Mumbai", "Pune", "Nagpur"],
      };
      setCities(stateCities[state] ?? []);
      setSelectedCity(undefined); // Reset selected city if state changes
    } else {
      setCities([]);
      setSelectedCity(undefined);
    }
    // TODO: Integrate with real city API for production
  }, [state]);

  const handleSelect = (city: string) => {
    setSelectedCity(city);
    onChange(city);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="...">
        {" "}
        {/* Add your trigger styles here */}
        {selectedCity ?? "Select a city"}
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandList>
            {cities.map((city, index) => (
              <CommandItem key={index} onSelect={() => handleSelect(city)}>
                {city}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CityDropdown;
