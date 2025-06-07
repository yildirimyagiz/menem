import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./propertySchema";

interface PropertyFeaturesAmenitiesProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyFeaturesAmenities: React.FC<PropertyFeaturesAmenitiesProps> = ({ form }) => (
  <div>
    <div>
      <label>Pet Friendly</label>
      <input type="checkbox" {...form.register("petFriendly")} />
    </div>
    <div>
      <label>Furnished</label>
      <input type="checkbox" {...form.register("furnished")} />
    </div>
    <div>
      <label>Air Conditioning</label>
      <input type="checkbox" {...form.register("airConditioning")} />
    </div>
    <div>
      <label>Heating</label>
      <input {...form.register("heating")} placeholder="e.g. Central, Gas, Electric" />
    </div>
    <div>
      <label>Parking</label>
      <input {...form.register("parking")} placeholder="e.g. Garage, Street, None" />
    </div>
    <div>
      <label>Laundry</label>
      <input {...form.register("laundry")} placeholder="e.g. In Unit, In Building, None" />
    </div>
    <div>
      <label>Amenities</label>
      <input {...form.register("amenities.0")} placeholder="e.g. Pool, Gym, Elevator" />
      {/* Add more amenities fields as needed */}
    </div>
  </div>
);

export default PropertyFeaturesAmenities;
