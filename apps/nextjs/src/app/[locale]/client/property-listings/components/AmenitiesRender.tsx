"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import Checkbox from "~/shared/Checkbox";

type AmenityType = "property" | "location" | "facility";
type AmenitiesRecord = Record<`${AmenityType}Amenities`, string[]>;

interface SectionState {
  property: boolean;
  location: boolean;
  facility: boolean;
}

interface RenderTabsAmenitiesProps {
  amenities: AmenitiesRecord;
  onAmenitiesChange: (type: AmenityType, amenities: string[]) => void;
  disabled?: boolean;
  maxSelections?: number;
  initialOpen?: boolean;
  onClose?: () => void;
}

const RenderTabsAmenities: React.FC<RenderTabsAmenitiesProps> = ({
  amenities,
  onAmenitiesChange,
  disabled = false,
  maxSelections,
  initialOpen = false,
  onClose,
}) => {
  // Direct translation mapping to avoid any prefixes
  const translate = (key: string) => {
    // Map keys directly without any prefixes
    const translations: Record<string, string> = {
      amenities: "Amenities",
      max: "Max",
      selectAll: "Select All",
      clear: "Clear",
      apply: "Apply",
      selected: "selected",
      propertyAmenities: "Property Amenities",
      locationAmenities: "Location Amenities",
      facilityAmenities: "Facility Amenities",
      // Amenity names
      wifi: "Wifi",
      parking: "Parking",
      airConditioning: "Air Conditioning",
      heating: "Heating",
      washer: "Washer",
      dryer: "Dryer",
      balcony: "Balcony",
      fireplace: "Fireplace",
      hairDryer: "Hair Dryer",
      elevator: "Elevator",
      cityCenter: "City Center",
      school: "School",
      policeStation: "Police Station",
      fireStation: "Fire Station",
      park: "Park",
      mosque: "Mosque",
      church: "Church",
      synagogue: "Synagogue",
      hospital: "Hospital",
      pharmacy: "Pharmacy",
      market: "Market",
      dryCleaners: "Dry Cleaning",
      security: "Security",
      gym: "Gym",
      pool: "Pool",
      tvSmart: "Smart TV",
      cctvCamera: "CCTV Camera",
      virtualReality: "Virtual Reality",
    };
    return translations[key] ?? key;
  };
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [tempAmenities, setTempAmenities] =
    useState<AmenitiesRecord>(amenities);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<SectionState>({
    property: true,
    location: false,
    facility: false,
  });

  const AMENITIES: Record<
    AmenityType,
    { name: string; label: string; description?: string }[]
  > = {
    property: [
      {
        name: "wifi",
        label: "Wifi",
        description: "High-speed wireless internet",
      },
      {
        name: "parking",
        label: "Parking",
        description: "Available parking space",
      },
      {
        name: "airConditioning",
        label: "Air Conditioning",
        description: "Climate control system",
      },
      {
        name: "heating",
        label: "Heating",
        description: "Central heating system",
      },
      {
        name: "washer",
        label: "Washer",
        description: "Washing machine",
      },
      {
        name: "dryer",
        label: "Dryer",
        description: "Clothes dryer",
      },
      {
        name: "balcony",
        label: "Balcony",
        description: "Private outdoor space",
      },
      {
        name: "fireplace",
        label: "Fireplace",
        description: "Indoor fireplace",
      },
      {
        name: "hairDryer",
        label: "Hair Dryer",
        description: "Hair dryer provided",
      },
      {
        name: "elevator",
        label: "Elevator",
        description: "Elevator access",
      },
    ],
    location: [
      {
        name: "cityCenter",
        label: "City Center",
        description: "Close to city center",
      },
      {
        name: "school",
        label: "School",
        description: "Near educational institutions",
      },
      {
        name: "policeStation",
        label: "Police Station",
        description: "Police station nearby",
      },
      {
        name: "fireStation",
        label: "Fire Station",
        description: "Fire station in vicinity",
      },
      {
        name: "park",
        label: "Park",
        description: "Parks and recreation areas",
      },
      { name: "mosque", label: "Mosque", description: "Mosque nearby" },
      { name: "church", label: "Church", description: "Church in the area" },
      {
        name: "synagogue",
        label: "Synagogue",
        description: "Synagogue nearby",
      },
      {
        name: "hospital",
        label: "Hospital",
        description: "Medical facilities close by",
      },
      {
        name: "pharmacy",
        label: "Pharmacy",
        description: "Pharmacy within walking distance",
      },
      {
        name: "market",
        label: "Market",
        description: "Shopping markets nearby",
      },
      {
        name: "dryCleaners",
        label: "Dry Cleaning",
        description: "Dry cleaning services",
      },
    ],
    facility: [
      {
        name: "security",
        label: "Security",
        description: "24/7 security service",
      },
      {
        name: "gym",
        label: "Gym",
        description: "Fully equipped gym",
      },
      {
        name: "pool",
        label: "Pool",
        description: "Swimming pool",
      },
      {
        name: "tvSmart",
        label: "Smart TV",
        description: "Smart TV",
      },
      {
        name: "cctvCamera",
        label: "CCTV Camera",
        description: "Security cameras",
      },
      {
        name: "virtualReality",
        label: "Virtual Reality",
        description: "Virtual reality tour",
      },
    ],
  };

  const getAmenitiesKey = useCallback(
    (type: AmenityType): keyof AmenitiesRecord => `${type}Amenities`,
    [],
  );

  const getTotalSelectedAmenities = useCallback(() => {
    return Object.values(tempAmenities).reduce(
      (total, arr) => total + arr.length,
      0,
    );
  }, [tempAmenities]);

  const handleAmenityChange = useCallback(
    (type: AmenityType, itemName: string) => {
      const key = getAmenitiesKey(type);
      const currentAmenities = tempAmenities[key];

      if (
        maxSelections &&
        !currentAmenities.includes(itemName) &&
        getTotalSelectedAmenities() >= maxSelections
      ) {
        setError(`You can only select up to ${maxSelections} amenities`);
        return;
      }

      setError(null);
      const updatedAmenities = currentAmenities.includes(itemName)
        ? currentAmenities.filter((amenity) => amenity !== itemName)
        : [...currentAmenities, itemName];

      setTempAmenities((prev) => ({
        ...prev,
        [key]: updatedAmenities,
      }));
    },
    [tempAmenities, maxSelections, getAmenitiesKey, getTotalSelectedAmenities],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleClear = useCallback(() => {
    setTempAmenities({
      propertyAmenities: [],
      locationAmenities: [],
      facilityAmenities: [],
    });
    setError(null);
  }, []);

  const handleApply = useCallback(() => {
    Object.entries(tempAmenities).forEach(([key, value]) => {
      const type = key.replace("Amenities", "") as AmenityType;
      onAmenitiesChange(type, value);
    });
    handleClose();
  }, [tempAmenities, onAmenitiesChange, handleClose]);

  const toggleSection = (section: keyof SectionState) => {
    setExpandedSections((prev: SectionState) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSelectAll = (type: AmenityType) => {
    const key = getAmenitiesKey(type);
    const allAmenities = AMENITIES[type].map((item) => item.name);

    if (maxSelections && allAmenities.length > maxSelections) {
      setError(`You can only select up to ${maxSelections} amenities`);
      return;
    }

    setTempAmenities((prev) => ({
      ...prev,
      [key]: allAmenities,
    }));
    setError(null);
  };

  const handleClearSection = (type: AmenityType) => {
    const key = getAmenitiesKey(type);
    setTempAmenities((prev) => ({
      ...prev,
      [key]: [],
    }));
    setError(null);
  };

  useEffect(() => {
    setTempAmenities(amenities);
  }, [amenities]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={`flex items-center justify-center rounded-full border px-4 py-2 text-sm transition-all focus:outline-none ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "border-neutral-300 hover:border-neutral-400 hover:shadow-lg"
        } `}
      >
        <span>
          {translate("amenities")}{" "}
          {getTotalSelectedAmenities() > 0 &&
            `(${getTotalSelectedAmenities()})`}
        </span>
        <i className="las la-angle-down ml-2"></i>
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={handleClose} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-5xl rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-lg font-medium">
                    {translate("amenities")}
                    {maxSelections && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({translate("max")} {maxSelections})
                      </span>
                    )}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    aria-label="Close"
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
                    {error}
                  </div>
                )}

                {(
                  Object.entries(AMENITIES) as [
                    AmenityType,
                    (typeof AMENITIES)[AmenityType],
                  ][]
                ).map(([type, items]) => (
                  <div key={type} className="mb-6 rounded-lg border">
                    <button
                      onClick={() => toggleSection(type)}
                      className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium capitalize">
                          {translate(`${type}Amenities`)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({tempAmenities[getAmenitiesKey(type)].length}{" "}
                          {translate("selected")})
                        </span>
                      </div>
                      {expandedSections[type] ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>

                    {expandedSections[type] && (
                      <div className="border-t p-4">
                        <div className="mb-4 flex gap-4">
                          <ButtonThird
                            onClick={() => handleSelectAll(type)}
                            sizeClass="px-3 py-1.5"
                          >
                            {translate("selectAll")}
                          </ButtonThird>
                          <ButtonThird
                            onClick={() => handleClearSection(type)}
                            sizeClass="px-3 py-1.5"
                          >
                            {translate("clear")}
                          </ButtonThird>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {items.map((item) => (
                            <Checkbox
                              key={item.name}
                              name={item.name}
                              label={translate(item.name)}
                              subLabel={item.description}
                              checked={tempAmenities[
                                getAmenitiesKey(type)
                              ].includes(item.name)}
                              onChange={() =>
                                handleAmenityChange(type, item.name)
                              }
                              defaultChecked={false}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-6 flex justify-between border-t pt-4">
                  <ButtonThird onClick={handleClear} sizeClass="px-4 py-2">
                    {translate("clear")}
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={handleApply}
                    className="px-4 py-2"
                    type="button"
                    loading={false}
                  >
                    {translate("apply")} ({getTotalSelectedAmenities()})
                  </ButtonPrimary>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default RenderTabsAmenities;
