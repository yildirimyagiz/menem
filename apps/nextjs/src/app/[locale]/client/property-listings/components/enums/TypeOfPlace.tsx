import {
  Checkbox,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";

import { PropertyType } from "@acme/db";

import ButtonPrimary from "~/shared/ButtonPrimary";
import ButtonThird from "~/shared/ButtonThird";

// PropertyType is an enum object; we want its string values
type TypeOfPlace = keyof typeof PropertyType;

interface RenderTabsTypeOfPlaceProps {
  onTypeChange: (type: TypeOfPlace) => void;
  currentType?: TypeOfPlace;
  close: () => void;
}

const RenderTabsTypeOfPlace = ({
  onTypeChange,
  currentType,
  close,
}: RenderTabsTypeOfPlaceProps) => {
  return (
    <Popover>
      <PopoverButton as={ButtonPrimary} type={"button"} loading={false}>
        Type of Place
      </PopoverButton>
      <Transition>
        <PopoverPanel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-md">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="relative flex flex-col space-y-5 px-5 py-6">
              {Object.values(PropertyType).map((type) => (
                <div key={type} className="flex items-center space-x-3">
                  <Checkbox
                    checked={currentType === type}
                    onChange={() => onTypeChange(type)}
                  />
                  <div>
                    <span className="font-medium">
                      {type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end border-t border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900">
              <ButtonThird onClick={close}>Close</ButtonThird>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default RenderTabsTypeOfPlace;
