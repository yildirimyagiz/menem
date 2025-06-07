import { Fragment, useEffect, useState } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { useTranslations } from "next-intl";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";
import LocationFilter from "./LocationFilter";

interface RenderTabsLocationProps {
  setLocations: React.Dispatch<React.SetStateAction<string[]>>;
}

const RenderTabsLocation: React.FC<RenderTabsLocationProps> = ({
  setLocations,
}) => {
  const t = useTranslations();
  const [locations, setFetchedLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Define the expected API response type with proper typing
  interface LocationResponse {
    locations: string[];
  }

  useEffect(() => {
    const fetchLocations = async () => {
      if (searchTerm) {
        try {
          const response = await fetch(`/api/location/route?query=${searchTerm}`);
          // Properly type the response data
          const data = await response.json() as unknown;
          // Type-safe handling of API response
          if (data && 
              typeof data === 'object' && 
              'locations' in data && 
              Array.isArray(data.locations)) {
            // Use a properly typed variable
            const locationData = data as LocationResponse;
            setFetchedLocations(locationData.locations);
          } else {
            setFetchedLocations([]);
          }
        } catch (error) {
          console.error('Error fetching locations:', error);
          setFetchedLocations([]);
        }
      } else {
        setFetchedLocations([]);
      }
    };

    const debounceFetch = setTimeout(() => {
      void fetchLocations(); // Use void operator to handle the Promise properly
    }, 300); // Debounce for better performance

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverButton
            className={`flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-400 focus:outline-none ${
              open ? "!border-primary-500" : ""
            }`}
          >
            <span>{t("tab_location")}</span>
            <i className="las la-angle-down ml-2"></i>
          </PopoverButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                <div className="px-5 py-6">
                  <input
                    type="text"
                    placeholder={t("tab_location")}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2"
                  />
                  <LocationFilter
                    locations={locations}
                    onChange={(selectedLocations: string[]) =>
                      setLocations(selectedLocations)
                    }
                  />
                </div>
                <div className="flex items-center justify-between bg-neutral-50 p-5">
                  <ButtonThird
                    onClick={close}
                    sizeClass="px-4 py-2 sm:px-5"
                    type={"button"}
                    className={""}
                    loading={false}
                  >
                    {t("clear")}
                  </ButtonThird>
                  <ButtonPrimary
                    onClick={close}
                    sizeClass="px-4 py-2 sm:px-5"
                    type={"button"}
                    className={""}
                    loading={false}
                  >
                    {t("apply")}
                  </ButtonPrimary>
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default RenderTabsLocation;
