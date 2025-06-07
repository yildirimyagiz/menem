"use client";

import { useTranslations } from "next-intl";

import Checkbox from "~/shared/Checkbox";

interface LocationFilterProps {
  locations: string[];
  onChange: (selectedLocations: string[]) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locations,
  onChange,
}) => {
  const t = useTranslations();

  const LOCATIONS = [
    {
      name: "CityCenter",
      label: t("CITY_CENTER"),
      description: t("CITY_CENTER_DESC"),
    },
    {
      name: "School",
      label: t("SCHOOL"),
      description: t("SCHOOL_DESC"),
    },
    {
      name: "PoliceStation",
      label: t("POLICE_STATION"),
      description: t("POLICE_STATION_DESC"),
    },
    {
      name: "FireStation",
      label: t("FIRE_STATION"),
      description: t("FIRE_STATION_DESC"),
    },
    {
      name: "Park",
      label: t("PARK"),
      description: t("PARK_DESC"),
    },
    {
      name: "Mosque",
      label: t("MOSQUE"),
      description: t("MOSQUE_DESC"),
    },
    {
      name: "Church",
      label: t("CHURCH"),
      description: t("CHURCH_DESC"),
    },
    {
      name: "Sinagog",
      label: t("SYNAGOGUE"),
      description: t("SYNAGOGUE_DESC"),
    },
    {
      name: "Hospital",
      label: t("HOSPITAL"),
      description: t("HOSPITAL_DESC"),
    },
    {
      name: "Pharmacy",
      label: t("PHARMACY"),
      description: t("PHARMACY_DESC"),
    },
    {
      name: "Market",
      label: t("MARKET"),
      description: t("MARKET_DESC"),
    },
    {
      name: "DryCenter",
      label: t("DRY_CLEANING"),
      description: t("DRY_CLEANING_DESC"),
    },
  ];

  const handleCheckboxChange = (location: string) => {
    const updatedLocations = locations.includes(location)
      ? locations.filter((item) => item !== location)
      : [...locations, location];
    onChange(updatedLocations);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {LOCATIONS.map((location) => (
        <Checkbox
          key={location.name}
          name={location.name}
          label={location.label}
          subLabel={location.description}
          checked={locations.includes(location.name)}
          onChange={() => handleCheckboxChange(location.name)}
        />
      ))}
    </div>
  );
};

export default LocationFilter;
