import React from "react";
import { useTranslations } from "next-intl";

import Checkbox from "~/shared/Checkbox";

interface FilterItemProps {
  name: string;
  description?: string;
  defaultChecked?: boolean;
  translationKey?: string;
}

interface MoreFilterItemProps {
  data: FilterItemProps[];
  onChange?: (name: string, checked: boolean) => void;
}

const MoreFilterItem: React.FC<MoreFilterItemProps> = ({ data, onChange }) => {
  const t = useTranslations();
  const list1 = data.filter((_, i) => i < data.length / 2);
  const list2 = data.filter((_, i) => i >= data.length / 2);

  const getTranslatedLabel = (item: FilterItemProps) => {
    if (item.translationKey) {
      return t(item.translationKey);
    }
    return item.name;
  };

  const getTranslatedDescription = (item: FilterItemProps) => {
    if (item.translationKey) {
      return t(`${item.translationKey}Description`);
    }
    return item.description;
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col space-y-5">
        {list1.map((item) => (
          <Checkbox
            key={item.name}
            name={item.name}
            subLabel={getTranslatedDescription(item)}
            label={getTranslatedLabel(item)}
            checked={!!item.defaultChecked}
            onChange={(checked) => onChange?.(item.name, checked)}
          />
        ))}
      </div>
      <div className="flex flex-col space-y-5">
        {list2.map((item) => (
          <Checkbox
            key={item.name}
            name={item.name}
            subLabel={getTranslatedDescription(item)}
            label={getTranslatedLabel(item)}
            defaultChecked={!!item.defaultChecked}
            onChange={(checked) => onChange?.(item.name, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoreFilterItem;
