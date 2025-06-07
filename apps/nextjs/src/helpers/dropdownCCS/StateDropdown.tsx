// src/components/ui/StateDropdown.tsx
import React, { useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@acme/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

interface StateDropdownProps {
  country: string | undefined; // Adjusted to accept country name or code
  onChange: (state: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const StateDropdown: React.FC<StateDropdownProps> = ({
  country,
  onChange,
  defaultValue,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | undefined>(
    defaultValue,
  );
  const [states, setStates] = useState<string[]>([]); // Replace with actual state data

  useEffect(() => {
    if (country) {
      // Fetch states based on the selected country
      // Example: setStates(fetchStatesByCountry(country));
      setStates(["State 1", "State 2"]); // Replace with actual state fetching logic
    }
  }, [country]);

  const handleSelect = (state: string) => {
    setSelectedState(state);
    onChange(state);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="...">
        {" "}
        {/* Add your trigger styles here */}
        {selectedState ?? "Select a state"}
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search state..." />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandList>
            {states.map((state, index) => (
              <CommandItem key={index} onSelect={() => handleSelect(state)}>
                {state}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StateDropdown;
