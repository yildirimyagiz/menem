import type { UseFormReturn } from "react-hook-form";
import React from "react";
import Image from "next/image";

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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newFiles]);
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
      // Update form value
      const currentImages = form.getValues("images") ?? [];
      form.setValue("images", [...currentImages, ...newFiles]);
    }
  };
  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    const url = imagePreviewUrls[index];
    if (typeof url === "string") URL.revokeObjectURL(url);
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
    const currentImages = form.getValues("images") ?? [];
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    );
  };
  return (
    <div>
      <label>Property Photos</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {imagePreviewUrls.map((url, i) => (
          <div key={i} style={{ position: "relative" }}>
            <Image
              src={url}
              alt={`Preview ${i}`}
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyPhotos;
