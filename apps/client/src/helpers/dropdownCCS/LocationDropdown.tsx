// src/components/ui/LocationDropdowns.tsx
import React, { useState } from "react";

import type { Country } from "./CountryDropdown";
import CityDropdown from "./CityDropdown";
import { CountryDropdown } from "./CountryDropdown"; // Adjusted the import path as necessary
import StateDropdown from "./StateDropdown";

const LocationDropdowns: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined,
  );
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined,
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined,
  );

  return (
    <div>
      <CountryDropdown onChange={setSelectedCountry} />
      <StateDropdown
        country={selectedCountry?.alpha2}
        onChange={setSelectedState}
      />
      <CityDropdown state={selectedState} onChange={setSelectedCity} />
    </div>
  );
};

export default LocationDropdowns;
