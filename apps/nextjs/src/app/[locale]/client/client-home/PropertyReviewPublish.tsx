import type { UseFormReturn } from "react-hook-form";
import React from "react";

import type { PropertyFormValues } from "./propertySchema";

interface PropertyReviewPublishProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyReviewPublish: React.FC<PropertyReviewPublishProps> = ({
  form,
}) => {
  const values = form.getValues();
  return (
    <div>
      <h2>Review Your Property Listing</h2>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      {/* Add a summary or styled review UI here */}
    </div>
  );
};

export default PropertyReviewPublish;
