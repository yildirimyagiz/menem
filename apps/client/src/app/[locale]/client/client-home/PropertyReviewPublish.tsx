import { useTranslations } from 'next-intl';
import React from "react";
import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import type { PropertyFormValues } from "./propertySchema";

interface PropertyReviewPublishProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyReviewPublish: React.FC<PropertyReviewPublishProps> = ({
  form,
}) => {
  const t = useTranslations('clientHome.property');
  const values = form.getValues();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('review.title', { defaultValue: 'Review Your Property Listing' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li><strong>{t('review.title', { defaultValue: 'Title' })}:</strong> {values.title}</li>
          <li><strong>{t('review.type', { defaultValue: 'Type' })}:</strong> {values.propertyType}</li>
          <li><strong>{t('review.category', { defaultValue: 'Category' })}:</strong> {values.category}</li>
          <li><strong>{t('review.size', { defaultValue: 'Size' })}:</strong> {values.size} sq ft</li>
          <li><strong>{t('review.bedrooms', { defaultValue: 'Bedrooms' })}:</strong> {values.bedrooms}</li>
          <li><strong>{t('review.bathrooms', { defaultValue: 'Bathrooms' })}:</strong> {values.bathrooms}</li>
          <li><strong>{t('review.yearBuilt', { defaultValue: 'Year Built' })}:</strong> {values.yearBuilt}</li>
          <li><strong>{t('review.description', { defaultValue: 'Description' })}:</strong> {values.description}</li>
          <li><strong>{t('review.features', { defaultValue: 'Features' })}:</strong> {Array.isArray(values.features) ? values.features.join(", ") : values.features}</li>
          <li><strong>{t('review.amenities', { defaultValue: 'Amenities' })}:</strong> {Array.isArray(values.amenities) ? values.amenities.join(", ") : values.amenities}</li>
          <li><strong>{t('review.parkingSpaces', { defaultValue: 'Parking Spaces' })}:</strong> {values.parkingSpaces}</li>
          <li><strong>{t('review.constructionType', { defaultValue: 'Construction Type' })}:</strong> {values.constructionType}</li>
          <li><strong>{t('review.buildingClass', { defaultValue: 'Building Class' })}:</strong> {values.buildingClass}</li>
          <li><strong>{t('review.energyRating', { defaultValue: 'Energy Rating' })}:</strong> {values.energyRating}</li>
          <li><strong>{t('review.address', { defaultValue: 'Address' })}:</strong> {values.Location?.address}, {values.Location?.city}, {values.Location?.country}</li>
          <li><strong>{t('review.postalCode', { defaultValue: 'Postal Code' })}:</strong> {values.Location?.postalCode}</li>
          <li><strong>{t('review.district', { defaultValue: 'District' })}:</strong> {values.Location?.district}</li>
          <li><strong>{t('review.photos', { defaultValue: 'Photos' })}:</strong> {Array.isArray(values.photos) ? values.photos.length : 0} {t('review.photoCount', { defaultValue: 'photos' })}</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PropertyReviewPublish;
