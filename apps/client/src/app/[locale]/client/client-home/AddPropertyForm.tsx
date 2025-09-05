// AddPropertyForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from 'next-intl';
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@reservatior/ui/button";
import PropertyBasicDetails from "./PropertyBasicDetails";
import PropertyFeaturesAmenities from "./PropertyFeaturesAmenities";
import PropertyLocation from "./PropertyLocation";
import PropertyPhotos from "./PropertyPhotos";
import PropertyReviewPublish from "./PropertyReviewPublish";
import type { PropertyFormValues } from "./propertySchema";
import { propertySchema } from "./propertySchema";
import PropertySteps from "./PropertySteps";

const rawSteps = [
  { id: 0, title: 'steps.basicDetails.title', description: 'steps.basicDetails.description' },
  { id: 1, title: 'steps.featuresAmenities.title', description: 'steps.featuresAmenities.description' },
  { id: 2, title: 'steps.location.title', description: 'steps.location.description' },
  { id: 3, title: 'steps.photos.title', description: 'steps.photos.description' },
  { id: 4, title: 'steps.reviewPublish.title', description: 'steps.reviewPublish.description' },
];

export default function AddPropertyForm() {
  const t = useTranslations('clientHome.property');

  // Map steps to translated values
  const steps = rawSteps.map(step => ({
    ...step,
    title: t(step.title, { defaultValue: step.title }),
    description: t(step.description, { defaultValue: step.description }),
  }));
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "APARTMENT",
      propertyStatus: "AVAILABLE",
      category: "RESIDENTIAL",
      size: 0,
      bedrooms: 0,
      bathrooms: 0,
      yearBuilt: 0,
      features: [],
      amenities: [],
      parkingSpaces: 0,
      constructionType: "WOOD_FRAME",
      buildingClass: "CLASS_A",
      energyRating: "A",
      ownershipType: "FREEHOLD",
      ownershipCategory: "PERSONAL",
      isActive: true,
      featured: false,
      Location: {
        address: "",
        city: "",
        country: "",
        postalCode: "",
      },
      photos: [],
    },
  });

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const onSubmit = (data: PropertyFormValues) => {
    try {
      console.log('Form data:', data);
      // Add your form submission logic here
      // await createProperty(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <PropertySteps steps={steps} activeStep={activeStep} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {activeStep === 0 && <PropertyBasicDetails form={form} />}
        {activeStep === 1 && <PropertyFeaturesAmenities form={form} />}
        {activeStep === 2 && (
          <PropertyLocation
            form={form}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        )}
        {activeStep === 3 && (
          <PropertyPhotos
            form={form}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            imagePreviewUrls={imagePreviewUrls}
            setImagePreviewUrls={setImagePreviewUrls}
          />
        )}
        {activeStep === 4 && <PropertyReviewPublish form={form} />}
        
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStep === 0}
          >
            {t('buttons.previous', { defaultValue: 'Previous' })}
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              {t('buttons.next', { defaultValue: 'Next' })}
            </Button>
          ) : (
            <Button type="submit">
              {t('buttons.submit', { defaultValue: 'Submit' })}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
