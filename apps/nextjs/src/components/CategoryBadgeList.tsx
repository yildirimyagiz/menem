import type { FC } from "react";
import React from "react";

import type { PostDataType, TwMainColor } from "~/data/types";
import Badge from "~/shared/Badge";

export interface CategoryBadgeListProps {
  className?: string;
  itemClass?: string;
  categories: PostDataType["categories"];
}

const CategoryBadgeList: FC<CategoryBadgeListProps> = ({
  className = "flex flex-wrap space-x-2",
  itemClass,
  categories,
}) => {
  return (
    <div
      className={`nc-CategoryBadgeList ${className}`}
      data-nc-id="CategoryBadgeList"
    >
      {categories.map((item, index) => (
        <Badge
          className={itemClass}
          key={item.name || index} // Use a unique identifier when available
          name={item.name}
          href={item.href}
          color={item.color as TwMainColor | undefined}
          aria-label={item.name} // Added aria-label for accessibility
        />
      ))}
    </div>
  );
};

export default React.memo(CategoryBadgeList);
