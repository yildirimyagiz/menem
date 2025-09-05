"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Headless from "@headlessui/react";

import convertNumbThousand from "~/utils/convertNumbThousand";
import T from "~/utils/getT";
import FieldPanelContainer from "./FieldPanelContainer";
import LocationInput from "./LocationInput";
import PriceRangeInput from "./PriceRangeInput";
import PropertyTypeSelect from "./PropertyTypeSelect";

type Tab = "buy" | "rent" | "sell";
const tabs = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "sell", label: "Sell" },
] as const;

const RealestateSearchFormMobile = () => {
  //
  const [fieldNameShow, setFieldNameShow] = useState<
    "location" | "propertyType" | "price"
  >("location");
  //
  const [tabType, setTabType] = useState<Tab>(tabs[0].value);
  const [locationInputTo, setLocationInputTo] = useState("");
  const [rangePrices, setRangePrices] = useState([10000, 400000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const router = useRouter();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formDataEntries = Object.fromEntries(formData.entries());
    console.log("Form submitted", formDataEntries);
    // You can also redirect or perform other actions based on the form data

    // example: add location to the URL
    const location = formDataEntries.location as string;
    let url = "/real-estate-categories/all";
    if (location) {
      url = url + `?location=${encodeURIComponent(location)}`;
    }
    router.push(url);
  };

  const typeStringConverted = selectedTypes?.length
    ? selectedTypes.join(", ")
    : "Add property";
  return (
    <form
      id="form-hero-search-form-mobile"
      onSubmit={handleFormSubmit}
      className="flex w-full flex-col gap-y-3"
    >
      {/* RADIO */}
      <Headless.RadioGroup
        value={tabType}
        onChange={setTabType}
        aria-label="Real Estate Tab Type"
        name="real_estate_tab_type"
        className="flex flex-wrap items-center justify-center gap-2.5"
      >
        {tabs.map((tab) => (
          <Headless.Field key={tab.value}>
            <Headless.Radio
              value={tab.value}
              className={`data-checked:bg-black data-checked:text-white data-checked:shadow-lg data-checked:shadow-black/10 dark:data-checked:bg-neutral-200 dark:data-checked:text-neutral-900 flex cursor-pointer items-center rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium dark:border-neutral-700`}
            >
              {tab.label}
            </Headless.Radio>
          </Headless.Field>
        ))}
      </Headless.RadioGroup>

      {/* LOCATION INPUT */}
      <FieldPanelContainer
        isActive={fieldNameShow === "location"}
        headingOnClick={() => setFieldNameShow("location")}
        headingTitle={"Where"}
        headingValue={locationInputTo || "Location"}
      >
        <LocationInput
          headingText={"Where to find?"}
          defaultValue={locationInputTo}
          onChange={(value) => {
            setLocationInputTo(value);
            setFieldNameShow("propertyType");
          }}
        />
      </FieldPanelContainer>

      {/* SELECT */}
      <FieldPanelContainer
        isActive={fieldNameShow === "propertyType"}
        headingOnClick={() => setFieldNameShow("propertyType")}
        headingTitle={"Property"}
        headingValue={typeStringConverted}
      >
        <PropertyTypeSelect onChange={setSelectedTypes} />
      </FieldPanelContainer>

      {/* PRICE RANGE  */}
      <FieldPanelContainer
        isActive={fieldNameShow === "price"}
        headingOnClick={() => setFieldNameShow("price")}
        headingTitle={"Price"}
        headingValue={`$${convertNumbThousand(Number(Array.isArray(rangePrices) && rangePrices.length === 2 && typeof rangePrices[0] === "number" ? rangePrices[0] : 0) / 1000)}k ~ $${convertNumbThousand(Number(Array.isArray(rangePrices) && rangePrices.length === 2 && typeof rangePrices[1] === "number" ? rangePrices[1] : 0) / 1000)}k`}
      >
        <PriceRangeInput defaultValue={rangePrices} onChange={setRangePrices} />
      </FieldPanelContainer>
    </form>
  );
};

export default RealestateSearchFormMobile;
