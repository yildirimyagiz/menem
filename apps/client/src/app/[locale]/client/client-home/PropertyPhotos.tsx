import { useTranslations } from 'next-intl';
import React from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import type { PropertyFormValues } from "./propertySchema";

interface PropertyPhotosProps {
  form: UseFormReturn<PropertyFormValues>;
  uploadedImages: File[];
  setUploadedImages: (files: File[]) => void;
  imagePreviewUrls: string[];
  setImagePreviewUrls: (urls: string[]) => void;
}

const PropertyPhotos: React.FC<PropertyPhotosProps> = ({
  form,
  uploadedImages,
  setUploadedImages,
  imagePreviewUrls,
  setImagePreviewUrls,
}) => {
  const t = useTranslations('clientHome.property');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newFiles]);
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
      // Update form value
      const currentPhotos = form.getValues("photos") ?? [];
      form.setValue("photos", [...currentPhotos, ...newFiles.map(f => f.name)]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    const url = imagePreviewUrls[index];
    if (typeof url === "string") URL.revokeObjectURL(url);
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
    const currentPhotos = form.getValues("photos") ?? [];
    form.setValue(
      "photos",
      currentPhotos.filter((_, i) => i !== index),
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('photos.title', { defaultValue: 'Property Photos' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="property-photos-upload" className="mb-2 block font-medium">
          {t('photos.uploadLabel', { defaultValue: 'Upload property photos' })}
        </Label>
        <Input
          id="property-photos-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {imagePreviewUrls.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`${t('photos.preview', { defaultValue: 'Preview' })} ${i}`}
                width={100}
                height={100}
                className="object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-0 top-0 h-6 w-6 rounded-full p-0"
                onClick={() => removeImage(i)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyPhotos;
