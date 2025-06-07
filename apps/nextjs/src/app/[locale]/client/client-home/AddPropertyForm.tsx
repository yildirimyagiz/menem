// AddPropertyForm.tsx
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { propertySchema, PropertyFormValues } from "./propertySchema";
import PropertySteps from "./PropertySteps";
import PropertyBasicDetails from "./PropertyBasicDetails";
import PropertyFeaturesAmenities from "./PropertyFeaturesAmenities";
import PropertyLocation from "./PropertyLocation";
import PropertyPhotos from "./PropertyPhotos";
import PropertyReviewPublish from "./PropertyReviewPublish";

const steps = [
  { id: 0, title: "Basic Details", description: "Enter the property basics" },
  { id: 1, title: "Features & Amenities", description: "Specify features and amenities" },
  { id: 2, title: "Location", description: "Set the exact location" },
  { id: 3, title: "Photos", description: "Upload property photos" },
  { id: 4, title: "Review & Publish", description: "Review and publish your listing" },
];

export default function AddPropertyForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      propertyType: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      price: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      squareFeet: undefined,
      yearBuilt: undefined,
      availableFrom: new Date().toISOString().split('T')[0],
      petFriendly: false,
      furnished: false,
      parking: "",
      laundry: "",
      airConditioning: false,
      heating: "",
      amenities: [],
      images: [],
      coordinates: { lat: undefined, lng: undefined },
    },
  });

  const handleNext = async () => {
    let valid = true;
    // Add validation logic per step here if needed
    if (valid && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  const handlePrevious = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div>
      <PropertySteps steps={steps} activeStep={activeStep} />
      <form onSubmit={form.handleSubmit(() => {})}>
        {activeStep === 0 && <PropertyBasicDetails form={form} />}
        {activeStep === 1 && <PropertyFeaturesAmenities form={form} />}
        {activeStep === 2 && <PropertyLocation form={form} coordinates={coordinates} setCoordinates={setCoordinates} />}
        {activeStep === 3 && <PropertyPhotos form={form} uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} imagePreviewUrls={imagePreviewUrls} setImagePreviewUrls={setImagePreviewUrls} />}
        {activeStep === 4 && <PropertyReviewPublish form={form} />}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button type="button" onClick={handlePrevious} disabled={activeStep === 0}>Previous</button>
          {activeStep < steps.length - 1 ? (
            <button type="button" onClick={handleNext}>Next</button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </div>
  );
}
