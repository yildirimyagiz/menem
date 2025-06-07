import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./propertySchema";

interface PropertyLocationProps {
  form: UseFormReturn<PropertyFormValues>;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (coords: { lat: number; lng: number }) => void;
}

const PropertyLocation: React.FC<PropertyLocationProps> = ({ form, coordinates, setCoordinates }) => (
  <div>
    <div>
      <label>Address</label>
      <input {...form.register("address")} placeholder="Street Address" />
      <span>{form.formState.errors.address?.message}</span>
    </div>
    <div>
      <label>City</label>
      <input {...form.register("city")} placeholder="City" />
      <span>{form.formState.errors.city?.message}</span>
    </div>
    <div>
      <label>State</label>
      <input {...form.register("state")} placeholder="State" />
      <span>{form.formState.errors.state?.message}</span>
    </div>
    <div>
      <label>ZIP Code</label>
      <input {...form.register("zipCode")} placeholder="ZIP Code" />
      <span>{form.formState.errors.zipCode?.message}</span>
    </div>
    {/* Map integration can be added here */}
    <div>
      <label>Coordinates</label>
      <input
        type="number"
        placeholder="Latitude"
        value={coordinates?.lat ?? ""}
        onChange={e => setCoordinates({ lat: Number(e.target.value), lng: coordinates?.lng ?? 0 })}
      />
      <input
        type="number"
        placeholder="Longitude"
        value={coordinates?.lng ?? ""}
        onChange={e => setCoordinates({ lat: coordinates?.lat ?? 0, lng: Number(e.target.value) })}
      />
    </div>
  </div>
);

export default PropertyLocation;
