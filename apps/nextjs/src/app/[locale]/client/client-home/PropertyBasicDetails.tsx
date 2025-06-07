import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./propertySchema";

interface PropertyBasicDetailsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyBasicDetails: React.FC<PropertyBasicDetailsProps> = ({ form }) => (
  <div>
    <div>
      <label>Property Title</label>
      <input {...form.register("title")} placeholder="e.g. Modern Downtown Apartment with City Views" />
      <span>{form.formState.errors.title?.message}</span>
    </div>
    <div>
      <label>Property Type</label>
      <input {...form.register("propertyType")} placeholder="e.g. Apartment" />
      <span>{form.formState.errors.propertyType?.message}</span>
    </div>
    <div>
      <label>Monthly Rent ($)</label>
      <input type="number" {...form.register("price", { valueAsNumber: true })} />
      <span>{form.formState.errors.price?.message}</span>
    </div>
    <div>
      <label>Bedrooms</label>
      <input type="number" {...form.register("bedrooms", { valueAsNumber: true })} />
      <span>{form.formState.errors.bedrooms?.message}</span>
    </div>
    <div>
      <label>Bathrooms</label>
      <input type="number" {...form.register("bathrooms", { valueAsNumber: true })} />
      <span>{form.formState.errors.bathrooms?.message}</span>
    </div>
    <div>
      <label>Square Feet</label>
      <input type="number" {...form.register("squareFeet", { valueAsNumber: true })} />
      <span>{form.formState.errors.squareFeet?.message}</span>
    </div>
    <div>
      <label>Year Built</label>
      <input type="number" {...form.register("yearBuilt", { valueAsNumber: true })} />
      <span>{form.formState.errors.yearBuilt?.message}</span>
    </div>
    <div>
      <label>Available From</label>
      <input type="date" {...form.register("availableFrom")} />
      <span>{form.formState.errors.availableFrom?.message}</span>
    </div>
    <div>
      <label>Property Description</label>
      <textarea {...form.register("description")} placeholder="Describe your property in detail..." />
      <span>{form.formState.errors.description?.message}</span>
    </div>
  </div>
);

export default PropertyBasicDetails;
